import * as types from '../constants/ActionTypes';

export default function settings(state = {
  values: {},
}, action) {
  switch (action.type) {
    case types.UPDATE_SETTINGS:
      return Object.assign({}, state, {
        values: Object.assign({}, state.values, action.value),
      });
    default:
      return state;
  }
}
