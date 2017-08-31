import * as types from '../constants/ActionTypes';

export default function drawer(state = {
  open: true,
}, action) {
  switch (action.type) {
    case types.DRAWER_SET_OPEN:
      return { open: action.open };
    default:
      return state;
  }
}
