import * as types from '../constants/ActionTypes';

export function updateSettings(shop, key, value) {
  const obj = {};
  obj[key] = value;
  return {
    type: types.UPDATE_SETTINGS,
    value: obj,
    shop,
  };
}
