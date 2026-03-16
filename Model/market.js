const categoryTabsEl = document.getElementById("categoryTabs");
const industryTabsEl = document.getElementById("industryTabs");
const searchInputEl = document.getElementById("searchInput");
const marketGridEl = document.getElementById("marketAlgoGrid");
const detailPanelEl = document.getElementById("detailPanel");

const marketState = {
  selectedCategory: "全部算法",
  selectedIndustry: "全部",
  selectedId: platformData.algorithms[0]?.id ?? "",
};

const marketCategories = ["全部算法", "目标检测", "语义分割", "异常分析", "多模态识别", "图像处理"];

function renderMarketTabs() {
  categoryTabsEl.innerHTML = marketCategories.map((item) => `
    <button class="tab-pill ${marketState.selectedCategory === item ? "active" : ""}" data-category="${item}" type="button">${item}</button>
  `).join("");

  industryTabsEl.innerHTML = ["全部", ...platformData.industries.map((item) => item.name)].map((item) => `
    <button class="tab-pill ${marketState.selectedIndustry === item ? "active" : ""}" data-industry="${item}" type="button">${item}</button>
  `).join("");

  document.querySelectorAll("[data-category]").forEach((node) => {
    node.addEventListener("click", () => {
      marketState.selectedCategory = node.dataset.category;
      renderMarketTabs();
      renderMarket();
    });
  });

  document.querySelectorAll("[data-industry]").forEach((node) => {
    node.addEventListener("click", () => {
      marketState.selectedIndustry = node.dataset.industry;
      renderMarketTabs();
      renderMarket();
    });
  });
}

function getFilteredAlgorithms() {
  const keyword = searchInputEl.value.trim().toLowerCase();
  return platformData.algorithms.filter((item) => {
    const categoryOk = marketState.selectedCategory === "全部算法" || item.category === marketState.selectedCategory;
    const industryOk = marketState.selectedIndustry === "全部" || item.industry === marketState.selectedIndustry;
    const text = [item.name, item.subtitle, item.scene, item.desc, item.industry].join(" ").toLowerCase();
    return categoryOk && industryOk && (!keyword || text.includes(keyword));
  });
}

function renderDetail() {
  const item = platformData.algorithms.find((entry) => entry.id === marketState.selectedId);
  if (!item) {
    detailPanelEl.innerHTML = `<div class="empty-detail"><p class="eyebrow">Algorithm Detail</p><h3>请选择一个算法查看详情</h3><p>这里会展示算法简介、技术栈和进入在线检测的入口。</p></div>`;
    return;
  }

  detailPanelEl.innerHTML = `
    <p class="eyebrow">Algorithm Detail</p>
    <h3>${item.name}</h3>
    <div class="detail-cover" style="background-image: url('${item.image}');"></div>
    <div class="detail-specs">
      <div class="spec-card"><span>算法分类</span><strong>${item.category}</strong></div>
      <div class="spec-card"><span>适用行业</span><strong>${item.industry}</strong></div>
      <div class="spec-card"><span>技术栈</span><strong>${item.stack}</strong></div>
      <div class="spec-card"><span>核心指标</span><strong>${item.metric}</strong></div>
    </div>
    <div class="detail-body">
      <p>${item.desc}</p>
    </div>
    <div class="detail-actions">
      <a class="primary-btn" href="./algorithm.html?id=${item.id}">进入在线检测</a>
      <a class="ghost-btn" href="./algorithm.html?id=${item.id}">查看详情页</a>
    </div>
  `;
}

function renderMarket() {
  const list = getFilteredAlgorithms();
  if (list.length && !list.some((item) => item.id === marketState.selectedId)) {
    marketState.selectedId = list[0].id;
  }

  marketGridEl.innerHTML = list.map((item) => `
    <article class="algo-card ${marketState.selectedId === item.id ? "active" : ""}" data-market-id="${item.id}">
      <div class="algo-cover" style="background-image: url('${item.image}');"></div>
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

  document.querySelectorAll("[data-market-id]").forEach((node) => {
    node.addEventListener("click", () => {
      marketState.selectedId = node.dataset.marketId;
      renderMarket();
    });
  });

  renderDetail();
}

searchInputEl.addEventListener("input", renderMarket);
renderMarketTabs();
renderMarket();
