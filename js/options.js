const VERSION = "0.2";

$(document).ready(() => {
    const forms = $('form');
    for (var form of forms) {
        const name = $(form).attr('data-form');
        if (name === undefined) {
            continue;
        }
        processForm($(form), name);
    }
});


function processForm(form, name) {
    const currentStore = getCurrentStore(name);
    const fields = form.find(':input');

    if (currentStore !== undefined) {
        for (var i = 0; i < fields.length; i++) {
            const field = $(fields[i]);
            const dataMap = field.attr('data-map');
            const option = currentStore.options.filter(o => o.key === dataMap)[0];

            field.val(option !== undefined ? option.value : "");
        }
    }

    checkValidFields(form);
    fields.change(function() {
        checkValidFields(form);
    });

    form.submit(function(e) {
        const optionsStore = [];
        for (var i = 0; i < fields.length; i++) {
            const field = $(fields[i]);
            const dataMap = field.attr('data-map');
            if (dataMap !== undefined) {
                var storeData = optionsStore.filter(x => x.key === dataMap)[0];
                if (storeData === undefined) {
                    storeData = {};
                    optionsStore.push(storeData);
                }
                storeData.key = dataMap;
                storeData.value = field.val();
            }
        }

        if (localStorage[name]) {
            // already has a store saved
            try {
                var stores = getStore(name);
                var currentVersionStore = stores.filter(x => x.version === VERSION)[0];
                if (currentVersionStore === undefined) {
                    // No store for the current version
                    setStoreValues([{
                        version: VERSION,
                        options: optionsStore
                    }, ...stores], name);
                } else {
                    currentVersionStore.options = optionsStore;
                    setStoreValues(stores, name);
                }
            } catch (e) {
                error('Error while saving options in storage, reinitializing local storage');
                resetStoreValues(name);
            }
        } else {
            setStoreValues([{ version: VERSION, options: optionsStore }], name);
        }
        success('Configuration saved', 'success');
        e.preventDefault();
    });
}

function checkValidFields(form) {
    const fields = form.find(':input');

    for (var i = 0; i < fields.length; i++) {
        const field = fields[i];
        const valid = field.checkValidity();
        const parent = $(field).parents('.form-group');
        if (parent.hasClass('has-danger')) {
            parent.removeClass('has-danger');
        }

        if (!valid) {
            $(field).parents('.form-group').addClass('has-danger');
        }
    }
}

function resetStoreValues(storeName) {
    localStorage[storeName] = JSON.stringify([]);
}

function setStoreValues(val, storeName) {
    try {
        localStorage[storeName] = JSON.stringify(val);
    } catch (e) {
        error('Error while saving options in storage, reinitializing local storage');
        resetOptionsStore();
    }
}

function getStore(name) {
    if (localStorage[name]) {
        try {
            return JSON.parse(localStorage[name]);
        } catch (e) {
            error('Error while reading options store');
        }
    }
}

function getCurrentStore(storeName) {
    const store = getStore(storeName);
    if (store) {
        return store.filter(x => x.version === VERSION)[0];
    }
}