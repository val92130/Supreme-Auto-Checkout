const request = require('request');
const express = require('express');
const cors = require('cors');
const app = express();

const options = {
  url: 'http://www.supremenewyork.com/mobile_stock.json',
  headers: {
    'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 9_3_3 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Mobile/13G34'
  }
};

var products = {};
var lastUpdate = new Date();

app.use(cors());

function getProducts(callback) {
  request(options, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      callback(undefined, JSON.parse(body).products_and_categories);
    } else {
      callback({ error });
    }
  });
}

function getProduct(id, callback) {
  let opt = { headers: options.headers, url: `http://www.supremenewyork.com/shop/${id}.json`};
  if (!id || isNaN(id)) {
    callback({ error: 'Invalid id' });
  }
  request(opt, (error, response, body) => {
    if (!error && response.statusCode == 200) {
      callback(undefined, JSON.parse(body));
    } else {
      callback({ error });
    }
  });
}

app.get('/products.json', function(req, res){
  var now = new Date();
  var diff = (now.getTime() - lastUpdate.getTime()) / 1000;

  if (diff >= 10) {
    lastUpdate = now;
    getProducts((err, prod) => {
      if (!err)
        products = prod;
      res.json(err ? err : products);
    });
  } else {
    res.json(products);
  }
});

app.get('/product/:id', function (req, res) {
  getProduct(req.param('id'), function(err, prod) {
    res.json(err ? err : prod);
  });
});
app.listen(3000);