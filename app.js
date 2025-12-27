let data = JSON.parse(localStorage.getItem("shoppingData")) || [
  {
    name: "Proteínas",
    products: [
      { name: "Pescado", needed: true },
      { name: "Pollo", needed: true },
      { name: "Pavo", needed: true }
    ]
  }
];

function save() {
  localStorage.setItem("shoppingData", JSON.stringify(data));
}

function render() {
  const list = document.getElementById("list");
  const select = document.getElementById("categorySelect");
  list.innerHTML = "";
  select.innerHTML = "";

  data.forEach((cat, ci) => {
    select.innerHTML += `<option value="${ci}">${cat.name}</option>`;

    let html = `
      <div class="category">
        <div class="category-header">
          <strong>${cat.name}</strong>
          <button onclick="sortAZ(${ci})">A–Z</button>
        </div>
    `;

    cat.products.forEach((p, pi) => {
      html += `
        <div class="product">
          <div class="checkbox ${!p.needed ? "checked" : ""}"
               onclick="toggle(${ci},${pi})"></div>
          <div class="product-name ${p.needed ? "red" : "green"}">
            ${p.name}
          </div>
        </div>
      `;
    });

    html += "</div>";
    list.innerHTML += html;
  });

  save();
}

function toggle(ci, pi) {
  data[ci].products[pi].needed = !data[ci].products[pi].needed;
  render();
}

function addCategory() {
  const input = document.getElementById("categoryInput");
  if (!input.value) return;
  data.push({ name: input.value, products: [] });
  input.value = "";
  render();
}

function addProduct() {
  const input = document.getElementById("productInput");
  const ci = document.getElementById("categorySelect").value;
  if (!input.value) return;
  data[ci].products.push({ name: input.value, needed: true });
  input.value = "";
  render();
}

function sortAZ(ci) {
  data[ci].products.sort((a, b) =>
    a.name.localeCompare(b.name)
  );
  render();
}

render();
