import request from 'browser-request';

const options = {
  url: 'http://www.supremenewyork.com/shop/all',
};

function getProducts() {
  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        resolve(JSON.parse(body).products_and_categories);
      } else {
        reject(error);
      }
    });
  });

}

function getProduct(id) {
  return new Promise((resolve, reject) => {
    const opt = { headers: options.headers, url: `http://www.supremenewyork.com/shop/${id}.json`};
    if (!id || isNaN(id)) {
      reject('Invalid id');
    }
    request(opt, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        resolve(JSON.parse(body));
      } else {
        reject(error);
      }
    });
  });
}

async function start() {
  const products = await getProducts();
  console.log(products);
}

start();
