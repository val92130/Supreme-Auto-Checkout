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

  let prevProducts = Object.keys(supremeOptions.products).length ? supremeOptions.products : products;

  let prevProductsConcat = [].concat.apply([], Object.keys(prevProducts).map(x => prevProducts[x]));
  let currProductsConcat = [].concat.apply([], Object.keys(products).map(x => products[x]));
  let newProducts = currProductsConcat.filter(x => prevProductsConcat.map(y => y.id).indexOf(x.id) === -1);

  for (let newProd of newProducts) {
    await createNotification(`New product added: ${newProd.name}`, `${newProd.name} was just added! Price: ${newProd.price}`);
  }

  let atcProducts = supremeOptions.atc;
  if (atcProducts === undefined) {
    return;
  }
  
  for (let product of atcProducts) {
    let m = currProductsConcat.filter(x => match(product.keyword, x.name) && x.category_name.toLowerCase() === product.category.toLowerCase())[0];
    if (m !== undefined) {
      let productInfo = await getProduct(url, m.id);

      if (productInfo.styles.length) {
        let matchedStyle = null;

        if (productInfo.styles.length > 1 && product.color) {
          matchedStyle = productInfo.styles.filter(x => match(product.color, x.name))[0];
        } else {
          matchedStyle = productInfo.styles[0];
        }

        if (matchedStyle) {
          atcProducts.splice(atcProducts.indexOf(product), 1);
          chrome.tabs.create({ url: `http://supremenewyork.com/shop/${m.id}` });
        }
      }
    }
  }

  await setOptionValue(storeName, "products", products);
  await setOptionValue(storeName, "atc", atcProducts);
}

function match(keyword, name) {
  keyword = keyword.replace(/\s/g, "");
  name = name.replace(/\s/g, "");

  var re = new RegExp(keyword);
  return keyword.toLowerCase() === name.toLowerCase() || re.test(name);
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