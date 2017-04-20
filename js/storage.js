function resetStoreValues(storeName) {
    return setStoreValues([], storeName);
}

function setStoreValues(val, storeName) {
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
            if (_.isEmpty(items)) {
                resolve(undefined);
            } else {
                console.log(items[name]);
                resolve(items[name]);
            }
        });
    });
}

function createOrUpdateStore(storeName, values) {
    return new Promise((resolve, reject) => {
        return resolve(setStoreValues(values, storeName));
    });
}