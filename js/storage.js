function setStoreValue(val, storeName) {
    return new Promise((resolve, reject) => {
        const obj = {};
        obj[storeName] = val;
        chrome.storage.local.set(obj, () => {
            resolve();
        });
    });
}

function getStore(name) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(name, (items) => {
            if (!Object.keys(items).length) {
                resolve(undefined);
            } else {
                resolve(items[name]);
            }
        });
    });
}

function getStores(names) {
    return Promise.all(names.map(x => getStore(x)));
}