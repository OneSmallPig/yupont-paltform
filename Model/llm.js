const llmGridEl = document.getElementById("llmGrid");
const llmScenarioEl = document.getElementById("llmScenarios");

function isFavoriteLlm(llmId) {
  return getCurrentUser().favorites.includes(llmId);
}

function getLlmFavoriteTotal(item) {
  return item.favorites + (isFavoriteLlm(item.id) ? 1 : 0);
}

function renderLlms() {
  llmGridEl.innerHTML = platformData.llms.map((item, index) => `
    <article class="llm-card ${index === 0 ? "active" : ""}">
      <div class="llm-card-bg" aria-hidden="true">
        <span></span>
        <span></span>
      </div>
      <div class="llm-card-head">
        <div class="llm-card-index-block">
          <span class="llm-index">0${index + 1}</span>
          <span class="llm-card-badge">${item.badge}</span>
        </div>
        <button class="hero-favorite-mini llm-favorite-btn ${isFavoriteLlm(item.id) ? "is-active" : ""}" type="button" data-llm-favorite="${item.id}" aria-label="${isFavoriteLlm(item.id) ? "取消收藏" : "加入收藏"}" title="${isFavoriteLlm(item.id) ? "取消收藏" : "加入收藏"}">
          <span aria-hidden="true">${isFavoriteLlm(item.id) ? "★" : "☆"}</span>
          <strong>${getLlmFavoriteTotal(item)}</strong>
        </button>
      </div>
      <p class="eyebrow llm-type">${item.type}</p>
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <div class="llm-tag-row">
        ${item.tags.map((tag, tagIndex) => `<span class="llm-tag ${tagIndex === 0 ? "llm-tag-accent" : ""}">${tag}</span>`).join("")}
      </div>
    </article>
  `).join("");

  llmScenarioEl.innerHTML = [
    "巡检图像理解与缺陷归因",
    "多模态预警事件分析",
    "运维知识问答与辅助决策",
    "演示场景中的智能报告生成",
  ].map((item, index) => `
    <article class="scenario-row">
      <span class="scenario-index">0${index + 1}</span>
      <div class="scenario-copy">
        <strong>${item}</strong>
        <p>面向电力业务流程输出更具交互性和解释性的模型能力。</p>
      </div>
    </article>
  `).join("");

  document.querySelectorAll("[data-llm-favorite]").forEach((node) => {
    node.addEventListener("click", () => {
      const result = toggleFavoriteAlgorithm(node.dataset.llmFavorite);
      if (result === null) return;
      renderLlms();
    });
  });
}

window.addEventListener("vision-user-updated", () => {
  renderLlms();
});

renderLlms();
