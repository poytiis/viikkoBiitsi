import React from 'react';
import './InfoDialog.scss';
import Dialog from '../Dialog/Dialog';
import Button from '../../Button/Button';

const DeleteDialog = (props) => {
  const deleteButtonStyles = {
    backgroundColor: '#607d8b'
  }
  return (
    <Dialog>
      <div className='info-dialog flex-column-center'>
        <h2 className='info-dialog__header'>{props.header}</h2>
        <div className='info-dialog__main-content'>
          {props.content()}
        </div>
        <div className='info-dialog__button-container flex-row'>
          <Button 
            onClick={props.close} 
            style={deleteButtonStyles}
            className='info-dialog__close-button'
          >
            Peruuta
          </Button>
          <Button 
            onClick={props.accept} 
            disabled={props.disableAcceptButton}
            className='info-dialog__accept-button'
          >
            {props.acceptButtonText}
          </Button>

        </div>
      </div>
    </Dialog>
    
  );
}

export default DeleteDialog;