import {useState} from 'react';

const useSelect = (props) => {
  const [value, setValue] = useState(props.initValue);

  const handleOnClick = (event) => {
    setValue(event.target.value);
  };

  return {
    value,
    handleOnClick,
    options: props.options,
    error: false
  };
}

export default useSelect;
