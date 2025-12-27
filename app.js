let selectedCategoryIndex = 0;

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

function onCategoryChange() {
  selectedCategoryIndex =
    document.getElementById("categorySelect").value;
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
          <div>
            <button onclick="sortAZ(${ci})">A–Z</button>
            <span class="delete-category"
                  onclick="deleteCategory(${ci})">❌</span>
          </div>
        </div>
    `;

    cat.products.forEach((p, pi) => {
      const checked = p.needed; // TRUE = CHECK = ROJO

      html += `
        <div class="product">
          <div class="checkbox ${checked ? "checked" : ""}"
               onclick="toggle(${ci},${pi})"></div>

          <div class="product-name">
            ${p.name}
          </div>

          <div class="delete-btn"
               onclick="deleteProduct(${ci},${pi})">
            ❌
          </div>
        </div>
      `;
    });

    html += "</div>";
    list.innerHTML += html;
  });

  // 🔑 restaurar selección
  select.value = selectedCategoryIndex;

  save();
}

// 🔄 Toggle estado
function toggle(ci, pi) {
  data[ci].products[pi].needed =
    !data[ci].products[pi].needed;
  render();
}

// ➕ Categoría
function addCategory() {
  const input = document.getElementById("categoryInput");
  if (!input.value.trim()) return;

  data.push({
    name: input.value.trim(),
    products: []
  });

  selectedCategoryIndex = data.length - 1;
  input.value = "";
  render();
}

// ➕ Producto individual
function addProduct() {
  const input = document.getElementById("productInput");
  const ci = selectedCategoryIndex;

  if (!input.value.trim()) return;

  data[ci].products.push({
    name: input.value.trim(),
    needed: true
  });

  input.value = "";
  render();
}

// 📋 PEGAR DESDE PORTAPAPELES
function pasteProducts() {
  const textarea = document.getElementById("pasteInput");
  const ci = selectedCategoryIndex;

  const lines = textarea.value
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  lines.forEach(line => {
    data[ci].products.push({
      name: line,
      needed: true
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

// ❌ ELIMINAR PRODUCTO
function deleteProduct(ci, pi) {
  if (!confirm("¿Eliminar este producto?")) return;
  data[ci].products.splice(pi, 1);
  render();
}

// ❌ ELIMINAR CATEGORÍA
function deleteCategory(ci) {
  if (
    !confirm(
      `¿Eliminar la categoría "${data[ci].name}" y todos sus productos?`
    )
  )
    return;

  data.splice(ci, 1);

  if (selectedCategoryIndex >= data.length) {
    selectedCategoryIndex = data.length - 1;
  }
  if (selectedCategoryIndex < 0) {
    selectedCategoryIndex = 0;
  }

  render();
}

render();

// 📤 EXPORTAR
function exportData() {
  const blob = new Blob(
    [JSON.stringify(data, null, 2)],
    { type: "application/json" }
  );

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "lista-compras.json";
  a.click();

  URL.revokeObjectURL(url);
}

// 📥 IMPORTAR
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const importedData = JSON.parse(e.target.result);

      if (!Array.isArray(importedData)) {
        alert("Archivo inválido");
        return;
      }

      if (
        !confirm(
          "Esto reemplazará TODA tu lista actual. ¿Continuar?"
        )
      ) return;

      data = importedData;
      selectedCategoryIndex = 0;
      render();
    } catch {
      alert("Error al leer el archivo");
    }
  };

  reader.readAsText(file);
}
