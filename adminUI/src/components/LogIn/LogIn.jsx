import React from 'react';
import './LogIn.scss';
import useInput from '../../hooks/useInput';
import Button from '../Button/Button';
import { useHistory } from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { logInFetch } from '../../services/httpClient';
import { useState } from 'react';

const LogIn = () => {

  const usernameControl = useInput('');
  const passwordControl = useInput('');
  const history = useHistory();
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogInClick = async () => {
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

  const buttonStyles = {
    marginBottom: '1.5rem',
    marginTop: '1.5rem',
    width:'300px'
  }

  const inputStyle = {
    marginBottom: '0.9rem',
    width: '300px'
  }
  return (
    <div className='log-in'>
      <div className='log-in__content flex-column-center'>
        <span className='log-in__header'>Kirjaudu sisään</span>

        <TextField style={inputStyle} label='Käyttäjänimi' {...usernameControl}  color="secondary" id='log-in__username'/>
        <TextField style={inputStyle} label='Salasana' type="password" {...passwordControl}  color="secondary" id='log-in__password'/>

        <Button style={buttonStyles} onClick={handleLogInClick} className='log-in__button'>Kirjaudu</Button>
        <div className='log-in__error-message'>{errorMessage}</div>
      </div>

    </div>
  );
}

export default LogIn;
