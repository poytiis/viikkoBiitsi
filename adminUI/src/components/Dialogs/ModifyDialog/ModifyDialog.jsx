import React, { useState } from 'react';
import Dialog from '../Dialog/Dialog';
import Button from '../../Button/Button';
import './ModifyDialog.scss';
import useInput from '../../../hooks/useInput';
import TextField from '@material-ui/core/TextField';
import { UpdatePoolFetch, updateOldScoresFetch, deleteOldScoresFetch } from '../../../services/httpClient';

const ModifyDialog = (props) => {

  const { rank, serie, name, score, year, week, plusMinusPoints, ranking } = props.content;

  const poolControl = useInput(rank.value);
  const serieControl = useInput(serie.value);
  const nameControl = useInput(name.value);
  const scoreControl = useInput(score.value);
  const plusMinusPointsControl = useInput(plusMinusPoints?.value);
  const yearControl = useInput(year?.value );
  const weekControl = useInput(week?.value);
  const rankingControl = useInput(ranking?.value);

  const deleteButtonStyles = {
    backgroundColor: 'var(--gray)'
  };

  const handleDeleteScore = async () => {
    const id = {
      id: serie.id
    }

    const res = await deleteOldScoresFetch(id);

    if (res.ok) {
      props.fetchData();
      props.close();
    } else {
       props.close();
    }
  }

  const handleUpdate = async () => {
    console.log('muokkaa')
    if(rank.value === poolControl.value && serie.value === serieControl.value &&
       name.value === nameControl.value && score.value === scoreControl.value) {
         return;
    }

    let newData = {
      rankValue: poolControl.value,
      rankId: rank.id,
      nameValue: nameControl.value,
      nameId: name.id,
      scorevalue: scoreControl.value,
      scoreid: score.id,
      serievalue: serieControl.value,
      serieId: serie.id
    };

    if (props.type === 'oldScores') {
      newData = {
        week: parseInt(weekControl.value),
        pool: parseInt(poolControl.value),
        ranking: parseInt(rankingControl.value),
        playedScores: parseInt(scoreControl.value),
        serieScores: parseFloat(plusMinusPointsControl.value),
        year:parseInt(yearControl.value),
        serie: serieControl.value,
        id: serie.id,
        name: nameControl.value
      }
    }
    console.log(newData)

    try {
      let res = null;
      if (props.type === 'oldScores') {
        res = await updateOldScoresFetch(newData);
      } else {
        res = await UpdatePoolFetch(newData);
      }
      
      if (res.ok) {
        props.fetchData();
        props.close();
      } else {
         props.close();
      }
    } catch (ex) {

    }
  }
  return (
    <Dialog type={props.type}>
      <div className='modify-dialog flex-column-center'>
        <h2 className='modify-dialog__header'>Muokkaa tietoja</h2>
        {props.type === 'oldScores' && (
          <span className='modify-dialog__delete-score-button' onClick={handleDeleteScore}>Poista</span>
        )}

        <div className='modify-dialog__main-content'>

          <div className='flex-column'>
          <TextField {...poolControl} label="Lohko" style={{width: '300px',margin: '0.6rem 0'}} id='modify-dialog__pool-input' />
          <TextField {...serieControl} label="Sarja" style={{width: '300px',margin: '0.6rem 0'}} id='modify-dialog__serie-input'/>
          <TextField {...nameControl} label="Nimi" style={{width: '300px',margin: '0.6rem 0'}} id='modify-dialog__name-input'/>
          <TextField {...scoreControl} label="Pisteet" style={{width: '300px',margin: '0.6rem 0'}} id='modify-dialog__score-input'/>

          {props.type === 'oldScores' && (
           <>         
              <TextField {...plusMinusPointsControl} label="+-Pistet" style={{width: '300px',margin: '0.6rem 0'}} id='modify-dialog__plus-minus-input'/>
              <TextField {...rankingControl} label="Sijoitus" style={{width: '300px',margin: '0.6rem 0'}} id='modify-dialog__ranking-input'/>
              <TextField {...yearControl} label="Vuosi" style={{width: '300px',margin: '0.6rem 0'}} id='modify-dialog__year-input'/>
              <TextField {...weekControl} label="Viikko" style={{width: '300px',margin: '0.6rem 0'}} id='modify-dialog__week-input'/>
            </>        
          )}
          
          </div>       
          
        </div>

        <div className='modify-dialog__button-container flex-row'>
          <Button 
            onClick={props.close} 
            style={deleteButtonStyles}
            className='modify-dialog__close-button'
          >
            Peruuta
          </Button>
          <Button onClick={handleUpdate} className='modify-dialog__update-button'>Muokkaa</Button>
        </div>
      </div>     
    </Dialog>   
  );
}

export default ModifyDialog;