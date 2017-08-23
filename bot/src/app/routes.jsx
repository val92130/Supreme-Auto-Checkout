import React from 'react';
import { Route, Redirect } from 'react-router';
import App from './containers/App';
import Supreme from './components/shops/Supreme';

export default () => {
  return (
    <Route component={App}>
      <Route path="supreme/" component={Supreme} />
      <Redirect from="/" to="supreme/" />
    </Route>
  );
};
