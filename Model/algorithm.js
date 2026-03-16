const detailId = new URLSearchParams(window.location.search).get("id") || platformData.algorithms[0].id;
const selectedAlgorithm = platformData.algorithms.find((item) => item.id === detailId) || platformData.algorithms[0];

const heroEl = document.getElementById("algorithmHero");
const sidebarEl = document.getElementById("algorithmSidebar");
const comboPanelEl = document.getElementById("comboPanel");
const uploadPreviewEl = document.getElementById("uploadPreview");
const resultPreviewEl = document.getElementById("resultPreview");
const resultMetricsEl = document.getElementById("resultMetrics");
const resultStatusEl = document.getElementById("resultStatus");
const comboToggleEl = document.getElementById("comboToggle");
const fileInputEl = document.getElementById("detectionFile");
const runBtnEl = document.getElementById("runDetectionBtn");
const previewJsonBtnEl = document.getElementById("previewJsonBtn");
const previewPdfBtnEl = document.getElementById("previewPdfBtn");
const exportPreviewBodyEl = document.getElementById("exportPreviewBody");
const downloadExportBtnEl = document.getElementById("downloadExportBtn");

const detectionState = {
  fileName: "杆塔巡检样例.jpg",
  fileUrl: selectedAlgorithm.image,
  selectedIds: [selectedAlgorithm.id],
  result: null,
  exportType: "json",
};

function getAlgorithmById(id) {
  return platformData.algorithms.find((item) => item.id === id);
}

function renderDetailHero() {
  document.getElementById("detailBreadcrumb").textContent = selectedAlgorithm.name;
  heroEl.innerHTML = `
    <div class="algorithm-hero-main">
      <div class="algorithm-icon">AI</div>
      <div class="algorithm-hero-copy">
        <p class="eyebrow">${selectedAlgorithm.industry}</p>
        <h1>${selectedAlgorithm.name}</h1>
        <p>${selectedAlgorithm.desc}</p>
        <div class="algo-meta">
          <span class="status-pill status-pill-accent">${selectedAlgorithm.badge}</span>
          <span class="status-pill">${selectedAlgorithm.category}</span>
          <span class="status-pill">${selectedAlgorithm.stack}</span>
        </div>
      </div>
    </div>
    <div class="algorithm-hero-score">
      <strong>${selectedAlgorithm.metric}</strong>
      <span>核心指标</span>
    </div>
  `;
}

function renderSidebar() {
  const related = platformData.algorithms.filter((item) => item.id !== selectedAlgorithm.id).slice(0, 3);
  sidebarEl.innerHTML = `
    <div class="section-card">
      <p class="eyebrow">Algorithm Notes</p>
      <h3>算法说明</h3>
      <div class="sidebar-spec-list">
        <div class="spec-row"><span>模型架构</span><strong>${selectedAlgorithm.stack}</strong></div>
        <div class="spec-row"><span>适用场景</span><strong>${selectedAlgorithm.scene}</strong></div>
        <div class="spec-row"><span>收藏次数</span><strong>${selectedAlgorithm.favorites}</strong></div>
        <div class="spec-row"><span>测试次数</span><strong>${selectedAlgorithm.tests}</strong></div>
      </div>
      <p class="sidebar-copy">${selectedAlgorithm.businessDesc}</p>
    </div>
    <div class="section-card">
      <p class="eyebrow">Related Models</p>
      <h3>组合建议</h3>
      <div class="related-list">
        ${related.map((item) => `
          <a class="related-item" href="./algorithm.html?id=${item.id}">
            <strong>${item.name}</strong>
            <span>${item.scene}</span>
          </a>
        `).join("")}
      </div>
    </div>
  `;
}

function renderComboPanel() {
  if (!comboToggleEl.checked) {
    comboPanelEl.innerHTML = `
      <div class="combo-summary">
        <span>当前算法</span>
        <div class="combo-tags"><span class="status-pill">${selectedAlgorithm.name}</span></div>
      </div>
    `;
    detectionState.selectedIds = [selectedAlgorithm.id];
    return;
  }

  const options = platformData.algorithms
    .filter((item) => item.id !== selectedAlgorithm.id)
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");

  comboPanelEl.innerHTML = `
    <div class="combo-summary">
      <span>已选择 ${detectionState.selectedIds.length} 个算法</span>
      <div class="combo-tags" id="comboTags"></div>
    </div>
    <div class="combo-actions">
      <select id="comboSelect">
        <option value="">添加算法</option>
        ${options}
      </select>
      <button class="ghost-btn small" type="button" id="clearComboBtn">清空组合</button>
    </div>
  `;

  updateComboTags();

  document.getElementById("comboSelect").addEventListener("change", (event) => {
    const value = event.target.value;
    if (!value || detectionState.selectedIds.includes(value)) return;
    detectionState.selectedIds = [...detectionState.selectedIds, value];
    updateComboTags();
    event.target.value = "";
  });

  document.getElementById("clearComboBtn").addEventListener("click", () => {
    detectionState.selectedIds = [selectedAlgorithm.id];
    updateComboTags();
  });
}

function updateComboTags() {
  const tagsEl = document.getElementById("comboTags");
  if (!tagsEl) return;
  tagsEl.innerHTML = detectionState.selectedIds.map((id) => {
    const item = getAlgorithmById(id);
    const removable = id !== selectedAlgorithm.id;
    return `
      <span class="combo-tag">
        ${item.name}
        ${removable ? `<button type="button" data-remove-combo="${id}">×</button>` : ""}
      </span>
    `;
  }).join("");

  document.querySelectorAll("[data-remove-combo]").forEach((node) => {
    node.addEventListener("click", () => {
      detectionState.selectedIds = detectionState.selectedIds.filter((id) => id !== node.dataset.removeCombo);
      updateComboTags();
    });
  });
}

function renderUploadPreview() {
  uploadPreviewEl.innerHTML = `
    <div class="upload-thumb" style="background-image: url('${detectionState.fileUrl}');"></div>
    <div class="upload-meta">
      <strong>${detectionState.fileName}</strong>
      <span>可用于在线检测和结果导出预览</span>
    </div>
  `;
}

function buildDetectionResult() {
  const models = detectionState.selectedIds.map((id) => getAlgorithmById(id).name);
  const detections = models.map((name, index) => ({
    id: index + 1,
    model: name,
    label: index === 0 ? "异常区域" : "关联目标",
    confidence: `${(96 - index * 4.5).toFixed(1)}%`,
    detail: index === 0 ? "存在疑似缺陷，需要复核" : "识别到关联部件特征",
  }));

  return {
    success: true,
    algorithmNames: models,
    inferenceTime: `${32 + models.length * 6}ms`,
    timestamp: new Date().toISOString(),
    fileName: detectionState.fileName,
    detections,
  };
}

function renderDetectionResult() {
  if (!detectionState.result) {
    resultPreviewEl.innerHTML = `
      <div class="empty-result">
        <strong>尚未生成检测结果</strong>
        <p>上传素材后点击“开始检测”，将在此展示标注图和检测明细。</p>
      </div>
    `;
    resultMetricsEl.innerHTML = "";
    resultStatusEl.textContent = "等待检测";
    return;
  }

  resultStatusEl.textContent = "检测完成";
  resultPreviewEl.innerHTML = `
    <div class="annotated-preview">
      <img src="${detectionState.fileUrl}" alt="${detectionState.fileName}">
      ${detectionState.result.detections.map((item, index) => `
        <div class="detection-box detection-box-${index + 1}">
          <span>${item.label} ${item.confidence}</span>
        </div>
      `).join("")}
    </div>
  `;

  resultMetricsEl.innerHTML = `
    <div class="metrics-grid">
      <div class="metric-card">
        <span>检测目标数</span>
        <strong>${detectionState.result.detections.length}</strong>
      </div>
      <div class="metric-card">
        <span>推理时延</span>
        <strong>${detectionState.result.inferenceTime}</strong>
      </div>
    </div>
    <div class="result-detail-list">
      ${detectionState.result.detections.map((item) => `
        <article class="result-detail-item">
          <strong>${item.model}</strong>
          <span>${item.label}</span>
          <span>${item.confidence}</span>
          <p>${item.detail}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function getJsonPreview() {
  return JSON.stringify(detectionState.result, null, 2);
}

function getPdfPreviewMarkup() {
  return `
    <div class="pdf-preview">
      <div class="pdf-preview-head">
        <strong>检测结果报告</strong>
        <span>${selectedAlgorithm.name}</span>
      </div>
      <div class="pdf-preview-grid">
        <div>
          <span>检测文件</span>
          <strong>${detectionState.result.fileName}</strong>
        </div>
        <div>
          <span>检测算法</span>
          <strong>${detectionState.result.algorithmNames.join(" / ")}</strong>
        </div>
        <div>
          <span>推理时间</span>
          <strong>${detectionState.result.inferenceTime}</strong>
        </div>
        <div>
          <span>检测时间</span>
          <strong>${new Date(detectionState.result.timestamp).toLocaleString("zh-CN")}</strong>
        </div>
      </div>
      <div class="pdf-preview-list">
        ${detectionState.result.detections.map((item) => `
          <div class="pdf-preview-item">
            <strong>${item.model}</strong>
            <span>${item.label}</span>
            <span>${item.confidence}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

function triggerDownload() {
  const type = detectionState.exportType;
  const filename = `${selectedAlgorithm.name}-${type}-preview.${type === "json" ? "json" : "txt"}`;
  const content = type === "json" ? getJsonPreview() : exportPreviewBodyEl.innerText;
  const blob = new Blob([content], { type: type === "json" ? "application/json" : "text/plain" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function openExportPreview(type) {
  if (!detectionState.result) return;
  detectionState.exportType = type;
  document.getElementById("exportTypeLabel").textContent = type === "json" ? "JSON Preview" : "PDF Preview";
  document.getElementById("exportTitle").textContent = type === "json" ? "JSON 结果预览" : "PDF 报告预览";

  exportPreviewBodyEl.innerHTML = type === "json"
    ? `<pre class="code-preview">${getJsonPreview()}</pre>`
    : getPdfPreviewMarkup();

  downloadExportBtnEl.textContent = type === "json" ? "导出 JSON" : "导出 PDF";
  openModal("exportModal");
}

function bindEvents() {
  comboToggleEl.addEventListener("change", renderComboPanel);

  fileInputEl.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    detectionState.fileName = file.name;
    detectionState.fileUrl = URL.createObjectURL(file);
    renderUploadPreview();
  });

  runBtnEl.addEventListener("click", () => {
    detectionState.result = buildDetectionResult();
    renderDetectionResult();
    previewJsonBtnEl.disabled = false;
    previewPdfBtnEl.disabled = false;
  });

  previewJsonBtnEl.addEventListener("click", () => openExportPreview("json"));
  previewPdfBtnEl.addEventListener("click", () => openExportPreview("pdf"));
  downloadExportBtnEl.addEventListener("click", triggerDownload);
}

renderDetailHero();
renderSidebar();
renderComboPanel();
renderUploadPreview();
renderDetectionResult();
bindGlobalModalActions();
bindEvents();
