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
    Number(document.getElementById("categorySelect").value);
}

function render() {
  const list = document.getElementById("list");
  const select = document.getElementById("categorySelect");

  list.innerHTML = "";
  select.innerHTML = "";

  if (data.length === 0) {
    save();
    return;
  }

  data.forEach((cat, ci) => {
    select.innerHTML += `<option value="${ci}">${cat.name}</option>`;

    let html = `
      <div class="category">
        <div class="category-header">
          <strong>${cat.name}</strong>
          <div>
            <button onclick="sortAZ(${ci})">A–Z</button>
            <span class="delete-category"
                  onclick="deleteCategory(${ci})">✖️</span>
          </div>
        </div>
    `;

    cat.products.forEach((p, pi) => {
      const checked = p.needed;

      html += `
        <div class="product">
          <div class="checkbox ${checked ? "checked" : ""}"
               onclick="toggle(${ci},${pi})"></div>

          <div class="product-name">${p.name}</div>

          <div class="delete-btn"
               onclick="deleteProduct(${ci},${pi})">✖️</div>
        </div>
      `;
    });

    html += "</div>";
    list.innerHTML += html;
  });

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

// 📋 PEGAR PRODUCTOS
function addProducts() {
  if (!data[selectedCategoryIndex]) return;

  const textarea = document.getElementById("pasteInput");

  const lines = textarea.value
    .split("\n")
    .map(l => l.trim())
    .filter(l => l.length > 0);

  lines.forEach(line => {
    data[selectedCategoryIndex].products.push({
      name: line,
      needed: true
    });
  });

  textarea.value = "";
  render();
}

// 🔤 ORDEN A–Z
function sortAZ(ci) {
  if (!confirm(`¿Ordenar alfabéticamente la categoría "${data[ci].name}"?`))
    return;

  data[ci].products.sort((a, b) =>
    a.name.localeCompare(b.name, "es", { sensitivity: "base" })
  );
  render();
}

// ❌ ELIMINAR PRODUCTO
function deleteProduct(ci, pi) {
  if (
    !confirm(
      `¿Desea eliminar el producto "${data[ci].products[pi].name}"?`
    )
  ) return;

  data[ci].products.splice(pi, 1);
  render();
}

// ❌ ELIMINAR CATEGORÍA
function deleteCategory(ci) {
  if (
    !confirm(
      `¿Eliminar la categoría "${data[ci].name}" y todos sus productos?`
    )
  ) return;

  data.splice(ci, 1);

  selectedCategoryIndex =
    Math.max(0, Math.min(selectedCategoryIndex, data.length - 1));

  render();
}

// 📤 EXPORTAR GLOBAL (JSON)
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

// 📤 EXPORTAR SELECCIONADOS DE UNA CATEGORÍA (TXT)
function exportSelected() {
  if (data.length === 0) {
    alert("No hay categorías para exportar");
    return;
  }

  const categoryNames = data.map(cat => cat.name);
  const options = categoryNames
    .map((name, index) => `${index + 1}. ${name}`)
    .join("\n");

  const choice = prompt(
    `¿Qué categoría deseas exportar?\n\n${options}\n\nEscribe el número:`,
    "1"
  );

  if (!choice) return;

  const categoryIndex = Number(choice) - 1;

  if (categoryIndex < 0 || categoryIndex >= data.length) {
    alert("Número de categoría inválido");
    return;
  }

  const category = data[categoryIndex];
  const selectedProducts = category.products
    .filter(p => p.needed)
    .map(p => p.name);

  if (selectedProducts.length === 0) {
    alert(`No hay elementos seleccionados en "${category.name}"`);
    return;
  }

  const text = selectedProducts.join("\n");
  const blob = new Blob([text], { type: "text/plain" });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${category.name}.txt`;
  a.click();

  URL.revokeObjectURL(url);
}

// 📥 IMPORTAR
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = e => {
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

    // 🔑 permitir importar el mismo archivo otra vez
    event.target.value = "";
  };

  reader.readAsText(file);
}

render();
