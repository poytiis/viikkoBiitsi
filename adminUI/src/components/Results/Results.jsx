import React, { useState, useEffect, useCallback } from 'react';
import './Results.scss';
import Layout from '../Layout/Layout';
import Button from '../Button/Button';
import ModifyDialog from '../Dialogs/ModifyDialog/ModifyDialog';
import InfoDialog from '../Dialogs/InfoDialog/InfoDialog';
import useDialog from '../../hooks/useDialog';
import { getNewScoresFetch } from '../../services/httpClient';
import SnackBar from '../SnackBar/SnackBar';
import { deletePoolFetch, calculateNewRankingFetch, takeBackupFormDataFetch } from '../../services/httpClient';
import TableWithPaginator from '../TableWithPaginator/TableWithPaginator';
import useTable from '../../hooks/useTable';

const Results = () => {
  const modifyDialogControl = useDialog();
  const deletePoolControl = useDialog();
  const calculateScoresControl = useDialog();

  const [modifydialogData, setModifydialogData] = useState();
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [disableUpdateButton, setDisableUpdateButton] = useState(false);

  const tableControl = useTable({rowsPerPage: 4, type: 'scores'});


  const createCalculateScoresDialogContent = () => {
    let menPools = new Set();
    let womenPools = new Set();

    tableControl.rows.forEach(row => {
      if (row[1].value === 'Naiset') {
        womenPools.add(row[0].value);
      } else if (row[1].value === 'Miehet'){
        menPools.add(row[0].value);
      }
    });

    return (
      <div className='flex-column'>
        <div className='info-dialog__text info-dialog__text--men-pools'>Miesten lohkoja: {menPools.size}</div>
        <div className='info-dialog__text info-dialog__text--women-pools'>Naisten lohkoja: {womenPools.size}</div>
      </div>
    );
  }

  const fetchData = useCallback(() => {
    getNewScoresFetch()
      .then(res  => {
        return  res.json();    
      })
      .then (data => {

        const newTableRows = [];
        const rawData = data.data;

        let pool = null;
        let serie = null;

        for(let i = 0; i < rawData.length; i = i + 2) {

          if (i % 12 === 0)   {         

            serie = {
              value: rawData[i].meta_value,
              id: rawData[i].meta_id,
              postId: rawData[i +1].post_id
            };

            pool = {
              value: rawData[i + 1].meta_value,
              id: rawData[i +1].meta_id,
              postId: rawData[i +1].post_id
            };

          } else if (i % 12 === 10) {
            continue;
          } else {
            const name  = {
              value: rawData[i].meta_value,
              id: rawData[i].meta_id,
              postId: rawData[i +1].post_id
            }

            const score = {
              value: rawData[i + 1].meta_value,
              id: rawData[i + 1].meta_id,
              postId: rawData[i +1].post_id
            }

            const row = [pool, serie, score, name]

            newTableRows.push(row);
          }        
        }

        const comparePools = (first, second) => {

          if (first[1].value === 'Miehet' && second[1].value === 'Naiset' ) {
            return 1;
          } else if (first[1].value === 'Naiset' && second[1].value === 'Miehet') {
            return -1;
          } else {
            return parseInt(first[0].value) - parseInt(second[0].value);
          }
   
        }

        newTableRows.sort(comparePools)

        tableControl.setHeaders(['Lohko','Sarja', 'Pisteet', 'Nimi', ''])
        tableControl.initializeRows(newTableRows);
      })
      .catch( err => {
        console.log(err);
        setSnackBarMessage('Virhe tulosten haussa');
      })

  }, []);

  useEffect(() => {
    const takeBackupFormData = async () => {
      await takeBackupFormDataFetch();
    };
    takeBackupFormData();
    fetchData();
  }, [fetchData]);
 

  const openModifyDialogData = (data) => {
    const dialogData = {
      name: {
        value: data[3].value,
        id: data[3].id
      },
      score: {
        value: data[2].value,
        id: data[2].id
      },
      serie: {
        value: data[1].value,
        id: data[1].id
      },
      rank: {
        value: data[0].value,
        id: data[0].id
      }

    }
    setModifydialogData(dialogData);
    modifyDialogControl.openDialog();
  }

  const createDeletePoolContent = () => {
    const contentStyles = {
      fontSize: '1.3rem'
    };

    if(tableControl.selectedPool === -1 || tableControl.rows.length === 0){
      return <h2>Ainuttakaan valintaa ei voitu poistaa</h2>;
    }

    const content = 'Lohko ' + tableControl.visibleRows[0][0].value + ' ' + tableControl.visibleRows[0][1].value;
    return(
      <p style={contentStyles}>{content}</p>
    );
  }


  const handleDeletePool = async () => {
    if(tableControl.visibleRows.length === 0) {
      return;
    }
    const postId = tableControl.visibleRows[0][0].postId;
    if(postId === null || postId === '') {
      return;
    }

    try {
      const res = await deletePoolFetch(postId);
      if(!res.ok) setSnackBarMessage('Lohkon poistaminen epäonnistui')
      else setSnackBarMessage('Lohko poistettu onnistuneesti')
      deletePoolControl.closeDialog();
      fetchData();
    } catch (ex) {
      setSnackBarMessage('Tapahtui tietoyhteysvirhe');
      deletePoolControl.closeDialog();
    }
  }

  const handleUpdateNewRanking = async () => {
    calculateScoresControl.setDisableAcceptButton(true);
    const response = await calculateNewRankingFetch();
    if(!response) setSnackBarMessage('Tapahtui tietoyhteysvirhe')
    
    else if (response.ok) {
      const result = await response.json();
      fetchData();
      setSnackBarMessage('Viikon tulokset päivitetty onnistuneesti. Uudet pelaajat: ' + result.data)
    } else {
      const result = await response.json();
      const errorMessage = result.data;
      setSnackBarMessage(errorMessage)
    }

    setDisableUpdateButton(false);
    calculateScoresControl.setDisableAcceptButton(false);
    calculateScoresControl.closeDialog(); 
  }

  return (
    <Layout>
      <div className='results flex-column-center'>
        <h2 className='results__header'>Laske viikon tulokset</h2>

        <TableWithPaginator
          control={tableControl}
          rowClick={openModifyDialogData}
        />

        <div className='results__button-container flex-row'>
          <Button 
            type='delete' 
            onClick={deletePoolControl.openDialog}
            className='results__delete-button'
          >
            Poista lohko
          </Button>
          <Button 
            disabled={disableUpdateButton} 
            onClick={calculateScoresControl.openDialog}
            className='results__update-scores-button'
          >
            Päivitä tulokset
          </Button>
        </div>
      </div>

      { modifyDialogControl.showDialog &&
        <ModifyDialog 
          close={modifyDialogControl.closeDialog}
          content={modifydialogData}
          fetchData={fetchData}
        />     
      }

      { deletePoolControl.showDialog &&
        <InfoDialog 
          close={deletePoolControl.closeDialog}
          content={createDeletePoolContent}
          header={'Oletko varma että haluat poistaa seuraavan lohkon'}
          accept={handleDeletePool}
          acceptButtonText='Poista'
        />     
      }

      { calculateScoresControl.showDialog &&
        <InfoDialog 
          close={calculateScoresControl.closeDialog}
          content={createCalculateScoresDialogContent}
          header={'Tulokset päivitetään seuraavalla määrällä lohkoja'}
          accept={handleUpdateNewRanking}
          acceptButtonText='Päivitä'
          disableAcceptButton={calculateScoresControl.disableAcceptButton}
        />     
      }

      { snackBarMessage !== '' &&
        <SnackBar close={() => {setSnackBarMessage('')}}>{snackBarMessage}</SnackBar>
      }
   </Layout>
  );
}

export default Results;
