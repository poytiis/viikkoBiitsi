import React from 'react';
import Dialog from '../Dialog/Dialog';
import Button from '../../Button/Button';
import './ModifyDialog.scss';
import useInput from '../../../hooks/useInput';
import TextField from '@material-ui/core/TextField';
import { UpdatePoolFetch } from '../../../services/httpClient';

const ModifyDialog = (props) => {

  const { rank, serie, name, score } = props.content;

  const rankControl = useInput(rank.value);
  const serieControl = useInput(serie.value);
  const nameControl = useInput(name.value);
  const scoreControl =useInput(score.value);

  const deleteButtonStyles = {
    backgroundColor: 'var(--gray)'
  };

  const handleUpdate = async () => {
    console.log('muokkaa')
    if(rank.value === rankControl.value && serie.value === serieControl.value &&
       name.value === nameControl.value && score.value === scoreControl.value) {
         return;
    }

    const newData = {
      rankValue: rankControl.value,
      rankId: rank.id,
      nameValue: nameControl.value,
      nameId: name.id,
      scorevalue: scoreControl.value,
      scoreid: score.id,
      serievalue: serieControl.value,
      serieId: serie.id
    };
    console.log(newData)

    try {
      const res = await UpdatePoolFetch(newData);
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
    <Dialog>
      <div className='modify-dialog flex-column-center'>
        <h2 className='modify-dialog__header'>Muokkaa tietoja</h2>

        <div className='modify-dialog__main-content'>

          <div className='flex-column'>
          <TextField {...rankControl} label="lohko" style={{width: '300px',margin: '0.6rem 0'}} />
          <TextField {...serieControl} label="Sarja" style={{width: '300px',margin: '0.6rem 0'}} />
          <TextField {...nameControl} label="Nimi" style={{width: '300px',margin: '0.6rem 0'}} />
          <TextField {...scoreControl} label="Pisteet" style={{width: '300px',margin: '0.6rem 0'}} />

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