$(document).ready(() => {
    const optionsForm = $('#options-form');

    optionsForm.submit(function(e) {
        const fields = optionsForm.find('input');
        const store = {};
        for(var i = 0; i < fields.length; i++) {
            const field = $(fields[i]);
            const dataValue = field.attr('data-value');
            if (dataValue !== undefined) {
                store[dataValue] = field.val();
            }
        }
        console.log(store);
        e.preventDefault();
    });
});