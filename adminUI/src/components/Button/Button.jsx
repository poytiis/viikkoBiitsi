import React from 'react';
import './Button.scss';

const Button = (props) => {
  const disabled = props.disabled === true ? true : false;
  const buttonClass = disabled ? 'button button--disabled' : 'button';
  return (
    <button className={buttonClass + (props.type==='delete' ? ' button--delete' : '')} 
      style={props.style} 
      onClick={props.onClick}
      disabled={disabled}
    >
      {props.children}
    </button>
  );
}

export default Button;
