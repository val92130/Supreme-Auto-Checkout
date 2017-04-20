
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
            console.log(currentStore);
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
                console.log(optionsStore);
                createOrUpdateStore(name, optionsStore)
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