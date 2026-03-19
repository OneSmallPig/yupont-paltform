const detailId = new URLSearchParams(window.location.search).get("id") || platformData.algorithms[0].id;
const selectedAlgorithm = platformData.algorithms.find((item) => item.id === detailId) || platformData.algorithms[0];

const heroEl = document.getElementById("algorithmHero");
const sidebarEl = document.getElementById("algorithmSidebar");
const uploadPanelEl = document.getElementById("uploadPanel");
const resultPreviewEl = document.getElementById("resultPreview");
const resultMetricsEl = document.getElementById("resultMetrics");
const resultStatusEl = document.getElementById("resultStatus");
const runBtnEl = document.getElementById("runDetectionBtn");

const detailSections = [
  { label: "算法信息", value: selectedAlgorithm.category },
  { label: "所属行业", value: selectedAlgorithm.industry },
  { label: "核心场景", value: selectedAlgorithm.scene },
  { label: "模型架构", value: selectedAlgorithm.stack },
  { label: "热度收藏", value: `${selectedAlgorithm.favorites}` },
  { label: "测试次数", value: `${selectedAlgorithm.tests}` },
];

const detectionState = {
  uploadType: "image",
  fileName: `${selectedAlgorithm.scene}-样例.jpg`,
  fileUrl: selectedAlgorithm.image,
  result: null,
};

function isDetailFavorite() {
  const user = getCurrentUser();
  return user.loggedIn && user.favorites.includes(selectedAlgorithm.id);
}

function getFavoriteTotal() {
  return selectedAlgorithm.favorites + (isDetailFavorite() ? 1 : 0);
}

function getHeroMetrics() {
  return [
    selectedAlgorithm.metric,
    selectedAlgorithm.category,
    `${getFavoriteTotal()} 收藏`,
    `${selectedAlgorithm.tests} 次检测`,
  ];
}

function renderDetailHero() {
  document.getElementById("detailBreadcrumb").textContent = selectedAlgorithm.name;

  heroEl.innerHTML = `
    <div class="algorithm-hero-strip">
      <div class="algorithm-hero-symbol">
        <div class="algorithm-hero-icon">AI</div>
      </div>
      <div class="algorithm-hero-core">
        <div class="algorithm-hero-topline">
          <div>
            <p class="eyebrow">${selectedAlgorithm.industry}</p>
            <h1>${selectedAlgorithm.name}</h1>
          </div>
          <button class="favorite-icon-btn ${isDetailFavorite() ? "is-active" : ""}" type="button" id="favoriteToggleBtn" aria-label="${isDetailFavorite() ? "取消收藏" : "加入收藏"}" title="${isDetailFavorite() ? "取消收藏" : "加入收藏"}">
            <span aria-hidden="true">${isDetailFavorite() ? "★" : "☆"}</span>
          </button>
        </div>
        <p class="algorithm-hero-desc">${selectedAlgorithm.desc}</p>
        <div class="algorithm-hero-tag-row">
          <span class="business-tag business-tag-accent">${selectedAlgorithm.badge}</span>
          <span class="business-tag">${selectedAlgorithm.scene}</span>
          <span class="business-tag">${selectedAlgorithm.stack}</span>
        </div>
        <div class="algorithm-hero-metrics">
          ${getHeroMetrics().map((item) => `<span class="metric-pill">${item}</span>`).join("")}
        </div>
      </div>
    </div>
  `;

  document.getElementById("favoriteToggleBtn")?.addEventListener("click", () => {
    const result = toggleFavoriteAlgorithm(selectedAlgorithm.id);
    if (result === null) return;
    renderDetailHero();
    renderSidebar();
  });
}

function renderSidebar() {
  sidebarEl.innerHTML = `
    <section class="section-card sidebar-panel slim-sidebar-panel">
      <p class="eyebrow">Quick Guide</p>
      <h3>详情导览</h3>
      <div class="sidebar-spec-list compact-spec-list">
        ${detailSections.map((item) => `
          <div class="spec-row">
            <span>${item.label}</span>
            <strong>${item.label === "热度收藏" ? getFavoriteTotal() : item.value}</strong>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderUploadPanel() {
  const isImage = detectionState.uploadType === "image";
  const accept = isImage ? "image/*" : "video/*";
  const title = isImage ? "上传图片素材" : "上传多媒体流";
  const hint = isImage ? "支持 JPG、PNG、JPEG" : "支持 MP4、MOV、AVI";

  uploadPanelEl.innerHTML = `
    <label class="upload-zone commercial-upload-zone" for="detectionFile">
      <input id="detectionFile" type="file" accept="${accept}">
      <div class="upload-zone-copy compact-upload-copy">
        <strong>${title}</strong>
        <span>${hint}</span>
      </div>
      <div class="upload-preview" id="uploadPreview"></div>
    </label>
  `;

  renderUploadPreview();

  document.getElementById("detectionFile")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    detectionState.fileName = file.name;
    detectionState.fileUrl = URL.createObjectURL(file);
    renderUploadPreview();
  });
}

function renderUploadPreview() {
  const uploadPreviewEl = document.getElementById("uploadPreview");
  if (!uploadPreviewEl) return;

  const previewVisual = detectionState.uploadType === "image"
    ? `<div class="upload-thumb" style="background-image: url('${detectionState.fileUrl}');"></div>`
    : `<div class="upload-media-badge">STREAM</div>`;

  uploadPreviewEl.innerHTML = `
    ${previewVisual}
    <div class="upload-meta">
      <strong>${detectionState.fileName}</strong>
      <span>${detectionState.uploadType === "image" ? "图片检测输入" : "多媒体流检测输入"}</span>
    </div>
  `;
}

function buildDetectionResult() {
  const baseLabel = detectionState.uploadType === "image" ? selectedAlgorithm.scene : "多媒体流分析";
  const detectionCount = detectionState.uploadType === "image" ? 2 : 3;

  return {
    success: true,
    inferenceTime: `${detectionState.uploadType === "image" ? 41 : 68}ms`,
    confidence: detectionState.uploadType === "image" ? "96.2%" : "94.8%",
    targetCount: detectionCount,
    label: baseLabel,
  };
}

function renderDetectionResult() {
  if (!detectionState.result) {
    resultPreviewEl.innerHTML = `
      <div class="empty-result slim-empty-result">
        <strong>等待检测</strong>
      </div>
    `;
    resultMetricsEl.innerHTML = `
      <div class="metrics-grid compact-metrics-grid">
        <div class="metric-card">
          <span>检测目标数</span>
          <strong>--</strong>
        </div>
        <div class="metric-card">
          <span>推理时延</span>
          <strong>--</strong>
        </div>
        <div class="metric-card">
          <span>检测置信度</span>
          <strong>--</strong>
        </div>
        <div class="metric-card">
          <span>识别类别</span>
          <strong>--</strong>
        </div>
      </div>
    `;
    resultStatusEl.textContent = "等待检测";
    return;
  }

  resultStatusEl.textContent = "检测完成";
  const previewMarkup = detectionState.uploadType === "image"
    ? `<img src="${detectionState.fileUrl}" alt="${detectionState.fileName}">`
    : `
      <div class="stream-preview-card">
        <div class="upload-media-badge">STREAM</div>
        <strong>${detectionState.fileName}</strong>
      </div>
    `;

  resultPreviewEl.innerHTML = `
    <div class="annotated-preview compact-annotated-preview">
      ${previewMarkup}
      <div class="detection-box detection-box-1">
        <span>${detectionState.result.label}</span>
      </div>
      <div class="detection-box detection-box-2">
        <span>${detectionState.result.confidence}</span>
      </div>
    </div>
  `;

  resultMetricsEl.innerHTML = `
    <div class="metrics-grid compact-metrics-grid">
      <div class="metric-card">
        <span>检测目标数</span>
        <strong>${detectionState.result.targetCount}</strong>
      </div>
      <div class="metric-card">
        <span>推理时延</span>
        <strong>${detectionState.result.inferenceTime}</strong>
      </div>
      <div class="metric-card">
        <span>检测置信度</span>
        <strong>${detectionState.result.confidence}</strong>
      </div>
      <div class="metric-card">
        <span>识别类别</span>
        <strong>${detectionState.result.label}</strong>
      </div>
    </div>
  `;
}

function bindUploadTabs() {
  document.querySelectorAll("[data-upload-tab]").forEach((node) => {
    node.addEventListener("click", () => {
      detectionState.uploadType = node.dataset.uploadTab;
      detectionState.fileName = detectionState.uploadType === "image"
        ? `${selectedAlgorithm.scene}-样例.jpg`
        : `${selectedAlgorithm.scene}-视频流.mp4`;
      detectionState.fileUrl = selectedAlgorithm.image;
      document.querySelectorAll("[data-upload-tab]").forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.uploadTab === detectionState.uploadType);
      });
      renderUploadPanel();
    });
  });
}

function bindEvents() {
  runBtnEl.addEventListener("click", () => {
    detectionState.result = buildDetectionResult();
    renderDetectionResult();
  });

  window.addEventListener("vision-user-updated", () => {
    renderDetailHero();
    renderSidebar();
  });
}

renderDetailHero();
renderSidebar();
renderUploadPanel();
renderDetectionResult();
bindUploadTabs();
bindEvents();
