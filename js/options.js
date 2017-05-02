const defaultOptions = {
    "preferences": {
        "delay_checkout": 1500,
        "delay_atc": 200,
        "delay_go_checkout": 100,
        "autocheckout": false
    }
};

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
    const opts = defaultOptions[name] || {};
    getStore(name)
        .then((currentStore) => {
            const fields = form.find(':input');
            for (var i = 0; i < fields.length; i++) {
                const field = $(fields[i]);
                const dataMap = field.attr('data-map');
                const option = currentStore ? currentStore[dataMap] : opts[dataMap];
                if (field.is(':checkbox')) {
                    field.prop('checked', option);
                } else {
                    field.val(option !== undefined ? option : "");
                }
            }

            checkValidFields(form);
            fields.change(function() {
                checkValidFields(form);
            });

            form.submit(function(e) {
                const optionsStore = {};
                for (var i = 0; i < fields.length; i++) {
                    const field = $(fields[i]);
                    const dataMap = field.attr('data-map');
                    let fieldVal = field.is(':checkbox') ? field.prop('checked') : field.val();
                    if (dataMap !== undefined) {
                        if (fieldVal === undefined || fieldVal === '') {
                            fieldVal = opts[dataMap];
                        }
                        optionsStore[dataMap] = fieldVal;
                    }
                }
                setStoreValue(optionsStore, name)
                    .then(() => {
                        success('Configuration saved', 'success');
                    });
                e.preventDefault();
            });
        });

}

function checkValidFields(form) {
    const fields = form.find(':input');
    let isValid = true;
    for (var i = 0; i < fields.length; i++) {
        const field = fields[i];
        const valid = field.checkValidity();
        const parent = $(field).parents('.form-group');
        if (parent.hasClass('has-danger')) {
            parent.removeClass('has-danger');
        }

        if (!valid) {
            isValid = false;
            $(field).parents('.form-group').addClass('has-danger');
        }
    }
    return isValid;
}