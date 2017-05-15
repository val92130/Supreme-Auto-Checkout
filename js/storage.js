function setStoreValue(category, storeName, value) {
    return new Promise((resolve, reject) => {
        const obj = {};
        obj[storeName] = value;
        const t = {};
        t[category] = obj;
        chrome.storage.local.set(t, () => {
            resolve();
        });
    });
}

function getStore(category, name) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(category, (items) => {
            if (!Object.keys(items).length) {
                resolve(undefined);
            } else {
                resolve(items[category][name]);
            }
        });
    });
}

function getStores(names) {
    return Promise.all(names.map(x => getStore(x)));
}