const VERSION = '0.0.1';

function setOptionValue(shop, optName, value) {
  const store = getAllOptions(shop);
  const obj = {};
  store[optName] = value;
  obj[shop] = store;
  localStorage.setItem('state', JSON.stringify(Object.assign(getState(), {
    settings: {
      values: {
        obj,
      },
    },
  },)));
}

function getState() {
  const items = JSON.parse(localStorage.getItem('state')) || [];
  const state = items.filter(x => x.version === VERSION)[0];
  return state.value;
}

function getAllOptions(shop) {
  return getState().settings.values[shop] || {};
}

function getOption(shop, name) {
  const options = getAllOptions(shop);
  if (options !== undefined) {
    return options[name];
  }
}

function createStore(shop) {
  const obj = {};
  obj[shop] = {};
  localStorage.setItem('state', JSON.stringify(Object.assign(getState(), {
    settings: {
      values: {
        obj,
      },
    },
  },)));
}

function getOptions(shop, names) {
  return names.map(x => getOption(shop, x));
}
