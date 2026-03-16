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
    <div class="user-summary-card">
      <div class="user-summary-avatar">${user.name.slice(0, 1)}</div>
      <div>
        <h1>${user.name}</h1>
        <p>${user.role} · ${user.company}</p>
      </div>
    </div>
    <div class="user-summary-meta">
      <div class="metric-card">
        <span>收藏数</span>
        <strong>${user.favorites.length}</strong>
      </div>
      <div class="metric-card">
        <span>检测历史</span>
        <strong>${user.history.length}</strong>
      </div>
      <div class="metric-card">
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
    <div class="section-card">
      <div class="info-list">
        <div class="info-row"><span>用户名</span><strong>${user.name}</strong></div>
        <div class="info-row"><span>邮箱</span><strong>${user.email}</strong></div>
        <div class="info-row"><span>手机号</span><strong>${user.phone}</strong></div>
        <div class="info-row"><span>所属单位</span><strong>${user.company}</strong></div>
      </div>
    </div>
  `;
}

function renderFavorites(user) {
  return `
    <div class="user-card-grid">
      ${user.favorites.map((id) => {
        const item = platformData.algorithms.find((entry) => entry.id === id);
        return `
          <a class="favorite-card" href="./algorithm.html?id=${item.id}">
            <div class="favorite-cover" style="background-image: url('${item.image}')"></div>
            <strong>${item.name}</strong>
            <span>${item.scene}</span>
          </a>
        `;
      }).join("")}
    </div>
  `;
}

function renderHistory(user) {
  return `
    <div class="section-card">
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
  `;
}

function renderKeys(user) {
  return `
    <div class="section-card api-key-list">
      ${user.apiKeys.map((item) => `
        <article class="api-key-item">
          <div>
            <strong>${item.name}</strong>
            <p>${item.value}</p>
          </div>
          <div class="api-key-meta">
            <span>${item.createdAt}</span>
            <span class="status-pill">${item.status}</span>
          </div>
        </article>
      `).join("")}
    </div>
  `;
}

function renderSettings(user) {
  return `
    <div class="section-card settings-list">
      <div class="info-row"><span>邮件通知</span><strong>${user.settings.notifyEmail ? "开启" : "关闭"}</strong></div>
      <div class="info-row"><span>短信通知</span><strong>${user.settings.notifySms ? "开启" : "关闭"}</strong></div>
      <div class="info-row"><span>导出水印</span><strong>${user.settings.watermarkExport ? "开启" : "关闭"}</strong></div>
      <div class="info-row"><span>页面主题</span><strong>${user.settings.theme}</strong></div>
    </div>
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
