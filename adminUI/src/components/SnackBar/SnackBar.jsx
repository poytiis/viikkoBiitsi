import {useEffect} from 'react';
import './SnackBar.scss';

const SnackBar = (props) => {
  useEffect(() => {
    setTimeout(() => {
      props.close();
    }, 10000);
  }, [props]);

  return (
    <div className='snackbar'>
      <span className='snackbar__message'>{props.children}</span>
    </div>
  );
};

export default SnackBar;
