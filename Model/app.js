const heroState = {
  index: 0,
  timer: null,
};

const heroSlidesEl = document.getElementById("heroSlides");
const heroDotsEl = document.getElementById("heroDots");
const homeAlgoGridEl = document.getElementById("homeAlgoGrid");
const industryGridEl = document.getElementById("industryGrid");
const resourceListEl = document.getElementById("resourceList");
const newsMainEl = document.getElementById("newsMain");
const solutionFeatureEl = document.getElementById("solutionFeature");
const recommendModalTriggerEl = document.getElementById("openRecommendModal");
const recommendInputEl = document.getElementById("recommendInput");
const runRecommendBtnEl = document.getElementById("runRecommendBtn");
const recommendResultEl = document.getElementById("recommendResult");

function renderHero() {
  if (!heroSlidesEl || !heroDotsEl) return;

  heroSlidesEl.innerHTML = platformData.heroSlides.map((item, index) => `
    <article class="hero-slide ${index === heroState.index ? "active" : ""}">
      <img class="hero-image" src="${item.image}" alt="${item.title}">
      <div class="hero-slide-caption">
        <p class="eyebrow">Scene Focus</p>
        <h2>${item.title}</h2>
        <p>${item.text}</p>
      </div>
    </article>
  `).join("");

  heroDotsEl.innerHTML = platformData.heroSlides.map((_, index) => `
    <button class="hero-dot ${index === heroState.index ? "active" : ""}" data-hero-dot="${index}" type="button"></button>
  `).join("");

  document.querySelectorAll("[data-hero-dot]").forEach((node) => {
    node.addEventListener("click", () => {
      heroState.index = Number(node.dataset.heroDot);
      renderHero();
      restartHeroTimer();
    });
  });
}

function startHeroTimer() {
  heroState.timer = window.setInterval(() => {
    heroState.index = (heroState.index + 1) % platformData.heroSlides.length;
    renderHero();
  }, 4200);
}

function restartHeroTimer() {
  window.clearInterval(heroState.timer);
  startHeroTimer();
}

function renderHomeAlgorithms() {
  if (!homeAlgoGridEl) return;
  const featured = platformData.algorithms.filter((item) => item.featured).slice(0, 4);

  homeAlgoGridEl.innerHTML = featured.map((item) => `
    <a class="algo-card home-featured-card sharp-featured-card" href="./algorithm.html?id=${item.id}">
      <div class="algo-cover sharp-featured-cover" style="background-image: url('${item.image}');"></div>
      <div class="sharp-featured-body">
        <div class="sharp-featured-top">
          <span class="sharp-featured-type">${item.category}</span>
          <div class="sharp-featured-actions">
            <span class="icon-pill" aria-label="收藏数">★ ${item.favorites}</span>
            <span class="icon-pill" aria-label="测试数">◉ ${item.tests}</span>
          </div>
        </div>
        <h3>${item.name}</h3>
        <p class="sharp-featured-text">${item.businessDesc}</p>
      </div>
    </a>
  `).join("");
}

function renderIndustrySection() {
  if (!industryGridEl) return;
  const [featuredIndustry, ...restIndustries] = platformData.industries;

  if (solutionFeatureEl && featuredIndustry) {
    solutionFeatureEl.innerHTML = `
      <div class="solution-feature-copy">
        <p class="eyebrow">Core Solutions</p>
        <h3>${featuredIndustry.name}</h3>
        <p>${featuredIndustry.desc}</p>
        <a class="primary-btn solution-feature-btn" href="./market.html">了解更多</a>
      </div>
      <div class="solution-feature-visual">
        <div class="solution-orbit orbit-a"></div>
        <div class="solution-orbit orbit-b"></div>
        <div class="solution-orbit orbit-c"></div>
        <div class="solution-float-card float-card-a">
          <span></span>
          <strong>${featuredIndustry.scenes[0]}</strong>
          <p>面向高频巡检问题提供快速识别入口</p>
        </div>
        <div class="solution-float-card float-card-b media">
          <div class="float-card-media"></div>
          <strong>${featuredIndustry.scenes[1]}</strong>
          <p>支持图像样本与检测结果联动展示</p>
        </div>
        <div class="solution-float-card float-card-c">
          <span></span>
          <strong>${featuredIndustry.scenes[2]}</strong>
          <p>适配方案演示与在线检测验证流程</p>
        </div>
      </div>
    `;
  }

  industryGridEl.innerHTML = restIndustries.map((item, index) => `
    <article class="industry-card industry-solution-item">
      <span class="industry-item-index">0${index + 2}</span>
      <div class="industry-item-copy">
        <h3>${item.name}</h3>
        <p>${item.desc}</p>
      </div>
    </article>
  `).join("");
}

function renderResources() {
  if (!resourceListEl || !newsMainEl) return;
  newsMainEl.innerHTML = `
    <article class="news-feature support-feature">
      <div class="news-body">
        <p class="eyebrow">Resource Center</p>
        <h3>在线检测、结果导出与项目支持资料一体呈现</h3>
        <p>围绕算法目录、检测说明、项目案例和商务支撑资料，形成更适合客户沟通和演示的资源中心入口。</p>
        <span class="news-meta">售前支持 · 2026-03-17</span>
      </div>
    </article>
  `;

  resourceListEl.innerHTML = platformData.resources.slice(0, 4).map((item, index) => `
    <article class="resource-card support-card">
      <span class="resource-tag">0${index + 1}</span>
      <div>
        <strong>${item.title}</strong>
        <p>${item.meta}</p>
      </div>
    </article>
  `).join("");
}

function getRecommendationMatches(query) {
  const keywords = query.toLowerCase();
  const rules = [
    { keys: ["输电", "线路", "本体", "缺陷"], ids: ["algo-1", "algo-6"] },
    { keys: ["烟雾", "山火", "火情"], ids: ["algo-2"] },
    { keys: ["杆塔", "配网", "部件"], ids: ["algo-3"] },
    { keys: ["光伏", "热斑"], ids: ["algo-4"] },
    { keys: ["安全", "安检", "人员", "作业"], ids: ["algo-5"] },
    { keys: ["变电", "设备"], ids: ["algo-9"] },
    { keys: ["去雾", "增强", "低能见度"], ids: ["algo-7"] },
  ];

  const matchedIds = new Set();
  const hitKeywords = [];

  rules.forEach((rule) => {
    const matched = rule.keys.some((key) => keywords.includes(key));
    if (matched) {
      rule.ids.forEach((id) => matchedIds.add(id));
      hitKeywords.push(...rule.keys.filter((key) => keywords.includes(key)));
    }
  });

  if (!matchedIds.size) {
    platformData.algorithms.slice(0, 3).forEach((item) => matchedIds.add(item.id));
  }

  return {
    keywords: [...new Set(hitKeywords)].slice(0, 6),
    algorithms: [...matchedIds].map((id) => platformData.algorithms.find((item) => item.id === id)).filter(Boolean),
  };
}

function renderRecommendationResult() {
  const query = recommendInputEl.value.trim();
  if (!query) return;

  const matches = getRecommendationMatches(query);
  recommendResultEl.innerHTML = `
    <div class="recommend-keywords">
      <span>识别关键词</span>
      <div class="combo-tags">
        ${(matches.keywords.length ? matches.keywords : ["输电巡检", "目标检测", "在线导出"]).map((item) => `<span class="combo-tag">${item}</span>`).join("")}
      </div>
    </div>
    <div class="recommend-grid">
      ${matches.algorithms.map((item) => `
        <a class="recommend-item" href="./algorithm.html?id=${item.id}">
          <strong>${item.name}</strong>
          <p>${item.businessDesc}</p>
          <div class="algo-meta">
            <span class="status-pill status-pill-accent">${item.badge}</span>
            <span class="status-pill">${item.scene}</span>
          </div>
        </a>
      `).join("")}
    </div>
  `;
}

function initRecommendationModal() {
  if (!recommendModalTriggerEl) return;
  recommendModalTriggerEl.addEventListener("click", () => openModal("recommendModal"));
  runRecommendBtnEl.addEventListener("click", renderRecommendationResult);
  bindGlobalModalActions();
}

function initHome() {
  renderHero();
  renderHomeAlgorithms();
  renderIndustrySection();
  renderResources();
  initRecommendationModal();
  startHeroTimer();
}

initHome();
