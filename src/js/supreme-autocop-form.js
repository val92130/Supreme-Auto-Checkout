window.onload = async function() {
  function getFieldValue(form, name) {
    let elem =  Array.prototype.filter.call(form.elements, x => x.name === name)[0];
    if (!elem) return;

    return elem.value;
  }

  async function deleteItem(uuid) {
    const storeName = "Supreme";
    const supremeOptions = await getAllOptions(storeName);
    let atc_opts = supremeOptions.atc;
    if (atc_opts === undefined) {
      return;
    }
    await setOptionValue(storeName, "atc", atc_opts.filter(x => x.uuid !== uuid));
    await updateProductList();
  }

  async function updateProductList() {
    var tableRef = document.getElementById('atc-table').getElementsByTagName('tbody')[0];
    const storeName = "Supreme";
    const supremeOptions = await getAllOptions(storeName);
    let atc_opts = supremeOptions.atc;
    if (atc_opts === undefined) {
      return;
    }

    let inner = document.createElement('div');
    for (let prod of atc_opts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))) {
      var tr = document.createElement('tr');
      tr.innerHTML = `
      <td>${prod.keyword}</td>
      <td>${prod.color}</td>
      <td>${prod.category}</td>
      <td><button type="button" class="atc-delete-btn btn btn-sm btn-danger btn-raised" data-atc-id="${prod.uuid}">Delete</button></td>
      `;
      inner.appendChild(tr);
    }
    tableRef.innerHTML = inner.innerHTML;
    const deleteBtns = document.querySelectorAll('.atc-delete-btn');
    for (let btn of deleteBtns) {
      btn.addEventListener('click', async () => {
        const uid = btn.getAttribute('data-atc-id');
        await deleteItem(uid);
      });
    }
  }

  let selectOpt = document.getElementById('atc-category');
  let options = "";
  for (let key of Object.keys(_sizings)) {
    options += `<option value="${key}">${key}</option>`;
  }
  selectOpt.innerHTML = options;

  let form = document.getElementById('atc-add-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const storeName = "Supreme";
    const supremeOptions = await getAllOptions(storeName);
    if (supremeOptions === undefined) {
      await createStore(storeName);
    }

    let atc_opts = supremeOptions.atc;
    if (atc_opts === undefined) {
      await setOptionValue(storeName, "atc", []);
      atc_opts = [];
    }

    let keyword = getFieldValue(form, 'keyword');
    let color = getFieldValue(form, 'color');
    let category = getFieldValue(form, 'category');

    // Don't add duplicate
    if (!atc_opts.some(x => x.color === color && x.keyword === keyword && x.category)) {
      const uuid = guid();
      const timestamp = Date.now();
      atc_opts.push({ keyword, color, category, uuid, timestamp });
    }

    await setOptionValue(storeName, "atc", atc_opts);
    $('#atc-product-modal').modal('hide');
    form.reset();
    await updateProductList();
  });
  await updateProductList();

  const updateBtn = document.getElementById('atc-update-btn');
  updateBtn.addEventListener('click', async () => {
    await updateProductList();
  })
};