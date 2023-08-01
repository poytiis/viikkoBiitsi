import React, {useEffect, useState} from 'react';
import Layout from '../Layout/Layout';
import './OldResults.scss';
import TextField from '@material-ui/core/TextField';
import useInput from '../../hooks/useInput';
import Button from '../Button/Button';
import  { updateRankingFetch, searchOldScoresFetch, deleteOldScoresFetch } from '../../services/httpClient'
import SnackBar from '../SnackBar/SnackBar';
import useTable from '../../hooks/useTable';
import TableWithPaginator from '../TableWithPaginator/TableWithPaginator';
import ModifyDialog from '../Dialogs/ModifyDialog/ModifyDialog';
import useDialog from '../../hooks/useDialog';
import InfoDialog from '../Dialogs/InfoDialog/InfoDialog';

const OldResults = () => {

  const [snackBarMessage, setSnackBarMessage] = useState('');
  const modifyDialogControl = useDialog();
  const deletePoolControl = useDialog();

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

  const handleUpdateRankingClick = async () =>  {
    const res = await updateRankingFetch();
    if(res.ok) {
      setSnackBarMessage('Ranking päivitetty onnistuneesti');
    } else {
      setSnackBarMessage('Rankinging päivittäminen epäonnistui');
    }
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

  const handleDeleteScore = () => {
    deletePoolControl.openDialog();
  }

  const deleteScoreDialogContent = () => {
    return (
      <div className='flex-column'>
      </div>
    );
  }

  const handleDeleteScoreClick = async () => {
    const id = {
      id: modifydialogData.name.id
    }

    const res = await deleteOldScoresFetch(id);

    if (res.ok) {
      handleSearchButtonClick();
      setSnackBarMessage('Tuloksen poistaminen onnistui')
    } else {
      setSnackBarMessage('Tuloksen poistaminen epäonnistui')
    }
    deletePoolControl.closeDialog();
    modifyDialogControl.closeDialog();
  }

  const searchButtonStyles = {
    transform: 'translateY(5px)'
  }

  const updateButtonStyles = {
    width: '190px'
  }


  return (
    <Layout>
      <div className='old-results'>
        <div className='old-results__content flex-column-center'>
          <span className='old-results__header'>Etsi ja muokkaa vanhoja tuloksia</span>
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
          <div className='old-results__button-container flex-row'>
            <Button style={updateButtonStyles} onClick={handleUpdateRankingClick}>Päivitä ranking</Button>
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
          delete={handleDeleteScore}
        />     
      }

      { deletePoolControl.showDialog &&
        <InfoDialog 
          close={deletePoolControl.closeDialog}
          content={deleteScoreDialogContent}
          header={'Oletko varma että haluat poistaa tuloksen?'}
          accept={handleDeleteScoreClick}
          acceptButtonText='Poista'
        />     
      }


    </Layout>
  );
}

export default OldResults;
