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
    <button class="hero-dot ${index === heroState.index ? "active" : ""}" data-hero-dot="${index}"></button>
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
    <article class="algo-card home-featured-card">
      <div class="algo-cover" style="background-image: linear-gradient(180deg, rgba(14, 16, 24, 0.08), rgba(14, 16, 24, 0.35)), url('${item.image}');"></div>
      <p class="eyebrow">${item.industry}</p>
      <h3>${item.name}</h3>
      <p>${item.subtitle}</p>
      <div class="algo-meta">
        <span class="status-pill">${item.category}</span>
        <span class="status-pill">${item.metric}</span>
      </div>
      <a class="ghost-btn small" href="./market.html">查看详情</a>
    </article>
  `).join("");
}

function renderIndustrySection() {
  if (!industryGridEl) return;

  industryGridEl.innerHTML = platformData.industries.map((item, index) => `
    <article class="industry-card industry-tile">
      <span class="industry-icon">0${index + 1}</span>
      <p class="eyebrow">${item.name}</p>
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <div class="algo-meta">
        ${item.scenes.map((scene) => `<span class="status-pill">${scene}</span>`).join("")}
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
        <h3>沉淀演示资料、能力说明与项目案例</h3>
        <p>围绕方案介绍、算法目录、测试报告和商务资料，形成更适合客户沟通的资源中心入口。</p>
        <span class="news-meta">售前支撑 · 2026-03-16</span>
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

function initHome() {
  renderHero();
  renderHomeAlgorithms();
  renderIndustrySection();
  renderResources();
  startHeroTimer();
}

initHome();
