const root = document.documentElement;
const themeToggle = document.querySelector("#theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');
const primaryDownload = document.querySelector("#primary-download");
const primaryDownloadText = document.querySelector("#primary-download-text");
const systemMessage = document.querySelector("#system-message");
const donateModal = document.querySelector("#donate-modal");
const windowsModal = document.querySelector("#windows-modal");
const toast = document.querySelector("#toast");

const setTheme = (theme) => {
  root.dataset.theme = theme;
  localStorage.setItem("gesubian-theme", theme);
  themeMeta.setAttribute("content", theme === "dark" ? "#0b1020" : "#f7f9ff");
  themeToggle.setAttribute(
    "aria-label",
    theme === "dark" ? "切换浅色模式" : "切换深色模式",
  );
};

const savedTheme = localStorage.getItem("gesubian-theme");
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
setTheme(savedTheme || (systemPrefersDark ? "dark" : "light"));

themeToggle.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

const getPlatform = () => {
  const platform =
    navigator.userAgentData?.platform || navigator.platform || navigator.userAgent;
  const normalized = platform.toLowerCase();

  if (normalized.includes("mac")) return "macos";
  if (normalized.includes("win")) return "windows";
  return "other";
};

const showDialog = (dialog) => {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
  } else {
    dialog.setAttribute("open", "");
  }
};

const configureDownload = () => {
  const platform = getPlatform();
  const recommendedCard = document.querySelector(`[data-platform-card="${platform}"]`);

  if (recommendedCard) {
    recommendedCard.classList.add("recommended");
    recommendedCard.querySelector(".recommended-badge").hidden = false;
  }

  if (platform === "macos") {
    systemMessage.textContent = "已识别为 macOS，为你推荐 macOS 版本。";
    primaryDownload.href =
      "https://zrg919197004.github.io/MyTool/downloads/gesubian-macos-v2.1.0.pkg";
    primaryDownload.setAttribute("download", "");
    primaryDownloadText.textContent = "下载 macOS 版";
    return;
  }

  if (platform === "windows") {
    systemMessage.textContent = "已识别为 Windows，Windows 版本正在筹备发布。";
    primaryDownload.href = "#download";
    primaryDownloadText.textContent = "查看 Windows 版";
    primaryDownload.addEventListener("click", (event) => {
      event.preventDefault();
      document.querySelector("[data-platform-card='windows']").scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    });
    return;
  }

  systemMessage.textContent = "请选择与你电脑系统对应的版本。";
  primaryDownload.href = "#download";
  primaryDownloadText.textContent = "选择下载版本";
};

configureDownload();

document.querySelectorAll("#donate-button, [data-open-donate]").forEach((button) => {
  button.addEventListener("click", () => showDialog(donateModal));
});

document.querySelectorAll("[data-windows-wait]").forEach((button) => {
  button.addEventListener("click", () => showDialog(windowsModal));
});

document.querySelectorAll("[data-close-modal]").forEach((button) => {
  button.addEventListener("click", () => button.closest("dialog").close());
});

document.querySelectorAll("dialog").forEach((dialog) => {
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});

document.querySelectorAll("[data-download]").forEach((link) => {
  link.addEventListener("click", () => {
    toast.textContent = "安装包正在开始下载";
    toast.classList.add("visible");
    window.setTimeout(() => toast.classList.remove("visible"), 2600);
  });
});

document.querySelectorAll(".faq-list details").forEach((item) => {
  item.addEventListener("toggle", () => {
    if (!item.open) return;
    document.querySelectorAll(".faq-list details").forEach((otherItem) => {
      if (otherItem !== item) otherItem.open = false;
    });
  });
});

document.querySelector("#current-year").textContent = new Date().getFullYear();
