import * as types from '../constants/ActionTypes';

export default function atc(state = {
  atcProducts: [],
}, action) {
  if (action.type === types.ATC_PRODUCT_ADD) {
    if (!action.data.name || state.atcProducts.filter(x => x.name === action.data.name).length) {
      return state;
    }
    const atcList = state.atcProducts.map(x => Object.assign({}, x));
    atcList.push(action.data);
    return { atcProducts: atcList };
  } else if (action.type === types.ATC_PRODUCT_REMOVE) {
    if (!action.name) {
      return state;
    }
    return {
      atcProducts: state.atcProducts.map(x => Object.assign({}, x)).filter(x => x.name !== action.name),
    };
  } else if (action.type === types.ATC_PRODUCT_EDIT) {
    const atcProduct = state.atcProducts.filter(x => x.name === action.name)[0];
    if (!atcProduct) return state;

    const newList = state.atcProducts.map((x) => {
      if (x.name === action.name) {
        return Object.assign({}, x, action.data);
      }
      return Object.assign({}, x);
    });
    return {
      atcProducts: newList,
    };
  }
  return state;
}
