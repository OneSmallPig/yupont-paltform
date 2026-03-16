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
    title: "面向电力巡检的视觉算法能力",
    text: "聚焦输电、配网与光伏场景，以可展示、可验证、可交付的方式组织算法能力。",
    image: "./效果图/轮播/聚焦电力场景的视觉算法.jfif",
  },
  {
    title: "输电线路与设备识别能力",
    text: "覆盖通道隐患、杆塔设备、缺陷识别等高频场景，服务巡检和运维业务。",
    image: "./效果图/轮播/输电线路与设备识别能力.png",
  },
  {
    title: "在线推理测试与结果留存",
    text: "支持样本上传、结果预览、指标输出与历史留存，缩短售前沟通与验证路径。",
    image: "./效果图/轮播/在线推理测试与结果留存.JPG",
  },
];

const capabilities = [
  {
    key: "01",
    title: "算法资产沉淀",
    desc: "按检测、分割、多模态和异常分析等方向组织算法能力，支持标准化展示。",
  },
  {
    key: "02",
    title: "在线测试验证",
    desc: "支持样本上传、参数配置、结果预览与报告输出，缩短售前验证路径。",
  },
  {
    key: "03",
    title: "行业方案交付",
    desc: "将单点算法能力快速组织为面向客户的行业化解决方案和项目沟通材料。",
  },
];

const homeSupport = {
  title: "标准化演示资料与验证路径",
  desc: "围绕方案介绍、能力清单、测试报告和客户交流材料，形成更适合商务转化的首页支撑内容。",
  meta: "售前支撑 · 2026-03-16",
};

const resources = [
  { title: "平台能力清单", meta: "资料下载" },
  { title: "电力巡检算法目录", meta: "能力目录" },
  { title: "在线测试说明", meta: "使用指南" },
  { title: "合作接入方式", meta: "商务支持" },
];

const industries = [
  {
    name: "输电巡检",
    desc: "聚焦线路缺陷、通道异物、山火烟雾和设备识别等高价值场景。",
    scenes: ["本体缺陷检测", "通道隐患识别", "山火预警"],
  },
  {
    name: "配网巡检",
    desc: "覆盖杆塔、关键部件、设备状态与配网通道场景，适合巡检与运维业务。",
    scenes: ["杆塔关键部件", "设备状态识别", "通道巡检"],
  },
  {
    name: "光伏巡检",
    desc: "面向热斑、组件缺陷和阵列异常定位，强化光伏运维场景价值表达。",
    scenes: ["热斑检测", "组件缺陷定位", "阵列异常识别"],
  },
  {
    name: "安全监管",
    desc: "支撑安全帽穿戴、现场安检与作业规范识别等监管类应用。",
    scenes: ["作业规范识别", "安全帽检测", "现场安检"],
  },
  {
    name: "应急救援",
    desc: "服务山火、烟雾和灾害应急识别场景，强调快速预警与多模态识别能力。",
    scenes: ["山火识别", "烟雾检测", "灾害搜救"],
  },
  {
    name: "环保治理",
    desc: "覆盖漂浮物、水体异常和环境目标识别等治理类场景。",
    scenes: ["漂浮物检测", "水体异常识别", "环境巡查"],
  },
];

const algorithms = [
  {
    id: "algo-1",
    name: "输电线路本体缺陷检测",
    subtitle: "29 类输电本体缺陷识别",
    category: "目标检测",
    industry: "输电巡检",
    scene: "本体缺陷检测",
    metric: "mAP 92.4%",
    stack: "YOLOv8",
    desc: "识别异物、鸟巢、绝缘子缺陷、金具状态和螺栓松动等重点问题。",
    featured: true,
    image: "./效果图/输电线路本体缺陷检测/1474349739174.jpg",
  },
  {
    id: "algo-2",
    name: "输电通道山火烟雾识别",
    subtitle: "烟雾与火情双目标告警",
    category: "多模态识别",
    industry: "应急救援",
    scene: "山火识别",
    metric: "Recall 90.8%",
    stack: "YOLOv11 + Qwen2.5-VL",
    desc: "适合通道监测与预警场景，突出早期识别与多模态感知能力。",
    featured: true,
    image: "./效果图/冀北侵物检测/101746736.jpg",
  },
  {
    id: "algo-3",
    name: "配网杆塔关键部件识别",
    subtitle: "配网关键部件识别与跟踪",
    category: "目标检测",
    industry: "配网巡检",
    scene: "杆塔关键部件",
    metric: "mAP 89.6%",
    stack: "YOLOv8n + ByteTrack",
    desc: "识别塔头、导线、刀闸、断路器和熔断器等关键部件。",
    featured: true,
    image: "./效果图/配网杆塔关键部件识别/10kV-wang-qiao-08-xian-104#-quan-ta.JPG",
  },
  {
    id: "algo-4",
    name: "光伏缺陷检测与定位",
    subtitle: "热斑与组件缺陷识别",
    category: "目标检测",
    industry: "光伏巡检",
    scene: "热斑检测",
    metric: "mAP 87.3%",
    stack: "YOLO11",
    desc: "识别热斑、接线故障和组件缺失等问题，适合光伏运维展示。",
    featured: true,
    image: "./效果图/光伏缺陷检测以及定位/DJI_20210801101641_0069_T.JPG",
  },
  {
    id: "algo-5",
    name: "现场安检识别",
    subtitle: "作业现场安全规范识别",
    category: "目标检测",
    industry: "安全监管",
    scene: "现场安检",
    metric: "Recall 93.1%",
    stack: "InfraVision",
    desc: "适用于现场人员规范识别、安全要素检测与异常告警。",
    featured: false,
    image: "./效果图/海南安检/11.3-329.JPG",
  },
  {
    id: "algo-6",
    name: "输电通道侵物识别",
    subtitle: "通道异物与风险目标监测",
    category: "目标检测",
    industry: "输电巡检",
    scene: "通道隐患识别",
    metric: "mAP 88.2%",
    stack: "YOLOv8 + OCR",
    desc: "识别通道中的外部风险目标，适合输电巡检业务展示。",
    featured: false,
    image: "./效果图/冀北侵物检测/101741749.jpg",
  },
  {
    id: "algo-7",
    name: "水面漂浮物检测",
    subtitle: "环保巡查中的漂浮物识别",
    category: "目标检测",
    industry: "环保治理",
    scene: "漂浮物检测",
    metric: "mAP 86.4%",
    stack: "YOLOv8",
    desc: "识别漂浮垃圾、障碍物和污染相关目标，适合治理场景演示。",
    featured: false,
    image: "./效果图/去雾处理/0099_0.9_0.16.jpg",
  },
  {
    id: "algo-8",
    name: "水体异常识别",
    subtitle: "水域分割与异常特征识别",
    category: "语义分割",
    industry: "环保治理",
    scene: "水体异常识别",
    metric: "IoU 82.7%",
    stack: "SegFormer",
    desc: "适合环境治理和遥感监测类场景展示。",
    featured: false,
    image: "./效果图/去雾处理/1400_2.png",
  },
  {
    id: "algo-9",
    name: "变电设备缺陷识别",
    subtitle: "变电设备状态与缺陷分析",
    category: "异常分析",
    industry: "配网巡检",
    scene: "设备状态识别",
    metric: "准确率 91.2%",
    stack: "孪生网络",
    desc: "分析设备状态变化和典型缺陷，适合运维场景能力展示。",
    featured: false,
    image: "./效果图/变电设备缺陷智能识别/biandian_02102.jpg",
  },
];

const categories = ["全部算法", "目标检测", "语义分割", "异常分析", "多模态识别"];

const testRecords = [
  { time: "2026-03-16 10:28", scene: "本体缺陷检测", algorithm: "输电线路本体缺陷检测", status: "已完成", output: "PDF 报告 / JSON" },
  { time: "2026-03-15 17:42", scene: "热斑检测", algorithm: "光伏缺陷检测与定位", status: "已完成", output: "检测图 / 热力图" },
  { time: "2026-03-15 11:06", scene: "山火识别", algorithm: "输电通道山火烟雾识别", status: "处理中", output: "等待报告生成" },
];

const favorites = [
  { industry: "配网巡检", algorithm: "配网杆塔关键部件识别", value: "售前演示重点 / 设备识别" },
  { industry: "输电巡检", algorithm: "输电线路本体缺陷检测", value: "高价值巡检场景" },
];

const feedback = [
  { time: "2026-03-16 09:10", issue: "希望增加结果叠加透明度调节", status: "待确认", owner: "产品经理" },
  { time: "2026-03-15 16:20", issue: "建议增加批量样本上传能力", status: "处理中", owner: "前端开发" },
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
  capabilityGrid: document.getElementById("capabilityGrid"),
  homeAlgoGrid: document.getElementById("homeAlgoGrid"),
  homeIndustryPills: document.getElementById("homeIndustryPills"),
  industryGrid: document.getElementById("industryGrid"),
  newsMain: document.getElementById("newsMain"),
  resourceList: document.getElementById("resourceList"),
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
  renderCapabilities();
  renderHomeAlgorithms();
  renderIndustrySection();
  renderNewsSection();
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
    state.selectedIndustry = "输电巡检";
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
    <article class="hero-slide ${index === state.heroIndex ? "active" : ""}">
      <img class="hero-image" src="${item.image}" alt="${item.title}">
      <div class="hero-slide-caption">
        <p class="eyebrow">Scene Focus</p>
        <h2>${item.title}</h2>
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

function renderCapabilities() {
  el.capabilityGrid.innerHTML = capabilities.map((item) => `
    <article class="capability-card capability-lite">
      <span class="capability-index">${item.key}</span>
      <h3>${item.title}</h3>
      <p>${item.desc}</p>
    </article>
  `).join("");
}

function renderHomeAlgorithms() {
  const featured = algorithms.filter((item) => item.featured).slice(0, 4);
  el.homeAlgoGrid.innerHTML = featured.map((item) => `
    <article class="algo-card home-featured-card" data-home-algo="${item.id}">
      <div class="algo-cover" style="background-image: linear-gradient(180deg, rgba(14, 16, 24, 0.08), rgba(14, 16, 24, 0.35)), url('${item.image}');"></div>
      <p class="eyebrow">${item.industry}</p>
      <h3>${item.name}</h3>
      <p>${item.subtitle}</p>
      <div class="algo-meta">
        <span class="status-pill">${item.category}</span>
        <span class="status-pill">${item.metric}</span>
      </div>
      <button class="ghost-btn small">查看详情</button>
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
  el.industryGrid.innerHTML = industries.map((item, index) => `
    <article class="industry-card industry-tile" data-card-industry="${item.name}">
      <span class="industry-icon">0${index + 1}</span>
      <p class="eyebrow">${item.name}</p>
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <div class="algo-meta">
        ${item.scenes.map((scene) => `<span class="status-pill">${scene}</span>`).join("")}
      </div>
    </article>
  `).join("");

  [...document.querySelectorAll("[data-home-industry], [data-card-industry]")].forEach((node) => {
    node.addEventListener("click", () => {
      state.selectedIndustry = node.dataset.homeIndustry || node.dataset.cardIndustry;
      state.selectedCategory = "全部算法";
      renderMarketTabs();
      renderMarketAlgorithms();
      switchView("market");
    });
  });
}

function renderNewsSection() {
  el.newsMain.innerHTML = `
    <article class="news-feature support-feature">
      <div class="news-body">
        <p class="eyebrow">Support Material</p>
        <h3>${homeSupport.title}</h3>
        <p>${homeSupport.desc}</p>
        <span class="news-meta">${homeSupport.meta}</span>
      </div>
    </article>
  `;

  el.resourceList.innerHTML = resources.map((item, index) => `
    <article class="resource-card support-card">
      <span class="resource-tag">0${index + 1}</span>
      <div>
        <strong>${item.title}</strong>
        <p>${item.meta}</p>
      </div>
    </article>
  `).join("");
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
    return categoryOk && industryOk && (!keyword || text.includes(keyword));
  });
}

function renderMarketAlgorithms() {
  const list = getFilteredAlgorithms();
  if (list.length && !list.some((item) => item.id === state.selectedAlgorithmId)) {
    state.selectedAlgorithmId = list[0].id;
  }

  el.marketAlgoGrid.innerHTML = list.map((item) => `
    <article class="algo-card ${state.selectedAlgorithmId === item.id ? "active" : ""}" data-market-algo="${item.id}">
      <div class="algo-cover" style="background-image: linear-gradient(180deg, rgba(14, 16, 24, 0.08), rgba(14, 16, 24, 0.35)), url('${item.image}');"></div>
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
    <div class="detail-cover" style="background-image: linear-gradient(180deg, rgba(14, 16, 24, 0.08), rgba(14, 16, 24, 0.35)), url('${item.image}');"></div>
    <div class="detail-thumbs">
      <div class="thumb"></div>
      <div class="thumb"></div>
      <div class="thumb"></div>
    </div>
    <div class="detail-specs">
      <div class="spec-card"><span>算法分类</span><strong>${item.category}</strong></div>
      <div class="spec-card"><span>适用行业</span><strong>${item.industry}</strong></div>
      <div class="spec-card"><span>技术栈</span><strong>${item.stack}</strong></div>
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
