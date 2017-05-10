const forms = getForms();
const formContainer = document.getElementById('form-container');

createTabs(forms, formContainer);
createPanes(forms, formContainer);

function createTabs(forms, container) {
  const tabContainer = document.createElement('ul');
  tabContainer.className = 'nav nav-tabs';
  tabContainer.setAttribute('role', 'tablist');

  for (let i = 0; i < forms.length; i++) {
    const formName = forms[i].name;
    const li = document.createElement('li');
    li.className = 'nav-item' + (i === 0 ? ' active' : '');

    const inner = document.createElement('a');
    inner.className = 'nav-link' + (i === 0 ? ' active' : '');
    inner.id = `${formName}-form`;
    inner.setAttribute('data-toggle', 'tab');
    inner.setAttribute('role', 'tab');
    inner.href = `#${formName}-tab`;
    inner.innerText = formName;

    li.appendChild(inner);
    tabContainer.appendChild(li);
  }

  container.appendChild(tabContainer);
}

function createPanes(forms, container) {
  const tabContainer = document.createElement('div');
  tabContainer.className = 'tab-content';

  for (let i = 0; i < forms.length; i++) {
    const formName = forms[i].name;
    const tabPane = document.createElement('div');
    tabPane.className = 'tab-pane' + (i === 0 ? ' active' : '');
    tabPane.id = `${formName}-tab`;
    tabPane.setAttribute('role', 'tabpanel');

    const inner = document.createElement('div');
    inner.id = `${formName}-form`;

    tabPane.appendChild(inner);
    tabContainer.appendChild(tabPane);

    const form = new FormBuilder(forms[i], inner, formName);
    form.render();
  }
  container.appendChild(tabContainer);
}
