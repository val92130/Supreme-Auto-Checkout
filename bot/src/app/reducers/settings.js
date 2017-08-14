import * as types from '../constants/ActionTypes';

export default function settings(state = {
  values: {},
}, action) {
  switch (action.type) {
    case types.UPDATE_SETTINGS:
      const data = Object.assign({}, state.values);
      data[action.shop] = Object.assign({}, state.values[action.shop], action.value);
      return Object.assign({}, state, { values: data });
    default:
      return state;
  }
}
