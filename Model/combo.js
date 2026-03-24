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

function getDefaultImageFiles() {
  return [
    {
      name: "biandian_03753.jpg",
      url: "./效果图/变电设备缺陷智能识别/biandian_03753.jpg",
    },
    {
      name: "杆塔104.JPG",
      url: "./效果图/配网杆塔关键部件识别/杆塔104.JPG",
    },
  ];
}

const comboState = {
  selectedIds: platformData.algorithms.slice(0, 3).map((item) => item.id),
  uploadType: "image",
  imageFiles: getDefaultImageFiles(),
  fileName: "",
  fileUrl: "",
  result: null,
  exportType: "json",
  activeMetricId: null,
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

function renderWorkbenchSummary() {
  const selected = getSelectedAlgorithms();

  comboWorkbenchSummaryEl.innerHTML = `
    <div class="combo-workbench-head">
      <strong>本次组合算法</strong>
    </div>
    <div class="combo-workbench-title-list">
      ${selected.map((item) => `
        <article class="combo-workbench-title-item">
          <strong>${item.name}</strong>
        </article>
      `).join("")}
    </div>
  `;
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
          ${files.map((file) => `
            <div class="combo-upload-card">
              <div class="combo-upload-card-cover" style="background-image: url('${file.url}');"></div>
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

function buildAlgorithmMetric(item, index, imageCount) {
  const baseConfidence = 96.1 - index * 1.2;
  const baseLatency = 28 + index * 11 + imageCount * 5;
  const targetCount = comboState.uploadType === "image" ? Math.max(1, imageCount + index) : 2 + index;

  return {
    id: item.id,
    name: item.name,
    category: item.category,
    industry: item.industry,
    scene: item.scene,
    stack: item.stack,
    confidence: `${baseConfidence.toFixed(1)}%`,
    latency: `${baseLatency}ms`,
    targetCount,
    status: index === 0 ? "主检测算法" : "联合识别算法",
    summary: `负责 ${item.scene} 场景识别，当前输出稳定，适合放入组合演示链路。`,
    details: [
      `行业场景：${item.industry}`,
      `算法类别：${item.category}`,
      `模型架构：${item.stack}`,
      `当前识别目标数：${targetCount}`,
    ],
  };
}

function buildDetectionResult() {
  const selected = getSelectedAlgorithms();
  if (selected.length < 2) return null;

  const isImage = comboState.uploadType === "image";
  const imageCount = isImage ? getCurrentImageFiles().length : 1;
  const algorithmMetrics = selected.map((item, index) => buildAlgorithmMetric(item, index, imageCount));
  const totalTargets = algorithmMetrics.reduce((sum, item) => sum + item.targetCount, 0);
  const averageConfidence = (algorithmMetrics.reduce((sum, item) => sum + Number.parseFloat(item.confidence), 0) / algorithmMetrics.length).toFixed(1);
  const totalLatency = algorithmMetrics.reduce((sum, item) => sum + Number.parseInt(item.latency, 10), 0);
  const summaryNames = selected.map((item) => item.name).join("、");

  comboState.activeMetricId = algorithmMetrics[0]?.id || null;

  return {
    success: true,
    inferenceTime: `${totalLatency}ms`,
    confidence: `${averageConfidence}%`,
    targetCount: totalTargets,
    label: isImage ? "组合检测区域" : "多媒体联合分析",
    timestamp: buildTimestamp(),
    summary: isImage
      ? `系统已完成 ${imageCount} 张图片的 ${summaryNames} 组合检测解析，报告区可按算法分别查看检测指标与详细说明。`
      : `系统已完成 ${summaryNames} 的组合检测解析，报告区支持按算法查看单项指标与详细说明。`,
    detections: algorithmMetrics.map((item, index) => ({
      name: item.scene,
      confidence: item.confidence,
      region: `联合检测区域 ${index + 1}`,
    })),
    insights: [
      `本次组合同时调用 ${selected.length} 个算法模块，覆盖 ${[...new Set(selected.map((item) => item.industry))].length} 类业务场景。`,
      isImage ? `当前批次共上传 ${imageCount} 张图片，适合做多样本对比演示与联合识别验证。` : "当前上传素材与所选算法场景匹配度较高，组合检测输出稳定，适合方案演示和能力说明。",
      "报告区已拆分为算法指标列表，可逐个查看单算法检测表现。",
    ],
    actions: [
      "建议保留本次组合方案用于项目演示和能力汇报。",
      "可继续补充更多样本验证不同算法在同一批次中的检测表现。",
      "支持导出 JSON 与 PDF 用于归档、汇报或对接。",
    ],
    algorithmMetrics,
  };
}

function getActiveMetric() {
  if (!comboState.result?.algorithmMetrics?.length) return null;
  return comboState.result.algorithmMetrics.find((item) => item.id === comboState.activeMetricId) || comboState.result.algorithmMetrics[0];
}

function buildExportPayload() {
  if (!comboState.result) return null;

  return {
    algorithms: comboState.result.algorithmMetrics.map((item) => ({
      id: item.id,
      name: item.name,
      industry: item.industry,
      category: item.category,
      scene: item.scene,
      stack: item.stack,
      confidence: item.confidence,
      latency: item.latency,
      targetCount: item.targetCount,
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
          <span>上传素材并开始检测后，这里会展示联合识别预览和算法指标明细。</span>
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
        <p class="result-report-summary">完成组合检测后，将在这里生成算法指标列表，并支持点击查看单算法检测详情。</p>
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
            <div class="combo-batch-detection combo-batch-detection-primary combo-batch-detection-${(index % 2) + 1}">
              <i>${comboState.result.detections[index]?.name || comboState.result.label}</i>
            </div>
            <div class="combo-batch-detection combo-batch-detection-secondary combo-batch-detection-${((index + 1) % 2) + 1}">
              <i>${comboState.result.detections[index]?.confidence || comboState.result.confidence}</i>
            </div>
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

  const activeMetric = getActiveMetric();

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
        <div data-label="综合时延">
          <span>综合时延</span>
          <strong>${comboState.result.inferenceTime}</strong>
        </div>
        <div data-label="平均置信度">
          <span>平均置信度</span>
          <strong>${comboState.result.confidence}</strong>
        </div>
      </div>
      <div class="result-report-section">
        <h5>算法检测指标列表</h5>
        <div class="combo-metric-list">
          ${comboState.result.algorithmMetrics.map((item) => `
            <article class="combo-metric-item ${item.id === activeMetric?.id ? "is-active" : ""}">
              <div class="combo-metric-item-main">
                <strong>${item.name}</strong>
                <span>${item.scene}</span>
              </div>
              <div class="combo-metric-chip"><span>置信度</span><em>${item.confidence}</em></div>
              <div class="combo-metric-chip"><span>时延</span><em>${item.latency}</em></div>
              <div class="combo-metric-chip"><span>目标数</span><em>${item.targetCount}</em></div>
              <button class="ghost-btn combo-metric-detail-btn" type="button" data-metric-detail="${item.id}">查看详情</button>
            </article>
          `).join("")}
        </div>
      </div>
      ${activeMetric ? `
        <div class="result-report-section">
          <h5>算法详情</h5>
          <div class="combo-metric-detail-card">
            <div class="combo-metric-detail-head">
              <div>
                <strong>${activeMetric.name}</strong>
                <span>${activeMetric.status}</span>
              </div>
              <div class="combo-metric-detail-badges">
                <span>${activeMetric.category}</span>
                <span>${activeMetric.industry}</span>
              </div>
            </div>
            <p>${activeMetric.summary}</p>
            <div class="combo-metric-detail-grid">
              <div><span>检测场景</span><strong>${activeMetric.scene}</strong></div>
              <div><span>推理时延</span><strong>${activeMetric.latency}</strong></div>
              <div><span>识别目标</span><strong>${activeMetric.targetCount}</strong></div>
              <div><span>置信度</span><strong>${activeMetric.confidence}</strong></div>
            </div>
            <div class="report-bullet-list">
              ${activeMetric.details.map((item) => `<p>${item}</p>`).join("")}
            </div>
          </div>
        </div>
      ` : ""}
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
          <h5>算法指标列表</h5>
          ${comboState.result.algorithmMetrics.map((item) => `
            <div class="export-sheet-line">
              <strong>${item.name}</strong>
              <span>${item.latency}</span>
              <em>${item.confidence}</em>
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
    `Algorithms: ${asciiSafe(comboState.result.algorithmMetrics.map((item) => item.name).join(", "))}`,
    `Target Count: ${comboState.result.targetCount}`,
    `Confidence: ${asciiSafe(comboState.result.confidence)}`,
    `Latency: ${asciiSafe(comboState.result.inferenceTime)}`,
    `Generated At: ${asciiSafe(comboState.result.timestamp)}`,
  ].join("\n");
  downloadBlob(`${baseName}.pdf`, buildSimplePdf(pdfText), "application/pdf");
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
  bindUploadTabs();

  runBtnEl.addEventListener("click", () => {
    comboState.result = buildDetectionResult();
    renderDetectionResult();
  });

  resultMetricsEl.addEventListener("click", (event) => {
    const detailTrigger = event.target.closest("[data-metric-detail]");
    if (detailTrigger && comboState.result) {
      comboState.activeMetricId = detailTrigger.dataset.metricDetail;
      renderDetectionResult();
      return;
    }

    const exportTrigger = event.target.closest("[data-export-type]");
    if (!exportTrigger || !comboState.result) return;
    renderExportPreview(exportTrigger.dataset.exportType);
  });

  exportConfirmBtnEl.addEventListener("click", () => {
    exportCurrentResult();
  });
}

renderWorkbenchSummary();
renderUploadPanel();
renderDetectionResult();
bindEvents();
