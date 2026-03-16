const llmGridEl = document.getElementById("llmGrid");
const llmScenarioEl = document.getElementById("llmScenarios");

function renderLlms() {
  llmGridEl.innerHTML = platformData.llms.map((item, index) => `
    <article class="llm-card ${index === 0 ? "active" : ""}">
      <span class="llm-index">0${index + 1}</span>
      <p class="eyebrow">${item.type}</p>
      <h3>${item.name}</h3>
      <p>${item.desc}</p>
      <div class="algo-meta">
        ${item.tags.map((tag) => `<span class="status-pill">${tag}</span>`).join("")}
      </div>
    </article>
  `).join("");

  llmScenarioEl.innerHTML = [
    "巡检图像理解与缺陷归因",
    "多模态预警事件分析",
    "运维知识问答与辅助决策",
    "演示场景中的智能报告生成",
  ].map((item) => `
    <article class="scenario-row">
      <strong>${item}</strong>
      <p>面向电力业务流程输出更具交互性和解释性的模型能力。</p>
    </article>
  `).join("");
}

renderLlms();
