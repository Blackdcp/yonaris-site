(() => {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-menu]");
  const nav = document.querySelector("[data-nav]");
  const leadForm = document.querySelector("[data-lead-form]");
  const humanSurfaces = [...document.querySelectorAll("[data-human-site]")];
  const agentSite = document.querySelector("[data-agent-site]");
  const motionSurfaces = [...document.querySelectorAll("[data-motion-surface]")];
  const storyTheaters = [...document.querySelectorAll(".recommendation-theater, .product-console")];
  const platformSteps = [...document.querySelectorAll(".platform-flow article")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(pointer: fine)");
  const titles = {
    en: "Yonaris - AI-Native Growth Platform",
    zh: "Yonaris - AI 原生增长平台",
  };

  let language = "en";
  let siteMode = "human";
  let menuOpen = false;
  let motionFrame = null;

  try {
    language = localStorage.getItem("yonaris-language") === "zh" ? "zh" : "en";
    siteMode = localStorage.getItem("yonaris-site-mode") === "agent" ? "agent" : "human";
  } catch (_error) {
    // The page remains usable when storage is blocked.
  }

  function setRegionalFields() {
    document.querySelectorAll("[data-region]").forEach((field) => {
      const visible = field.dataset.region === language;
      field.hidden = !visible;
      field.querySelectorAll("input").forEach((input) => {
        input.required = visible;
        input.disabled = !visible;
      });
    });
  }

  function setLanguage(next, persist = true) {
    language = next === "zh" ? "zh" : "en";
    root.lang = language === "zh" ? "zh-CN" : "en";
    root.dataset.language = language;
    document.title = titles[language];
    document.querySelectorAll("[data-lang]").forEach((element) => {
      element.hidden = element.dataset.lang !== language;
    });
    document.querySelectorAll("[data-language]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.language === language));
    });
    document.querySelectorAll("[data-aria-en][data-aria-zh]").forEach((element) => {
      element.setAttribute("aria-label", language === "zh" ? element.dataset.ariaZh : element.dataset.ariaEn);
    });
    setRegionalFields();
    if (persist) {
      try {
        localStorage.setItem("yonaris-language", language);
      } catch (_error) {}
    }
  }

  function setSiteMode(next, persist = true, resetScroll = true) {
    const previousMode = siteMode;
    siteMode = next === "agent" ? "agent" : "human";
    root.classList.remove("mode-changing");
    void root.offsetWidth;
    root.classList.add("mode-changing");
    root.dataset.siteMode = siteMode;
    humanSurfaces.forEach((surface) => { surface.hidden = siteMode === "agent"; });
    if (agentSite) agentSite.hidden = siteMode !== "agent";
    document.querySelectorAll("[data-site-view]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.siteView === siteMode));
    });
    if (siteMode === "agent") closeMenu();
    if (resetScroll && previousMode !== siteMode) window.scrollTo({ top: 0, behavior: "auto" });
    window.setTimeout(() => root.classList.remove("mode-changing"), 760);
    if (persist) {
      try {
        localStorage.setItem("yonaris-site-mode", siteMode);
      } catch (_error) {}
    }
    requestAnimationFrame(requestMotionUpdate);
  }

  function syncMenu() {
    header?.classList.toggle("open", menuOpen);
    document.body.classList.toggle("menu-open", menuOpen);
    menu?.setAttribute("aria-expanded", String(menuOpen));
    nav?.setAttribute("aria-hidden", String(innerWidth <= 900 && !menuOpen));
  }

  function closeMenu() {
    menuOpen = false;
    syncMenu();
  }

  function updateMotion() {
    motionFrame = null;
    header?.classList.toggle("scrolled", scrollY > 8);
    motionSurfaces.forEach((surface) => {
      if (surface.hidden) return;
      const rect = surface.getBoundingClientRect();
      const distance = (rect.top + rect.height / 2 - innerHeight / 2) / innerHeight;
      surface.style.setProperty("--scroll", String(Math.max(-1, Math.min(1, distance))));
    });
    storyTheaters.forEach((theater) => {
      const rect = theater.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight - rect.top) / (innerHeight + rect.height * .55)));
      theater.style.setProperty("--story-progress", progress.toFixed(3));
      theater.dataset.stage = progress < .34 ? "ask" : progress < .68 ? "compare" : "resolve";
    });
    if (platformSteps.length) {
      let activeStep = 0;
      platformSteps.forEach((step, index) => {
        const rect = step.getBoundingClientRect();
        if (rect.top < innerHeight * .72) activeStep = index;
      });
      platformSteps.forEach((step, index) => {
        step.classList.toggle("active", index === activeStep);
      });
    }
  }

  function requestMotionUpdate() {
    if (motionFrame) return;
    motionFrame = requestAnimationFrame(updateMotion);
  }

  function setupMotionSurfaces() {
    if (reduced.matches || !finePointer.matches) return;
    motionSurfaces.forEach((surface) => {
      surface.addEventListener("pointermove", (event) => {
        const rect = surface.getBoundingClientRect();
        const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
        const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
        surface.style.setProperty("--mx", x.toFixed(3));
        surface.style.setProperty("--my", y.toFixed(3));
      });
      surface.addEventListener("pointerleave", () => {
        surface.style.setProperty("--mx", "0");
        surface.style.setProperty("--my", "0");
      });
    });
  }

  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (reduced.matches || !("IntersectionObserver" in window)) {
      items.forEach((element) => element.classList.add("visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8%" });
    items.forEach((element) => observer.observe(element));
  }

  function scrollToAnchor(event) {
    const href = event.currentTarget.getAttribute("href");
    if (!href?.startsWith("#")) return;
    if (siteMode === "agent") setSiteMode("human");
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: reduced.matches ? "auto" : "smooth", block: "start" });
    history.pushState?.(null, "", href);
  }

  function composeLeadEmail(event) {
    event.preventDefault();
    if (!leadForm?.reportValidity()) return;

    const formData = new FormData(leadForm);
    const subject = language === "zh" ? "Yonaris 演示预约" : "Yonaris demo request";
    const lines = language === "zh"
      ? [
          `姓名：${formData.get("name") || ""}`,
          `电话：${formData.get("phone") || ""}`,
          `公司：${formData.get("company") || ""}`,
        ]
      : [
          `Name: ${formData.get("name") || ""}`,
          `Work email: ${formData.get("email") || ""}`,
          `Company: ${formData.get("company") || ""}`,
        ];

    const query = new URLSearchParams({ subject, body: lines.join("\n") });
    location.href = `mailto:leads@yonaris.com?${query.toString()}`;
  }

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
  });

  document.querySelectorAll("[data-site-view]").forEach((button) => {
    button.addEventListener("click", () => setSiteMode(button.dataset.siteView));
  });

  menu?.addEventListener("click", () => {
    menuOpen = !menuOpen;
    syncMenu();
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener("click", scrollToAnchor));
  leadForm?.addEventListener("submit", composeLeadEmail);

  addEventListener("scroll", requestMotionUpdate, { passive: true });
  addEventListener("resize", () => {
    if (innerWidth > 900 && menuOpen) closeMenu();
    requestMotionUpdate();
  }, { passive: true });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  setLanguage(language, false);
  syncMenu();
  setSiteMode(siteMode, false, false);
  setupReveal();
  setupMotionSurfaces();
  updateMotion();
})();
