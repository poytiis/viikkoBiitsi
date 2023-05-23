import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Settings from './components/Settings/Settings';
import PrivateRoute from './services/PrivateRoute';
import Logs from './components/Logs/Logs';
import LogIn from './components/LogIn/LogIn';
import Results from './components/Results/Results';
import OldResults from './components/OldResults/OldResults';

function App() {
  return (
    <Router>
      <Switch>

        <Route exact path='/' component={LogIn} />

        <PrivateRoute exact path='/viikon-tulokset' component={Results}/>        
        <PrivateRoute path='/logit' component={Logs}/>
        <PrivateRoute path='/asetukset' component={Settings}/>
        <PrivateRoute path='/vanhat-tulokset' component={OldResults}/>

      </Switch>
    </Router>
  );
}

export default App;
