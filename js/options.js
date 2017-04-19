const VERSION = "0.2";

$(document).ready(() => {
    const optionsForm = $('#options-form');
    const currentStore = getCurrentStore();
    const fields = optionsForm.find(':input');

    if (currentStore !== undefined) {
        for(var i = 0; i < fields.length; i++) {
            const field = $(fields[i]);
            const dataMap = field.attr('data-map');
            const option = currentStore.options.filter(o => o.key === dataMap)[0];

            field.val(option !== undefined ? option.value : "");
        }
    }
    optionsForm.submit(function(e) {
        const optionsStore = [];
        for(var i = 0; i < fields.length; i++) {
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

        if (localStorage.options) {
            // already has a store saved
            try {
                var stores = getOptionsStore();
                var currentVersionStore = stores.filter(x => x.version === VERSION)[0];
                if (currentVersionStore === undefined) {
                    // No store for the current version
                    setOptionsStore([{
                        version: VERSION,
                        options: optionsStore
                    }, ...stores]);
                } else {
                    currentVersionStore.options = optionsStore;
                    setOptionsStore(stores);
                }
            } catch(e) {
                console.error('Error while saving options in storage, reinitializing local storage');
                resetOptionsStore();
            }
        } else {
            setOptionsStore([{ version: VERSION, options: optionsStore }]);
        }
        e.preventDefault();
    });
});

function resetOptionsStore() {
    localStorage.options = JSON.stringify([]);
}

function setOptionsStore(val) {
    try {
        localStorage.options = JSON.stringify(val);
    } catch (e) {
        console.error('Error while saving options in storage, reinitializing local storage');
        resetOptionsStore();
    }
}

function getOptionsStore() {
    if (localStorage.options) {
        try {
            return JSON.parse(localStorage.options);
        } catch(e) {
            console.error('Error while reading options store');
        }
    }
}

function getCurrentStore() {
    return getOptionsStore().filter(x => x.version === VERSION)[0];
}

