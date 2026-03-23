const categoryTabsEl = document.getElementById("categoryTabs");
const industryTabsEl = document.getElementById("industryTabs");
const searchInputEl = document.getElementById("searchInput");
const marketGridEl = document.getElementById("marketAlgoGrid");
const marketResultMetaEl = document.getElementById("marketResultMeta");
const favoriteFilterBtnEl = document.getElementById("favoriteFilterBtn");
const openDemandModalEl = document.getElementById("openDemandModal");
const demandFormEl = document.getElementById("demandForm");
const demandFormNoteEl = document.getElementById("demandFormNote");

const marketState = {
  selectedCategory: "全部算法",
  selectedIndustry: "全部",
  favoritesOnly: false,
};

const marketCategories = ["全部算法", "目标检测", "语义分割", "异常分析", "多模态识别", "图像处理"];

function isMarketFavorite(algorithmId) {
  const user = getCurrentUser();
  return user.loggedIn && user.favorites.includes(algorithmId);
}

function getFavoriteDisplayCount(item) {
  return item.favorites + (isMarketFavorite(item.id) ? 1 : 0);
}

function getFilteredAlgorithms() {
  const keyword = searchInputEl.value.trim().toLowerCase();

  return platformData.algorithms.filter((item) => {
    const categoryOk = marketState.selectedCategory === "全部算法" || item.category === marketState.selectedCategory;
    const industryOk = marketState.selectedIndustry === "全部" || item.industry === marketState.selectedIndustry;
    const favoriteOk = !marketState.favoritesOnly || isMarketFavorite(item.id);
    const text = [
      item.name,
      item.subtitle,
      item.scene,
      item.desc,
      item.businessDesc,
      item.industry,
      item.badge,
      item.stack,
      item.metric,
      item.category,
    ].join(" ").toLowerCase();

    return categoryOk && industryOk && favoriteOk && (!keyword || text.includes(keyword));
  });
}

function renderMarketTabs() {
  categoryTabsEl.innerHTML = marketCategories.map((item) => `
    <button class="market-filter-chip ${marketState.selectedCategory === item ? "active" : ""}" data-category="${item}" type="button">${item}</button>
  `).join("");

  industryTabsEl.innerHTML = ["全部", ...platformData.industries.map((item) => item.name)].map((item) => `
    <button class="market-filter-chip market-filter-chip-soft ${marketState.selectedIndustry === item ? "active" : ""}" data-industry="${item}" type="button">${item}</button>
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

  favoriteFilterBtnEl.classList.toggle("active", marketState.favoritesOnly);
  favoriteFilterBtnEl.setAttribute("aria-label", marketState.favoritesOnly ? "查看全部算法" : "仅看收藏");
  favoriteFilterBtnEl.setAttribute("title", marketState.favoritesOnly ? "查看全部算法" : "仅看收藏");
}

function renderSummary(list) {
  const activeFilters = [
    marketState.selectedCategory !== "全部算法" ? marketState.selectedCategory : "",
    marketState.selectedIndustry !== "全部" ? marketState.selectedIndustry : "",
    marketState.favoritesOnly ? "仅看收藏" : "",
    searchInputEl.value.trim() ? `关键词：${searchInputEl.value.trim()}` : "",
  ].filter(Boolean);

  marketResultMetaEl.textContent = activeFilters.length
    ? `当前共展示 ${list.length} 个算法，已启用 ${activeFilters.join(" / ")}。`
    : "";
}

function renderEmptyState() {
  marketGridEl.innerHTML = `
    <article class="market-empty-state">
      <p class="eyebrow">No Match</p>
      <h3>没有找到符合当前条件的算法</h3>
      <p>建议先恢复“全部算法”，再按行业或关键词逐步缩小范围，避免过滤条件过多。</p>
      <button class="ghost-btn" type="button" id="resetEmptyStateFilters">重置筛选条件</button>
    </article>
  `;

  document.getElementById("resetEmptyStateFilters")?.addEventListener("click", resetFilters);
}

function renderGrid(list) {
  if (!list.length) {
    renderEmptyState();
    return;
  }

  marketGridEl.innerHTML = list.map((item) => `
    <article class="algo-card home-featured-card sharp-featured-card market-card market-card-clickable" data-card-href="./algorithm.html?id=${item.id}" tabindex="0" role="link" aria-label="查看${item.name}详情">
      <div class="algo-cover sharp-featured-cover market-card-cover" style="background-image: url('${item.image}');"></div>
      <div class="sharp-featured-body market-card-body">
        <div class="market-card-top">
          <span class="sharp-featured-type">${item.category}</span>
          <div class="market-card-icon-actions">
            <button class="market-favorite-icon ${isMarketFavorite(item.id) ? "is-favorite" : ""}" data-favorite-toggle="${item.id}" type="button" aria-label="${isMarketFavorite(item.id) ? "取消收藏" : "添加收藏"}">
              <span aria-hidden="true">${isMarketFavorite(item.id) ? "★" : "☆"}</span>
            </button>
            <a class="market-detail-link" href="./algorithm.html?id=${item.id}" aria-label="查看算法详情"><span aria-hidden="true">➜</span></a>
          </div>
        </div>
        <h3>${item.name}</h3>
        <div class="market-card-tags">
          <span class="market-tag market-tag-scene">${item.industry}</span>
          <span class="market-tag market-tag-light">${item.scene}</span>
          <span class="market-tag market-tag-accent">${item.badge}</span>
        </div>
      </div>
    </article>
  `).join("");
}

function bindFavoriteActions() {
  document.querySelectorAll("[data-favorite-toggle]").forEach((node) => {
    node.addEventListener("click", (event) => {
      event.preventDefault();
      const result = toggleFavoriteAlgorithm(node.dataset.favoriteToggle);
      if (result === null) return;
      renderMarket();
    });
  });
}

function bindCardActions() {
  document.querySelectorAll("[data-card-href]").forEach((node) => {
    const openDetail = () => {
      window.location.href = node.dataset.cardHref;
    };

    node.addEventListener("click", (event) => {
      if (event.target.closest("button, a")) return;
      openDetail();
    });

    node.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      openDetail();
    });
  });
}

function renderMarket() {
  const list = getFilteredAlgorithms();
  renderSummary(list);
  renderGrid(list);
  bindFavoriteActions();
  bindCardActions();
}

function resetFilters() {
  marketState.selectedCategory = "全部算法";
  marketState.selectedIndustry = "全部";
  marketState.favoritesOnly = false;
  searchInputEl.value = "";
  renderMarketTabs();
  renderMarket();
}

function bindDemandModal() {
  openDemandModalEl?.addEventListener("click", () => {
    demandFormNoteEl.textContent = "提交后将进入定制需求跟进流程。";
    openModal("demandModal");
  });

  demandFormEl?.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(demandFormEl);
    const requiredFields = ["name", "phone", "company", "title", "requirement"];
    const isValid = requiredFields.every((key) => String(formData.get(key) || "").trim());

    if (!isValid) {
      demandFormNoteEl.textContent = "请完整填写所有必填信息后再提交。";
      return;
    }

    demandFormNoteEl.textContent = "需求已提交，我们会尽快与您联系。";
    demandFormEl.reset();
    window.setTimeout(() => closeModal("demandModal"), 900);
  });
}

searchInputEl.addEventListener("input", renderMarket);

favoriteFilterBtnEl.addEventListener("click", () => {
  if (!getCurrentUser().loggedIn && !marketState.favoritesOnly) {
    configureAuthModal("login");
    openModal("authModal");
    return;
  }

  marketState.favoritesOnly = !marketState.favoritesOnly;
  renderMarketTabs();
  renderMarket();
});

window.addEventListener("vision-user-updated", () => {
  renderMarketTabs();
  renderMarket();
});

bindDemandModal();
renderMarketTabs();
renderMarket();
