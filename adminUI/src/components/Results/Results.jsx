import React, { useState, useEffect, useCallback } from 'react';
import './Results.scss';
import Layout from '../Layout/Layout';
import Table from '../Table/Table';
import Button from '../Button/Button';
import DeleteDialog from '../Dialogs/DeleteDialog/DeleteDialog';
import ModifyDialog from '../Dialogs/ModifyDialog/ModifyDialog';
import useDialog from '../../hooks/useDialog';
import { getNewScores } from '../../services/httpClient';
import SnackBar from '../SnackBar/SnackBar';
import { deletePoolAjax, calculateNewRankingAjax } from '../../services/httpClient';

const Results = () => {
  const deleteDialogControl = useDialog();
  const modifyDialogControl = useDialog();

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

  const fetchData = useCallback(() => {
    getNewScores()
      .then(res  => {

        const pools = res.data.data.filter(row => row.meta_key === '_field_39').map(pool => pool.meta_value);
        const series = res.data.data.filter(row => row.meta_key === '_field_38').map(serie => serie.meta_value);
        const postIds = res.data.data.filter(row => row.meta_key === '_field_38').map(postId => postId.post_id);

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

        settableData(res.data.data);
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
      fontSize: '1.2rem'
    };

    if(selectedPool === -1 || pools.length === 0){
      return <h2>Ainuttakaan valintaa ei voitu poistaa</h2>;
    }

    const content = 'Lohko ' + pools[selectedPool].pool + ' ' + pools[selectedPool].serie;
    return(
      <p style={contentStyles}>{content}</p>
    );
  };

  const handleDeletePool = () => {
    if(selectedPool === -1 || pools.length === 0) {
      return;
    }
    const postId = pools[selectedPool].postId;
    if(postId === null || postId === '') {
      return;
    }
    console.log(postId)
    deletePoolAjax(postId)
      .then(res => {
        setSelectedPool(-1);
        deleteDialogControl.closeDialog();
        fetchData();
      })
  }

  const handleUpdateNewRanking = () => {
    setDisableUpdateButton(true);
    calculateNewRankingAjax()
      .then(res => {
        setDisableUpdateButton(false);
        setSelectedPool(-1);
        setPools([]);
        fetchData();
      })
      .catch(err => {
        setDisableUpdateButton(false);
      })
    
  }

  const tableHeaders = ['', 'Lohko','Sarja' , 'Pisteet', 'Nimi'];

  const tableStyles = {
    marginTop: '2rem'
  }

  const updateButtonStyles = {
    width: '190px'
  };

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

        />
        <div className='results__button-container flex-row'>
          <Button type='delete' onClick={deleteDialogControl.openDialog}>Poista lohko</Button>
          <Button style={updateButtonStyles} disabled={disableUpdateButton} onClick={handleUpdateNewRanking}>Päivitä tulokset</Button>
        </div>
      </div>

      {  deleteDialogControl.showDialog && 
        <DeleteDialog 
          close={deleteDialogControl.closeDialog}
          delete={handleDeletePool} 
          content={createDeletePoolContent} 
          things='lohkot'
        />
      }

      { modifyDialogControl.showDialog &&
        <ModifyDialog 
          close={modifyDialogControl.closeDialog}
          content={modifydialogData}
          fetchData ={fetchData}
        />     
      }

      { snackBarMessage !== '' &&
        <SnackBar close={() => {setSnackBarMessage('')}}>{snackBarMessage}</SnackBar>
      }
   </Layout>
  );
}

export default Results;
