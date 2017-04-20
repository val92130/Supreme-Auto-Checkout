function resetStoreValues(storeName) {
    return setStoreValues([], storeName);
}

function setStoreValue(val, storeName) {
    return new Promise((resolve, reject) => {
        const obj = {};
        obj[storeName] = val;
        chrome.storage.sync.set(obj, () => {
            resolve();
        });
    });
}

function getStore(name) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(name, (items) => {
            if (!Object.keys(items).length) {
                resolve(undefined);
            } else {
                resolve(items[name]);
            }
        });
    });
}

function createOrUpdateStore(storeName, values) {
    return new Promise((resolve, reject) => {
        return resolve(setStoreValue(values, storeName));
    });
}