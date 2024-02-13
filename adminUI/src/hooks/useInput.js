import {useState} from 'react';

const useInput = (props) => {
  const [value, setValue] = useState(props.initValue);
  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState('');

  const validate = (value) => {
    const setErrorMessage = (isError, errorMessage) => {
      setError(isError);
      setHelperText(errorMessage);
    };

    const validattion = props?.validattion ?? 'maxLenght';
    const maxLenght = props?.maxLenght ?? 200;

    switch (validattion) {
      case 'required': {
        if (value.length === 0 ) {
          setErrorMessage(true, 'Kenttä on pakollinen');
        } else if (value.length > maxLenght) {
          setErrorMessage(true, 'Maksimi merkkimäärä ylitetty');
        } else {
          setErrorMessage(false, '');
        }
        break;
      }

      case 'maxLenght': {
        if (value.length > maxLenght) {
          setErrorMessage(true, 'Maksimi merkkimäärä ylitetty');
        } else {
          setErrorMessage(false, '');
        }
        break;
      }

      case 'integerRequired':
      case 'integer': {
        if (validattion === 'integer' && value.length === 0) {
          setErrorMessage(false, '');
          return;
        }
        const integerRegex = /^-?\d+$/;
        const valid = integerRegex.test(value);
        if (!valid) {
          setErrorMessage(true, 'Kentän täytyy olla kokonaisluku');
        } else {
          setErrorMessage(false, '');
        }
        break;
      }

      case 'floatRequired':
      case 'float': {
        if (validattion === 'float' && value.length === 0) {
          setErrorMessage(false, '');
          return;
        }
        const floatRegex = /^[+-]?\d+(\.\d+)?$/;
        const floatValid = floatRegex.test(value);
        if (!floatValid) {
          setErrorMessage(true, 'Kentän täytyy olla numero');
        } else {
          setErrorMessage(false, '');
        }
        break;
      }
      default: {
        console.log('Invalid useInput validattion param: '+ validattion);
      }

    }
  }

  return {
    value, 
    onChange: (e) => {setValue(e.target.value)},
    error,
    helperText,
    onBlur: (e) => {validate(e.target.value)}
  };
};

export default useInput;
