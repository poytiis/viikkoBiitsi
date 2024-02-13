import './Dialog.scss';

const Dialog = (props) => {
  const dialogClassName = props.type 
    ? 'dialog + dialog--' + props.type 
    : 'dialog';
  return (
    <div className={dialogClassName}>
      <div className='dialog__content'>
        {props.children}
      </div>
    </div>
  );
};

export default Dialog;
