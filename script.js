(() => {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-menu]");
  const nav = document.querySelector("[data-nav]");
  const showcase = document.querySelector("[data-showcase]");
  const leadForm = document.querySelector("[data-lead-form]");
  const humanSurfaces = [...document.querySelectorAll("[data-human-site]")];
  const agentSite = document.querySelector("[data-agent-site]");
  const motionSurfaces = [...document.querySelectorAll("[data-motion-surface]")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(pointer: fine)");
  const viewOrder = ["observe", "trace", "prioritize", "review"];
  const titles = {
    en: "Yonaris - When buyers ask AI",
    zh: "Yonaris - 客户问 AI 时",
  };

  let language = "en";
  let siteMode = "human";
  let menuOpen = false;
  let activeView = "observe";
  let showcaseVisible = false;
  let showcaseHovered = false;
  let userPauseUntil = 0;
  let cycleTimer = null;
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
      field.querySelectorAll("input, textarea").forEach((input) => {
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
    root.dataset.siteMode = siteMode;
    humanSurfaces.forEach((surface) => { surface.hidden = siteMode === "agent"; });
    if (agentSite) agentSite.hidden = siteMode !== "agent";
    document.querySelectorAll("[data-site-view]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.siteView === siteMode));
    });
    if (siteMode === "agent") closeMenu();
    if (resetScroll && previousMode !== siteMode) window.scrollTo({ top: 0, behavior: "auto" });
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

  function setView(name, focus = false) {
    if (!showcase || !viewOrder.includes(name)) return;
    activeView = name;
    showcase.querySelectorAll("[data-view]").forEach((button) => {
      const active = button.dataset.view === name;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
      if (active && focus) button.focus();
    });
    showcase.querySelectorAll("[data-panel]").forEach((panel) => {
      const active = panel.dataset.panel === name;
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  }

  function cycleView() {
    if (!showcaseVisible || showcaseHovered || document.hidden || Date.now() < userPauseUntil || siteMode === "agent") return;
    const index = viewOrder.indexOf(activeView);
    setView(viewOrder[(index + 1) % viewOrder.length]);
  }

  function startCycle() {
    clearInterval(cycleTimer);
    if (reduced.matches) return;
    cycleTimer = window.setInterval(cycleView, 5200);
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

  function setupShowcaseObserver() {
    if (!showcase || !("IntersectionObserver" in window)) return;
    new IntersectionObserver(([entry]) => {
      showcaseVisible = entry.isIntersecting;
    }, { threshold: 0.3 }).observe(showcase);
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

  showcase?.querySelectorAll("[data-view]").forEach((button, index, buttons) => {
    button.addEventListener("click", () => {
      userPauseUntil = Date.now() + 12000;
      setView(button.dataset.view);
    });
    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      userPauseUntil = Date.now() + 12000;
      const step = event.key === "ArrowRight" ? 1 : -1;
      const next = (index + step + buttons.length) % buttons.length;
      setView(buttons[next].dataset.view, true);
    });
  });

  showcase?.addEventListener("pointerenter", () => { showcaseHovered = true; });
  showcase?.addEventListener("pointerleave", () => { showcaseHovered = false; });
  leadForm?.addEventListener("submit", composeLeadEmail);

  addEventListener("scroll", requestMotionUpdate, { passive: true });
  addEventListener("resize", () => {
    if (innerWidth > 900 && menuOpen) closeMenu();
    requestMotionUpdate();
  }, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) startCycle();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });
  reduced.addEventListener?.("change", startCycle);

  document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = String(new Date().getFullYear());
  });

  setLanguage(language, false);
  syncMenu();
  setView("observe");
  setSiteMode(siteMode, false, false);
  setupReveal();
  setupMotionSurfaces();
  setupShowcaseObserver();
  startCycle();
  updateMotion();
})();
