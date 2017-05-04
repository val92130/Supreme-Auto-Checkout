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
                const optName = field.attr('name');
                const option = currentStore ? currentStore[optName] : opts[optName];
                if (field.is(':checkbox')) {
                    field.prop('checked', option);
                } else if (option !== undefined) {
                    field.val(option);
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
                    const optName = field.attr('name');
                    let fieldVal = field.is(':checkbox') ? field.prop('checked') : field.val();
                    if (optName !== undefined) {
                        if (fieldVal === undefined || fieldVal === '') {
                            fieldVal = opts[optName];
                        }
                        optionsStore[optName] = fieldVal;
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