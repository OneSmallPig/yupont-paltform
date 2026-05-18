const heroState = {
  index: 0,
  timer: null,
  initialized: false,
};

const heroSlidesEl = document.getElementById("heroSlides");
const heroDotsEl = document.getElementById("heroDots");
const homeAlgoGridEl = document.getElementById("homeAlgoGrid");
const demoStagePanelEl = document.getElementById("demoStagePanel");
const demoPlaylistPanelEl = document.getElementById("demoPlaylistPanel");
const recommendModalTriggerEl = document.getElementById("openRecommendModal");
const recommendInputEl = document.getElementById("recommendInput");
const runRecommendBtnEl = document.getElementById("runRecommendBtn");
const recommendResultEl = document.getElementById("recommendResult");

let recommendSearchBound = false;
let heroSlideNodes = [];
let heroDotNodes = [];
let homeDemoVideoNodes = [];

function setHeroIndex(nextIndex) {
  const total = (platformData.heroSlides || []).length;
  if (!total) return;
  heroState.index = (nextIndex + total) % total;
  renderHero();
  restartHeroTimer();
}

function getHeroSlideState(index, currentIndex, total) {
  const forwardDistance = (index - currentIndex + total) % total;

  if (forwardDistance === 0) return "is-active";
  if (forwardDistance === 1) return "is-next";
  if (forwardDistance === 2) return "is-queue";
  if (forwardDistance === 3) return "is-tail";
  return "is-hidden";
}

function buildHero(slides) {
  heroSlidesEl.innerHTML = slides.map((item, index) => `
    <article class="hero-slide" data-hero-slide="${index}" aria-hidden="true">
      <img class="hero-image" src="${item.image}" alt="${item.title}">
      <div class="hero-slide-caption">
        <h2>${item.title}</h2>
        <p>${item.text}</p>
      </div>
    </article>
  `).join("");

  heroDotsEl.innerHTML = slides.map((item, index) => `
    <button
      class="hero-dot"
      type="button"
      data-hero-dot="${index}"
      aria-label="hero slide ${index + 1}"
    ></button>
  `).join("");

  heroSlideNodes = Array.from(heroSlidesEl.querySelectorAll("[data-hero-slide]"));
  heroDotNodes = Array.from(heroDotsEl.querySelectorAll("[data-hero-dot]"));

  heroDotNodes.forEach((node) => {
    node.addEventListener("click", () => {
      setHeroIndex(Number(node.dataset.heroDot));
    });
  });

  heroState.initialized = true;
}

function updateHero(slides) {
  const total = slides.length;

  heroSlideNodes.forEach((node, index) => {
    const stateClass = getHeroSlideState(index, heroState.index, total);
    node.className = `hero-slide ${stateClass}`;
    node.setAttribute("aria-hidden", String(index !== heroState.index));
  });

  heroDotNodes.forEach((node, index) => {
    node.classList.toggle("active", index === heroState.index);
    node.setAttribute("aria-current", index === heroState.index ? "true" : "false");
  });
}

function bindFeaturedCardEffects() {
  const cards = document.querySelectorAll(".sharp-featured-card");
  if (!cards.length) return;

  cards.forEach((card) => {
    const reset = () => {
      card.style.setProperty("--card-glow-x", "50%");
      card.style.setProperty("--card-glow-y", "50%");
      card.style.setProperty("--card-tilt-x", "0deg");
      card.style.setProperty("--card-tilt-y", "0deg");
    };

    reset();

    card.addEventListener("pointermove", (event) => {
      const rect = card.getBoundingClientRect();
      const offsetX = event.clientX - rect.left;
      const offsetY = event.clientY - rect.top;
      const rotateY = ((offsetX / rect.width) - 0.5) * 7;
      const rotateX = (0.5 - (offsetY / rect.height)) * 6;

      card.style.setProperty("--card-glow-x", `${(offsetX / rect.width) * 100}%`);
      card.style.setProperty("--card-glow-y", `${(offsetY / rect.height) * 100}%`);
      card.style.setProperty("--card-tilt-x", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--card-tilt-y", `${rotateY.toFixed(2)}deg`);
    });

    card.addEventListener("pointerleave", reset);
  });
}

function renderHero() {
  if (!heroSlidesEl || !heroDotsEl) return;

  const slides = platformData.heroSlides || [];
  if (!slides.length) {
    heroSlidesEl.innerHTML = "";
    heroDotsEl.innerHTML = "";
    heroSlideNodes = [];
    heroDotNodes = [];
    heroState.initialized = false;
    return;
  }

  heroState.index = ((heroState.index % slides.length) + slides.length) % slides.length;

  if (!heroState.initialized || heroSlideNodes.length !== slides.length || heroDotNodes.length !== slides.length) {
    buildHero(slides);
  }

  updateHero(slides);
}

function startHeroTimer() {
  window.clearInterval(heroState.timer);
  if ((platformData.heroSlides || []).length < 2) return;

  heroState.timer = window.setInterval(() => {
    heroState.index = (heroState.index + 1) % platformData.heroSlides.length;
    renderHero();
  }, 4200);
}

function restartHeroTimer() {
  startHeroTimer();
}

function renderHomeAlgorithms() {
  if (!homeAlgoGridEl) return;
  const featured = platformData.algorithms.filter((item) => item.featured).slice(0, 4);

  homeAlgoGridEl.innerHTML = featured.map((item) => `
    <a class="algo-card home-featured-card sharp-featured-card" href="./algorithm.html?id=${item.id}">
      <div class="algo-cover sharp-featured-cover" style="background-image: url('${item.image}');"></div>
      <div class="sharp-featured-body">
        <div class="sharp-featured-top sharp-featured-top-metrics">
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
        <p class="eyebrow">Transmission Inspection</p>
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

function createDemoStageMarkup(item) {
  return `
    <div class="demo-stage-shell">
      <div class="demo-stage-frame ${item.src ? "" : "is-poster-mode"}">
        <div class="demo-stage-glow"></div>
        <video
          class="demo-stage-video"
          id="homeDemoVideo"
          ${item.src ? `src="${item.src}"` : ""}
          poster="${item.poster}"
          playsinline
          preload="metadata"
        ></video>
        <div class="demo-stage-overlay">
          <div class="demo-stage-actions">
            ${item.src ? `<button class="primary-btn demo-inline-play" type="button" data-demo-play>播放演示</button>` : `<a class="primary-btn" href="${item.fallbackHref || "./combo.html"}">查看联动演示</a>`}
            <a class="ghost-btn demo-ghost-link" href="${item.secondaryHref || "./market.html"}">${item.secondaryLabel || "浏览算法能力"}</a>
          </div>
        </div>
      </div>
    </div>
  `;
}

function createDemoPlaylistMarkup(videos, activeId) {
  return `
    <div class="demo-playlist-shell">
      <div class="demo-playlist-head">
        <p class="eyebrow">Scene Cards</p>
        <strong>按场景查看演示</strong>
      </div>
      <div class="demo-playlist">
        ${videos.map((item, index) => `
          <button
            class="demo-playlist-item ${item.id === activeId ? "is-active" : ""}"
            type="button"
            data-demo-item="${item.id}"
            aria-pressed="${item.id === activeId ? "true" : "false"}"
          >
            <span class="demo-playlist-index">${String(index + 1).padStart(2, "0")}</span>
            <span class="demo-playlist-thumb" style="background-image: linear-gradient(180deg, rgba(8, 16, 28, 0.08), rgba(8, 16, 28, 0.42)), url('${item.poster}');"></span>
            <span class="demo-playlist-copy">
              <strong>${item.sceneTag || item.title}</strong>
              <em>${item.playlistText || item.description}</em>
            </span>
          </button>
        `).join("")}
      </div>
    </div>
  `;
}

function syncDemoSectionHeading() {
  const demoSection = document.querySelector(".demo-band .section-head");
  if (!demoSection) return;

  const titleEl = demoSection.querySelector("h2");
  const introEl = demoSection.querySelector(".section-intro");

  if (titleEl) {
    titleEl.textContent = "优秀场景演示";
  }

  if (introEl) {
    introEl.textContent = "通过视频化演示方式，围绕四大典型应用场景，对平台能力架构、业务流程及智能分析能力进行动态展示。";
  }
}

function bindHomeDemoInteractions(videos, activeId) {
  const activeVideo = videos.find((item) => item.id === activeId) || videos[0];
  const stageVideoEl = document.getElementById("homeDemoVideo");
  const playTriggerEl = document.querySelector("[data-demo-play]");

  homeDemoVideoNodes = stageVideoEl ? [stageVideoEl] : [];

  document.querySelectorAll("[data-demo-item]").forEach((node) => {
    node.addEventListener("click", () => {
      renderHomeDemoSection(node.dataset.demoItem);
    });
  });

  if (playTriggerEl && stageVideoEl && activeVideo?.src) {
    playTriggerEl.addEventListener("click", async () => {
      try {
        if (stageVideoEl.paused) {
          await stageVideoEl.play();
          playTriggerEl.textContent = "暂停演示";
        } else {
          stageVideoEl.pause();
          playTriggerEl.textContent = "播放演示";
        }
      } catch (error) {
        playTriggerEl.textContent = "浏览演示";
        playTriggerEl.setAttribute("disabled", "disabled");
      }
    });

    stageVideoEl.addEventListener("pause", () => {
      playTriggerEl.textContent = "播放演示";
    });

    stageVideoEl.addEventListener("play", () => {
      playTriggerEl.textContent = "暂停演示";
    });
  }
}

function renderHomeDemoSection(activeId) {
  if (!demoStagePanelEl || !demoPlaylistPanelEl) return;

  syncDemoSectionHeading();

  const videos = platformData.homeVideoShowcase || [];
  if (!videos.length) {
    demoStagePanelEl.innerHTML = "";
    demoPlaylistPanelEl.innerHTML = "";
    return;
  }

  const activeVideo = videos.find((item) => item.id === activeId) || videos[0];

  demoStagePanelEl.innerHTML = createDemoStageMarkup(activeVideo);
  demoPlaylistPanelEl.innerHTML = createDemoPlaylistMarkup(videos, activeVideo.id);

  bindHomeDemoInteractions(videos, activeVideo.id);
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
  const directMatches = platformData.algorithms.filter((item) => {
    const text = [
      item.name,
      item.subtitle,
      item.industry,
      item.scene,
      item.category,
      item.badge,
      item.stack,
      item.desc,
      item.businessDesc,
    ].join(" ").toLowerCase();

    return keywords && text.includes(keywords);
  });

  rules.forEach((rule) => {
    const matched = rule.keys.some((key) => keywords.includes(key));
    if (matched) {
      rule.ids.forEach((id) => matchedIds.add(id));
      hitKeywords.push(...rule.keys.filter((key) => keywords.includes(key)));
    }
  });

  directMatches.forEach((item) => {
    matchedIds.add(item.id);
    [item.name, item.industry, item.scene, item.category].forEach((token) => {
      if (keywords.includes(String(token || "").toLowerCase())) {
        hitKeywords.push(token);
      }
    });
  });

  if (!matchedIds.size) {
    platformData.algorithms.slice(0, 3).forEach((item) => matchedIds.add(item.id));
  }

  return {
    keywords: [...new Set(hitKeywords)].slice(0, 6),
    algorithms: [...matchedIds].map((id) => platformData.algorithms.find((item) => item.id === id)).filter(Boolean),
  };
}

function runRecommendationQuery(query) {
  if (!recommendInputEl || !recommendResultEl) return;

  const nextQuery = String(query || "").trim();
  if (!nextQuery) return;

  recommendInputEl.value = nextQuery;
  openModal("recommendModal");
  renderRecommendationResult();
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
          <div class="recommend-item-cover" style="background-image: url('${item.image}')"></div>
          <div class="recommend-item-body">
            <div class="recommend-item-top">
              <span class="sharp-featured-type">${item.category}</span>
              <div class="sharp-featured-actions">
                <span class="icon-pill" aria-label="收藏数">★ ${item.favorites}</span>
                <span class="icon-pill" aria-label="测试数">◉ ${item.tests}</span>
              </div>
            </div>
            <strong>${item.name}</strong>
            <p>${item.businessDesc}</p>
            <div class="algo-meta">
              <span class="status-pill status-pill-accent">${item.badge}</span>
              <span class="status-pill">${item.scene}</span>
            </div>
          </div>
        </a>
      `).join("")}
    </div>
  `;
}

function initRecommendationModal() {
  recommendModalTriggerEl?.addEventListener("click", () => openModal("recommendModal"));
  runRecommendBtnEl.addEventListener("click", renderRecommendationResult);

  if (!recommendSearchBound) {
    recommendSearchBound = true;
    document.addEventListener("submit", (event) => {
      const form = event.target.closest("#recommendSearchForm");
      if (!form) return;
      event.preventDefault();
      const input = form.querySelector("#headerRecommendSearch");
      runRecommendationQuery(input?.value || "");
    });
  }

  bindGlobalModalActions();
}

function initHome() {
  renderHero();
  renderHomeAlgorithms();
  renderHomeDemoSection();
  bindFeaturedCardEffects();
  initRecommendationModal();
  startHeroTimer();
}

initHome();
