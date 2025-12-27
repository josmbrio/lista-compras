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
      const checked = p.needed; // TRUE = CHECK = ROJO

      html += `
        <div class="product">
          <div class="checkbox ${checked ? "checked" : ""}"
               onclick="toggle(${ci},${pi})"></div>

          <div class="product-name ${checked ? "red" : "green"}">
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

// 🔄 Toggle estado
function toggle(ci, pi) {
  data[ci].products[pi].needed = !data[ci].products[pi].needed;
  render();
}

// ➕ Categoría
function addCategory() {
  const input = document.getElementById("categoryInput");
  if (!input.value.trim()) return;

  data.push({ name: input.value.trim(), products: [] });
  input.value = "";
  render();
}

// ➕ Producto individual
function addProduct() {
  const input = document.getElementById("productInput");
  const ci = document.getElementById("categorySelect").value;

  if (!input.value.trim()) return;

  data[ci].products.push({
    name: input.value.trim(),
    needed: true // SIEMPRE entra en CHECK (ROJO)
  });

  input.value = "";
  render();
}

// 📋 PEGAR DESDE PORTAPAPELES
function pasteProducts() {
  const textarea = document.getElementById("pasteInput");
  const ci = document.getElementById("categorySelect").value;

  const lines = textarea.value
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  lines.forEach(line => {
    data[ci].products.push({
      name: line,
      needed: true // CHECK ROJO
    });
  });

  textarea.value = "";
  render();
}

// 🔤 ORDEN A–Z
function sortAZ(ci) {
  data[ci].products.sort((a, b) =>
    a.name.localeCompare(b.name, "es", { sensitivity: "base" })
  );
  render();
}

render();
