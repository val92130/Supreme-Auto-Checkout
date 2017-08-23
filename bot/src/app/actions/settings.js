import * as types from '../constants/ActionTypes';
import addNotification from '../actions/notification';

export function updateSettings(shop, key, value) {
  return function(dispatch) {
    dispatch(addNotification('Settings saved'));
    const obj = {};
    obj[key] = value;
    dispatch({
      type: types.UPDATE_SETTINGS,
      value: obj,
      shop,
    });
  };
}
