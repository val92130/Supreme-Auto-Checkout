const defaultOptions = {
    "preferences": {
        "delay_checkout": 1500,
        "delay_atc": 200,
        "delay_go_checkout": 100,
        "autocheckout": false
    }
};

(() => {
    $.material.init();
    const forms = document.getElementsByTagName('form');
    for (var form of forms) {
        const name = form.getAttribute('data-form');
        if (name === undefined) {
            continue;
        }
        processForm(form, name);
    }
})();


function processForm(form, name) {
    const opts = defaultOptions[name] || {};
    getStore(name)
        .then((currentStore) => {
            const fields = form.elements;
            for (var i = 0; i < fields.length; i++) {
                const field = fields[i];
                const optName = field.name;
                const option = currentStore ? currentStore[optName] : opts[optName];
                if (field.type && field.type === 'checkbox') {
                    field.checked = option;
                } else if (option !== undefined) {
                    field.value = option;
                }

                field.addEventListener('change', () => checkValidFields(form));
            }

            checkValidFields(form);

            form.onsubmit = function(e) {
                const optionsStore = {};
                for (var i = 0; i < fields.length; i++) {
                    const field = fields[i];
                    const optName = field.getAttribute('name');
                    let fieldVal = (field.type && field.type === 'checkbox') ? field.checked : field.value;
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
            };
        });

}

function checkValidFields(form) {
    const fields = form.getElementsByTagName('input');
    let isValid = true;
    for (var i = 0; i < fields.length; i++) {
        const field = fields[i];
        const valid = field.checkValidity();
        const parent = findAncestor(field, 'form-group');
        if (parent.classList.contains('has-danger')) {
            parent.classList.remove('has-danger');
        }

        if (!valid) {
            isValid = false;
            parent.classList.add('has-danger');
        }
    }
    return isValid;
}