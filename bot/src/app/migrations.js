function migrateAtc(state) {
  let newState = Object.assign({}, state);
  if (newState.atc && newState.atc.atcProducts && newState.atc.atcProducts.length) {
    let id = 0;
    for (let i = 0; i < newState.atc.atcProducts.length; i += 1) {
      let product = newState.atc.atcProducts[i];
      if (product.id === undefined || !product.product) {
        newState.atc.atcProducts[i] = {
          id: id += 1,
          product
        };
      }
    }
  }
  return newState;
}

function migrate(state) {
  let newState = state;
  newState = migrateAtc(state);
  return newState;
}

export default migrate;
