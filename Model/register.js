const registerFormEl = document.getElementById("registerForm");
const registerFeedbackEl = document.getElementById("registerFeedback");

registerFormEl.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(registerFormEl);
  const result = window.registerPlatformAccount({
    account: formData.get("account"),
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    company: formData.get("company"),
    password: formData.get("password"),
    purpose: formData.get("purpose"),
  });

  if (!result.ok) {
    registerFeedbackEl.textContent = result.error;
    registerFeedbackEl.classList.add("is-error");
    registerFeedbackEl.classList.remove("is-success");
    return;
  }

  registerFeedbackEl.textContent = "账号申请成功，正在进入平台。";
  registerFeedbackEl.classList.add("is-success");
  registerFeedbackEl.classList.remove("is-error");
  window.setTimeout(() => {
    window.location.href = "./user.html";
  }, 800);
});
