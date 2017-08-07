const forms = getForms();

const optionsBuilder = new OptionsBuilder(forms, document.getElementById('options-container'));

let additionals_containers = document.querySelectorAll('div[data-option]');
for (let container of additionals_containers) {
  let html = container.innerHTML;
  optionsBuilder.addCustomTab(container.getAttribute('data-option-category'), container.getAttribute('data-option'), html);
  container.remove();
}
optionsBuilder.render();

$.material.init();