const resourceGridEl = document.getElementById("resourceGrid");
const resourceCategoryEl = document.getElementById("resourceCategories");
const resourcePreviewTitleEl = document.getElementById("resourcePreviewTitle");
const resourcePreviewMetaEl = document.getElementById("resourcePreviewMeta");
const resourcePreviewBodyEl = document.getElementById("resourcePreviewBody");
const resourceDownloadBtnEl = document.getElementById("resourceDownloadBtn");

const resourceState = {
  category: "全部资源",
  previewIndex: 0,
};

function getResourceCategoryItems() {
  return ["全部资源", ...new Set(platformData.resources.map((item) => item.type))];
}

function getFilteredResources() {
  if (resourceState.category === "全部资源") return platformData.resources;
  return platformData.resources.filter((item) => item.type === resourceState.category);
}

function getPreviewText(item) {
  return [
    `${item.title}`,
    ``,
    `资源类型：${item.type}`,
    `更新时间：${item.updatedAt}`,
    `内容说明：${item.meta}`,
    ``,
    `本资源用于平台资料沉淀、客户沟通、方案推进与项目交付支撑。`,
    `可结合平台能力说明、演示流程与项目案例一并使用。`,
  ].join("\n");
}

function renderResourceCategories() {
  resourceCategoryEl.innerHTML = getResourceCategoryItems().map((item) => `
    <button class="resource-filter-chip ${resourceState.category === item ? "active" : ""}" type="button" data-resource-category="${item}">${item}</button>
  `).join("");

  document.querySelectorAll("[data-resource-category]").forEach((node) => {
    node.addEventListener("click", () => {
      resourceState.category = node.dataset.resourceCategory;
      resourceState.previewIndex = 0;
      renderResourcesPage();
    });
  });
}

function renderResourceGrid() {
  const resources = getFilteredResources();

  resourceGridEl.innerHTML = `
    <div class="resource-list-shell">
      ${resources.map((item, index) => `
        <article class="resource-list-row">
          <div class="resource-list-main">
            <div class="resource-list-title-row">
              <h3>${item.title}</h3>
              <span class="resource-list-tag">${item.type}</span>
            </div>
            <div class="resource-list-meta-row">
              <span class="resource-list-update">更新时间 ${item.updatedAt}</span>
              <span class="resource-list-desc">${item.meta}</span>
            </div>
          </div>
          <div class="resource-list-actions">
            <button class="ghost-btn resource-list-btn" type="button" data-resource-preview="${index}">预览</button>
            <button class="primary-btn resource-list-btn resource-list-download-btn" type="button" data-resource-download="${index}">下载</button>
          </div>
        </article>
      `).join("")}
    </div>
  `;

  document.querySelectorAll("[data-resource-preview]").forEach((node) => {
    node.addEventListener("click", () => {
      resourceState.previewIndex = Number(node.dataset.resourcePreview);
      openResourcePreview();
    });
  });

  document.querySelectorAll("[data-resource-download]").forEach((node) => {
    node.addEventListener("click", () => {
      const item = resources[Number(node.dataset.resourceDownload)];
      downloadResource(item);
    });
  });
}

function downloadBlob(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function getCurrentPreviewResource() {
  return getFilteredResources()[resourceState.previewIndex] || getFilteredResources()[0];
}

function openResourcePreview() {
  const item = getCurrentPreviewResource();
  if (!item) return;

  resourcePreviewTitleEl.textContent = item.title;
  resourcePreviewMetaEl.textContent = `${item.type} / 更新时间 ${item.updatedAt}`;
  resourcePreviewBodyEl.innerHTML = `
    <div class="resource-preview-sheet">
      <div class="resource-preview-head">
        <span class="resource-list-tag">${item.type}</span>
        <strong>${item.title}</strong>
      </div>
      <pre class="resource-preview-text">${getPreviewText(item)}</pre>
    </div>
  `;
  openModal("resourcePreviewModal");
}

function downloadResource(item) {
  if (!item) return;
  const fileName = `${item.title.replace(/\s+/g, "-")}.txt`;
  downloadBlob(fileName, getPreviewText(item), "text/plain;charset=utf-8");
}

resourceDownloadBtnEl.addEventListener("click", () => {
  downloadResource(getCurrentPreviewResource());
});

function renderResourcesPage() {
  renderResourceCategories();
  renderResourceGrid();
}

renderResourcesPage();
