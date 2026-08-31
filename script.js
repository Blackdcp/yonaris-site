(() => {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const formation = document.querySelector("[data-formation]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const navigation = document.querySelector("[data-nav]");
  const contactForm = document.querySelector("[data-contact-form]");
  const mobileQuery = window.matchMedia("(max-width: 900px)");
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const titles = {
    en: "Yonaris — Know what buyers are being told",
    zh: "Yonaris — 看清客户听到了什么",
  };
  let language = readLanguage();
  let menuOpen = false;
  let framePending = false;

  function readLanguage() {
    try {
      return window.localStorage.getItem("yonaris-language") === "zh" ? "zh" : "en";
    } catch (_error) {
      return "en";
    }
  }

  function storeLanguage() {
    try {
      window.localStorage.setItem("yonaris-language", language);
    } catch (_error) {
      // Language switching remains available when storage is blocked.
    }
  }

  function applyLanguage(nextLanguage, persist = true) {
    language = nextLanguage === "zh" ? "zh" : "en";
    root.lang = language === "zh" ? "zh-CN" : "en";
    root.dataset.language = language;
    document.title = titles[language];

    document.querySelectorAll("[data-lang]").forEach((node) => {
      node.hidden = node.dataset.lang !== language;
    });
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === language));
    });
    document.querySelectorAll("[data-aria-en][data-aria-zh]").forEach((node) => {
      node.setAttribute("aria-label", language === "zh" ? node.dataset.ariaZh : node.dataset.ariaEn);
    });

    if (persist) storeLanguage();
  }

  function syncMenu() {
    const active = mobileQuery.matches && menuOpen;
    header?.classList.toggle("menu-open", active);
    document.body.classList.toggle("menu-open", active);
    menuToggle?.setAttribute("aria-expanded", String(active));
    if (navigation) navigation.setAttribute("aria-hidden", String(mobileQuery.matches && !active));
  }

  function closeMenu(returnFocus = false) {
    if (!menuOpen) return;
    menuOpen = false;
    syncMenu();
    if (returnFocus) menuToggle?.focus();
  }

  function setFormationProgress() {
    if (!formation) return;
    if (reducedMotionQuery.matches) {
      formation.style.setProperty("--formation-progress", "1");
      return;
    }
    const rect = formation.getBoundingClientRect();
    const travel = Math.max(formation.offsetHeight - window.innerHeight, 1);
    const progress = Math.max(0, Math.min(1, -rect.top / travel));
    formation.style.setProperty("--formation-progress", progress.toFixed(4));
  }

  function updateScrollState() {
    framePending = false;
    header?.classList.toggle("is-scrolled", window.scrollY > 20);
    setFormationProgress();
  }

  function requestScrollUpdate() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(updateScrollState);
  }

  function revealContent() {
    const items = document.querySelectorAll(".reveal");
    if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12%", threshold: 0.12 });

    items.forEach((item) => observer.observe(item));
  }

  function scrollToAnchor(anchor, event) {
    const href = anchor.getAttribute("href");
    if (!href?.startsWith("#")) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return;
    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: reducedMotionQuery.matches ? "auto" : "smooth", block: "start" });
    if (window.history?.pushState) window.history.pushState(null, "", href);
  }

  function submitContact(event) {
    event.preventDefault();
    if (!contactForm?.reportValidity()) return;
    const data = new FormData(contactForm);
    const email = String(data.get("email") || "").trim();
    const name = String(data.get("name") || "").trim();
    const curious = String(data.get("curious") || "").trim();
    const copy = language === "zh"
      ? { subject: "Yonaris 咨询", email: "工作邮箱", name: "称呼", curious: "想了解的事情" }
      : { subject: "Yonaris conversation request", email: "Work email", name: "Name", curious: "What I am curious about" };
    const body = [
      `${copy.email}: ${email}`,
      `${copy.name}: ${name || "—"}`,
      "",
      `${copy.curious}:`,
      curious || "—",
    ].join("\n");
    const query = new URLSearchParams({ subject: copy.subject, body });
    window.location.href = `mailto:hello@yonaris.com?${query.toString()}`;
  }

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.language));
  });

  menuToggle?.addEventListener("click", () => {
    menuOpen = !menuOpen;
    syncMenu();
    if (menuOpen) navigation?.querySelector("a")?.focus();
  });

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => scrollToAnchor(anchor, event));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu(true);
  });

  contactForm?.addEventListener("submit", submitContact);
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", requestScrollUpdate, { passive: true });
  mobileQuery.addEventListener?.("change", () => {
    if (!mobileQuery.matches) menuOpen = false;
    syncMenu();
    requestScrollUpdate();
  });
  reducedMotionQuery.addEventListener?.("change", requestScrollUpdate);

  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = String(new Date().getFullYear());
  });
  applyLanguage(language, false);
  syncMenu();
  revealContent();
  updateScrollState();
})();
