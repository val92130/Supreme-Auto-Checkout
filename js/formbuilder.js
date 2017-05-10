class FormBuilder {
  constructor(schema, targetNode, name) {
    const BrutusinForms = brutusin["json-forms"];
    BrutusinForms.addDecorator(
      function (element, schema) {
        if (element.tagName && schema && schema.name) {
          var tagName = element.tagName.toLowerCase();
          if (tagName === "input") {
            element.name = schema.name;
          }
        }
      }
    );

    this.form = BrutusinForms.create(schema);
    this.targetNode = targetNode;
    this.name = name;
  }

  async getInitialData() {
    return await getStore(this.name);
  }

  async render() {
    const initialData = await this.getInitialData();

    if (initialData !== undefined) {
      this.form.render(this.targetNode, initialData);
    } else {
      this.form.render(this.targetNode);
    }

    const btnContainer = document.createElement('div');
    btnContainer.style.textAlign = 'center';
    btnContainer.style.marginTop = '20px';

    const formNode = this.targetNode.getElementsByTagName('form')[0];

    const btn = document.createElement('input');
    btn.type = 'submit';
    btn.className = 'btn btn-raised btn-primary save-btn';
    btn.innerText = 'Save';
    formNode.addEventListener('submit', async () => {
      await this.onSave();
    });

    btnContainer.appendChild(btn);
    formNode.appendChild(btnContainer);
  }

  async onSave() {
    const isValid = this.form.validate();
    console.log(isValid);
    if (isValid) {
      await setStoreValue(this.form.getData(), this.name);
      success('Configuration saved !');
    }
  }
}