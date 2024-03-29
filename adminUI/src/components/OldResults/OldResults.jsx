import {useEffect, useState} from 'react';
import Layout from '../Layout/Layout';
import './OldResults.scss';
import TextField from '@material-ui/core/TextField';
import useInput from '../../hooks/useInput';
import Button from '../Button/Button';
import  {updateRankingFetch, searchOldScoresFetch, deleteOldScoresFetch} from '../../services/httpClient';
import SnackBar from '../SnackBar/SnackBar';
import useTable from '../../hooks/useTable';
import TableWithPaginator from '../TableWithPaginator/TableWithPaginator';
import ModifyDialog from '../Dialogs/ModifyDialog/ModifyDialog';
import useDialog from '../../hooks/useDialog';
import InfoDialog from '../Dialogs/InfoDialog/InfoDialog';
import Select from '../Select/Select';
import useSelect from '../../hooks/useSelect';

const OldResults = () => {
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const modifyDialogControl = useDialog();
  const deletePoolControl = useDialog();

  const [modifydialogData, setModifydialogData] = useState();

  const selectOptions = [
    {value: '', text: 'Tyhjää kenttä'},
    {value: 'Naiset', text: 'Naiset'},
    {value: 'Miehet', text: 'Miehet'}
  ];
  const serieControl = useSelect({initValue: '', options: selectOptions});

  const yearControl = useInput({initValue: '', validattion: 'integer'});
  const weekControl = useInput({initValue: '', validattion: 'integer'});
  const nameControl = useInput({initValue: ''});
  const poolControl = useInput({initValue: '', validattion: 'integer'});

  const tableControl = useTable({rowsPerPage: 6, type: 'oldScores'});

  useEffect(() => {
    tableControl.setHeaders(['Nimi', 'Viikko', 'Lohko', 'Sijoitus', 'Pisteet', '+-Pisteet', 'Vuosi', 'Sarja']);
  }, [])

  const handleSearchButtonClick = async () => {
    if (yearControl.error || weekControl.error || nameControl.error || serieControl.error || poolControl.error) {
      return;
    }
    const response = await searchOldScoresFetch(nameControl.value, yearControl.value, weekControl.value, serieControl.value, poolControl.value);
    const json = await response.json();

    const tableData = json.data.map(row => {
      const id = row.pop();
      const columns = row.map(column => {return {value: column, id}});
      return columns;
    })
    
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

    };
    setModifydialogData(dialogData);
    modifyDialogControl.openDialog();
  }

  const handleDeleteScore = () => {
    deletePoolControl.openDialog();
  };

  const deleteScoreDialogContent = () => {
    return (
      <div className='flex-column'>
      </div>
    );
  };

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

  return (
    <Layout>
      <div className='old-results'>
        <div className='old-results__content flex-column-center'>
          <span className='old-results__header'>Etsi ja muokkaa vanhoja tuloksia</span>
          <div className='old-results__search-container'>
            <TextField className='old-results__input' label='Pelaaja' {...nameControl} id='old-results__player-input'/>
            <TextField className='old-results__input' label='Vuosi' {...yearControl} id='old-results__year-input'/>
            <TextField className='old-results__input' label='Viikko' {...weekControl} id='old-results__week-input'/>
            <Select className='old-results__input' control={serieControl} label='Sarja' id='old-results__serie-select'/>
            <TextField className='old-results__input' label='Lohko' {...poolControl} id='old-results__pool-input'/>

            <Button
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
            <Button className='old-results__update-button' onClick={handleUpdateRankingClick}>Päivitä ranking</Button>
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
};

export default OldResults;
