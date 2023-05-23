import React from 'react';
import './Dialog.scss';

const Dialog = (props) => {
  return (
    <div className='dialog'>
      <div className='dialog__content'>
        {props.children}
      </div>
    </div>
  );
}

export default Dialog;