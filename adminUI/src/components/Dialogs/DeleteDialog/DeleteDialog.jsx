import React from 'react';
import './DeleteDialog.scss';
import Dialog from '../Dialog/Dialog';
import Button from '../../Button/Button';

const DeleteDialog = (props) => {
  const deleteButtonStyles = {
    backgroundColor: '#607d8b'
  }
  return (
    <Dialog>
      <div className='delete-dialog flex-column-center'>
        <h2 className='delete-dialog__header'>Oletko varma että haluat poistaa seuraavan {props.things}?</h2>
        <div className='delete-dialog__main-content'>
          {props.content()}
        </div>
        <div className='delete-dialog__button-container flex-row'>
          <Button onClick={props.close} style={deleteButtonStyles}>Peruuta</Button>
          <Button onClick={props.delete}>Poista</Button>

        </div>
      </div>
    </Dialog>
    
  );
}

export default DeleteDialog;
