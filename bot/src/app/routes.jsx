import React from 'react';
import { Route, Redirect } from 'react-router';
import App from './containers/App';
import Supreme from './components/shops/Supreme';
import Profile from './components/Profile';

export default () => {
  return (
    <Route component={App}>
      <Route path="supreme/" component={Supreme} />
      <Route path="profiles/" component={Profile} />
      <Redirect from="/" to="supreme/" />
    </Route>
  );
};
