import React from 'react';
import {Route} from 'react-router-dom';

const PrivateRoute = ({component: Component, path}) => {
  return (
    <Route path={path} component={Component}/>
  );
}

export default PrivateRoute;