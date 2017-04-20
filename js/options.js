
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
    getStore(name)
        .then((currentStore) => {
            const fields = form.find(':input');
            if (currentStore !== undefined) {
                for (var i = 0; i < fields.length; i++) {
                    const field = $(fields[i]);
                    const dataMap = field.attr('data-map');
                    const option = currentStore.filter(o => o.key === dataMap)[0];
                    if (field.is(':checkbox')) {
                        field.prop('checked', option.value);
                    } else {
                        field.val(option !== undefined ? option.value : "");                        
                    }
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
                    const fieldVal = field.is(':checkbox') ? field.prop('checked') : field.val();
                    if (dataMap !== undefined) {
                        storeData = { key: dataMap, value: fieldVal };
                        optionsStore.push(storeData);
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