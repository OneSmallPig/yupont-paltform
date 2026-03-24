const comboCategoryTabsEl = document.getElementById("comboCategoryTabs");
const comboSearchInputEl = document.getElementById("comboSearchInput");
const comboSelectedSummaryEl = document.getElementById("comboSelectedSummary");
const comboAlgorithmListEl = document.getElementById("comboAlgorithmList");
const comboWorkbenchSummaryEl = document.getElementById("comboWorkbenchSummary");
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

const comboCategories = ["全部算法", ...new Set(platformData.algorithms.map((item) => item.category))];

function getDefaultImageFiles() {
  return [{
    name: "多算法组合样例.jpg",
    url: "./多算法组合.png",
    isDefault: true,
  }];
}

const comboState = {
  selectedIds: platformData.algorithms.slice(0, 2).map((item) => item.id),
  category: "全部算法",
  keyword: "",
  uploadType: "image",
  imageFiles: getDefaultImageFiles(),
  fileName: "",
  fileUrl: "",
  result: null,
  exportType: "json",
};

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

function getSelectedAlgorithms() {
  return comboState.selectedIds
    .map((id) => platformData.algorithms.find((item) => item.id === id))
    .filter(Boolean);
}

function getPreviewFallback() {
  return getSelectedAlgorithms()[0]?.image || "./多算法组合.png";
}

function revokeMediaFileUrl() {
  if (comboState.fileUrl && comboState.fileUrl.startsWith("blob:")) {
    URL.revokeObjectURL(comboState.fileUrl);
  }
}

function revokeImageFiles(files) {
  files.forEach((file) => {
    if (file.url?.startsWith("blob:")) {
      URL.revokeObjectURL(file.url);
    }
  });
}

function resetImageFiles() {
  revokeImageFiles(comboState.imageFiles);
  comboState.imageFiles = getDefaultImageFiles();
}

function getCurrentImageFiles() {
  return comboState.imageFiles.length ? comboState.imageFiles : getDefaultImageFiles();
}

function getCurrentFileLabel() {
  if (comboState.uploadType === "image") {
    const files = getCurrentImageFiles();
    return files.length > 1 ? `已上传 ${files.length} 张图片` : files[0].name;
  }

  return comboState.fileName || "待上传视频文件";
}

function getFilteredAlgorithms() {
  const keyword = comboState.keyword.trim().toLowerCase();

  return platformData.algorithms.filter((item) => {
    const categoryOk = comboState.category === "全部算法" || item.category === comboState.category;
    if (!categoryOk) return false;
    if (!keyword) return true;

    return [
      item.name,
      item.subtitle,
      item.industry,
      item.scene,
      item.category,
      item.desc,
      item.businessDesc,
    ].join(" ").toLowerCase().includes(keyword);
  });
}

function renderCategoryTabs() {
  comboCategoryTabsEl.innerHTML = comboCategories.map((item) => `
    <button class="market-filter-chip market-filter-chip-soft ${comboState.category === item ? "active" : ""}" type="button" data-combo-category="${item}">${item}</button>
  `).join("");
}

function renderSelectedSummary() {
  const selected = getSelectedAlgorithms();

  comboSelectedSummaryEl.innerHTML = `
    <div class="combo-selected-head">
      <strong>已选组合</strong>
      <button class="ghost-btn combo-clear-btn" type="button" id="clearComboSelection">清空选择</button>
    </div>
    <div class="combo-selected-tags">
      ${selected.length ? selected.map((item) => `
        <span class="combo-selected-tag">
          <em>${item.name}</em>
          <button type="button" data-remove-combo="${item.id}" aria-label="移除${item.name}">×</button>
        </span>
      `).join("") : `<span class="combo-selected-empty">当前还未选择算法。</span>`}
    </div>
  `;
}

function renderAlgorithmList() {
  const list = getFilteredAlgorithms();

  comboAlgorithmListEl.innerHTML = list.length ? list.map((item) => {
    const selected = comboState.selectedIds.includes(item.id);
    return `
      <article class="combo-algorithm-row ${selected ? "is-selected" : ""}">
        <div class="combo-algorithm-row-main">
          <div class="combo-algorithm-row-head">
            <h4>${item.name}</h4>
            <div class="combo-algorithm-inline-tags">
              <span class="sharp-featured-type">${item.category}</span>
              <span class="business-tag">${item.scene}</span>
            </div>
          </div>
          <p>${item.industry}</p>
        </div>
        <div class="combo-algorithm-actions">
          <button class="${selected ? "ghost-btn" : "primary-btn"} combo-pick-btn" type="button" data-toggle-combo="${item.id}">
            ${selected ? "移除" : "添加"}
          </button>
        </div>
      </article>
    `;
  }).join("") : `
    <div class="combo-algorithm-empty">
      <strong>没有匹配到算法</strong>
      <span>可尝试切换分类或清空关键词后重新筛选。</span>
    </div>
  `;
}

function renderWorkbenchSummary() {
  const selected = getSelectedAlgorithms();

  comboWorkbenchSummaryEl.innerHTML = `
    <div class="combo-workbench-head">
      <strong>本次参与检测的算法</strong>
    </div>
    <div class="combo-workbench-tags">
      ${selected.length ? selected.map((item) => `<span class="combo-workbench-tag">${item.name}</span>`).join("") : `<span class="combo-workbench-empty">请先在左侧选择算法</span>`}
    </div>
  `;
}

function renderSelectionViews() {
  renderSelectedSummary();
  renderAlgorithmList();
  renderWorkbenchSummary();
}

function renderUploadPanel() {
  const accept = comboState.uploadType === "image" ? "image/*" : "video/*";
  const multiple = comboState.uploadType === "image" ? "multiple" : "";
  const uploadHint = comboState.uploadType === "image"
    ? "支持一次上传多张图片进行组合检测"
    : "上传单个视频文件或媒体流进行联合分析";

  uploadPanelEl.innerHTML = `
    <label class="upload-zone commercial-upload-zone detection-upload-zone" for="comboDetectionFile">
      <input id="comboDetectionFile" type="file" accept="${accept}" ${multiple}>
      <div class="upload-preview compact-upload-preview" id="uploadPreview"></div>
    </label>
    <p class="combo-upload-hint">${uploadHint}</p>
  `;

  renderUploadPreview();

  document.getElementById("comboDetectionFile")?.addEventListener("change", (event) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    comboState.result = null;

    if (comboState.uploadType === "image") {
      revokeImageFiles(comboState.imageFiles);
      comboState.imageFiles = files.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        isDefault: false,
      }));
      renderDetectionResult();
      renderUploadPreview();
      return;
    }

    revokeMediaFileUrl();
    comboState.fileName = files[0].name;
    comboState.fileUrl = URL.createObjectURL(files[0]);
    renderDetectionResult();
    renderUploadPreview();
  });
}

function renderUploadPreview() {
  const uploadPreviewEl = document.getElementById("uploadPreview");
  if (!uploadPreviewEl) return;

  if (comboState.uploadType === "image") {
    const files = getCurrentImageFiles();
    const previewVisual = files.length === 1
      ? `<div class="upload-thumb upload-thumb-large" style="background-image: url('${files[0].url || getPreviewFallback()}');"></div>`
      : `
        <div class="combo-upload-grid">
          ${files.map((file, index) => `
            <div class="combo-upload-card">
              <div class="combo-upload-card-cover" style="background-image: url('${file.url}');"></div>
              <div class="combo-upload-card-meta">
                <strong>图片 ${index + 1}</strong>
                <span>${file.name}</span>
              </div>
            </div>
          `).join("")}
        </div>
      `;

    uploadPreviewEl.innerHTML = `
      <div class="upload-preview-frame ${files.length > 1 ? "is-multi" : ""}">
        ${previewVisual}
      </div>
    `;
    return;
  }

  const hasFile = Boolean(comboState.fileUrl);
  const previewVisual = hasFile
      ? `<video class="upload-video-preview" src="${comboState.fileUrl}" controls muted playsinline preload="metadata"></video>`
      : `<div class="upload-video-empty">VIDEO STREAM</div>`;

  uploadPreviewEl.innerHTML = `
    <div class="upload-preview-frame">
      ${previewVisual}
    </div>
  `;
}

function buildDetectionResult() {
  const selected = getSelectedAlgorithms();
  if (selected.length < 2) return null;

  const isImage = comboState.uploadType === "image";
  const imageCount = isImage ? getCurrentImageFiles().length : 1;
  const totalTargets = isImage ? selected.length + imageCount : selected.length + 2;
  const summaryNames = selected.map((item) => item.name).join("、");

  return {
    success: true,
    inferenceTime: isImage ? `${46 + selected.length * 11 + imageCount * 9}ms` : `${78 + selected.length * 13}ms`,
    confidence: isImage ? "95.6%" : "93.9%",
    targetCount: totalTargets,
    label: isImage ? "组合检测区域" : "多媒体联合分析",
    timestamp: buildTimestamp(),
    summary: isImage
      ? `系统已完成 ${imageCount} 张图片的 ${summaryNames} 组合检测解析，当前结果适合用于多算法协同演示、批量样本联合识别验证与结果汇报导出。`
      : `系统已完成 ${summaryNames} 的组合检测解析，当前结果适合用于多算法协同演示、联合识别验证与结果汇报导出。`,
    detections: selected.map((item, index) => ({
      name: item.scene,
      confidence: `${94 - index * 0.6}%`,
      region: `联合检测区域 ${index + 1}`,
    })).concat(isImage ? [
      { name: "综合风险汇总", confidence: "91.8%", region: "组合结论区域" },
    ] : [
      { name: "时序异常片段", confidence: "92.4%", region: "关键帧链路" },
      { name: "综合风险汇总", confidence: "90.9%", region: "组合结论区域" },
    ]),
    insights: [
      `本次组合同时调用 ${selected.length} 个算法模块，覆盖 ${[...new Set(selected.map((item) => item.industry))].length} 类业务场景。`,
      isImage ? `当前批次共上传 ${imageCount} 张图片，适合做多样本对比演示与联合识别验证。` : "当前上传素材与所选算法场景匹配度较高，组合检测输出稳定，适合方案演示和能力说明。",
      `组合链路可继续扩展到更多算法，适用于多目标识别、联合告警和复杂场景分析。`,
    ],
    actions: [
      "建议保留本次组合方案用于项目演示和能力汇报。",
      isImage ? "可继续追加更多图片样本进行批量横向对比验证。" : "可追加不同工况样本进行横向对比验证。",
      "支持导出 JSON 与 PDF 用于归档、汇报或对接。",
    ],
  };
}

function buildExportPayload() {
  if (!comboState.result) return null;

  return {
    algorithms: getSelectedAlgorithms().map((item) => ({
      id: item.id,
      name: item.name,
      industry: item.industry,
      category: item.category,
      scene: item.scene,
      stack: item.stack,
    })),
    input: {
      type: comboState.uploadType,
      fileName: getCurrentFileLabel(),
      files: comboState.uploadType === "image"
        ? getCurrentImageFiles().map((file) => file.name)
        : [getCurrentFileLabel()],
      source: comboState.uploadType === "image"
        ? getCurrentImageFiles().map((file) => file.url)
        : (comboState.fileUrl || "combo-default-preview"),
    },
    output: {
      success: comboState.result.success,
      inferenceTime: comboState.result.inferenceTime,
      confidence: comboState.result.confidence,
      targetCount: comboState.result.targetCount,
      label: comboState.result.label,
      timestamp: comboState.result.timestamp,
      detections: comboState.result.detections,
      insights: comboState.result.insights,
      actions: comboState.result.actions,
    },
  };
}

function renderDetectionResult() {
  if (!comboState.result) {
    resultPreviewEl.innerHTML = `
      <div class="empty-result slim-empty-result">
        <div class="result-empty-copy">
          <strong>等待组合检测</strong>
          <span>选择算法、上传素材并开始检测后，这里会展示联合识别预览。</span>
        </div>
      </div>
    `;
    resultMetricsEl.innerHTML = `
      <div class="result-report-panel result-report-empty">
        <div class="result-report-head">
          <div>
            <p class="eyebrow">Analysis Report</p>
            <h4>组合检测解析报告</h4>
          </div>
          <span class="result-report-state">待生成</span>
        </div>
        <p class="result-report-summary">完成组合检测后，将在这里生成整块报告式解析内容，并支持 JSON 与 PDF 预览导出。</p>
      </div>
    `;
    resultStatusEl.textContent = "等待检测";
    return;
  }

  resultStatusEl.textContent = "检测完成";
  const showBatchBoxes = comboState.uploadType !== "image" || getCurrentImageFiles().length === 1;
  const previewMarkup = comboState.uploadType === "image"
    ? `
      <div class="combo-batch-preview ${getCurrentImageFiles().length > 1 ? "is-grid" : ""}">
        ${getCurrentImageFiles().map((file, index) => `
          <div class="combo-batch-item">
            <img src="${file.url || getPreviewFallback()}" alt="${file.name}">
            <span>样本 ${index + 1}</span>
          </div>
        `).join("")}
      </div>
    `
    : comboState.fileUrl
      ? `<video src="${comboState.fileUrl}" controls muted playsinline preload="metadata"></video>`
      : `<div class="stream-preview-card"><div class="upload-video-empty">VIDEO STREAM</div><strong>${getCurrentFileLabel()}</strong></div>`;

  resultPreviewEl.innerHTML = `
    <div class="annotated-preview compact-annotated-preview">
      ${previewMarkup}
      ${showBatchBoxes ? `
        <div class="detection-box detection-box-1">
          <span>${comboState.result.label}</span>
        </div>
        <div class="detection-box detection-box-2">
          <span>${comboState.result.confidence}</span>
        </div>
      ` : ""}
    </div>
  `;

  resultMetricsEl.innerHTML = `
    <div class="result-report-panel">
      <div class="result-report-head">
        <div>
          <p class="eyebrow">Analysis Report</p>
          <h4>组合检测解析报告</h4>
        </div>
        <span class="result-report-state">已生成</span>
      </div>
      <p class="result-report-summary">${comboState.result.summary}</p>
      <div class="result-report-stats">
        <div data-label="参与算法">
          <span>参与算法</span>
          <strong>${getSelectedAlgorithms().length}</strong>
        </div>
        <div data-label="输入样本">
          <span>输入样本</span>
          <strong>${comboState.uploadType === "image" ? getCurrentImageFiles().length : 1}</strong>
        </div>
        <div data-label="推理时延">
          <span>推理时延</span>
          <strong>${comboState.result.inferenceTime}</strong>
        </div>
        <div data-label="检测时间">
          <span>检测时间</span>
          <strong>${comboState.result.timestamp}</strong>
        </div>
        <div data-label="识别目标">
          <span>识别目标</span>
          <strong>${comboState.result.targetCount}</strong>
        </div>
      </div>
      <div class="result-report-section">
        <h5>识别对象</h5>
        <div class="report-line-list">
          ${comboState.result.detections.map((item) => `
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
          ${comboState.result.insights.map((item) => `<p>${item}</p>`).join("")}
        </div>
      </div>
      <div class="result-report-section">
        <h5>建议动作</h5>
        <div class="report-bullet-list">
          ${comboState.result.actions.map((item) => `<p>${item}</p>`).join("")}
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

  comboState.exportType = type;
  exportPreviewEyebrowEl.textContent = type === "json" ? "JSON Preview" : "PDF Preview";
  exportPreviewTitleEl.textContent = type === "json" ? "JSON 导出预览" : "PDF 导出预览";
  exportPreviewDescEl.textContent = type === "json"
    ? "用于系统对接、联合检测结果留存与结构化归档。"
    : "用于组合演示汇报、方案留档与项目输出。";
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
            <p class="eyebrow">Multi Algorithm Report</p>
            <h4>多算法组合检测</h4>
          </div>
          <span>${comboState.result.timestamp}</span>
        </div>
        <div class="export-sheet-grid">
          <div data-label="参与算法"><span>参与算法</span><strong>${getSelectedAlgorithms().length}</strong></div>
          <div data-label="覆盖行业"><span>覆盖行业</span><strong>${[...new Set(getSelectedAlgorithms().map((item) => item.industry))].length}</strong></div>
          <div data-label="检测目标"><span>检测目标</span><strong>${comboState.result.targetCount}</strong></div>
          <div data-label="置信度"><span>置信度</span><strong>${comboState.result.confidence}</strong></div>
        </div>
        <div class="export-sheet-section">
          <h5>参与算法</h5>
          ${getSelectedAlgorithms().map((item) => `
            <div class="export-sheet-line">
              <strong>${item.name}</strong>
              <span>${item.industry}</span>
              <em>${item.scene}</em>
            </div>
          `).join("")}
        </div>
        <div class="export-sheet-section">
          <h5>检测摘要</h5>
          <p>${comboState.result.summary}</p>
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

  const baseName = `combo-detect-${Date.now()}`;
  if (comboState.exportType === "json") {
    downloadBlob(`${baseName}.json`, JSON.stringify(payload, null, 2), "application/json");
    return;
  }

  const pdfText = [
    "MULTI ALGORITHM DETECTION REPORT",
    `Algorithms: ${asciiSafe(getSelectedAlgorithms().map((item) => item.name).join(", "))}`,
    `Target Count: ${comboState.result.targetCount}`,
    `Confidence: ${comboState.result.confidence}`,
    `Latency: ${comboState.result.inferenceTime}`,
    `Generated At: ${asciiSafe(comboState.result.timestamp)}`,
  ].join("\n");
  downloadBlob(`${baseName}.pdf`, buildSimplePdf(pdfText), "application/pdf");
}

function toggleAlgorithmSelection(id) {
  comboState.selectedIds = comboState.selectedIds.includes(id)
    ? comboState.selectedIds.filter((item) => item !== id)
    : [...comboState.selectedIds, id];

  comboState.result = null;
  renderSelectionViews();
  renderDetectionResult();
}

function bindCategoryTabs() {
  comboCategoryTabsEl.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-combo-category]");
    if (!trigger) return;
    comboState.category = trigger.dataset.comboCategory;
    renderCategoryTabs();
    renderAlgorithmList();
  });
}

function bindSelectionActions() {
  comboSelectedSummaryEl.addEventListener("click", (event) => {
    const removeTrigger = event.target.closest("[data-remove-combo]");
    if (removeTrigger) {
      toggleAlgorithmSelection(removeTrigger.dataset.removeCombo);
      return;
    }

    if (event.target.id === "clearComboSelection") {
      comboState.selectedIds = [];
      comboState.result = null;
      renderSelectionViews();
      renderDetectionResult();
    }
  });

  comboAlgorithmListEl.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-toggle-combo]");
    if (!trigger) return;
    toggleAlgorithmSelection(trigger.dataset.toggleCombo);
  });
}

function bindUploadTabs() {
  document.querySelectorAll("[data-upload-tab]").forEach((node) => {
    node.addEventListener("click", () => {
      revokeMediaFileUrl();
      comboState.uploadType = node.dataset.uploadTab;
      if (comboState.uploadType === "image") {
        resetImageFiles();
        comboState.fileName = "";
        comboState.fileUrl = "";
      } else {
        revokeImageFiles(comboState.imageFiles);
        comboState.imageFiles = [];
        comboState.fileName = "";
        comboState.fileUrl = "";
      }
      document.querySelectorAll("[data-upload-tab]").forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.uploadTab === comboState.uploadType);
      });
      comboState.result = null;
      renderDetectionResult();
      renderUploadPanel();
    });
  });
}

function bindEvents() {
  comboSearchInputEl.addEventListener("input", () => {
    comboState.keyword = comboSearchInputEl.value;
    renderAlgorithmList();
  });

  bindCategoryTabs();
  bindSelectionActions();
  bindUploadTabs();

  runBtnEl.addEventListener("click", () => {
    if (getSelectedAlgorithms().length < 2) {
      return;
    }
    comboState.result = buildDetectionResult();
    renderDetectionResult();
  });

  resultMetricsEl.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-export-type]");
    if (!trigger || !comboState.result) return;
    renderExportPreview(trigger.dataset.exportType);
  });

  exportConfirmBtnEl.addEventListener("click", () => {
    exportCurrentResult();
  });
}

renderCategoryTabs();
renderSelectionViews();
renderUploadPanel();
renderDetectionResult();
bindEvents();
