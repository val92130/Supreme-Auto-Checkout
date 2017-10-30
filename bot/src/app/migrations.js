function migrateAtc(state) {
  const newState = Object.assign({}, state);
  if (newState.atc && newState.atc.atcProducts && newState.atc.atcProducts.length) {
    let id = 0;
    for (let i = 0; i < newState.atc.atcProducts.length; i += 1) {
      const product = newState.atc.atcProducts[i];
      if (product.id === undefined || !product.product) {
        newState.atc.atcProducts[i] = {
          id: id += 1,
          product,
        };
      }
      if (newState.atc.atcProducts[i].product.retryCount === undefined) {
        newState.atc.atcProducts[i].product.retryCount = 3;
      }

      if (newState.atc.atcProducts[i].product.soldOutAction === undefined) {
        newState.atc.atcProducts[i].product.soldOutAction = 'skip';
      }
    }
  }
  return newState;
}

function migrate(state) {
  return migrateAtc(state);
}

export default migrate;
