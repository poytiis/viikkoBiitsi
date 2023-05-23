import React from 'react';
import Layout from '../Layout/Layout';
import './OldResults.scss';
import TextField from '@material-ui/core/TextField';
import useInput from '../../hooks/useInput';
import Button from '../Button/Button';
import Table from '../Table/Table';
import  { downloadRankings } from '../../services/httpClient'

const OldResults = () => {

  const yearControl = useInput('');
  const weekControl = useInput('');
  const nameControl = useInput('');
  const serieControl = useInput('');

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
  const downloadRankinList = (serie) => {

    Date.prototype.getWeek = function() {
      var onejan = new Date(this.getFullYear(),0,1);
      return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
    }

    const today =new Date();
    var weekNumber = today.getWeek();
    const fileName = 'ranking_' + serie + weekNumber + '.csv';

    downloadRankings(serie)
      .then(res => {
        console.log(res)
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(res.data));
        element.setAttribute('download', fileName);

        element.style.display = 'none';
        document.body.appendChild(element);

        element.click();
        document.body.removeChild(element);

      })
      .catch(err => {

    })

  }
  const tableHeaders = ['', 'Lohko', 'Sarja', 'Pisteet', 'Nimi'];
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

            <Button style={searchButtonStyles}>Etsi</Button>

          </div>
          <div className='old-results__table-container'>
            <Table headers={tableHeaders}/>
            <Button type='delete' style={deleteButtonStyles}>Poista valitut</Button>

          </div>
          <div className='old-results__button-container'>
            <Button style={updateButtonStyles}>Päivitä ranking</Button>
            <Button style={uploadButtonStyles} onClick={handleDownloadrankingLists}>Lataa Exeliin</Button>
          </div>

        </div>

      </div>

    </Layout>
  );
}

export default OldResults;
