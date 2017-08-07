import React from 'react';
import { Route, Redirect } from 'react-router';
import App from './containers/App';
import Home from './components/Home';

export default () => {
  return (
    <Route component={App}>
      <Route path="home/" component={Home} />
      <Redirect from="/" to="home/" />
    </Route>
  );
};
