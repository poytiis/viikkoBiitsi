import React, { useState, useEffect, useCallback } from 'react';
import './Results.scss';
import Layout from '../Layout/Layout';
import Table from '../Table/Table';
import Button from '../Button/Button';
import ModifyDialog from '../Dialogs/ModifyDialog/ModifyDialog';
import InfoDialog from '../Dialogs/InfoDialog/InfoDialog';
import useDialog from '../../hooks/useDialog';
import { getNewScoresFetch } from '../../services/httpClient';
import SnackBar from '../SnackBar/SnackBar';
import { deletePoolFetch, calculateNewRankingFetch } from '../../services/httpClient';
import TableWithPaginator from '../TableWithPaginator/TableWithPaginator';
import useTable from '../../hooks/useTable';

const Results = () => {
  const modifyDialogControl = useDialog();
  const deletePoolControl = useDialog();
  const calculateScoresControl = useDialog();

  const [modifydialogData, setModifydialogData] = useState();
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [tableData, settableData] = useState([]);
  const [pools, setPools] = useState([]);
  const [selectedPool, setSelectedPool] = useState(-1);
  const [disableUpdateButton, setDisableUpdateButton] = useState(false);

  const tableControl = useTable({rowsPerPage: 4});


  const handleNextPaginatorClick = () => {
    if(selectedPool !== pools.length - 1) {
      setSelectedPool(selectedPool + 1);
    } 
  }

  const handlePreviousPaginatorClick = () => {
    if(selectedPool !== 0){
      setSelectedPool(selectedPool - 1);
    }  
  }

  const players = [];

  if (selectedPool !== -1 && pools.length !== 0) {
    const selectedPostId = pools[selectedPool].postId;
    const data = tableData.filter(row => row.post_id === selectedPostId);

    for(let i = 2; i <= 8; i = i + 2) {

      const player = {
        name: {
          value: data[i].meta_value,
          id: data[i].meta_id
        },
        score: {
          value: data[i + 1].meta_value,
          id: data[i + 1].meta_id
        },
        serie: {
          value: data[0].meta_value,
          id: data[0].meta_id
        },
        rank: {
          value: data[1].meta_value,
          id: data[1].meta_id
        }
      };
      players.push(player);
    }
    // console.log(players)
  }

  const comparePools = useCallback((first, second) => {

    if (first.serie === 'Miehet' && second.serie === 'Naiset' ) {
      return 1;
     } else if (first.serie === 'Naiset' && second.serie === 'Miehet') {
      return -1;
     } else {
      return parseInt(first.pool) - parseInt(second.pool);
    }

  }, []);

  const createCalculateScoresDialogContent = () => {
    let menPools = 0;
    let womenPools = 0;

    pools.forEach(pool => {
      if (pool.serie === 'Naiset') {
        womenPools += 1;
      } else if (pool.serie === 'Miehet'){
        menPools += 1;
      }
    });

    return (
      <div className='flex-column'>
        <div className='info-dialog__text'>Miesten lohkoja: {menPools}</div>
        <div className='info-dialog__text'> Naisten lohkoja: {womenPools}</div>
      </div>
    );
  }

  const fetchData = useCallback(() => {
    getNewScoresFetch()
      .then(res  => {
        console.log(res)
        return  res.json();    
      })
      .then (data => {
        const pools = data.data.filter(row => row.meta_key === '_field_39').map(pool => pool.meta_value);
        const series = data.data.filter(row => row.meta_key === '_field_38').map(serie => serie.meta_value);
        const postIds = data.data.filter(row => row.meta_key === '_field_38').map(postId => postId.post_id);

        const poolsCount = pools.length;
        const poolsData = [];

        for(let i = 0; i < poolsCount; i++) {
          const poolObject = {
            pool: pools[i],
            serie: series[i],
            postId: postIds[i]
          };
          poolsData.push(poolObject);
        }

        poolsData.sort(comparePools);

        settableData(data.data);
        setPools(poolsData);
        setSelectedPool(0);

        const newTableRows = [];
        const rawData = data.data;
        console.log(rawData)

        let pool = null;
        let serie = null;

        for(let i = 0; i < rawData.length; i = i + 2) {

          if (i % 12 === 0)   {         

            serie = {
              value: rawData[i].meta_value,
              id: rawData[i].meta_id
            };

            pool = {
              value: rawData[i + 1].meta_value,
              id: rawData[i +1].meta_id
            };

          } else if (i % 12 === 10) {
           

            continue;

          } else {
            const name  = {
              value: rawData[i].meta_value,
              id: rawData[i].meta_id
            }

            const score = {
              value: rawData[i + 1].meta_value,
              id: rawData[i + 1].meta_id
            }

            const row = [pool, serie, score, name]

            newTableRows.push(row);
          }        
        }

        const compare = (first, second) => {

          if (first[1].value === 'Miehet' && second[1].value === 'Naiset' ) {
            return 1;
          } else if (first[1].value === 'Naiset' && second[1].value === 'Miehet') {
            return -1;
          } else {
            return parseInt(first[0].value) - parseInt(second[0].value);
          }


     
        }
        newTableRows.sort(compare)

        tableControl.setHeaders(['Lohko','Sarja' , 'Pisteet', 'Nimi', ''])
        tableControl.initializeRows(newTableRows);

        console.log(newTableRows)

      })
      .catch( err => {
        console.log(err);
        setSnackBarMessage('Virhe tulosten haussa');
      })

  }, [settableData, setPools, setSelectedPool, comparePools]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
 
  const openModifyDialogData = (data) => {
    console.log(data)
    setModifydialogData(data);
    modifyDialogControl.openDialog();
  }

  const createDeltePool = () => {
    const contentStyles = {
      fontSize: '1.3rem'
    };

    if(tableControl.selectedPool === -1 || tableControl.rows.length === 0){
      return <h2>Ainuttakaan valintaa ei voitu poistaa</h2>;
    }

    const content = 'Lohko ' + tableControl.rows[selectedPool][0] + ' ' + tableControl.rows[selectedPool][1];
    return(
      <p style={contentStyles}>{content}</p>
    );
  }

  const createDeletePoolContent = () => {
    const contentStyles = {
      fontSize: '1.3rem'
    };

    if(selectedPool === -1 || pools.length === 0){
      return <h2>Ainuttakaan valintaa ei voitu poistaa</h2>;
    }

    const content = 'Lohko ' + pools[selectedPool].pool + ' ' + pools[selectedPool].serie;
    return(
      <p style={contentStyles}>{content}</p>
    );
  };

  const handleDeletePool = async () => {
    if(selectedPool === -1 || pools.length === 0) {
      return;
    }
    const postId = pools[selectedPool].postId;
    if(postId === null || postId === '') {
      return;
    }

    try {
      const res = await deletePoolFetch(postId);
      if(!res.ok) setSnackBarMessage('Lohkon poistaminen epäonnistui')
      else setSnackBarMessage('Lohko poistettu onnistuneesti')
      setSelectedPool(-1);
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
      setSelectedPool(-1);
      setPools([]);
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

  const tableHeaders = ['', 'Lohko','Sarja' , 'Pisteet', 'Nimi'];

  const tableStyles = {
    marginTop: '2rem'
  }

  const updateButtonStyles = {
    width: '190px'
  };

  const tablePageNumber = (selectedPool + 1).toString() + '/' + pools.length.toString();

  return (
    <Layout>
      <div className='results flex-column-center'>
        <h2 className='results__header'>Laske viikon tulokset</h2>
        <Table 
          style={tableStyles} 
          rowClick={openModifyDialogData}
          headers={tableHeaders}
          players={players}
          nextClick={handleNextPaginatorClick}
          backClick={handlePreviousPaginatorClick}
          pageNumber={tablePageNumber}

        />
        <div className='results__button-container flex-row'>
          <Button type='delete' onClick={deletePoolControl.openDialog}>Poista lohko</Button>
          <Button style={updateButtonStyles} disabled={disableUpdateButton} onClick={calculateScoresControl.openDialog}>Päivitä tulokset</Button>
        </div>

        <TableWithPaginator
          control={tableControl}
        />

      </div>

      { modifyDialogControl.showDialog &&
        <ModifyDialog 
          close={modifyDialogControl.closeDialog}
          content={modifydialogData}
          fetchData ={fetchData}
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
