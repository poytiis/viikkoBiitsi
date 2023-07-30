import React, { useState } from 'react';
import Dialog from '../Dialog/Dialog';
import Button from '../../Button/Button';
import './ModifyDialog.scss';
import useInput from '../../../hooks/useInput';
import TextField from '@material-ui/core/TextField';
import { UpdatePoolFetch, updateOldScoresFetch } from '../../../services/httpClient';

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

        <div className='modify-dialog__main-content'>

          <div className='flex-column'>
          <TextField {...poolControl} label="Lohko" style={{width: '300px',margin: '0.6rem 0'}} />
          <TextField {...serieControl} label="Sarja" style={{width: '300px',margin: '0.6rem 0'}} />
          <TextField {...nameControl} label="Nimi" style={{width: '300px',margin: '0.6rem 0'}} />
          <TextField {...scoreControl} label="Pisteet" style={{width: '300px',margin: '0.6rem 0'}} />

          {props.type === 'oldScores' && (
           <>         
              <TextField {...plusMinusPointsControl} label="+-Pistet" style={{width: '300px',margin: '0.6rem 0'}} />
              <TextField {...rankingControl} label="Sijoitus" style={{width: '300px',margin: '0.6rem 0'}} />
              <TextField {...yearControl} label="Vuosi" style={{width: '300px',margin: '0.6rem 0'}} />
              <TextField {...weekControl} label="Viikko" style={{width: '300px',margin: '0.6rem 0'}} />
            </>        
          )}
          
          </div>       
          
        </div>

        <div className='modify-dialog__button-container flex-row'>
          <Button onClick={props.close} style={deleteButtonStyles}>Peruuta</Button>
          <Button onClick={handleUpdate}>Muokkaa</Button>
        </div>
      </div>     
    </Dialog>   
  );
}

export default ModifyDialog;