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

  if (supremeOptions.products === undefined) {
    await setOptionValue(storeName, "products", products);
  }

  let prevProductsObj = Object.keys(supremeOptions.products).length ? supremeOptions.products : products;

  let prevProducts = [].concat.apply([], Object.keys(prevProductsObj).map(x => prevProductsObj[x]));
  let currProducts = [].concat.apply([], Object.keys(products).map(x => products[x]));
  let newProducts = currProducts.filter(x => prevProducts.map(y => y.id).indexOf(x.id) === -1);

  await setOptionValue(storeName, "products", products);

  for (let newProd of removeDuplicatesBy(x => x.name, newProducts)) {
    createNotification(`New product added: ${newProd.name}`, `${newProd.name} was just added! Price: ${newProd.price}`);
  }

  let atcProducts = supremeOptions.atc;
  if (atcProducts === undefined) {
    return;
  }
  
  for (let product of atcProducts) {
    let m = currProducts.filter(x => match(product.keyword, x.name) && x.category_name.toLowerCase() === product.category.toLowerCase())[0];
    if (m !== undefined) {
      let productInfo = await getProduct(url, m.id);

      if (productInfo.styles.length) {
        let matchedStyle = null;

        if (productInfo.styles.length > 1 && product.color) {
          matchedStyle = productInfo.styles.filter(x => match(product.color, x.name))[0];
        } else {
          matchedStyle = productInfo.styles[0];
        }

        if (matchedStyle && matchedStyle.sizes.some(x => x.stock_level > 0)) {
          atcProducts.splice(atcProducts.indexOf(product), 1);
          chrome.tabs.create({ url: `http://supremenewyork.com/shop/${m.id}?atc-category=${product.category}` });
        }
      }
    }
  }

  await setOptionValue(storeName, "atc", atcProducts);
}

async function getProducts(baseUrl) {
  return new Promise(resolve =>  $.getJSON(`${baseUrl}/products.json`, resolve))
}

async function getProduct(baseUrl, productId) {
  return new Promise(resolve =>  $.getJSON(`${baseUrl}/product/${productId}`, resolve))
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
  try {
    run();
  } catch (e) {
    console.error(e);
  }
}, 5000);

run();