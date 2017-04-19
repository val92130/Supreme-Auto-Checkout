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

    checkValidFields(optionsForm);
    fields.change(function() {
        checkValidFields($('#options-form'));
    });
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
                error('Error while saving options in storage, reinitializing local storage');
                resetOptionsStore();
            }
        } else {
            setOptionsStore([{ version: VERSION, options: optionsStore }]);
        }
        success('Configuration saved', 'success');
        e.preventDefault();
    });
});

function checkValidFields(form) {
    const fields = form.find(':input');

    for(var i = 0; i < fields.length; i++) {
        const field = fields[i];
        const valid = field.checkValidity();
        const parent = $(field).parents('.form-group');
        if (parent.hasClass('has-success')) {
            parent.removeClass('has-success');
        }
        if (parent.hasClass('has-danger')) {
            parent.removeClass('has-danger');
        }
        
        $(field).parents('.form-group').addClass('has-' + (valid ? 'success' : 'danger'));
    }
}

function resetOptionsStore() {
    localStorage.options = JSON.stringify([]);
}

function setOptionsStore(val) {
    try {
        localStorage.options = JSON.stringify(val);
    } catch (e) {
        error('Error while saving options in storage, reinitializing local storage');
        resetOptionsStore();
    }
}

function getOptionsStore() {
    if (localStorage.options) {
        try {
            return JSON.parse(localStorage.options);
        } catch(e) {
            error('Error while reading options store');
        }
    }
}

function getCurrentStore() {
    const store = getOptionsStore();
    if (store) {
        return store.filter(x => x.version === VERSION)[0];
    }
}

