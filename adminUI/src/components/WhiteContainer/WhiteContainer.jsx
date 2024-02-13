import './WhiteContainer.scss';

const WhiteContainer = (props) => {
  return (
    <div className='white-container flex-column-center'>
      <div className='white-container__content flex-column-center'>
        <h2 className='white-container__header'>{props.header}</h2>
        <div className='white-container__content__container'>
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default WhiteContainer;
