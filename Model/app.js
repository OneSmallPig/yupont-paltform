const state = {
  currentView: "home",
  loggedIn: false,
  heroIndex: 0,
  heroTimer: null,
  selectedCategory: "全部算法",
  selectedIndustry: "全部",
  selectedAlgorithmId: "algo-1",
  historyTab: "tests",
  historyScene: "all",
  historyStatus: "all",
  compareQueue: [],
};

const heroData = [
  {
    title: "面向电力与行业场景的视觉算法平台",
    text: "聚焦输电、配网、光伏与安全监察等重点业务方向，形成可展示、可测试、可转化的算法平台首页。",
    theme: "theme-grid",
  },
  {
    title: "重点展示输电线路与设备识别能力",
    text: "通过算法轮播和缩略图，让用户快速理解煜邦在电网视觉算法方向的核心优势。",
    theme: "theme-scan",
  },
  {
    title: "支持在线测试与结果沉淀",
    text: "用户登录后可上传样本、调节参数、生成结果并保存测试记录，形成完整试用闭环。",
    theme: "theme-compare",
  },
];

const industries = [
  {
    name: "电网巡检",
    desc: "围绕输电、配网、变电与光伏场景，构建高价值电力算法展示区。",
    scenes: ["输电线路巡检", "配网巡检", "光伏巡检", "变电设备分析"],
  },
  {
    name: "应急救援",
    desc: "服务森林防火、灾害搜救、海上搜救等需要快速识别与预警的场景。",
    scenes: ["森林防火", "灾害救援", "海上搜救"],
  },
  {
    name: "城市管理",
    desc: "聚焦交通监控、城管执法、违规建筑等城市治理相关方向。",
    scenes: ["交通监控", "城管执法", "违规建筑"],
  },
  {
    name: "农林植保",
    desc: "覆盖漂浮物检测、违规排污、绿藻监测和农业相关识别场景。",
    scenes: ["水面漂浮物", "违规排污", "绿藻监测", "高茬检测"],
  },
];

const algorithms = [
  {
    id: "algo-1",
    name: "输电线路本体缺陷检测",
    subtitle: "29 类电力本体缺陷识别",
    category: "目标检测",
    industry: "电网巡检",
    scene: "输电线路巡检",
    metric: "mAP 92.4%",
    stack: "YOLOv8",
    desc: "识别异物、鸟窝、绝缘子缺陷、金具状态、螺丝松动等重点问题。",
    featured: true,
  },
  {
    id: "algo-2",
    name: "输电通道山火覆冰检测",
    subtitle: "烟雾、火焰双目标告警",
    category: "多模态识别",
    industry: "电网巡检",
    scene: "输电线路巡检",
    metric: "Recall 90.8%",
    stack: "YOLOv11 + Qwen2.5-VL",
    desc: "适合抓拍机通道预警，突出山火预警与多模态识别能力。",
    featured: true,
  },
  {
    id: "algo-3",
    name: "配网杆塔关键部件识别",
    subtitle: "配网关键部件识别与跟踪",
    category: "目标检测",
    industry: "电网巡检",
    scene: "配网巡检",
    metric: "mAP 89.6%",
    stack: "YOLOv8n + ByteTrack",
    desc: "识别塔头、导线、刀闸、断路器、熔断器等关键部件。",
    featured: true,
  },
  {
    id: "algo-4",
    name: "光伏缺陷检测与定位",
    subtitle: "热斑与组件缺陷识别",
    category: "目标检测",
    industry: "电网巡检",
    scene: "光伏巡检",
    metric: "mAP 87.3%",
    stack: "YOLO11",
    desc: "识别热斑、接线故障和组件缺失等问题。",
    featured: true,
  },
  {
    id: "algo-5",
    name: "森林火点热成像识别",
    subtitle: "红外热成像火点识别",
    category: "目标检测",
    industry: "应急救援",
    scene: "森林防火",
    metric: "Recall 93.1%",
    stack: "InfraVision",
    desc: "通过热成像识别火点与烟雾，用于火灾早期告警。",
    featured: false,
  },
  {
    id: "algo-6",
    name: "城市交通违法检测",
    subtitle: "交通违法与拥堵分析",
    category: "目标检测",
    industry: "城市管理",
    scene: "交通监控",
    metric: "mAP 88.2%",
    stack: "YOLOv8 + OCR",
    desc: "识别拥堵、逆行、占道和重点车辆行为，适合城市治理展示。",
    featured: false,
  },
  {
    id: "algo-7",
    name: "安徽漂浮物检测",
    subtitle: "环保巡检漂浮物识别",
    category: "目标检测",
    industry: "农林植保",
    scene: "水面漂浮物",
    metric: "mAP 86.4%",
    stack: "YOLOv8",
    desc: "识别漂浮垃圾、防尘网和彩带等目标。",
    featured: false,
  },
  {
    id: "algo-8",
    name: "水体绿藻爆发识别",
    subtitle: "水域分割与绿藻识别",
    category: "语义分割",
    industry: "农林植保",
    scene: "绿藻监测",
    metric: "IoU 82.7%",
    stack: "SegFormer",
    desc: "适合环境治理和遥感监测展示。",
    featured: false,
  },
  {
    id: "algo-9",
    name: "安徽通道地物分割",
    subtitle: "输电通道地物分割",
    category: "语义分割",
    industry: "电网巡检",
    scene: "输电线路巡检",
    metric: "IoU 85.5%",
    stack: "DeepLabV3+",
    desc: "识别农田、树株、房屋、水域、公路等多类地物。",
    featured: false,
  },
  {
    id: "algo-10",
    name: "变电设备状态异常分析",
    subtitle: "变电设备状态判别",
    category: "异常分析",
    industry: "电网巡检",
    scene: "配网巡检",
    metric: "准确率 91.2%",
    stack: "孪生网络",
    desc: "分析刀闸分合状态和硅胶变色等异常。",
    featured: false,
  },
];

const categories = ["全部算法", "目标检测", "语义分割", "异常分析", "图像处理", "多模态识别"];

const testRecords = [
  { time: "2026-03-16 10:28", scene: "输电线路巡检", algorithm: "输电线路本体缺陷检测", status: "已完成", output: "PDF 报告 / JSON" },
  { time: "2026-03-15 17:42", scene: "光伏巡检", algorithm: "光伏缺陷检测与定位", status: "已完成", output: "检测图 / 热力图" },
  { time: "2026-03-15 11:06", scene: "森林防火", algorithm: "森林火点热成像识别", status: "处理中", output: "等待报告生成" },
];

const favorites = [
  { industry: "电网巡检", algorithm: "配网杆塔关键部件识别", value: "售前展示重点 / 设备识别" },
  { industry: "城市管理", algorithm: "城市交通违法检测", value: "城市治理项目常用" },
];

const feedback = [
  { time: "2026-03-16 09:10", issue: "希望增加结果叠加透明度调节", status: "待确认", owner: "产品经理" },
  { time: "2026-03-15 16:20", issue: "光伏样本建议增加批量上传", status: "处理中", owner: "前端开发" },
  { time: "2026-03-14 14:35", issue: "增加误检标签反馈入口", status: "已完成", owner: "算法团队" },
];

const el = {
  navLinks: [...document.querySelectorAll(".nav-link")],
  brandLink: document.querySelector("[data-view-link='home']"),
  viewJumpButtons: [...document.querySelectorAll("[data-view-jump]")],
  views: {
    home: document.getElementById("homeView"),
    market: document.getElementById("marketView"),
    contact: document.getElementById("contactView"),
    user: document.getElementById("userView"),
  },
  recommendBtn: document.getElementById("recommendBtn"),
  loginBtn: document.getElementById("loginBtn"),
  heroSlides: document.getElementById("heroSlides"),
  heroDots: document.getElementById("heroDots"),
  homeAlgoGrid: document.getElementById("homeAlgoGrid"),
  homeIndustryPills: document.getElementById("homeIndustryPills"),
  industryGrid: document.getElementById("industryGrid"),
  loginStatusCard: document.getElementById("loginStatusCard"),
  categoryTabs: document.getElementById("categoryTabs"),
  industryTabs: document.getElementById("industryTabs"),
  searchInput: document.getElementById("searchInput"),
  marketAlgoGrid: document.getElementById("marketAlgoGrid"),
  detailPanel: document.getElementById("detailPanel"),
  demoApplyBtn: document.getElementById("demoApplyBtn"),
  exportBtn: document.getElementById("exportBtn"),
  historyTabs: [...document.querySelectorAll(".history-tab")],
  historySceneFilter: document.getElementById("historySceneFilter"),
  historyStatusFilter: document.getElementById("historyStatusFilter"),
  historyHead: document.getElementById("historyHead"),
  historyBody: document.getElementById("historyBody"),
  summaryTests: document.getElementById("summaryTests"),
  summaryFavorites: document.getElementById("summaryFavorites"),
  summaryFeedback: document.getElementById("summaryFeedback"),
  testDrawer: document.getElementById("testDrawer"),
  drawerTitle: document.getElementById("drawerTitle"),
  uploadBox: document.getElementById("uploadBox"),
  thumbs: document.getElementById("thumbs"),
  compareTags: document.getElementById("compareTags"),
  outputMode: document.getElementById("outputMode"),
  runTestBtn: document.getElementById("runTestBtn"),
  metricMap: document.getElementById("metricMap"),
  metricRecall: document.getElementById("metricRecall"),
  metricLatency: document.getElementById("metricLatency"),
  saveHistoryBtn: document.getElementById("saveHistoryBtn"),
  closeDrawerNodes: [...document.querySelectorAll("[data-close-drawer]")],
};

function init() {
  bindEvents();
  renderHero();
  renderHomeAlgorithms();
  renderIndustrySection();
  renderMarketTabs();
  renderMarketAlgorithms();
  renderHistoryFilters();
  renderHistory();
  updateLoginState();
  startHeroTimer();
}

function bindEvents() {
  el.navLinks.forEach((node) => node.addEventListener("click", () => switchView(node.dataset.view)));
  el.brandLink.addEventListener("click", (event) => {
    event.preventDefault();
    switchView("home");
  });
  el.viewJumpButtons.forEach((node) => node.addEventListener("click", () => switchView(node.dataset.viewJump)));

  el.recommendBtn.addEventListener("click", () => {
    state.selectedCategory = "目标检测";
    state.selectedIndustry = "电网巡检";
    state.selectedAlgorithmId = "algo-1";
    renderMarketTabs();
    renderMarketAlgorithms();
    switchView("market");
  });

  el.loginBtn.addEventListener("click", () => {
    state.loggedIn = !state.loggedIn;
    updateLoginState();
    renderMarketAlgorithms();
  });

  el.searchInput.addEventListener("input", renderMarketAlgorithms);
  el.demoApplyBtn.addEventListener("click", () => window.alert("已提交演示申请。\n公司主体：北京煜邦电力技术股份有限公司"));
  el.exportBtn.addEventListener("click", exportSummary);

  el.historyTabs.forEach((node) => {
    node.addEventListener("click", () => {
      state.historyTab = node.dataset.history;
      el.historyTabs.forEach((item) => item.classList.toggle("active", item === node));
      renderHistory();
    });
  });

  el.historySceneFilter.addEventListener("change", () => {
    state.historyScene = el.historySceneFilter.value;
    renderHistory();
  });

  el.historyStatusFilter.addEventListener("change", () => {
    state.historyStatus = el.historyStatusFilter.value;
    renderHistory();
  });

  el.closeDrawerNodes.forEach((node) => node.addEventListener("click", closeDrawer));
  el.uploadBox.addEventListener("click", () => {
    el.uploadBox.innerHTML = "<strong>已加载示例样本：inspection_demo_01.jpg</strong><p>当前为原型演示，已模拟上传成功。</p>";
  });
  el.runTestBtn.addEventListener("click", runMockTest);
  el.saveHistoryBtn.addEventListener("click", saveToHistory);
}

function switchView(view) {
  state.currentView = view;
  Object.entries(el.views).forEach(([key, node]) => node.classList.toggle("active", key === view));
  el.navLinks.forEach((node) => node.classList.toggle("active", node.dataset.view === view));
}

function renderHero() {
  el.heroSlides.innerHTML = heroData.map((item, index) => `
    <article class="hero-slide ${item.theme} ${index === state.heroIndex ? "active" : ""}">
      <div class="hero-copy overlay">
        <p class="eyebrow">Yupont AI Platform</p>
        <h1>${item.title}</h1>
        <p>${item.text}</p>
      </div>
    </article>
  `).join("");

  el.heroDots.innerHTML = heroData.map((_, index) => `<button class="hero-dot ${index === state.heroIndex ? "active" : ""}" data-hero-dot="${index}"></button>`).join("");

  [...document.querySelectorAll("[data-hero-dot]")].forEach((node) => {
    node.addEventListener("click", () => {
      state.heroIndex = Number(node.dataset.heroDot);
      renderHero();
      restartHeroTimer();
    });
  });
}

function startHeroTimer() {
  state.heroTimer = setInterval(() => {
    state.heroIndex = (state.heroIndex + 1) % heroData.length;
    renderHero();
  }, 4200);
}

function restartHeroTimer() {
  clearInterval(state.heroTimer);
  startHeroTimer();
}

function renderHomeAlgorithms() {
  const featured = algorithms.filter((item) => item.featured).slice(0, 6);
  el.homeAlgoGrid.innerHTML = featured.map((item) => `
    <article class="algo-card" data-home-algo="${item.id}">
      <div class="algo-cover"></div>
      <p class="eyebrow">${item.industry}</p>
      <h3>${item.name}</h3>
      <p>${item.subtitle}</p>
      <div class="algo-meta">
        <span class="status-pill">${item.category}</span>
        <span class="status-pill">${item.metric}</span>
      </div>
    </article>
  `).join("");

  [...document.querySelectorAll("[data-home-algo]")].forEach((node) => {
    node.addEventListener("click", () => {
      const item = algorithms.find((algo) => algo.id === node.dataset.homeAlgo);
      state.selectedAlgorithmId = item.id;
      state.selectedCategory = item.category;
      state.selectedIndustry = item.industry;
      renderMarketTabs();
      renderMarketAlgorithms();
      switchView("market");
    });
  });
}

function renderIndustrySection() {
  el.homeIndustryPills.innerHTML = industries.map((item) => `<button class="tab-pill" data-home-industry="${item.name}">${item.name}</button>`).join("");
  el.industryGrid.innerHTML = industries.map((item) => `
    <article class="industry-card" data-card-industry="${item.name}">
      <p class="eyebrow">${item.name}</p>
      <h3>${item.name}解决方案</h3>
      <p>${item.desc}</p>
      <div class="algo-meta">
        ${item.scenes.map((scene) => `<span class="status-pill">${scene}</span>`).join("")}
      </div>
      <button class="ghost-btn small" data-card-industry="${item.name}">进入专区</button>
    </article>
  `).join("");

  [...document.querySelectorAll("[data-home-industry], .industry-card [data-card-industry]")].forEach((node) => {
    node.addEventListener("click", () => {
      state.selectedIndustry = node.dataset.homeIndustry || node.dataset.cardIndustry;
      state.selectedCategory = "全部算法";
      renderMarketTabs();
      renderMarketAlgorithms();
      switchView("market");
    });
  });
}

function renderMarketTabs() {
  el.categoryTabs.innerHTML = categories.map((item) => `<button class="tab-pill ${state.selectedCategory === item ? "active" : ""}" data-category="${item}">${item}</button>`).join("");
  el.industryTabs.innerHTML = ["全部", ...industries.map((item) => item.name)].map((item) => `<button class="tab-pill ${state.selectedIndustry === item ? "active" : ""}" data-industry="${item}">${item}</button>`).join("");

  [...document.querySelectorAll("[data-category]")].forEach((node) => {
    node.addEventListener("click", () => {
      state.selectedCategory = node.dataset.category;
      renderMarketTabs();
      renderMarketAlgorithms();
    });
  });

  [...document.querySelectorAll("[data-industry]")].forEach((node) => {
    node.addEventListener("click", () => {
      state.selectedIndustry = node.dataset.industry;
      renderMarketTabs();
      renderMarketAlgorithms();
    });
  });
}

function getFilteredAlgorithms() {
  const keyword = el.searchInput.value.trim().toLowerCase();
  return algorithms.filter((item) => {
    const categoryOk = state.selectedCategory === "全部算法" || item.category === state.selectedCategory;
    const industryOk = state.selectedIndustry === "全部" || item.industry === state.selectedIndustry;
    const text = [item.name, item.subtitle, item.scene, item.desc, item.category, item.industry].join(" ").toLowerCase();
    const keywordOk = !keyword || text.includes(keyword);
    return categoryOk && industryOk && keywordOk;
  });
}

function renderMarketAlgorithms() {
  const list = getFilteredAlgorithms();
  if (list.length && !list.some((item) => item.id === state.selectedAlgorithmId)) {
    state.selectedAlgorithmId = list[0].id;
  }

  el.marketAlgoGrid.innerHTML = list.map((item) => `
    <article class="algo-card ${state.selectedAlgorithmId === item.id ? "active" : ""}" data-market-algo="${item.id}">
      <div class="algo-cover"></div>
      <p class="eyebrow">${item.industry} · ${item.scene}</p>
      <h3>${item.name}</h3>
      <p>${item.subtitle}</p>
      <div class="algo-meta">
        <span class="status-pill">${item.category}</span>
        <span class="status-pill">${item.stack}</span>
        <span class="status-pill">${item.metric}</span>
      </div>
      <p>${item.desc}</p>
    </article>
  `).join("");

  [...document.querySelectorAll("[data-market-algo]")].forEach((node) => {
    node.addEventListener("click", () => {
      state.selectedAlgorithmId = node.dataset.marketAlgo;
      const current = algorithms.find((item) => item.id === state.selectedAlgorithmId);
      if (current && !state.compareQueue.includes(current.name)) {
        state.compareQueue = [current.name, ...state.compareQueue].slice(0, 3);
      }
      renderMarketAlgorithms();
    });
  });

  renderDetail();
}

function renderDetail() {
  const item = algorithms.find((algo) => algo.id === state.selectedAlgorithmId);
  if (!item) return;

  el.detailPanel.innerHTML = `
    <p class="eyebrow">Algorithm Detail</p>
    <h3>${item.name}</h3>
    <div class="detail-cover"></div>
    <div class="detail-thumbs">
      <div class="thumb"></div>
      <div class="thumb"></div>
      <div class="thumb"></div>
    </div>
    <div class="detail-specs">
      <div class="spec-card"><span>算法分类</span><strong>${item.category}</strong></div>
      <div class="spec-card"><span>适用行业</span><strong>${item.industry}</strong></div>
      <div class="spec-card"><span>技术架构</span><strong>${item.stack}</strong></div>
      <div class="spec-card"><span>关键指标</span><strong>${item.metric}</strong></div>
    </div>
    <div class="detail-body">
      <p>${item.desc}</p>
    </div>
    <div class="detail-actions">
      <button class="primary-btn" id="testNowBtn" ${state.loggedIn ? "" : "disabled"}>${state.loggedIn ? "立即测试" : "登录后测试"}</button>
      <button class="ghost-btn" id="favoriteBtn">加入收藏</button>
    </div>
  `;

  const testNowBtn = document.getElementById("testNowBtn");
  const favoriteBtn = document.getElementById("favoriteBtn");
  if (state.loggedIn) {
    testNowBtn.addEventListener("click", () => openDrawer(item));
  }
  favoriteBtn.addEventListener("click", () => {
    favorites.unshift({ industry: item.industry, algorithm: item.name, value: `${item.scene} / 手动加入` });
    updateSummary();
    renderHistory();
  });
}

function updateLoginState() {
  el.loginBtn.textContent = state.loggedIn ? "切换为游客" : "登录后体验";
  el.loginStatusCard.innerHTML = state.loggedIn
    ? "<span>当前状态</span><strong>已登录</strong><p>可进行在线测试、保存结果并查看测试记录。</p>"
    : "<span>当前状态</span><strong>未登录</strong><p>可浏览算法详情，测试功能需登录后启用。</p>";
}

function openDrawer(item) {
  el.drawerTitle.textContent = `${item.name} · 在线测试`;
  el.thumbs.innerHTML = [1, 2, 3].map(() => '<div class="thumb"></div>').join("");
  el.compareTags.innerHTML = state.compareQueue.map((name) => `<span class="status-pill">${name}</span>`).join("");
  el.metricMap.textContent = "-";
  el.metricRecall.textContent = "-";
  el.metricLatency.textContent = "-";
  el.testDrawer.classList.add("open");
}

function closeDrawer() {
  el.testDrawer.classList.remove("open");
}

function runMockTest() {
  el.metricMap.textContent = `${(84 + Math.random() * 10).toFixed(1)}%`;
  el.metricRecall.textContent = `${(85 + Math.random() * 9).toFixed(1)}%`;
  el.metricLatency.textContent = `${Math.floor(150 + Math.random() * 180)}ms`;
}

function saveToHistory() {
  const item = algorithms.find((algo) => algo.id === state.selectedAlgorithmId);
  if (!item) return;
  testRecords.unshift({
    time: "2026-03-16 16:10",
    scene: item.scene,
    algorithm: item.name,
    status: "已完成",
    output: `${el.outputMode.value} / JSON`,
  });
  state.historyTab = "tests";
  el.historyTabs.forEach((node) => node.classList.toggle("active", node.dataset.history === "tests"));
  renderHistoryFilters();
  renderHistory();
  switchView("user");
  closeDrawer();
}

function renderHistoryFilters() {
  const scenes = [...new Set(algorithms.map((item) => item.scene))];
  el.historySceneFilter.innerHTML = ['<option value="all">全部场景</option>'].concat(scenes.map((scene) => `<option value="${scene}">${scene}</option>`)).join("");
  el.historySceneFilter.value = state.historyScene;
  el.historyStatusFilter.value = state.historyStatus;
  updateSummary();
}

function renderHistory() {
  let headers = [];
  let rows = [];

  if (state.historyTab === "tests") {
    headers = ["测试时间", "场景", "算法", "状态", "输出"];
    rows = testRecords.filter((item) => matchHistory(item.scene, item.status)).map((item) => [item.time, item.scene, item.algorithm, renderStatus(item.status), item.output]);
  } else if (state.historyTab === "favorites") {
    headers = ["所属行业", "算法", "收藏说明"];
    rows = favorites.map((item) => [item.industry, item.algorithm, item.value]);
  } else {
    headers = ["反馈时间", "问题描述", "状态", "处理人"];
    rows = feedback.filter((item) => matchHistory("all", item.status)).map((item) => [item.time, item.issue, renderStatus(item.status), item.owner]);
  }

  el.historyHead.innerHTML = `<tr>${headers.map((item) => `<th>${item}</th>`).join("")}</tr>`;
  el.historyBody.innerHTML = rows.length
    ? rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join("")}</tr>`).join("")
    : `<tr><td colspan="${headers.length}">暂无匹配数据</td></tr>`;
  updateSummary();
}

function matchHistory(scene, status) {
  const sceneOk = state.historyScene === "all" || scene === state.historyScene;
  const statusOk = state.historyStatus === "all" || status === state.historyStatus;
  return sceneOk && statusOk;
}

function renderStatus(status) {
  const classMap = {
    已完成: "status-ok",
    处理中: "status-pending",
    待确认: "status-waiting",
  };
  return `<span class="status-pill ${classMap[status] || ""}">${status}</span>`;
}

function updateSummary() {
  el.summaryTests.textContent = String(testRecords.length);
  el.summaryFavorites.textContent = String(favorites.length);
  el.summaryFeedback.textContent = String(feedback.filter((item) => item.status !== "已完成").length);
}

function exportSummary() {
  const content = [
    "北京煜邦电力技术股份有限公司",
    `测试记录：${testRecords.length}`,
    `收藏算法：${favorites.length}`,
    `待处理反馈：${feedback.filter((item) => item.status !== "已完成").length}`,
  ].join("\n");
  window.alert(content);
}

init();
