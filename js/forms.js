const countries = ["UK", "UK (N. IRELAND)", "-", "AUSTRIA", "BELARUS", "BELGIUM", "BULGARIA", "CROATIA", "CZECH REPUBLIC", "DENMARK", "ESTONIA", "FINLAND", "FRANCE", "GERMANY", "GREECE", "HUNGARY", "ICELAND", "IRELAND", "ITALY", "LATVIA", "LITHUANIA", "LUXEMBOURG", "MONACO", "NETHERLANDS", "NORWAY", "POLAND", "PORTUGAL", "ROMANIA", "RUSSIA", "SLOVAKIA", "SLOVENIA", "SPAIN", "SWEDEN", "SWITZERLAND", "TURKEY"];
const cards = ["Visa", "American Express", "Mastercard", "Solo"];
const sizes = ["Small", "Medium", "Large", "XLarge"];
const sizesPants = ["28", "30", "32", "34", "36", "38", "40"];

const currentYear = new Date().getFullYear();

const preferencesForm = {
  "type": "object",
  "name": "preferences",
  "properties": {
    "autoCheckout": {
      "type": "boolean",
      "title": "Auto Checkout",
      "description": "If enabled, the product will be automatically added to your cart and will proceed to the checkout page",
      "default": false,
      "required": true,
    },
    "autoPay": {
      "type": "boolean",
      "title": "Auto Payment",
      "description": "Will automatically submit the checkout form when on the checkout page",
      "default": false,
      "required": true,
    },
    "strictSize": {
      "type": "boolean",
      "title": "Strict size choice",
      "description": "If enabled, the bot will NOT add a product to the cart if your desired size isn't available",
      "default": false,
      "required": true,
    },
    "captchaBypass": {
      "type": "boolean",
      "title": "Bypass Captcha (beta)",
      "description": "If enabled, the bot will try to bypass the captcha by removing it from the checkout page, not guaranteed to work",
      "default": false,
      "required": true,
    },
    "addToCartDelay": {
      "type": "integer",
      "title": "Add to cart delay (ms)",
      "description": "Delay before adding the product to the cart if autocheckout is enabled",
      "minimum": 1,
      "default": 300,
      "required": true,
    },
    "goToCheckoutDelay": {
      "type": "integer",
      "title": "Proceed to checkout delay (ms)",
      "description": "Delay before going to checkout once the product is added to the cart",
      "minimum": 1,
      "default": 200,
      "required": true,
    },
    "checkoutDelay": {
      "type": "integer",
      "title": "Checkout delay (ms)",
      "description": "Delay before submitting the payment once on the payment page",
      "minimum": 1,
      "default": 1500,
      "required": true,
    },
    "maxPrice": {
      "type": "integer",
      "title": "Maximum product price",
      "description": "Maximum product price, the product will not be added to the cart if it is higher than this price",
      "minimum": 0,
      "required": false,
    },
    "minPrice": {
      "type": "integer",
      "title": "Minimum product price",
      "description": "Minimum product price, the product will not be added to the cart if it is lower than this price",
      "minimum": 0,
      "required": false,
    },
  }
};

const billingForm = {
  "type": "object",
  "name": "billing",
  "properties": {
    "order_billing_name": {
      "type": "string",
      "title": "Firstname and Lastname",
      "required": true,
      "minLength": 1
    },
    "order_email": {
      "type": "string",
      "format": "email",
      "title": "Email",
      "required": true,
      "minLength": 1
    },
    "order_tel": {
      "type": "string",
      "format": "tel",
      "title": "Phone",
      "required": true,
      "minLength": 1
    },
    "bo": {
      "type": "string",
      "title": "Address",
      "required": true,
      "minLength": 1
    },
    "order_billing_city": {
      "type": "string",
      "title": "City",
      "required": true,
      "minLength": 1
    },
    "order_billing_country": {
      "type": "string",
      "title": "Country",
      "required": true,
      "enum": countries
    },
    "order_billing_zip": {
      "type": "string",
      "title": "Zip",
      "required": true,
      "minLength": 1
    },
    "credit_card_type": {
      "type": "string",
      "title": "Card Type",
      "required": true,
      "minLength": 1,
      "enum": cards
    },
    "cnb": {
      "type": "string",
      "title": "Credit Card Number",
      "required": true,
      "minLength": 1
    },
    "credit_card_month": {
      "type": "string",
      "title": "Expiry month",
      "required": true,
      "minLength": 1,
      "enum": Array.apply(null, new Array(12)).map((x, i) => ++i < 10 ? `0${i}` : i),
    },
    "credit_card_year": {
      "type": "string",
      "title": "Expiry year",
      "required": true,
      "minLength": 1,
      "enum": Array.apply(null, new Array(5)).map((x, i) => currentYear + i),
    },
    "vval": {
      "type": "string",
      "title": "CCV",
      "required": true,
      "minLength": 1,
      "maxLength": 4
    },
  }
};

const sizesForm = {
  "type": "object",
  "name": "sizings",
  "properties": {
    "accessories": {
      "type": "string",
      "title": "Accessories",
      "required": true,
      "minLength": 1,
      "enum": sizes
    },
    "t-shirts": {
      "type": "string",
      "title": "T-Shirts",
      "required": true,
      "minLength": 1,
      "enum": sizes
    },
    "pants": {
      "type": "string",
      "title": "Pants",
      "required": true,
      "minLength": 1,
      "enum": sizesPants
    },
    "shorts": {
      "type": "string",
      "title": "Shorts",
      "required": true,
      "minLength": 1,
      "enum": sizesPants
    },
    "sweatshirts": {
      "type": "string",
      "title": "Sweatshirts",
      "required": true,
      "minLength": 1,
      "enum": sizes
    },
    "tops": {
      "type": "string",
      "title": "Tops/Sweaters",
      "required": true,
      "minLength": 1,
      "enum": sizes
    },
    "shirts": {
      "type": "string",
      "title": "Shirts",
      "required": true,
      "minLength": 1,
      "enum": sizes
    },
    "jackets": {
      "type": "string",
      "title": "Jackets",
      "required": true,
      "minLength": 1,
      "enum": sizes
    },
  }
};

function getForms() {
  return [preferencesForm, billingForm, sizesForm];
}