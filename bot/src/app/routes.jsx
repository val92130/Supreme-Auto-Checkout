import React from 'react';
import { Route, Redirect } from 'react-router';
import App from './containers/App';
import Configuration from './components/shops/supreme/Configuration';
import Atc from './components/shops/supreme/pages/Atc';
import Products from './components/shops/supreme/pages/Products';
import Drops from './components/shops/supreme/pages/Drops';
import Restocks from './components/shops/supreme/pages/Restocks';
import DropProducts from './components/shops/supreme/pages/DropProducts';
import Profile from './components/Profile';

export default () => {
  return (
    <Route component={App}>
      <Route path="supreme/" component={Configuration} />
      <Route path="supreme/configuration" component={Configuration} />
      <Route path="supreme/autocop" component={Atc} />
      <Route path="supreme/products" component={Products} />
      <Route path="supreme/restocks" component={Restocks} />
      <Route path="supreme/drops" component={Drops}>
        <Route path=":slug/" component={DropProducts} />
      </Route>
      <Route path="profiles/" component={Profile} />
      <Redirect from="/" to="supreme/" />
    </Route>
  );
};
