const forms = getForms();

const optionsBuilder = new OptionsBuilder(forms, document.getElementById('options-container'));
optionsBuilder.render();

$.material.init();