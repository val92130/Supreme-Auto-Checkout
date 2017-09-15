import * as types from '../constants/ActionTypes';
import addNotification from '../actions/notification';

export function addAtcProduct(data) {
  return function (dispatch) {
    dispatch(addNotification(`Atc product ${data.name} added`));
    dispatch({
      type: types.ATC_PRODUCT_ADD,
      name,
      data,
    });
  };
}

export function editAtcProduct(name, data) {
  return function (dispatch) {
    dispatch(addNotification(`Atc product ${name} edited`));
    dispatch({
      type: types.ATC_PRODUCT_EDIT,
      name,
      data,
    });
  };
}

export function removeAtcProduct(name) {
  return function (dispatch) {
    dispatch(addNotification(`Atc product ${name} removed`));
    dispatch({
      type: types.ATC_PRODUCT_REMOVE,
      name,
    });
  };
}

export function setAtcProductEnabled(name, enabled = true) {
  return {
    type: types.ATC_PRODUCT_EDIT,
    name,
    data: { enabled },
  };
}
