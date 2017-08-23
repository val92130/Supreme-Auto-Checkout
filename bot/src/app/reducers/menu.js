import * as types from '../constants/ActionTypes';

export default function menu(state = {
  currentMenu: null,
}, action) {
  switch (action.type) {
    case types.CHANGE_MENU:
      return Object.assign({}, state, {
        currentMenu: action.menu,
      });
    default:
      return state;
  }
}
