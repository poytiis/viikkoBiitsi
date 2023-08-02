import React from 'react';
import './LogIn.scss';
import useInput from '../../hooks/useInput';
import Button from '../Button/Button';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { logInFetch } from '../../services/httpClient';
import { useState } from 'react';

const LogIn = () => {

  const usernameControl = useInput({initValue: '', validattion: 'required'});
  const passwordControl = useInput({initValue: '', validattion: 'required'});
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogInClick = async () => {
    if (usernameControl.error || passwordControl.error) {
      return;
    }
    try {
      const response = await logInFetch(usernameControl.value, passwordControl.value);
      if(!response.ok) setErrorMessage('Kirjautuminen epäonnistui');
      else {
        localStorage.setItem("loggedIn", "true");
        history.push('/viikon-tulokset');
      }
      
    } catch(ex) {
      setErrorMessage('Kirjautuminen epäonnistui');
    }
  }

  const handleEnterKeyUpLogIn = (e) => {
    if (e.key == 'Enter' ) handleLogInClick();
  }

  return (
    <div className='log-in'>
      <div className='log-in__content flex-column-center'>
        <span className='log-in__header'>Kirjaudu sisään</span>

        <TextField
          className='log-in__input'
          label='Käyttäjänimi'
          {...usernameControl}
          color="secondary"
          id='log-in__username'
        />

        <TextField 
          className='log-in__input'
          label='Salasana'
          type="password"
          {...passwordControl}
          color="secondary"
          id='log-in__password'
          onKeyUp={handleEnterKeyUpLogIn}
        />

        <Button  onClick={handleLogInClick} className='log-in__button'>
          Kirjaudu
        </Button>
        <div className='log-in__error-message'>{errorMessage}</div>
      </div>

    </div>
  );
}

export default LogIn;
