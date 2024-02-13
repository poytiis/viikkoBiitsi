import {useState} from 'react';
import Button from '../Button/Button';
import Layout from '../Layout/Layout';
import {downloadRankingsFetch, downloadBackupFormDataFetch} from '../../services/httpClient';
import SnackBar from '../SnackBar/SnackBar';
import WhiteContainer from '../WhiteContainer/WhiteContainer';

const RankingList = () => {
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const handleDownloadrankingLists = () => {
    downloadRankinList('men');
    downloadRankinList('women');
  }

  const downloadFile = (text, fileName) => {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fileName);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();
    document.body.removeChild(element);
  }

  const downloadFormDataBackup = async () => {
    const res = await downloadBackupFormDataFetch();
    if (res.ok) {
      const text = await res.text();
      downloadFile(text, 'syotetyt_tulokset_varmuuskopio.csv');
    } else {
      setSnackBarMessage('varmuuskopion lataus epäonnistui');
    }
  }

  const downloadRankinList = async (serie) => {

    Date.prototype.getWeek = function() {
      var onejan = new Date(this.getFullYear(), 0, 1);
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
    };

    const today = new Date();
    const weekNumber = today.getWeek();
    const fileName = 'ranking_' + serie + weekNumber + '.csv';

    try {
      const res = await downloadRankingsFetch(serie);
      if (res.ok) {
        const text = await res.text();
        downloadFile(text, fileName);
      } else {
        setSnackBarMessage('Rankingien lataus epäonnistui');
      }
    } catch (ex) {
      setSnackBarMessage('Rankingien lataus epäonnistui');
    }
  };

  return (
    <Layout>
      <WhiteContainer header='Ranking-listat'>
        <>
          <div className='white-container__small-header'>Lataa miesten ja naisten ranking-lista</div>
          <div className='white-container__beging-ranking-info'>
            Järjestelmä lataa ranking-listat CSV-formaatissa, minkä saa avattua esimerkiksi Excelillä.
          </div>
          <div className='white-container__ranking-select-container white-container__ranking-button-container'>
            <Button onClick={handleDownloadrankingLists}>Lataa</Button>
          </div>

          <div className='white-container__small-header'>Lataa varmuuskopio syötetyistä tuloksista.</div>
          <div className='white-container__beging-ranking-info'>
            Lataa varmuuskopio nettisivun kautta syötetyistä tuloksista.
            Varmuuskopiota tarvitaan vain silloin jos edellisen viikon tulokset ovat kadonneet.
          </div>

          <div className='white-container__ranking-select-container'>
            <Button onClick={downloadFormDataBackup}>Lataa</Button>
          </div>
        </>
      </WhiteContainer>

      { snackBarMessage !== '' &&
        <SnackBar close={() => {setSnackBarMessage('')}}>{snackBarMessage}</SnackBar>
      }
    </Layout>
  );
};

export default RankingList;
