window.onload = async function() {
  function getFieldValue(form, name) {
    let elem =  Array.prototype.filter.call(form.elements, x => x.name === name)[0];
    if (!elem) return;

    return elem.value;
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
    for (let prod of atc_opts) {
      var tr = document.createElement('tr');
      tr.innerHTML = `
      <td>${prod.keyword}</td>
      <td>${prod.color}</td>
      <td>${prod.category}</td>
      `;
      inner.appendChild(tr);
    }
    tableRef.innerHTML = inner.innerHTML;
  }

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
      atc_opts.push({ keyword, color, category });
    }

    await setOptionValue(storeName, "atc", atc_opts);
    $('#atc-product-modal').modal('hide');
    form.reset();
    await updateProductList();
  });

  await updateProductList();
};