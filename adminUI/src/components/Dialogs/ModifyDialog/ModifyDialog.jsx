import React from 'react';
import Dialog from '../Dialog/Dialog';
import Button from '../../Button/Button';
import './ModifyDialog.scss';
import useInput from '../../../hooks/useInput';
import TextField from '@material-ui/core/TextField';
import { UpdatePoolFetch, updateOldScoresFetch } from '../../../services/httpClient';

const ModifyDialog = (props) => {

  const { rank, serie, name, score, year, week, plusMinusPoints, ranking } = props.content;

  const poolControl = useInput({initValue: rank.value, validattion: 'integer'});
  const serieControl = useInput({initValue: serie.value, validattion: 'required'});
  const nameControl = useInput({initValue: name.value, validattion: 'required'});
  const scoreControl = useInput({initValue: score.value, validattion: 'integer'});
  const plusMinusPointsControl = useInput({initValue: plusMinusPoints?.value, validattion: 'required'});
  const yearControl = useInput({initValue: year?.value, validattion: 'integer'});
  const weekControl = useInput({initValue: week?.value, validattion: 'integer'});
  const rankingControl = useInput({initValue: ranking?.value, validattion: 'integer'});

  const handleEnterKeyUpDelete = (e) => {
    if (e.key === 'Enter' ) props.delete();
  }

  const handleUpdate = async () => {
    if(rank.value === poolControl.value && serie.value === serieControl.value &&
       name.value === nameControl.value && score.value === scoreControl.value &&
       plusMinusPoints?.value === plusMinusPointsControl.value && 
       year?.value === yearControl.value && week?.value === weekControl.value &&
       ranking?.value === rankingControl.value) 
    {
        props.close();
    }

    if (poolControl.error || serieControl.error || nameControl.error || scoreControl.error ||
        plusMinusPointsControl.error || yearControl.error || weekControl.error || rankingControl.error) 
    {
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
          <span 
            className='modify-dialog__delete-score-button' 
            onClick={() => {props.delete()}}
            tabIndex={0}
            onKeyUp={(e) => {handleEnterKeyUpDelete(e)}}
          >
            Poista
          </span>
        )}

        <div className='modify-dialog__main-content'>

          <div className='flex-column'>
          <TextField {...poolControl} label="Lohko" className='modify-dialog__input' id='modify-dialog__pool-input' />
          <TextField {...serieControl} label="Sarja" className='modify-dialog__input' id='modify-dialog__serie-input'/>
          <TextField {...nameControl} label="Nimi" className='modify-dialog__input' id='modify-dialog__name-input'/>
          <TextField {...scoreControl} label="Pisteet" className='modify-dialog__input' id='modify-dialog__score-input'/>

          {props.type === 'oldScores' && (
           <>         
              <TextField {...plusMinusPointsControl} label="+-Pistet" className='modify-dialog__input' id='modify-dialog__plus-minus-input'/>
              <TextField {...rankingControl} label="Sijoitus" className='modify-dialog__input' id='modify-dialog__ranking-input'/>
              <TextField {...yearControl} label="Vuosi" className='modify-dialog__input' id='modify-dialog__year-input'/>
              <TextField {...weekControl} label="Viikko" className='modify-dialog__input' id='modify-dialog__week-input'/>
            </>        
          )}
          
          </div>       
          
        </div>

        <div className='modify-dialog__button-container flex-row'>
          <Button 
            onClick={props.close} 
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