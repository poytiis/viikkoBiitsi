import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';

const theme = createTheme({
  palette: {
    primary: {
      main: blueGrey[600],
    },
    secondary: {
      main: blueGrey[700],
    },
  },
});


ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
        <App />
    </ThemeProvider>
  
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
