// Checks for page change by repetidly checking the current page location and tracking change
(() => {
    var currentPage = window.location.href;
    setInterval(function() {
        updateNotificationBar();
        if (currentPage != window.location.href) {
            currentPage = window.location.href;
            setTimeout(() => onPageChange(), 100);
        }
    }, 50);
    updateNotificationBar();
    onPageChange();
})();

function updateNotificationBar() {
    if (document.getElementById('sup-notif-bar')) return;
    let notificationBar = document.createElement("div");
    notificationBar.style.width = '100%';
    notificationBar.style.textAlign = 'center';
    notificationBar.style.backgroundColor = '#cbffcd';
    notificationBar.style.lineHeight = '50px';
    notificationBar.style.height = '50px';
    notificationBar.style.fontSize = 'medium';
    notificationBar.id = "sup-notif-bar";
    document.body.prepend(notificationBar);
}

/**
 * Sets top notification bar text
 * @param  {} text The new text for the notification bar
 */
function setNotificationBarText(text) {
    let bar = document.getElementById('sup-notif-bar');
    if (bar) {
        bar.textContent = text;
    }
}

/**
 * Helper timeout function to add a timer in the notification bar
 * @param  {Function} fn Function to be called after the delay
 * @param  {Number} ms Delay before calling the function
 * @param  {String} actionName Optional, an action name that will be displayed in the notification bar
 */
function timeout(fn, ms, actionName) {
    const now = new Date();
    let shouldAbort = false;
    let currentLocation = document.location.href;

    let interval = setInterval(() => {
        if (currentLocation !== document.location.href) {
            shouldAbort = true;
            clearInterval(interval);
            return;
        }
        const d = new Date();
        const diff = (d.getTime() - now.getTime());
        setNotificationBarText((actionName || 'Action') + ' in : ' + ((ms - diff) / 1000));
    }, 100);

    setTimeout(() => {
        clearInterval(interval);
        if (shouldAbort || currentLocation !== document.location.href) {
            return;
        }
        setNotificationBarText('Done');
        fn();
    }, ms);
}

/**
 * Attach an event on product links of the page to reload the page instead of loading in ajax
 */
function processLinks() {
    let innerArticles = document.getElementsByClassName('inner-article');
    if (!innerArticles) return;

    const links = document.querySelectorAll('.inner-article a');
    for (let link of links) {

        link.addEventListener('click', function(e) {
            window.location.href = this.href;
            if (!e)
                e = window.event;

            if (e.stopPropagation) {
                e.stopPropagation();
            }
            else {
                e.cancelBubble = true;
            }
        });
    }
}


/**
 * This function is called whenever a new page change occurs
 * @param  {String} location new location of the page
 */
function onPageChange() {
    processLinks();
    getStores(['preferences', 'sizings', 'billing']).then((stores) => {
        // if stores are not configured yet..
        if (stores.some(x => x === undefined)) {
            setNotificationBarText('Bot not yet configured');
            return;
        }
        const autocheckout = stores[0].autocheckout;
        const autopay = stores[0].autopay;
        setNotificationBarText('Autocheckout ' + (autocheckout ? 'enabled' : 'disabled') + ', Autopay ' + (autopay ? 'enabled' : 'disabled'));
        if (!stores[0].autocheckout) return;

        if (isProductPage()) {
            processProduct(stores[0], stores[1]);
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
    const delay = preferencesStore['delay_go_checkout'];
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
    const checkoutDelay = preferencesStore['delay_checkout'];
    document.getElementsByName('order[terms]')[0].click();

    for (let key of Object.keys(billingStore)) {
        document.getElementById(key).value = billingStore[key];
    }

    if (preferencesStore.bypasscaptcha) {
        let captcha = document.querySelector('.g-recaptcha');
        if (captcha) {
            captcha.remove();
        }
    }
    if (preferencesStore.autopay) {
        timeout(() => {
            document.getElementsByName('commit')[0].click();
        }, checkoutDelay, 'Checking out');
    }
}

/**
 * This function should be called when the user is on a product page, it will
 * try to figure out if the product is sold out or not, and if not, it will find the best available size
 * based on the user's preferences and then it will add the item to cart
 * @param  {Object} preferencesStore Object that stores the preference options
 * @param  {Object} sizingStore Object that stores the sizings options
 */
function processProduct(preferencesStore, sizingStore) {
    if (!isSoldOut()) {
        let maxPrice = preferencesStore.max_price;
        let minPrice = preferencesStore.min_price;
        let itemPrice = document.querySelector('[itemprop=price]');

        if (itemPrice !== null) {
            let price = itemPrice.innerHTML.replace(/\D/g,'');
            if (!isNaN(price)) {
                if (maxPrice !== undefined && price > maxPrice) {
                    setNotificationBarText('Product price is too high, not checking out');
                    return;
                }

                if (minPrice !== undefined && price < minPrice) {
                    setNotificationBarText('Product price is too low, not checking out');
                    return;
                }
            }
        }

        let submitBtn = document.querySelector('[name=commit]');
        let productCategory = getProductCategory();
        let sizesOptions = getSizesOptions();
        let categorySize = sizingStore[productCategory];

        let targetOption = sizesOptions.find(x => sizeMatch(categorySize, x.text));

        if (!targetOption) {
            if (preferencesStore.nopickanysize) {
                setNotificationBarText('The desired size is not available');
                return;
            }
            targetOption = sizesOptions[0];
        }

        let atcDelay = preferencesStore['delay_atc'];
        targetOption.selected = true;

        timeout(() => {
            submitBtn.click();
            timeout(() => {
                window.location.href = '/shop/cart/';
            }, 100);
        }, atcDelay, 'Adding to cart');
    }
}

function sizeMatch(sizeA, sizeB) {
    sizeA = sizeA.toString().toLowerCase();
    sizeB = sizeB.toString().toLowerCase();

    if (!sizeB || !sizeA) return false;

    if (sizeA === sizeB) {
        return true;
    }

    if (!isNaN(sizeA) || !isNaN(sizeB)) return false;

    // Match sizes like 'S/M';
    const splitA = sizeA.split('/');
    const splitB = sizeB.split('/');

    return splitA.some(x => sizeB[0] === x[0]) || splitB.some(x => sizeA[0] === x[0]);
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
    return document.querySelector('input[name=commit]') === null;
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
