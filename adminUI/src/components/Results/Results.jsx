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
    setModifydialogData(data);
    modifyDialogControl.openDialog();
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
