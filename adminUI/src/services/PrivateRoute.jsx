import React from 'react';
import {Route, Redirect} from 'react-router-dom';

const PrivateRoute = ({component: Component, path}) => {
  const loggedIn = localStorage.getItem("loggedIn");
  if (loggedIn === 'true') {
    return <Route path={path} component={Component}/>;
  } else {
    return <Redirect to="/" />;
  } 
}

export default PrivateRoute;