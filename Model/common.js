const USER_STORAGE_KEY = "vision-platform-user";
const ACCOUNT_STORAGE_KEY = "vision-platform-accounts";

const defaultUserProfile = {
  loggedIn: false,
  account: "demo",
  name: "体验用户",
  email: "demo@yupont.com",
  phone: "138-0000-1024",
  company: "北京煜邦电力技术股份有限公司",
  role: "平台体验用户",
  avatar: "./logo.png",
  membership: "专业版",
  favorites: ["algo-1", "algo-4", "algo-9"],
  apiKeys: [
    { name: "生产环境 Key", value: "sk-live-yupont-vision-2026-prod", createdAt: "2026-03-01", status: "启用" },
    { name: "测试环境 Key", value: "sk-test-yupont-vision-2026-dev", createdAt: "2026-02-22", status: "启用" },
  ],
  history: [
    { id: "his-1", algorithmId: "algo-1", type: "图片", time: "2026-03-16 14:30", status: "成功", result: "检测到2处异常" },
    { id: "his-2", algorithmId: "algo-4", type: "图片", time: "2026-03-15 10:15", status: "成功", result: "检测到热斑与组件异常" },
    { id: "his-3", algorithmId: "algo-9", type: "视频", time: "2026-03-14 16:45", status: "成功", result: "识别到3类设备缺陷" },
  ],
  settings: {
    notifyEmail: true,
    notifySms: false,
    watermarkExport: true,
    theme: "商务浅色",
  },
};

const defaultAccounts = [
  {
    account: "demo",
    password: "demo123456",
    name: "体验用户",
    email: "demo@yupont.com",
    phone: "138-0000-1024",
    company: "北京煜邦电力技术股份有限公司",
    role: "平台体验用户",
    membership: "专业版",
    favorites: [...defaultUserProfile.favorites],
    apiKeys: [...defaultUserProfile.apiKeys],
    history: [...defaultUserProfile.history],
    settings: { ...defaultUserProfile.settings },
  },
];

function normalizeIdentifier(value) {
  return String(value || "").trim().toLowerCase();
}

function getStoredUser() {
  try {
    const saved = window.localStorage.getItem(USER_STORAGE_KEY);
    if (!saved) return { ...defaultUserProfile };
    return { ...defaultUserProfile, ...JSON.parse(saved) };
  } catch (error) {
    return { ...defaultUserProfile };
  }
}

function saveStoredUser(profile) {
  window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(profile));
}

function getStoredAccounts() {
  try {
    const saved = window.localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (!saved) return [...defaultAccounts];
    return JSON.parse(saved);
  } catch (error) {
    return [...defaultAccounts];
  }
}

function saveStoredAccounts(accounts) {
  window.localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(accounts));
}

function buildUserProfileFromAccount(account) {
  const { password, ...rest } = account;
  return {
    ...defaultUserProfile,
    ...rest,
    loggedIn: true,
  };
}

function getCurrentUser() {
  if (!window.__visionUserProfile) {
    window.__visionUserProfile = getStoredUser();
  }
  return window.__visionUserProfile;
}

function getPlatformAccounts() {
  if (!window.__visionAccounts) {
    window.__visionAccounts = getStoredAccounts();
  }
  return window.__visionAccounts;
}

function savePlatformAccounts(accounts) {
  window.__visionAccounts = accounts;
  saveStoredAccounts(accounts);
}

function syncCurrentUserToAccounts() {
  const user = getCurrentUser();
  if (!user.loggedIn) return;

  const accounts = getPlatformAccounts();
  const index = accounts.findIndex((item) => normalizeIdentifier(item.account) === normalizeIdentifier(user.account) || normalizeIdentifier(item.email) === normalizeIdentifier(user.email));
  if (index === -1) return;

  accounts[index] = {
    ...accounts[index],
    account: user.account || accounts[index].account,
    name: user.name,
    email: user.email,
    phone: user.phone,
    company: user.company,
    role: user.role,
    membership: user.membership,
    favorites: [...user.favorites],
    apiKeys: [...user.apiKeys],
    history: [...user.history],
    settings: { ...user.settings },
  };
  savePlatformAccounts(accounts);
}

function updateCurrentUser(patch) {
  window.__visionUserProfile = { ...getCurrentUser(), ...patch };
  saveStoredUser(window.__visionUserProfile);
  syncCurrentUserToAccounts();
  renderGlobalHeader();
  window.dispatchEvent(new CustomEvent("vision-user-updated", { detail: window.__visionUserProfile }));
}

function findAccountByIdentifier(identifier) {
  const normalized = normalizeIdentifier(identifier);
  return getPlatformAccounts().find((item) => normalizeIdentifier(item.account) === normalized || normalizeIdentifier(item.email) === normalized) || null;
}

function authenticatePlatformAccount(identifier, password) {
  const account = findAccountByIdentifier(identifier);
  if (!account) {
    return { ok: false, error: "未找到对应账号，请检查用户名或邮箱。" };
  }
  if (account.password !== String(password || "").trim()) {
    return { ok: false, error: "密码不正确，请重新输入。" };
  }
  const profile = buildUserProfileFromAccount(account);
  updateCurrentUser(profile);
  return { ok: true, profile };
}

function registerPlatformAccount(payload) {
  const accountValue = String(payload.account || "").trim();
  const emailValue = String(payload.email || "").trim();
  const passwordValue = String(payload.password || "").trim();

  if (!accountValue || !emailValue || !passwordValue) {
    return { ok: false, error: "请完整填写账号、邮箱和密码信息。" };
  }

  const accounts = getPlatformAccounts();
  const hasDuplicate = accounts.some((item) => normalizeIdentifier(item.account) === normalizeIdentifier(accountValue) || normalizeIdentifier(item.email) === normalizeIdentifier(emailValue));
  if (hasDuplicate) {
    return { ok: false, error: "账号或邮箱已存在，请更换后再提交。" };
  }

  const nextAccount = {
    account: accountValue,
    password: passwordValue,
    name: String(payload.name || accountValue).trim() || accountValue,
    email: emailValue,
    phone: String(payload.phone || "").trim() || defaultUserProfile.phone,
    company: String(payload.company || "").trim() || "待完善单位信息",
    role: "平台申请用户",
    membership: "标准版",
    favorites: [],
    apiKeys: [],
    history: [],
    settings: { ...defaultUserProfile.settings },
  };

  savePlatformAccounts([...accounts, nextAccount]);
  const profile = buildUserProfileFromAccount(nextAccount);
  updateCurrentUser(profile);
  return { ok: true, profile };
}

function isFavoriteAlgorithm(algorithmId) {
  return getCurrentUser().favorites.includes(algorithmId);
}

function toggleFavoriteAlgorithm(algorithmId) {
  const user = getCurrentUser();

  if (!user.loggedIn) {
    configureAuthModal("login");
    openModal("authModal");
    return null;
  }

  const nextFavorites = isFavoriteAlgorithm(algorithmId)
    ? user.favorites.filter((id) => id !== algorithmId)
    : [...new Set([...user.favorites, algorithmId])];

  updateCurrentUser({ favorites: nextFavorites });
  return nextFavorites.includes(algorithmId);
}

function buildHeaderMarkup() {
  const user = getCurrentUser();
  const page = document.body.dataset.page || "home";
  const navs = [
    { key: "home", label: "首页", href: "./index.html" },
    { key: "market", label: "算法商城", href: "./market.html" },
    { key: "llm", label: "大模型平台", href: "./llm.html" },
    { key: "resources", label: "资源中心", href: "./resources.html" },
  ];

  return `
    <div class="header-inner">
      <a class="brand" href="./index.html">
        <div class="brand-logo">
          <img src="./logo.png" alt="煜邦电力 Logo">
        </div>
        <div class="brand-copy">
          <strong>视觉算法平台</strong>
        </div>
      </a>
      <nav class="top-nav">
        ${navs.map((item) => `<a class="nav-link ${page === item.key ? "active" : ""}" href="${item.href}">${item.label}</a>`).join("")}
      </nav>
      <div class="header-actions header-user-area">
        <div class="user-menu ${user.loggedIn ? "is-authenticated" : ""}">
          <button class="user-menu-trigger" type="button" id="userMenuTrigger">
            <span class="user-avatar ${user.loggedIn ? "" : "user-avatar-guest"}">${user.loggedIn ? user.name.slice(0, 1) : ""}</span>
          </button>
          <div class="user-menu-panel" id="userMenuPanel">
            ${user.loggedIn ? `
              <div class="user-menu-summary">
                <strong>${user.name}</strong>
                <span>${user.email}</span>
              </div>
              <a class="user-menu-link" href="./user.html">进入用户页面</a>
              <button class="user-menu-link" type="button" id="logoutAction">退出登录</button>
            ` : `
              <div class="user-menu-summary">
                <strong>用户中心</strong>
                <span>登录后查看个人信息</span>
              </div>
              <button class="user-menu-link" type="button" data-auth-mode="login">登录</button>
            `}
          </div>
        </div>
      </div>
    </div>
  `;
}

function ensureGlobalModals() {
  if (!document.getElementById("authModal")) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = `
      <div class="modal-shell" id="authModal">
        <div class="modal-mask" data-close-modal="authModal"></div>
        <div class="modal-card auth-card">
          <button class="modal-close" type="button" data-close-modal="authModal">×</button>
          <div class="modal-head">
            <p class="eyebrow">Account Access</p>
            <h3 id="authTitle">登录平台</h3>
            <p id="authDesc">登录后可查看收藏、测试历史、API 密钥与账户设置。</p>
          </div>
          <form class="auth-form" id="authForm" data-mode="login">
            <label>
              <span>账号</span>
              <input id="authAccount" name="account" type="text" placeholder="请输入用户名或邮箱" required>
            </label>
            <label>
              <span>密码</span>
              <input id="authPassword" name="password" type="password" placeholder="请输入密码" required>
            </label>
            <p class="auth-error" id="authError"></p>
            <button class="primary-btn full auth-submit-btn" type="submit" id="authSubmit">立即登录</button>
          </form>
          <div class="auth-helper-row">
            <span>没有账号？</span>
            <a class="auth-inline-link" href="./register.html" id="authApplyLink">申请账号</a>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(wrapper.firstElementChild);
  }
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add("open");
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.remove("open");
}

function bindGlobalModalActions() {
  document.querySelectorAll("[data-close-modal]").forEach((node) => {
    if (node.dataset.boundClose === "true") return;
    node.dataset.boundClose = "true";
    node.addEventListener("click", () => closeModal(node.dataset.closeModal));
  });
}

function configureAuthModal(mode) {
  document.getElementById("authTitle").textContent = "登录平台";
  document.getElementById("authDesc").textContent = "登录后可查看收藏、测试历史、API 密钥与账户设置。";
  document.getElementById("authSubmit").textContent = "立即登录";
  document.getElementById("authForm").dataset.mode = mode;
  document.getElementById("authError").textContent = "";
}

function bindAuthForm() {
  const authForm = document.getElementById("authForm");
  if (!authForm || authForm.dataset.bound === "true") return;
  authForm.dataset.bound = "true";

  authForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(authForm);
    const result = authenticatePlatformAccount(formData.get("account"), formData.get("password"));
    const authErrorEl = document.getElementById("authError");
    if (!result.ok) {
      authErrorEl.textContent = result.error;
      return;
    }
    authErrorEl.textContent = "";
    closeModal("authModal");
  });
}

function bindHeaderEvents() {
  const trigger = document.getElementById("userMenuTrigger");
  const panel = document.getElementById("userMenuPanel");

  if (trigger) {
    trigger.addEventListener("click", () => {
      panel.classList.toggle("open");
    });
  }

  if (!document.body.dataset.userMenuBound) {
    document.body.dataset.userMenuBound = "true";
    document.addEventListener("click", (event) => {
      const menu = document.querySelector(".user-menu");
      const activePanel = document.getElementById("userMenuPanel");
      if (!menu || !activePanel) return;
      if (!menu.contains(event.target)) {
        activePanel.classList.remove("open");
      }
    });
  }

  document.querySelectorAll("[data-auth-mode]").forEach((node) => {
    node.addEventListener("click", () => {
      configureAuthModal(node.dataset.authMode);
      openModal("authModal");
      panel.classList.remove("open");
    });
  });

  const logoutAction = document.getElementById("logoutAction");
  if (logoutAction) {
    logoutAction.addEventListener("click", () => {
      updateCurrentUser({ ...defaultUserProfile, loggedIn: false });
      panel.classList.remove("open");
    });
  }
}

function renderGlobalHeader() {
  const header = document.querySelector(".site-header");
  if (!header) return;
  header.innerHTML = buildHeaderMarkup();
  ensureGlobalModals();
  bindGlobalModalActions();
  bindHeaderEvents();
  bindAuthForm();
}

window.registerPlatformAccount = registerPlatformAccount;
window.authenticatePlatformAccount = authenticatePlatformAccount;

renderGlobalHeader();
