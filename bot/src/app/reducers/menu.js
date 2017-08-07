import * as types from '../constants/ActionTypes';
import * as menus from '../constants/Menus';

export default function menu(state = {
  currentMenu: menus.MENU_OPTIONS,
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
