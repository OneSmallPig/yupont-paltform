const detailId = new URLSearchParams(window.location.search).get("id") || platformData.algorithms[0].id;
const selectedAlgorithm = platformData.algorithms.find((item) => item.id === detailId) || platformData.algorithms[0];

const heroEl = document.getElementById("algorithmHero");
const sidebarEl = document.getElementById("algorithmSidebar");
const uploadPanelEl = document.getElementById("uploadPanel");
const resultPreviewEl = document.getElementById("resultPreview");
const resultMetricsEl = document.getElementById("resultMetrics");
const resultStatusEl = document.getElementById("resultStatus");
const runBtnEl = document.getElementById("runDetectionBtn");
const exportPreviewBodyEl = document.getElementById("exportPreviewBody");
const exportPreviewTitleEl = document.getElementById("exportPreviewTitle");
const exportPreviewDescEl = document.getElementById("exportPreviewDesc");
const exportPreviewEyebrowEl = document.getElementById("exportPreviewEyebrow");
const exportConfirmBtnEl = document.getElementById("exportConfirmBtn");

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
  exportType: "json",
};

function isDetailFavorite() {
  const user = getCurrentUser();
  return user.loggedIn && user.favorites.includes(selectedAlgorithm.id);
}

function getFavoriteTotal() {
  return selectedAlgorithm.favorites + (isDetailFavorite() ? 1 : 0);
}

function buildTimestamp() {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date()).replace(/\//g, "-");
}

function getCurrentFileLabel() {
  return detectionState.fileName || (detectionState.uploadType === "image" ? "当前图片样例" : "待上传视频文件");
}

function renderDetailHero() {
  document.getElementById("detailBreadcrumb").textContent = selectedAlgorithm.name;

  heroEl.innerHTML = `
    <div class="algorithm-hero-strip">
      <div class="algorithm-hero-bg" aria-hidden="true">
        <span></span>
        <span></span>
      </div>
      <div class="algorithm-hero-symbol">
        <div class="algorithm-hero-icon">AI</div>
      </div>
      <div class="algorithm-hero-core">
        <div class="algorithm-hero-topline">
          <div>
            <p class="eyebrow">${selectedAlgorithm.industry}</p>
            <h1>${selectedAlgorithm.name}</h1>
          </div>
          <div class="algorithm-hero-side">
            <div class="algorithm-hero-kicker">
              <span>${selectedAlgorithm.badge}</span>
            </div>
            <button class="hero-favorite-mini ${isDetailFavorite() ? "is-active" : ""}" type="button" id="favoriteToggleBtn" aria-label="${isDetailFavorite() ? "取消收藏" : "加入收藏"}" title="${isDetailFavorite() ? "取消收藏" : "加入收藏"}">
              <span aria-hidden="true">${isDetailFavorite() ? "★" : "☆"}</span>
              <strong>${getFavoriteTotal()}</strong>
            </button>
          </div>
        </div>
        <p class="algorithm-hero-desc">${selectedAlgorithm.desc}</p>
        <div class="algorithm-hero-tag-row">
          <span class="business-tag business-tag-accent">${selectedAlgorithm.category}</span>
          <span class="business-tag">${selectedAlgorithm.scene}</span>
          <span class="business-tag">${selectedAlgorithm.stack}</span>
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
  const accept = detectionState.uploadType === "image" ? "image/*" : "video/*";

  uploadPanelEl.innerHTML = `
    <label class="upload-zone commercial-upload-zone detection-upload-zone" for="detectionFile">
      <input id="detectionFile" type="file" accept="${accept}">
      <div class="upload-preview compact-upload-preview" id="uploadPreview"></div>
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

  const hasFile = Boolean(detectionState.fileUrl);
  const previewVisual = detectionState.uploadType === "image"
    ? `<div class="upload-thumb upload-thumb-large" style="background-image: url('${hasFile ? detectionState.fileUrl : selectedAlgorithm.image}');"></div>`
    : hasFile
      ? `<video class="upload-video-preview" src="${detectionState.fileUrl}" controls muted playsinline preload="metadata"></video>`
      : `<div class="upload-video-empty">VIDEO STREAM</div>`;

  uploadPreviewEl.innerHTML = `
    <div class="upload-preview-frame">
      ${previewVisual}
    </div>
  `;
}

function buildDetectionResult() {
  const isImage = detectionState.uploadType === "image";
  const targetCount = isImage ? 2 : 3;
  const confidence = isImage ? "96.2%" : "94.8%";
  const inferenceTime = isImage ? "41ms" : "68ms";
  const label = isImage ? selectedAlgorithm.scene : "多媒体流分析";

  return {
    success: true,
    inferenceTime,
    confidence,
    targetCount,
    label,
    timestamp: buildTimestamp(),
    summary: `系统已完成本次${selectedAlgorithm.scene}样本解析，识别结果与当前业务场景匹配，可直接用于演示汇报与后续资料导出。`,
    detections: [
      { name: label, confidence, region: "主检测区域" },
      { name: selectedAlgorithm.category, confidence: isImage ? "93.4%" : "92.1%", region: "辅助识别区域" },
      ...(isImage ? [] : [{ name: "时序风险片段", confidence: "91.6%", region: "视频关键帧" }]),
    ],
    insights: [
      `本次样本共识别 ${targetCount} 个重点目标，模型输出稳定。`,
      `主类别置信度达到 ${confidence}，满足演示与业务汇报场景展示要求。`,
      `算法架构为 ${selectedAlgorithm.stack}，适合在 ${selectedAlgorithm.industry} 场景中延展部署。`,
    ],
    actions: [
      "建议保留当前样本作为方案演示案例。",
      "可继续补充不同场景样本进行对比验证。",
      "支持导出 JSON 与 PDF 用于汇报或归档。",
    ],
  };
}

function buildExportPayload() {
  if (!detectionState.result) return null;

  return {
    algorithm: {
      id: selectedAlgorithm.id,
      name: selectedAlgorithm.name,
      industry: selectedAlgorithm.industry,
      category: selectedAlgorithm.category,
      scene: selectedAlgorithm.scene,
      stack: selectedAlgorithm.stack,
    },
    input: {
      type: detectionState.uploadType,
      fileName: getCurrentFileLabel(),
      source: detectionState.fileUrl || "default-preview",
    },
    output: {
      success: detectionState.result.success,
      inferenceTime: detectionState.result.inferenceTime,
      confidence: detectionState.result.confidence,
      targetCount: detectionState.result.targetCount,
      label: detectionState.result.label,
      timestamp: detectionState.result.timestamp,
      detections: detectionState.result.detections,
      insights: detectionState.result.insights,
      actions: detectionState.result.actions,
    },
  };
}

function renderDetectionResult() {
  if (!detectionState.result) {
    resultPreviewEl.innerHTML = `
      <div class="empty-result slim-empty-result">
        <div class="result-empty-copy">
          <strong>等待检测</strong>
          <span>上传素材并开始检测后，这里会展示识别预览。</span>
        </div>
      </div>
    `;
    resultMetricsEl.innerHTML = `
      <div class="result-report-panel result-report-empty">
        <div class="result-report-head">
          <div>
            <p class="eyebrow">Analysis Report</p>
            <h4>检测解析报告</h4>
          </div>
          <span class="result-report-state">待生成</span>
        </div>
        <p class="result-report-summary">完成检测后，将在这里生成整块报告式解析内容，并支持 JSON 与 PDF 预览导出。</p>
      </div>
    `;
    resultStatusEl.textContent = "等待检测";
    return;
  }

  resultStatusEl.textContent = "检测完成";
  const previewMarkup = detectionState.uploadType === "image"
    ? `<img src="${detectionState.fileUrl || selectedAlgorithm.image}" alt="${getCurrentFileLabel()}">`
    : detectionState.fileUrl
      ? `<video src="${detectionState.fileUrl}" controls muted playsinline preload="metadata"></video>`
      : `<div class="stream-preview-card"><div class="upload-video-empty">VIDEO STREAM</div><strong>${getCurrentFileLabel()}</strong></div>`;

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
    <div class="result-report-panel">
      <div class="result-report-head">
        <div>
          <p class="eyebrow">Analysis Report</p>
          <h4>检测解析报告</h4>
        </div>
        <span class="result-report-state">已生成</span>
      </div>
      <p class="result-report-summary">${detectionState.result.summary}</p>
      <div class="result-report-stats">
        <div data-label="识别目标">
          <span>识别目标</span>
          <strong>${detectionState.result.targetCount}</strong>
        </div>
        <div data-label="推理时延">
          <span>推理时延</span>
          <strong>${detectionState.result.inferenceTime}</strong>
        </div>
        <div data-label="置信度">
          <span>置信度</span>
          <strong>${detectionState.result.confidence}</strong>
        </div>
        <div data-label="检测时间">
          <span>检测时间</span>
          <strong>${detectionState.result.timestamp}</strong>
        </div>
      </div>
      <div class="result-report-section">
        <h5>识别对象</h5>
        <div class="report-line-list">
          ${detectionState.result.detections.map((item) => `
            <div class="report-line-item">
              <strong>${item.name}</strong>
              <span>${item.region}</span>
              <em>${item.confidence}</em>
            </div>
          `).join("")}
        </div>
      </div>
      <div class="result-report-section">
        <h5>解析结论</h5>
        <div class="report-bullet-list">
          ${detectionState.result.insights.map((item) => `<p>${item}</p>`).join("")}
        </div>
      </div>
      <div class="result-report-section">
        <h5>建议动作</h5>
        <div class="report-bullet-list">
          ${detectionState.result.actions.map((item) => `<p>${item}</p>`).join("")}
        </div>
      </div>
      <div class="result-export-row">
        <button class="ghost-btn result-export-btn" type="button" data-export-type="json">预览 JSON</button>
        <button class="ghost-btn result-export-btn" type="button" data-export-type="pdf">预览 PDF</button>
      </div>
    </div>
  `;
}

function renderExportPreview(type) {
  const payload = buildExportPayload();
  if (!payload) return;

  detectionState.exportType = type;
  exportPreviewEyebrowEl.textContent = type === "json" ? "JSON Preview" : "PDF Preview";
  exportPreviewTitleEl.textContent = type === "json" ? "JSON 导出预览" : "PDF 导出预览";
  exportPreviewDescEl.textContent = type === "json"
    ? "用于系统对接、结果留存与结构化归档。"
    : "用于演示汇报、方案留档与业务输出。";
  exportConfirmBtnEl.textContent = type === "json" ? "导出 JSON" : "导出 PDF";

  if (type === "json") {
    exportPreviewBodyEl.innerHTML = `
      <pre class="code-preview export-code-preview">${JSON.stringify(payload, null, 2)}</pre>
    `;
  } else {
    exportPreviewBodyEl.innerHTML = `
      <div class="pdf-preview export-sheet-preview">
        <div class="export-sheet-head">
          <div>
            <p class="eyebrow">Vision Detection Report</p>
            <h4>${selectedAlgorithm.name}</h4>
          </div>
          <span>${detectionState.result.timestamp}</span>
        </div>
        <div class="export-sheet-grid">
          <div data-label="算法行业"><span>算法行业</span><strong>${selectedAlgorithm.industry}</strong></div>
          <div data-label="模型架构"><span>模型架构</span><strong>${selectedAlgorithm.stack}</strong></div>
          <div data-label="检测目标"><span>检测目标</span><strong>${detectionState.result.targetCount}</strong></div>
          <div data-label="置信度"><span>置信度</span><strong>${detectionState.result.confidence}</strong></div>
        </div>
        <div class="export-sheet-section">
          <h5>检测摘要</h5>
          <p>${detectionState.result.summary}</p>
        </div>
        <div class="export-sheet-section">
          <h5>识别对象</h5>
          ${detectionState.result.detections.map((item) => `
            <div class="export-sheet-line">
              <strong>${item.name}</strong>
              <span>${item.region}</span>
              <em>${item.confidence}</em>
            </div>
          `).join("")}
        </div>
      </div>
    `;
  }

  openModal("exportPreviewModal");
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

function pdfEscape(value) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function asciiSafe(value) {
  return value.replace(/[^\x20-\x7E]/g, " ").replace(/\s+/g, " ").trim();
}

function buildSimplePdf(text) {
  const lines = text.split("\n").map((line) => asciiSafe(line)).filter(Boolean);
  const content = [
    "BT",
    "/F1 12 Tf",
    "50 780 Td",
    ...lines.map((line, index) => `${index === 0 ? "" : "T* " }(${pdfEscape(line)}) Tj`.trim()),
    "ET",
  ].join("\n");

  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>",
    `<< /Length ${content.length} >>\nstream\n${content}\nendstream`,
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
  ];

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(pdf.length);
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefStart = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return pdf;
}

function exportCurrentResult() {
  const payload = buildExportPayload();
  if (!payload) return;

  const baseName = `${selectedAlgorithm.id}-${Date.now()}`;
  if (detectionState.exportType === "json") {
    downloadBlob(`${baseName}.json`, JSON.stringify(payload, null, 2), "application/json");
    return;
  }

  const pdfText = [
    "VISION DETECTION REPORT",
    `Algorithm ID: ${selectedAlgorithm.id}`,
    `Industry: ${asciiSafe(selectedAlgorithm.industry)}`,
    `Model Stack: ${asciiSafe(selectedAlgorithm.stack)}`,
    `Target Count: ${detectionState.result.targetCount}`,
    `Confidence: ${detectionState.result.confidence}`,
    `Latency: ${detectionState.result.inferenceTime}`,
    `Generated At: ${asciiSafe(detectionState.result.timestamp)}`,
  ].join("\n");
  downloadBlob(`${baseName}.pdf`, buildSimplePdf(pdfText), "application/pdf");
}

function bindUploadTabs() {
  document.querySelectorAll("[data-upload-tab]").forEach((node) => {
    node.addEventListener("click", () => {
      detectionState.uploadType = node.dataset.uploadTab;
      detectionState.fileName = detectionState.uploadType === "image" ? `${selectedAlgorithm.scene}-样例.jpg` : "";
      detectionState.fileUrl = detectionState.uploadType === "image" ? selectedAlgorithm.image : "";
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

  resultMetricsEl.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-export-type]");
    if (!trigger || !detectionState.result) return;
    renderExportPreview(trigger.dataset.exportType);
  });

  exportConfirmBtnEl.addEventListener("click", () => {
    exportCurrentResult();
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
