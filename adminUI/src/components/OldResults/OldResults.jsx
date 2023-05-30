import React, {useState} from 'react';
import Layout from '../Layout/Layout';
import './OldResults.scss';
import TextField from '@material-ui/core/TextField';
import useInput from '../../hooks/useInput';
import Button from '../Button/Button';
import Table from '../Table/Table';
import  { downloadRankingsFetch, searchOldScoresFetch } from '../../services/httpClient'
import SnackBar from '../SnackBar/SnackBar';
import useTable from '../../hooks/useTable';

const OldResults = () => {

  const [snackBarMessage, setSnackBarMessage] = useState('');

  const yearControl = useInput('');
  const weekControl = useInput('');
  const nameControl = useInput('');
  const serieControl = useInput('');

  const tableControl = useTable();
  const [tabledata, setTableData] =useState([])

  const rowsCountInTablePage = 6;
  const [tablePageCount, setTablePageCount] = useState(0);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const handleSearchButtonClick = async () => {
    const response = await searchOldScoresFetch(nameControl.value, yearControl.value, weekControl.value, serieControl.value);
    const json = await response.json()
    const logsPageCount = Math.ceil(json.data.length / rowsCountInTablePage);
    setTablePageCount(logsPageCount);
    console.log(json.data)
    setTableData(json.data)
  }

  const handleNextPaginatorClick = () => {
    if(currentPageIndex + 1 < tablePageCount) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePreviousPaginatorClick = () => {
    if (currentPageIndex !== 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  }

  const searchButtonStyles = {
    transform: 'translateY(5px)'
  }
  const uploadButtonStyles = {
    width: '190px',
  }
  const updateButtonStyles = {
    width: '190px',
    marginRight: '30px'
  }
  const deleteButtonStyles = {
    marginTop: '0.6rem'
  }
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

  const tableHeaders = ['Vuosi', 'Lohko', 'Sijoitus', 'Pisteet', 'Nimi'];
  const pageNumber = (currentPageIndex + 1).toString() + '/' + tablePageCount.toString();

  let slicedrows = [];
  if(currentPageIndex * rowsCountInTablePage + rowsCountInTablePage <= tabledata.length) {
    slicedrows = tabledata.slice(currentPageIndex * rowsCountInTablePage, currentPageIndex * rowsCountInTablePage + rowsCountInTablePage)
  } else {
    slicedrows = tabledata.slice(currentPageIndex * rowsCountInTablePage, tabledata.length -1)
  }
  return (
    <Layout>
      <div className='old-results'>
        <div className='old-results__content flex-column-center'>
          <span className='old-results__header'>Etsi vanhoja tuloksia</span>
          <div className='old-results__search-container'>
            <TextField className='old-results__input' label='Pelaaja' {...nameControl}/>
            <TextField className='old-results__input' label='vuosi' {...yearControl}/>
            <TextField className='old-results__input' label='Viikko' {...weekControl}/>
            <TextField className='old-results__input' label='Sarja' {...serieControl}/>

            <Button style={searchButtonStyles} onClick={handleSearchButtonClick}>Etsi</Button>

          </div>
          <div className='old-results__table-container'>
            <Table 
              headers={tableHeaders}
              control={tableControl}
              oldLogs={slicedrows}
              nextClick={handleNextPaginatorClick}
              backClick={handlePreviousPaginatorClick}
              pageNumber={pageNumber}
            />
            <Button type='delete' style={deleteButtonStyles}>Poista valitut</Button>

          </div>
          <div className='old-results__button-container'>
            <Button style={updateButtonStyles}>Päivitä ranking</Button>
            <Button style={uploadButtonStyles} onClick={handleDownloadrankingLists}>Lataa Exceliin</Button>
          </div>

        </div>

      </div>

      { snackBarMessage !== '' &&
        <SnackBar close={() => {setSnackBarMessage('')}}>{snackBarMessage}</SnackBar>
      }

    </Layout>
  );
}

export default OldResults;
