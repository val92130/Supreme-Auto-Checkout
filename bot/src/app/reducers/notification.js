import * as types from '../constants/ActionTypes';

export default function notification(state = {
  message: null,
}, action) {
  switch (action.type) {
    case types.NOTIFICATION_ADD:
      return { message: action.message };
    default:
      return state;
  }
}
