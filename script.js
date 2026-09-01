(() => {
  "use strict";

  const root = document.documentElement;
  const header = document.querySelector("[data-header]");
  const menu = document.querySelector("[data-menu]");
  const nav = document.querySelector("[data-nav]");
  const showcase = document.querySelector("[data-showcase]");
  const morph = document.querySelector("[data-morph]");
  const motionSurfaces = [...document.querySelectorAll("[data-motion-surface]")];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(pointer: fine)");
  const viewOrder = ["observe", "trace", "decide", "human"];
  const titles = {
    en: "Yonaris — Know what buyers are being told",
    zh: "Yonaris — 看清客户听到了什么",
  };

  let language = "en";
  let menuOpen = false;
  let activeView = "observe";
  let showcaseVisible = false;
  let showcaseHovered = false;
  let userPauseUntil = 0;
  let cycleTimer = null;
  let motionFrame = null;

  try {
    language = localStorage.getItem("yonaris-language") === "zh" ? "zh" : "en";
  } catch (_error) {
    // Language switching remains available when storage is blocked.
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
    if (persist) {
      try {
        localStorage.setItem("yonaris-language", language);
      } catch (_error) {
        // No persistence is required for the page to work.
      }
    }
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
    if (name === "human") buildParticles();
  }

  function cycleView() {
    if (!showcaseVisible || showcaseHovered || document.hidden || Date.now() < userPauseUntil) return;
    const index = viewOrder.indexOf(activeView);
    setView(viewOrder[(index + 1) % viewOrder.length]);
  }

  function startCycle() {
    clearInterval(cycleTimer);
    if (reduced.matches) return;
    cycleTimer = window.setInterval(cycleView, 5200);
  }

  function buildParticles() {
    const field = morph?.querySelector("[data-particles]");
    if (!field || field.childElementCount) return;
    for (let index = 0; index < 74; index += 1) {
      const particle = document.createElement("span");
      particle.style.left = `${(index * 37) % 100}%`;
      particle.style.top = `${(index * 61) % 100}%`;
      particle.style.setProperty("--dx", `${((index % 7) - 3) * 5}px`);
      particle.style.setProperty("--dy", `${((index % 11) - 5) * 3}px`);
      particle.style.animationDelay = `${(index % 13) * -0.17}s`;
      field.append(particle);
    }
  }

  function updateMorph(event) {
    if (!morph || reduced.matches) return;
    const rect = morph.getBoundingClientRect();
    const position = Math.max(22, Math.min(78, ((event.clientX - rect.left) / rect.width) * 100));
    morph.style.setProperty("--split", `${position}%`);
  }

  function resetMorph() {
    morph?.style.setProperty("--split", "52%");
  }

  function updateMotion() {
    motionFrame = null;
    header?.classList.toggle("scrolled", scrollY > 8);
    motionSurfaces.forEach((surface) => {
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
    const target = document.querySelector(href);
    if (!target) return;
    event.preventDefault();
    closeMenu();
    target.scrollIntoView({ behavior: reduced.matches ? "auto" : "smooth", block: "start" });
    history.pushState?.(null, "", href);
  }

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.language));
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
  morph?.addEventListener("pointermove", updateMorph);
  morph?.addEventListener("pointerleave", resetMorph);
  morph?.addEventListener("pointerdown", updateMorph);
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
  setupReveal();
  setupMotionSurfaces();
  setupShowcaseObserver();
  startCycle();
  updateMotion();
})();
