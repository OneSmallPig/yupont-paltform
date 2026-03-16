const resourceGridEl = document.getElementById("resourceGrid");
const resourceCategoryEl = document.getElementById("resourceCategories");

function renderResourcesPage() {
  const categories = ["全部资源", "资料手册", "能力说明", "案例沉淀", "售前支持"];

  resourceCategoryEl.innerHTML = categories.map((item, index) => `
    <button class="tab-pill ${index === 0 ? "active" : ""}" type="button">${item}</button>
  `).join("");

  resourceGridEl.innerHTML = platformData.resources.map((item, index) => `
    <article class="resource-panel">
      <span class="resource-panel-index">0${index + 1}</span>
      <div>
        <p class="eyebrow">${item.type}</p>
        <h3>${item.title}</h3>
        <p>${item.meta}</p>
      </div>
      <a class="ghost-btn small" href="./market.html">关联算法</a>
    </article>
  `).join("");
}

renderResourcesPage();
