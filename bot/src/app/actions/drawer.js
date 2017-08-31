import * as types from '../constants/ActionTypes';

export function setDrawerOpen(open) {
  return {
    type: types.DRAWER_SET_OPEN,
    open
  };
}
