import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import Layout from '../Layout/Layout';
import  { downloadRankingsFetch } from '../../services/httpClient';
import SnackBar from '../SnackBar/SnackBar';
import './RankingLists.scss';

const RankingList = () => {
  const [snackBarMessage, setSnackBarMessage] = useState('');

  const handleDownloadrankingLists = () => {
    downloadRankinList('men');
    downloadRankinList('women');
  }

  const downloadRankinList = async (serie) => {

    Date.prototype.getWeek = function() {
      var onejan = new Date(this.getFullYear(),0,1);
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
    }

    const today = new Date();
    var weekNumber = today.getWeek();
    const fileName = 'ranking_' + serie + weekNumber + '.csv';

    try {
      const res = await downloadRankingsFetch(serie);
      if(res.ok) {
        const text = await res.text();
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', fileName);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);
      } else {
        setSnackBarMessage('Rankingien lataus epäonnistui')
      }

    } catch (ex) {
      console.log(ex)
        setSnackBarMessage('Rankingien lataus epäonnistui')
    }
  }

  return(
    <Layout>
      <div className='settings flex-column-center'>
        <div className='settings__content flex-column-center'>
          <h2 className='settings__header'>Ranking-listat</h2>
          <div className='settings__settings__container'>
            <div className='settings__small-header'>Lataa miesten ja naisten ranking-lista</div>
            <div className='settings__beging-ranking-info'>
              Järjestelmä lataa ranking-listat CSV-formaatissa, minkä saa avattua esimerkiksi Excelillä.
            </div>
            <div className='settings__ranking-select-container'>
              <Button onClick={handleDownloadrankingLists}>Lataa</Button>
            </div>
            
          </div>
        </div>
      </div>

      { snackBarMessage !== '' &&
        <SnackBar close={() => {setSnackBarMessage('')}}>{snackBarMessage}</SnackBar>
      }
    </Layout>
  );
}

export default RankingList;