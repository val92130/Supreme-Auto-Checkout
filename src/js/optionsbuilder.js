class OptionsBuilder {
  constructor(forms, targetNode) {
    this.targetNode = targetNode;
    this.forms = forms;
    this.groupedForms = OptionsBuilder.GroupBy(forms, 'category');
    this.formCategory = Object.keys(this.groupedForms)[0];
    this.customTabs = [];
  }

  render() {
    this.targetNode.innerHTML = '';

    const menu = this.createMenu(this.groupedForms);

    const forms = this.forms.filter(x => x.category === this.formCategory);
    const tabs = OptionsBuilder.CreateTabs(forms);
    const panes = OptionsBuilder.CreatePanes(forms);
    const customTabs = this.customTabs.filter(x => x.category === this.formCategory);

    for(let tab of customTabs) {
      let li = document.createElement('li');
      li.className = 'nav-item';
      li.innerHTML = `<a class="nav-link" id="${tab.name}-nav" data-toggle="tab" role="tab" href="#${tab.name}-tab">${tab.name}</a>`;
      tabs.appendChild(li);
      let content = document.createElement('div');
      content.className = 'tab-pane';
      content.id = `${tab.name}-tab`;
      content.setAttribute('role', 'tabpanel');
      content.innerHTML = typeof tab.content === 'string' ? tab.content : tab.content.innerHTML;
      panes.appendChild(content);
    }

    this.targetNode.appendChild(menu);
    this.targetNode.appendChild(tabs);
    this.targetNode.appendChild(panes);
  }

  static GroupBy(xs, key) {
    return xs.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };

  addCustomTab(category, name, content) {
    this.customTabs.push({category, name, content});
  }

  createMenu() {
    let navContainer = document.createElement('div');
    navContainer.className = 'navbar navbar-inverse bg-primary';

    let fluidContainer = document.createElement('div');
    fluidContainer.className = 'container-fluid';

    let navHeader = document.createElement('div');
    navHeader.className = 'navbar-header';

    navHeader.innerHTML = `
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#collapse-navbar" aria-expanded="false">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
    `;

    let navBrand = document.createElement('a');
    navBrand.innerText = this.formCategory;
    navBrand.className = 'navbar-brand';

    let navBarCollapse = document.createElement('div');
    navBarCollapse.id = 'collapse-navbar';
    navBarCollapse.className = 'collapse navbar-collapse';

    let navBarUl = document.createElement('div');
    navBarUl.className = 'nav navbar-nav';

    const keys = Object.keys(this.groupedForms);

    for (let i = 0; i < keys.length; i++) {
      const group = keys[i];
      const li = document.createElement('li');
      li.className = this.formCategory === group ? 'active' : '';
      const a = document.createElement('a');
      a.innerText = group;
      a.href = '#';
      a.addEventListener('click',() => {
        this.changeFormCategory(group);
      });

      li.appendChild(a);
      navBarUl.appendChild(li);
    }

    navContainer.appendChild(fluidContainer);
    fluidContainer.appendChild(navHeader);
    navHeader.appendChild(navBrand);
    fluidContainer.appendChild(navBarCollapse);
    navBarCollapse.appendChild(navBarUl);
    return navContainer;
  }

  changeFormCategory(newCategory) {
    this.formCategory = newCategory;
    this.render();
  }

  static CreateTabs(forms) {
    const tabContainer = document.createElement('ul');
    tabContainer.className = 'nav nav-tabs';
    tabContainer.setAttribute('role', 'tablist');

    for (let i = 0; i < forms.length; i++) {
      const formName = forms[i].name;
      const formCategory = forms[i].category || '';
      const li = document.createElement('li');
      li.className = 'nav-item' + (i === 0 ? ' active' : '');

      const inner = document.createElement('a');
      inner.className = 'nav-link' + (i === 0 ? ' active' : '');
      inner.id = `${formCategory}-${formName}-form`;
      inner.setAttribute('data-toggle', 'tab');
      inner.setAttribute('role', 'tab');
      inner.href = `#${formCategory}-${formName}-tab`;
      inner.innerText = formName;

      li.appendChild(inner);
      tabContainer.appendChild(li);
    }

    return tabContainer;
  }

  static CreatePanes(forms) {
    const tabContainer = document.createElement('div');
    tabContainer.className = 'tab-content';

    for (let i = 0; i < forms.length; i++) {
      const formName = forms[i].name;
      const formCategory = forms[i].category || '';

      const tabPane = document.createElement('div');
      tabPane.className = 'tab-pane' + (i === 0 ? ' active' : '');
      tabPane.id = `${formCategory}-${formName}-tab`;
      tabPane.setAttribute('role', 'tabpanel');

      const inner = document.createElement('div');
      inner.id = `${formCategory}-${formName}-form`;

      tabPane.appendChild(inner);
      tabContainer.appendChild(tabPane);

      const form = new FormBuilder(forms[i], inner, formName);
      form.render();
    }
    return tabContainer;
  }
}