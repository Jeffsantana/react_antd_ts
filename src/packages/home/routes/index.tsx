import React from 'react';
import { Switch, Route } from 'react-router-dom';
import defaultRoutes from '../../../config/routes/defaultRoutes';
import Error404 from '../../../pages/Error404';
import Home from '../pages/Home';
import PlannigRoute from './PlannigRoute';

const baseURL = defaultRoutes.home;

const Routes: React.FC = () => {
  return (
    <Switch>
      <PlannigRoute path={`${baseURL}`} exact component={Home} />
      <Route path={`${baseURL}/*`} component={Error404} />
    </Switch>
  );
};

export default Routes;
