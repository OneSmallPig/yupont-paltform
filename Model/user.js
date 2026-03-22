const userCenterNavEl = document.getElementById("userCenterNav");
const userCenterHeaderEl = document.getElementById("userCenterHeader");
const userCenterContentEl = document.getElementById("userCenterContent");

const userSections = [
  { key: "profile", label: "用户信息" },
  { key: "favorites", label: "个人收藏" },
  { key: "history", label: "测试历史" },
  { key: "keys", label: "API 密钥" },
  { key: "settings", label: "账户设置" },
];

const userCenterState = {
  active: "profile",
  keyFormOpen: false,
};

function requireLogin() {
  const user = getCurrentUser();
  if (user.loggedIn) return true;
  configureAuthModal("login");
  openModal("authModal");
  return false;
}

function renderUserHeader() {
  const user = getCurrentUser();
  userCenterHeaderEl.innerHTML = `
    <div class="user-summary-card user-summary-panel">
      <div class="user-summary-avatar">${user.name.slice(0, 1)}</div>
      <div class="user-summary-copy">
        <h1>${user.name}</h1>
        <p>${user.role} · ${user.company}</p>
      </div>
    </div>
    <div class="user-summary-meta user-summary-panel">
      <div class="user-summary-stat">
        <span>收藏数</span>
        <strong>${user.favorites.length}</strong>
      </div>
      <div class="user-summary-stat">
        <span>检测历史</span>
        <strong>${user.history.length}</strong>
      </div>
      <div class="user-summary-stat">
        <span>API 密钥</span>
        <strong>${user.apiKeys.length}</strong>
      </div>
    </div>
  `;
}

function renderUserNav() {
  userCenterNavEl.innerHTML = userSections.map((item) => `
    <button class="user-nav-item ${userCenterState.active === item.key ? "active" : ""}" type="button" data-user-tab="${item.key}">
      ${item.label}
    </button>
  `).join("");

  document.querySelectorAll("[data-user-tab]").forEach((node) => {
    node.addEventListener("click", () => {
      userCenterState.active = node.dataset.userTab;
      renderUserNav();
      renderUserContent();
    });
  });
}

function renderProfile(user) {
  return `
    <section class="section-card user-section-panel">
      <div class="section-head-inline">
        <h2>用户信息</h2>
      </div>
      <div class="info-list">
        <div class="info-row"><span>用户名</span><strong>${user.name}</strong></div>
        <div class="info-row"><span>邮箱</span><strong>${user.email}</strong></div>
        <div class="info-row"><span>手机号</span><strong>${user.phone}</strong></div>
        <div class="info-row"><span>所属单位</span><strong>${user.company}</strong></div>
        <div class="info-row"><span>账户类型</span><strong>${user.membership}</strong></div>
      </div>
    </section>
  `;
}

function renderFavorites(user) {
  const favoriteItems = user.favorites
    .map((id) => platformData.algorithms.find((entry) => entry.id === id))
    .filter(Boolean);

  return `
    <section class="section-card user-section-panel">
      <div class="section-head-inline">
        <h2>个人收藏</h2>
      </div>
      <div class="user-data-list">
        ${favoriteItems.length ? favoriteItems.map((item) => `
          <article class="user-list-row user-favorite-row">
            <div class="user-list-media" style="background-image: url('${item.image}')"></div>
            <div class="user-list-main">
              <strong>${item.name}</strong>
              <p>${item.businessDesc}</p>
            </div>
            <div class="user-list-meta">
              <span>${item.industry}</span>
              <strong>${item.metric}</strong>
            </div>
            <div class="user-list-actions">
              <a class="list-link-btn" href="./algorithm.html?id=${item.id}">查看详情</a>
              <button class="list-link-btn list-link-btn-danger" type="button" data-remove-favorite="${item.id}">移除收藏</button>
            </div>
          </article>
        `).join("") : `<div class="user-empty-state">当前还没有收藏项，可在算法商城中加入收藏。</div>`}
      </div>
    </section>
  `;
}

function renderHistory(user) {
  return `
    <section class="section-card user-section-panel">
      <div class="section-head-inline">
        <h2>测试历史</h2>
      </div>
      <div class="table-wrap">
        <table class="history-table">
          <thead>
            <tr>
              <th>算法名称</th>
              <th>类型</th>
              <th>检测时间</th>
              <th>状态</th>
              <th>结果</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            ${user.history.map((item) => {
              const algorithm = platformData.algorithms.find((entry) => entry.id === item.algorithmId);
              return `
                <tr>
                  <td>${algorithm.name}</td>
                  <td>${item.type}</td>
                  <td>${item.time}</td>
                  <td><span class="status-pill status-pill-accent">${item.status}</span></td>
                  <td>${item.result}</td>
                  <td><a href="./algorithm.html?id=${algorithm.id}">查看</a></td>
                </tr>
              `;
            }).join("")}
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function renderKeys(user) {
  const formClassName = userCenterState.keyFormOpen ? "api-key-form is-visible" : "api-key-form";

  return `
    <section class="section-card user-section-panel">
      <div class="section-head-inline section-head-actions">
        <h2>API 密钥</h2>
        <button class="list-link-btn" type="button" id="toggleApiKeyFormBtn">${userCenterState.keyFormOpen ? "收起表单" : "新增密钥"}</button>
      </div>
      <form class="${formClassName}" id="apiKeyForm">
        <label class="user-inline-field">
          <span>密钥名称</span>
          <input id="apiKeyNameInput" name="apiKeyName" type="text" maxlength="30" placeholder="例如：项目演示环境 Key">
        </label>
        <button class="list-link-btn" type="submit">生成密钥</button>
      </form>
      <div class="user-data-list api-key-list">
        ${user.apiKeys.length ? `
          <div class="user-list-head api-key-head">
            <span>名称</span>
            <span>密钥</span>
            <span>时间</span>
            <span>状态</span>
            <span>操作</span>
          </div>
        ` : ""}
        ${user.apiKeys.length ? user.apiKeys.map((item) => `
          <article class="user-list-row api-key-item">
            <div class="user-list-main api-key-name">
              <strong>${item.name}</strong>
            </div>
            <div class="api-key-value" title="${item.value}">${item.value}</div>
            <div class="user-list-meta api-key-date">
              <span>${item.createdAt}</span>
            </div>
            <div class="api-key-status">
              <button class="list-link-btn ${item.status === "停用" ? "list-link-btn-muted" : "list-link-btn-accent"}" type="button" data-toggle-api-key="${item.id}">${item.status}</button>
            </div>
            <div class="user-list-actions api-key-actions">
              <button class="list-link-btn list-link-btn-danger" type="button" data-delete-api-key="${item.id}">删除</button>
            </div>
          </article>
        `).join("") : `<div class="user-empty-state">当前还没有 API 密钥，请先新增一项。</div>`}
      </div>
    </section>
  `;
}

function renderSettings(user) {
  const settingItems = [
    { key: "notifyEmail", label: "邮件通知", desc: "接收检测完成、密钥变更和平台通知。" },
    { key: "notifySms", label: "短信通知", desc: "针对关键任务和异常结果发送短信提醒。" },
    { key: "watermarkExport", label: "导出水印", desc: "导出结果文档时追加账户标识水印。" },
  ];

  return `
    <section class="section-card user-section-panel">
      <div class="section-head-inline">
        <h2>账户设置</h2>
      </div>
      <div class="settings-list">
        ${settingItems.map((item) => `
          <div class="settings-row">
            <div class="settings-copy">
              <strong>${item.label}</strong>
              <p>${item.desc}</p>
            </div>
            <label class="switch-toggle">
              <input type="checkbox" data-setting-toggle="${item.key}" ${user.settings[item.key] ? "checked" : ""}>
              <span class="switch-slider"></span>
            </label>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function renderUserContent() {
  const user = getCurrentUser();
  const map = {
    profile: renderProfile(user),
    favorites: renderFavorites(user),
    history: renderHistory(user),
    keys: renderKeys(user),
    settings: renderSettings(user),
  };
  userCenterContentEl.innerHTML = map[userCenterState.active];
  bindUserContentEvents();
}

function bindUserContentEvents() {
  document.querySelectorAll("[data-remove-favorite]").forEach((node) => {
    node.addEventListener("click", () => {
      removeFavoriteAlgorithm(node.dataset.removeFavorite);
    });
  });

  document.getElementById("toggleApiKeyFormBtn")?.addEventListener("click", () => {
    userCenterState.keyFormOpen = !userCenterState.keyFormOpen;
    renderUserContent();
  });

  document.getElementById("apiKeyForm")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const input = document.getElementById("apiKeyNameInput");
    const result = addUserApiKey(input?.value);
    if (!result?.ok) {
      window.alert(result?.error || "新增密钥失败，请稍后重试。");
      return;
    }
    userCenterState.keyFormOpen = false;
    renderUserCenter();
  });

  document.querySelectorAll("[data-toggle-api-key]").forEach((node) => {
    node.addEventListener("click", () => {
      toggleUserApiKeyStatus(node.dataset.toggleApiKey);
    });
  });

  document.querySelectorAll("[data-delete-api-key]").forEach((node) => {
    node.addEventListener("click", () => {
      deleteUserApiKey(node.dataset.deleteApiKey);
    });
  });

  document.querySelectorAll("[data-setting-toggle]").forEach((node) => {
    node.addEventListener("change", () => {
      updateUserSetting(node.dataset.settingToggle, node.checked);
    });
  });
}

function renderUserCenter() {
  renderUserHeader();
  renderUserNav();
  renderUserContent();
}

if (requireLogin()) {
  renderUserCenter();
}

window.addEventListener("vision-user-updated", () => {
  if (getCurrentUser().loggedIn) {
    renderUserCenter();
  }
});
