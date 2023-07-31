import React, {useEffect, useState} from 'react';
import Layout from '../Layout/Layout';
import './OldResults.scss';
import TextField from '@material-ui/core/TextField';
import useInput from '../../hooks/useInput';
import Button from '../Button/Button';
import  { downloadRankingsFetch, searchOldScoresFetch } from '../../services/httpClient'
import SnackBar from '../SnackBar/SnackBar';
import useTable from '../../hooks/useTable';
import TableWithPaginator from '../TableWithPaginator/TableWithPaginator';
import ModifyDialog from '../Dialogs/ModifyDialog/ModifyDialog';
import useDialog from '../../hooks/useDialog';

const OldResults = () => {

  const [snackBarMessage, setSnackBarMessage] = useState('');
  const modifyDialogControl = useDialog();

  const [modifydialogData, setModifydialogData] = useState();

  const yearControl = useInput('');
  const weekControl = useInput('');
  const nameControl = useInput('');
  const serieControl = useInput('');
  const poolontrol = useInput('');

  const tableControl = useTable({rowsPerPage: 6, type: 'oldScores'});

  useEffect(() => {
    tableControl.setHeaders(['Nimi', 'Viikko', 'Lohko',  'Sijoitus', 'Pisteet', '+-Pisteet','Vuosi', 'Sarja'  ])
  }, [])

  const handleSearchButtonClick = async () => {
    const response = await searchOldScoresFetch(nameControl.value, yearControl.value, weekControl.value, serieControl.value, poolontrol.value);
    const json = await response.json()
    console.log(json.data)

    const tableData = json.data.map(row => {
      const id = row.pop()
      const columns = row.map(column => { return {value: column, id}})
      return columns;
    })

    console.log(tableData)
    tableControl.initializeRows(tableData);
  }

  const openModifyDialogData = (data) => {
    console.log(data)
    const dialogData = {
      name: {
        value: data[0].value,
        id: data[0].id
      },
      score: {
        value: data[4].value,
        id: data[4].id
      },
      serie: {
        value: data[7].value,
        id: data[7].id
      },
      rank: {
        value: data[2].value,
        id: data[2].id
      },
      year: {
        value: data[6].value,
        id: data[6].id
      },
      week: {
        value: data[1].value,
        id: data[1].id
      },
      plusMinusPoints: {
        value: data[5].value,
        id: data[5].id
      },
      ranking: {
        value: data[3].value,
        id: data[3].id
      }

    }
    setModifydialogData(dialogData);
    modifyDialogControl.openDialog();
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

  return (
    <Layout>
      <div className='old-results'>
        <div className='old-results__content flex-column-center'>
          <span className='old-results__header'>Etsi vanhoja tuloksia</span>
          <div className='old-results__search-container'>
            <TextField className='old-results__input' label='Pelaaja' {...nameControl} id='old-results__player-input'/>
            <TextField className='old-results__input' label='Vuosi' {...yearControl} id='old-results__year-input'/>
            <TextField className='old-results__input' label='Viikko' {...weekControl} id='old-results__week-input'/>
            <TextField className='old-results__input' label='Sarja' {...serieControl} id='old-results__serie-input'/>
            <TextField className='old-results__input' label='Lohko' {...poolontrol} id='old-results__pool-input'/>

            <Button 
              style={searchButtonStyles} 
              onClick={handleSearchButtonClick}
              className='old-results__search-button'
            >
              Etsi
            </Button>

          </div>
          <div className='old-results__table-container'>
            <TableWithPaginator
              control={tableControl}
              rowClick={openModifyDialogData}
            />

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

      { modifyDialogControl.showDialog &&
        <ModifyDialog 
          close={modifyDialogControl.closeDialog}
          content={modifydialogData}
          fetchData={handleSearchButtonClick}
          type='oldScores'
        />     
      }

    </Layout>
  );
}

export default OldResults;
