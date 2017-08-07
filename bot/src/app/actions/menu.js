import * as types from '../constants/ActionTypes';
import * as menus from '../constants/Menus';

export function changeMenu(newMenu) {
  if (newMenu in menus) {
    return { type: types.CHANGE_MENU, menu: newMenu };
  }
  throw new Error(`Invalid menu : ${newMenu}`);
}
