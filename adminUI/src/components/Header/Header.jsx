import React, { useState, useEffect } from 'react';
import './Header.scss';
import userIcon from '../../imgs/user.png';
import { useHistory } from 'react-router-dom';
import { logOutFetch } from '../../services/httpClient';

const Header = () => {

  const history = useHistory();

  const [currentTab, setCurrentTab] = useState(null);

  useEffect(() => {
    if(currentTab !== null){
      return;
    }
    setCurrentTab(window.location.pathname);
    console.log(window.location.pathname)

  }, [currentTab]);

  const handleLogOutClick = async () => {
    try {
      await logOutFetch();
      localStorage.removeItem("loggedIn");
      history.push('/')
    } catch (ex) {

    }

  }


  return (
    <div className='header flex-row-center'>
      <div className='header__main-content-container flex-row'>
        <div className='header__tab-container flex-row-center'> 

          <div className={'header__tab header__tab--scores flex-row-center ' + (currentTab === '/viikon-tulokset' ? ' header__tab--active': '' )}
            onClick={() => {history.push('/viikon-tulokset')}}
          >
            <span>Viikon tulokset</span>
          </div>

          <div className={'header__tab  header__tab--old-scores flex-row-center ' + (currentTab === '/vanhat-tulokset' ? ' header__tab--active': '' )}
            onClick={() => {history.push('/vanhat-tulokset')}}
          >
            <span>Vanhat tulokset</span>
          </div>

          <div className={'header__tab  header__tab--logs flex-row-center ' + (currentTab === '/logit' ? ' header__tab--active': '' )}
            onClick={() => {history.push('/logit')}}
          >
            <span>Logit</span>
          </div>

          <div className={'header__tab header__tab--settings flex-row-center ' + (currentTab === '/asetukset' ? ' header__tab--active': '' )}
            onClick={() => {history.push('/asetukset')}}
          >

            <span>Asetukset</span>
          </div>        
          
        </div>
      </div>
      
      <div className='header__icon-container'>
        <img className='header__icon' src={userIcon} alt="user"/>
        <div className='header__dropdown'>
          <span className='header__dropdown-text' onClick={handleLogOutClick}>Kirjaudu ulos</span>
        </div>
      </div>
     
    </div>
  );
}

export default Header;
