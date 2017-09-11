import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory, hashHistory } from 'react-router';
import { combineReducers, createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import createLogger from 'redux-logger';
import { syncHistoryWithStore, routerReducer, routerMiddleware } from 'react-router-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { reducer as formReducer } from 'redux-form';
import thunk from 'redux-thunk';
import * as reducers from './reducers';
import getRoutes from './routes';
import { loadSavedState, saveState, saveToChromeStorage } from './utils/StorageManager';


const VERSION = '2.2.5';

injectTapEventPlugin();

const middleware = [thunk, routerMiddleware(browserHistory)];
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger());
}

const savedState = loadSavedState(VERSION);
const appReducer = combineReducers(Object.assign({}, reducers, {
  routing: routerReducer,
  form: formReducer,
}));

const rootReducer = (state, action) => {
  if (action.type === 'PROFILE_CHANGE') {
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};
const store = createStore(rootReducer, savedState, applyMiddleware(...middleware));

// Save state in localStorage automatically
store.subscribe(() => {
  const state = store.getState();
  if (state) {
    saveState({ menu: state.menu, profiles: state.profiles, atc: state.atc }, VERSION);
    const currentProfile = state.profiles.currentProfile;
    const settings = state.profiles.profiles.filter(x => x.name === currentProfile)[0].settings;
    if (typeof (chrome) !== 'undefined' && typeof (chrome.storage) !== 'undefined') {
      saveToChromeStorage('settings', settings || {});
      saveToChromeStorage('atc', state.atc || {});
    }
  }
});

const history = syncHistoryWithStore(hashHistory, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      {getRoutes(store)}
    </Router>
  </Provider>,
  document.getElementById('app'),
);
