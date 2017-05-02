// Creation of the notification bar
const notificationBar = document.createElement("div");
document.body.prepend(notificationBar);
notificationBar.style.width = '100%';
notificationBar.style.textAlign = 'center';
notificationBar.style.backgroundColor = '#cbffcd';
notificationBar.style.lineHeight = '50px';
notificationBar.style.height = '50px';
notificationBar.style.fontSize = 'xx-large';

// Checks for page change by repetidly checking the current page location and tracking change
(() => {
    var currentPage = window.location.href;
    setInterval(function() {
        if (currentPage != window.location.href) {
            currentPage = window.location.href;
            onPageChange(currentPage);
        }
    }, 50);
    onPageChange(currentPage);
})();

/**
 * Sets top notification bar text
 * @param  {} text The new text for the notification bar
 */
function setNotificationBarText(text) {
    notificationBar.innerText = text;
}

/**
 * Helper timeout function to add a timer in the notification bar
 * @param  {Function} fn Function to be called after the delay
 * @param  {Number} ms Delay before calling the function
 * @param  {String} actionName Optional, an action name that will be displayed in the notification bar
 */
function timeout(fn, ms, actionName) {
    const now = new Date();
    let interval = setInterval(() => {
        const d = new Date();
        const diff = (d.getTime() - now.getTime());
        setNotificationBarText((actionName || 'Action') + ' in : ' + ((ms - diff) / 1000));
    }, 100);
    setTimeout(() => {
        clearInterval(interval);
        setNotificationBarText('Done');
        fn();
    }, ms);
}

/**
 * Attach an event on all links of the page to reload the page instead of loading in ajax
 */
function processLinks() {
    let hrefs = $('body a');
    for (let href of hrefs) {
        $(href).on('click', function() {
            window.location.href = this.href;
        });
    }
}


/**
 * This function is called whenever a new page change occurs
 * @param  {String} location new location of the page
 */
function onPageChange(location) {
    processLinks();
    getStores(['preferences', 'sizings', 'billing']).then((stores) => {
        // if stores are not configured yet..
        if (stores.some(x => x === undefined)) {
            setNotificationBarText('Bot not yet configured');
            return;
        }
        setNotificationBarText('Waiting... Autocheckout ' + (stores[0].autocheckout ? 'enabled' : 'disabled'));
        if (!stores[0].autocheckout) return;

        if (isProductPage()) {
            processProduct(stores[0]);
        } else if (isCart()) {
            processCart(stores[0]);
        } else if (isCheckout()) {
            processCheckout(stores[0], stores[2]);
        }
    });
}

/**
 * This function should be called when the user is on the 'cart' page, it will then redirect the user
 * to the checkout page after the delay configured in the options
 * @param  {Object} preferencesStore Object that stores the preference options
 */
function processCart(preferencesStore) {
    const delay = preferencesStore['delay_go_checkout'] || 100;
    timeout(() => {
        document.location.href = '/checkout';
    }, delay, 'Going to checkout');
}

/**
 * This function should be called when the user is on the 'checkout' page, it will fill
 * the checkout form with the values defined by the user in the options and then checkout after a delay
 * @param  {Object} preferencesStore Object that stores the preference options
 * @param  {Object} billingStore Object that stores the billings options
 */
function processCheckout(preferencesStore, billingStore) {
    const checkoutDelay = preferencesStore['delay_checkout'] || 1500;
    for (let key of Object.keys(billingStore)) {
        const value = billingStore[key];
        $('#' + key).val(value);
        $("input[name='order[terms]']").val(1);
    }
    timeout(() => {
        $('#checkout_form').submit();
    }, checkoutDelay, 'Checking out');
}

/**
 * This function should be called when the user is on a product page, it will
 * try to figure out if the product is sold out or not, and if not, it will find the best available size
 * based on the user's preferences and then it will add the item to cart
 * @param  {Object} preferencesStore Object that stores the preference options
 */
function processProduct(preferencesStore) {
    getStore('sizings')
        .then((store) => {
            if (!isSoldOut()) {
                let submitBtn = $('input[name=commit]');
                let productCategory = getProductCategory();
                let sizesOptions = getSizesOptions();
                let categorySize = store[productCategory];
                let targetOption = sizesOptions.filter(x => x.text === categorySize)[0];
                if (!targetOption) {
                    targetOption = sizesOptions[0];
                }
                let atcDelay = preferencesStore['delay_atc'] || 500;
                if (targetOption !== undefined) {
                    targetOption.selected = true;
                }
                submitBtn.click();
                timeout(() => {
                    window.location.href = '/shop/cart/';
                }, atcDelay, 'Adding to cart');
            }
        });
}

/**
 * Check if the user is currently on a product page
 */
function isProductPage() {
    let path = location.pathname.substring(1).split('/');
    return path.length === 4 && path[0] === 'shop';
}

/**
 * Check if the user is currently on the 'cart' page
 */
function isCart() {
    let path = location.pathname.substring(1).split('/');
    return path[1] === 'cart';
}

/**
 * Check if the user is currently at the checkout page
 */
function isCheckout() {
    let path = location.pathname.substring(1).split('/');
    return path[0] === 'checkout';
}

/**
 * Returns the product category when the user is on a product page
 */
function getProductCategory() {
    return location.pathname.substring(1).split('/')[1];
}

/**
 * Check if the current product is sold out
 * @return {Boolean}
 */
function isSoldOut() {
    return $('input[name=commit]').length === 0;
}

/**
 * Return the available sizes for the current product
 * @return {Array}
 */
function getSizesOptions() {
    const sizes = document.getElementById('size');
    if (!sizes || !sizes.options)
        return [];
    return [...sizes.options];
}