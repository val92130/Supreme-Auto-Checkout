import * as types from '../constants/ActionTypes';

export default function addNotification(message) {
  return {
    type: types.NOTIFICATION_ADD,
    message,
  };
}
