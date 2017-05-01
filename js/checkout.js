getStore('billing')
    .then((store) => {
        setTimeout(() => {
            for (let key of Object.keys(store)) {
                const value = store[key];
                console.log(key);
                $('#' + key).val(value);
                $("input[name='order[terms]']").val(1);
                $('#checkout_form').submit();
            }
        }, 3000);
    });