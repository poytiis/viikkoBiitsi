import './Button.scss';

const Button = (props) => {
  const buttonbaseClass = props.disabled ? 'button button--disabled ' : 'button ';
  const buttonClass = props.className ? buttonbaseClass + props.className  : buttonbaseClass;
  return (
    <button className={buttonClass + (props.type==='delete' ? ' button--delete' : '')} 
      style={props.style} 
      onClick={props.onClick}
      disabled={!!props.disabled}
    >
      {props.children}
    </button>
  );
}

export default Button;
