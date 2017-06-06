async function run() {
  const storeName = "Supreme";
  const supremeOptions = await getAllOptions("Supreme");
  if (supremeOptions === undefined) {
    await createStore("Supreme");
  }

  let url = supremeOptions.monitor.url;
  let enabled = supremeOptions.monitor.enabled;

  if (!enabled) {
    return;
  }

  let products = await getProducts(url);
  if (!Object.keys(products).length || products.error) {
    return;
  }

  let prevProducts = Object.keys(supremeOptions.products).length ? supremeOptions.products : products;

  let prevProductsConcat = [].concat.apply([], Object.keys(prevProducts).map(x => prevProducts[x]));
  let currProductsConcat = [].concat.apply([], Object.keys(products).map(x => products[x]));
  let newProducts = currProductsConcat.filter(x => prevProductsConcat.map(y => y.id).indexOf(x.id) === -1);

  for (let newProd of newProducts) {
    createNotification(`New product added: ${newProd.name}`, `${newProd.name} was just added! Price: ${newProd.price}`);
  }
  setOptionValue(storeName, "products", products);
}

async function getProducts(baseUrl) {
  return new Promise(resolve =>  $.getJSON(`${baseUrl}/products.json`, resolve))
}

async function createNotification(title, message) {
return new Promise((resolve) => {
  chrome.notifications.create(
    title.replace(' ', '_'),{
      type: 'basic',
      iconUrl: 'icon.png',
      title,
      message
    }, resolve);
});

}

setInterval(() => {
  run();
}, 5000);

run();