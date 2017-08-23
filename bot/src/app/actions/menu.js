import * as types from '../constants/ActionTypes';
import * as menus from '../constants/Menus';

export function changeMenu(newMenu) {
  const keys = Object.keys(menus).map(x => menus[x]);
  if (keys.indexOf(newMenu) !== -1) {
    return { type: types.CHANGE_MENU, menu: newMenu };
  }
  throw new Error(`Invalid menu : ${newMenu}`);
}
