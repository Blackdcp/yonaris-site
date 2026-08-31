(() => {
  "use strict";

  const root = document.documentElement;
  const formation = document.querySelector("[data-formation]");
  const header = document.querySelector("[data-site-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav = document.querySelector("[data-mobile-nav]");
  const sourceNote = document.querySelector("[data-source-note] p");
  const sourceFragments = [...document.querySelectorAll("[data-source]")];
  const conditionControls = [...document.querySelectorAll("[data-condition]")];
  const contactForm = document.querySelector("[data-contact-form]");
  const marketQuestionToggle = document.querySelector("[data-market-question-toggle]");
  const marketQuestionFields = document.querySelector("[data-market-question-fields]");
  const mobileQuery = window.matchMedia?.("(max-width: 52rem)");
  const reducedMotionQuery = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  const storageKey = "yonaris-preferences-v1";

  const titles = {
    en: "Yonaris — Know what buyers are being told",
    zh: "Yonaris — 看清客户听到了什么",
  };
  const languageButtonLabels = { en: "English", zh: "中文" };
  const defaultSourceNote = {
    en: "Focus a source to keep its exact note in view. Press Escape to clear it.",
    zh: "聚焦一份来源可固定查看其准确说明；按 Escape 清除固定。",
  };
  const supportedPairs = Object.freeze([
    Object.freeze({
      market: "apac",
      locale: "en",
      profile: "apac:en",
      marketLabel: { en: "APAC", zh: "亚太" },
      localeLabel: { en: "English", zh: "英语" },
    }),
    Object.freeze({
      market: "china",
      locale: "zh",
      profile: "china:zh",
      marketLabel: { en: "Mainland China", zh: "中国大陆" },
      localeLabel: { en: "Simplified Chinese", zh: "简体中文" },
    }),
    Object.freeze({
      market: "japan",
      locale: "ja",
      profile: "japan:ja",
      marketLabel: { en: "Japan", zh: "日本" },
      localeLabel: { en: "Japanese", zh: "日语" },
    }),
  ]);

  const conditionData = Object.freeze({
    "apac:en": {
      sources: {
        "ai-answer": {
          relevance: "high",
          note: {
            en: "Observed AI answer: Northstar is presented as the safer multi-market option. This records the answer; it does not verify performance.",
            zh: "观测到的 AI 答案：Northstar 被呈现为更稳妥的多市场选择。这里记录的是答案，并不验证实际表现。",
          },
        },
        search: {
          relevance: "high",
          note: {
            en: "Inspectable search evidence connects Northstar to published markets and local support scope.",
            zh: "可核对的搜索证据把 Northstar 与已发布的支持市场和本地服务范围连接起来。",
          },
        },
        "editorial-review": {
          relevance: "medium",
          note: {
            en: "The editorial source treats local support as an enterprise-readiness criterion, but it is category context rather than company proof.",
            zh: "行业来源把本地支持视为企业级准备度标准，但它提供的是品类语境，而不是公司的直接证明。",
          },
        },
        "company-record": {
          relevance: "low",
          condition: {
            en: "Multi-market support · public connection not found",
            zh: "多市场支持 · 未找到公开连接",
          },
          note: {
            en: "Meridian states the capability. The public record inspected here does not connect it to the selected market and language condition.",
            zh: "Meridian 声明了这项能力；本次核对的公开记录没有把它与所选市场和语言条件连接起来。",
          },
        },
      },
      formation: {
        interpretation: {
          en: "Northstar is easier to advance because its multi-market support is publicly connected to the buyer’s condition.",
          zh: "Northstar 更容易进入下一步，因为它公开地把多市场支持与买方条件连接起来。",
        },
        boundary: {
          en: "Capability stated. Public connection to the selected condition not found.",
          zh: "能力已声明。未找到与所选条件的公开连接。",
        },
        review: {
          en: "Verify supported languages and local service scope, then connect the approved claim to inspectable evidence.",
          zh: "核实支持语言和本地服务范围，再把已批准的声明连接到可核对证据。",
        },
      },
      comparison: {
        relevance: "high",
        alignment: "medium",
        relevanceCopy: {
          en: "Relevant when supported markets and local service scope are inspectable.",
          zh: "当支持市场和本地服务范围可核对时，这项事实与问题相关。",
        },
        alignmentCopy: {
          en: "Partial. The capability is stated; the selected market connection needs review.",
          zh: "部分对齐。能力已经声明，但与所选市场的公开连接仍需审阅。",
        },
        interpretationCopy: {
          en: "Verify the selected market and language before using this fact as a comparison reason.",
          zh: "在把这项事实作为比较理由前，先核实所选市场与语言。",
        },
      },
    },
    "china:zh": {
      sources: {
        "ai-answer": {
          relevance: "medium",
          note: {
            en: "The selected answer is relevant, but its mainland-China and Simplified-Chinese service context still needs verification.",
            zh: "所选答案具有相关性，但其中关于中国大陆与简体中文服务的语境仍需核实。",
          },
        },
        search: {
          relevance: "medium",
          note: {
            en: "Published market pages provide a lead, but the inspected evidence does not fully connect local service scope to mainland China.",
            zh: "已发布的市场页面提供了线索，但本次核对的证据尚未完整连接到中国大陆的本地服务范围。",
          },
        },
        "editorial-review": {
          relevance: "low",
          note: {
            en: "General enterprise-readiness criteria do not establish mainland-China delivery or Simplified-Chinese support.",
            zh: "通用的企业级准备度标准不能证明中国大陆的交付能力或简体中文支持。",
          },
        },
        "company-record": {
          relevance: "low",
          condition: {
            en: "Mainland China · Simplified Chinese connection not found",
            zh: "中国大陆 · 未找到简体中文公开连接",
          },
          note: {
            en: "Meridian states multi-market capability, but the public record inspected here does not connect it to mainland China in Simplified Chinese.",
            zh: "Meridian 声明具备多市场能力，但本次核对的公开记录没有用简体中文把它与中国大陆条件连接起来。",
          },
        },
      },
      formation: {
        interpretation: {
          en: "Neither option should advance on the same basis until mainland-China and Simplified-Chinese service evidence is connected to the buyer’s condition.",
          zh: "在中国大陆与简体中文服务证据连接到买方条件前，不应沿用同一依据推进任何选项。",
        },
        boundary: {
          en: "Capability stated. Mainland-China and Simplified-Chinese connection not found.",
          zh: "能力已声明。未找到中国大陆与简体中文的公开连接。",
        },
        review: {
          en: "Verify mainland-China availability, Simplified-Chinese support, and the approved public source before advancing the claim.",
          zh: "在推进这项声明前，核实中国大陆可用性、简体中文支持以及已批准的公开来源。",
        },
      },
      comparison: {
        relevance: "medium",
        alignment: "low",
        relevanceCopy: {
          en: "Potentially relevant, pending inspectable mainland-China service scope.",
          zh: "可能相关，但仍需可核对的中国大陆服务范围。",
        },
        alignmentCopy: {
          en: "Not aligned yet. A general multi-market claim does not establish mainland-China or Simplified-Chinese support.",
          zh: "尚未对齐。通用的多市场声明不能证明中国大陆或简体中文支持。",
        },
        interpretationCopy: {
          en: "Review locally applicable evidence before using the fixed company fact in this market comparison.",
          zh: "在这次市场比较中使用该公司事实前，先审阅适用于当地的证据。",
        },
      },
    },
    "japan:ja": {
      sources: {
        "ai-answer": {
          relevance: "medium",
          note: {
            en: "The answer provides a comparison lead, but Japanese-language and Japan service context require separate verification.",
            zh: "该答案提供了比较线索，但日语信息和日本服务语境仍需单独核实。",
          },
        },
        search: {
          relevance: "medium",
          note: {
            en: "Published support scope is relevant only where a Japan-specific, Japanese-language connection is inspectable.",
            zh: "只有在日本市场与日语连接可核对时，已发布的支持范围才具有充分相关性。",
          },
        },
        "editorial-review": {
          relevance: "medium",
          note: {
            en: "Enterprise-readiness context helps frame the question, but it does not prove local delivery in Japan.",
            zh: "企业级准备度语境有助于界定问题，但不能证明在日本的本地交付。",
          },
        },
        "company-record": {
          relevance: "low",
          condition: {
            en: "Japan · Japanese-language connection not found",
            zh: "日本 · 未找到日语公开连接",
          },
          note: {
            en: "Meridian states multi-market capability, but the inspected public record does not connect it to Japan in Japanese.",
            zh: "Meridian 声明具备多市场能力，但本次核对的公开记录没有用日语把它与日本市场连接起来。",
          },
        },
      },
      formation: {
        interpretation: {
          en: "The comparison remains provisional until Japanese-language evidence connects local service scope to the Japan buyer condition.",
          zh: "在日语证据把本地服务范围与日本买方条件连接起来前，这项比较仍是暂定判断。",
        },
        boundary: {
          en: "Capability stated. Japan and Japanese-language connection not found.",
          zh: "能力已声明。未找到日本市场与日语的公开连接。",
        },
        review: {
          en: "Verify Japan availability, Japanese-language support, and an approved local source before advancing the claim.",
          zh: "在推进这项声明前，核实日本市场可用性、日语支持以及已批准的当地来源。",
        },
      },
      comparison: {
        relevance: "medium",
        alignment: "low",
        relevanceCopy: {
          en: "Potentially relevant, pending inspectable Japan service and Japanese-language scope.",
          zh: "可能相关，但仍需可核对的日本服务与日语支持范围。",
        },
        alignmentCopy: {
          en: "Not aligned yet. A multi-market claim does not establish Japan delivery or Japanese-language support.",
          zh: "尚未对齐。多市场声明不能证明日本交付或日语支持。",
        },
        interpretationCopy: {
          en: "Review Japan-specific evidence before using the fixed company fact as a comparison reason.",
          zh: "在把该公司事实作为比较理由前，先审阅适用于日本市场的证据。",
        },
      },
    },
  });

  ensureConditionOptions();
  const savedPreferences = readPreferences();
  const initialPair = normalizePair(savedPreferences.market, savedPreferences.locale);
  const state = {
    language: savedPreferences.language === "zh" ? "zh" : "en",
    market: initialPair.market,
    locale: initialPair.locale,
    formationState: "question",
    pinnedSource: null,
    menuOpen: false,
  };

  function ensureConditionOptions() {
    conditionControls.forEach((control) => {
      let definitions = [];
      if (control.dataset.condition === "market") {
        definitions = supportedPairs.map((pair) => ({ value: pair.market, label: pair.marketLabel }));
      }
      if (control.dataset.condition === "language") {
        definitions = supportedPairs.map((pair) => ({ value: pair.locale, label: pair.localeLabel }));
      }
      if (!definitions.length) return;

      const options = definitions.map((definition) => {
        const option = [...control.options].find((item) => item.value === definition.value)
          || document.createElement("option");
        option.value = definition.value;
        option.dataset.labelEn = definition.label.en;
        option.dataset.labelZh = definition.label.zh;
        option.textContent = definition.label.en;
        return option;
      });
      control.replaceChildren(...options);
    });
  }

  function normalizePair(market, locale, changedCondition = "initial") {
    if (changedCondition === "market") {
      return supportedPairs.find((pair) => pair.market === market) || supportedPairs[0];
    }
    if (changedCondition === "language") {
      return supportedPairs.find((pair) => pair.locale === locale) || supportedPairs[0];
    }
    return supportedPairs.find((pair) => pair.market === market && pair.locale === locale)
      || supportedPairs.find((pair) => pair.market === market)
      || supportedPairs.find((pair) => pair.locale === locale)
      || supportedPairs[0];
  }

  function readPreferences() {
    try {
      return JSON.parse(window.localStorage.getItem(storageKey) || "{}") || {};
    } catch (_error) {
      return {};
    }
  }

  function savePreferences() {
    const audience = document.querySelector('[data-condition="audience"]')?.value || "";
    try {
      window.localStorage.setItem(storageKey, JSON.stringify({ language: state.language, market: state.market, locale: state.locale, audience }));
    } catch (_error) {
      // The site remains fully usable when storage is unavailable.
    }
  }

  function activeProfileKey() {
    const pair = supportedPairs.find((item) => item.market === state.market && item.locale === state.locale);
    if (!pair || !conditionData[pair.profile]) throw new Error("Unsupported market and locale pair");
    return pair.profile;
  }

  function activeProfile() {
    return conditionData[activeProfileKey()];
  }

  function setLocalizedText(container, copy) {
    if (!container || !copy) return;
    const localizedNodes = container.querySelectorAll("[data-lang]");
    if (!localizedNodes.length) {
      container.textContent = copy[state.language] || copy.en || "";
      return;
    }
    localizedNodes.forEach((node) => {
      const value = copy[node.dataset.lang];
      if (typeof value === "string") node.textContent = value;
    });
  }

  function selectedLabel(condition, value, language = state.language) {
    const control = conditionControls.find((item) => item.dataset.condition === condition);
    const option = control?.querySelector(`option[value="${value}"]`);
    return option?.dataset[`label${language === "zh" ? "Zh" : "En"}`] || option?.textContent.trim() || value;
  }

  function conditionLabel(language) {
    return `${selectedLabel("market", state.market, language)} · ${selectedLabel("language", state.locale, language)}`;
  }

  function syncConditionControls() {
    conditionControls.forEach((control) => {
      if (control.dataset.condition === "market") control.value = state.market;
      if (control.dataset.condition === "language") control.value = state.locale;
    });
  }

  function renderConditions({ announce = true } = {}) {
    const profile = activeProfile();
    syncConditionControls();

    sourceFragments.forEach((fragment) => {
      const source = profile.sources[fragment.dataset.source];
      if (!source) return;
      fragment.dataset.sourceRelevance = source.relevance;
      setLocalizedText(fragment.querySelector("[data-source-condition]"), source.condition || {
        en: conditionLabel("en"),
        zh: conditionLabel("zh"),
      });
    });

    setLocalizedText(document.querySelector('[data-condition-output="formation-interpretation"]'), profile.formation.interpretation);
    setLocalizedText(document.querySelector('[data-condition-output="formation-boundary"]'), profile.formation.boundary);
    setLocalizedText(document.querySelector('[data-condition-output="formation-review"]'), profile.formation.review);
    const relevance = document.querySelector('[data-condition-output="relevance"]');
    const alignment = document.querySelector('[data-condition-output="alignment"]');
    const interpretation = document.querySelector('[data-condition-output="interpretation"]');
    setLocalizedText(relevance, profile.comparison.relevanceCopy);
    setLocalizedText(alignment, profile.comparison.alignmentCopy);
    setLocalizedText(interpretation, profile.comparison.interpretationCopy);
    relevance.dataset.relevance = profile.comparison.relevance;
    alignment.dataset.alignment = profile.comparison.alignment;

    if (announce) {
      setLocalizedText(document.querySelector("[data-condition-announcement]"), {
        en: `Conditions updated: ${conditionLabel("en")}. Interpretation and evidence alignment have been reviewed against this selection.`,
        zh: `条件已更新：${conditionLabel("zh")}。当前判断与证据对齐情况已按此选择更新。`,
      });
    }
    renderSourceNote();
  }

  function renderSourceNote() {
    const source = state.pinnedSource ? activeProfile().sources[state.pinnedSource] : null;
    setLocalizedText(sourceNote, source?.note || defaultSourceNote);
    sourceFragments.forEach((fragment) => {
      fragment.dataset.pinned = String(fragment.dataset.source === state.pinnedSource);
    });
  }

  function pinSource(sourceName) {
    if (!activeProfile().sources[sourceName]) return;
    state.pinnedSource = sourceName;
    renderSourceNote();
  }

  function clearPinnedSource() {
    if (!state.pinnedSource) return;
    state.pinnedSource = null;
    renderSourceNote();
  }

  function updateAriaLabels() {
    document.querySelectorAll("[data-aria-en][data-aria-zh]").forEach((element) => {
      element.setAttribute("aria-label", element.dataset[state.language === "zh" ? "ariaZh" : "ariaEn"]);
    });
  }

  function updateOptionLabels() {
    document.querySelectorAll("option[data-label-en][data-label-zh]").forEach((option) => {
      option.textContent = option.dataset[state.language === "zh" ? "labelZh" : "labelEn"];
    });
  }

  function applyLanguage(language, { persist = true } = {}) {
    state.language = language === "zh" ? "zh" : "en";
    root.lang = state.language === "zh" ? "zh-CN" : "en";
    root.dataset.activeLanguage = state.language;
    root.dataset.language = state.language;
    document.title = titles[state.language];
    document.querySelectorAll("[data-copy][data-lang]").forEach((node) => {
      node.hidden = node.dataset.lang !== state.language;
    });
    document.querySelectorAll("[data-language-toggle]").forEach((button) => {
      const targetLanguage = button.dataset.languageToggle;
      button.textContent = languageButtonLabels[targetLanguage];
      button.setAttribute("aria-pressed", String(targetLanguage === state.language));
    });
    updateAriaLabels();
    updateOptionLabels();
    renderConditions({ announce: false });
    if (persist) savePreferences();
  }

  function syncMenu() {
    const isMobile = Boolean(mobileQuery?.matches);
    const isOpen = isMobile && state.menuOpen;
    header?.classList.toggle("menu-open", isOpen);
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle?.setAttribute("aria-expanded", String(isOpen));
    if (!mobileNav) return;
    if (isMobile) {
      mobileNav.hidden = !isOpen;
      mobileNav.inert = !isOpen;
      mobileNav.setAttribute("aria-hidden", String(!isOpen));
    } else {
      mobileNav.hidden = false;
      mobileNav.inert = false;
      mobileNav.removeAttribute("aria-hidden");
    }
  }

  function openMenu() {
    if (!mobileQuery?.matches) return;
    state.menuOpen = true;
    syncMenu();
    mobileNav?.querySelector("a")?.focus();
  }

  function closeMenu({ returnFocus = false } = {}) {
    if (!state.menuOpen) return;
    state.menuOpen = false;
    syncMenu();
    if (returnFocus) menuToggle?.focus();
  }

  function scrollToAnchor(anchor) {
    const hash = anchor.getAttribute("href");
    if (!hash || hash === "#") return;
    const target = document.getElementById(hash.slice(1));
    if (!target) return;
    const hadTabIndex = target.hasAttribute("tabindex");
    if (!hadTabIndex) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.scrollIntoView({ behavior: reducedMotionQuery?.matches ? "auto" : "smooth", block: "start" });
    if (!hadTabIndex) target.addEventListener("blur", () => target.removeAttribute("tabindex"), { once: true });
    if (window.history?.pushState) window.history.pushState(null, "", hash);
  }

  function syncMarketQuestionFields() {
    if (!marketQuestionFields || !marketQuestionToggle) return;
    marketQuestionFields.hidden = !marketQuestionToggle.checked;
    marketQuestionFields.setAttribute("aria-hidden", String(!marketQuestionToggle.checked));
  }

  function contactValue(name) {
    return contactForm?.querySelector(`[data-contact-field="${name}"]`)?.value.trim() || "";
  }

  function composeContactEmail(event) {
    event.preventDefault();
    if (!contactForm?.reportValidity()) return;
    const labels = state.language === "zh"
      ? { subject: "Yonaris 咨询", email: "工作邮箱", name: "称呼", company: "公司或官网", curious: "想了解的事情", question: "市场问题", marketLanguage: "市场或语言", context: "购买决策或商业背景" }
      : { subject: "Yonaris conversation request", email: "Work email", name: "Name", company: "Company or website", curious: "What I am curious about", question: "Market question", marketLanguage: "Market or language", context: "Buyer or commercial context" };
    const lines = [
      `${labels.email}: ${contactValue("email")}`,
      `${labels.name}: ${contactValue("name") || "—"}`,
      `${labels.company}: ${contactValue("company") || "—"}`,
      "",
      `${labels.curious}:`,
      contactValue("curious") || "—",
    ];
    if (marketQuestionToggle?.checked) {
      lines.push("", `${labels.question}:`, contactValue("market-question") || "—", "", `${labels.marketLanguage}: ${contactValue("market-language") || "—"}`, "", `${labels.context}:`, contactValue("commercial-context") || "—");
    }
    const query = new URLSearchParams({ subject: labels.subject, body: lines.join("\n") });
    window.location.href = `mailto:hello@yonaris.com?${query.toString()}`;
  }

  const formationStages = ["question", "sources", "interpretation", "boundary", "review"];
  const stageThresholds = [0.12, 0.32, 0.56, 0.8];
  let framePending = false;

  function setFormationProgress(progress) {
    const normalized = Math.max(0, Math.min(1, progress));
    const stageIndex = stageThresholds.reduce((index, threshold) => index + Number(normalized >= threshold), 0);
    const nextStage = formationStages[stageIndex];
    formation?.style.setProperty("--formation-progress", normalized.toFixed(4));
    formation?.style.setProperty("--sources-progress", Math.max(0, Math.min(1, normalized / stageThresholds[1])).toFixed(4));
    formation?.style.setProperty("--interpretation-progress", Math.max(0, Math.min(1, (normalized - stageThresholds[1]) / (stageThresholds[2] - stageThresholds[1]))).toFixed(4));
    formation?.style.setProperty("--boundary-progress", Math.max(0, Math.min(1, (normalized - stageThresholds[2]) / (stageThresholds[3] - stageThresholds[2]))).toFixed(4));
    formation?.style.setProperty("--review-progress", Math.max(0, Math.min(1, (normalized - stageThresholds[3]) / (1 - stageThresholds[3]))).toFixed(4));
    if (nextStage !== state.formationState) {
      state.formationState = nextStage;
      formation.dataset.formationState = nextStage;
    }
  }

  function updateScrollState() {
    framePending = false;
    header?.classList.toggle("is-scrolled", window.scrollY > 16);
    if (!formation) return;
    if (mobileQuery?.matches || reducedMotionQuery?.matches) {
      setFormationProgress(1);
      return;
    }
    const rect = formation.getBoundingClientRect();
    const travel = Math.max(formation.offsetHeight - window.innerHeight, 1);
    setFormationProgress(-rect.top / travel);
  }

  function requestScrollUpdate() {
    if (framePending) return;
    framePending = true;
    (window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 16)))(updateScrollState);
  }

  conditionControls.forEach((control) => {
    control.addEventListener("change", () => {
      if (control.dataset.condition === "market" || control.dataset.condition === "language") {
        const pair = normalizePair(
          control.dataset.condition === "market" ? control.value : state.market,
          control.dataset.condition === "language" ? control.value : state.locale,
          control.dataset.condition,
        );
        state.market = pair.market;
        state.locale = pair.locale;
        syncConditionControls();
        savePreferences();
        renderConditions();
        return;
      }
      savePreferences();
    });
  });

  const savedAudience = savedPreferences.audience;
  const audienceControl = document.querySelector('[data-condition="audience"]');
  if (audienceControl && [...audienceControl.options].some((option) => option.value === savedAudience)) audienceControl.value = savedAudience;

  sourceFragments.forEach((fragment) => {
    fragment.setAttribute("aria-describedby", "source-note");
    fragment.addEventListener("click", () => pinSource(fragment.dataset.source));
    fragment.addEventListener("focus", () => pinSource(fragment.dataset.source));
  });
  sourceNote?.closest("[data-source-note]")?.setAttribute("id", "source-note");

  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.addEventListener("click", () => applyLanguage(button.dataset.languageToggle));
  });
  menuToggle?.addEventListener("click", () => {
    if (state.menuOpen) closeMenu({ returnFocus: true });
    else openMenu();
  });
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const hash = anchor.getAttribute("href");
      if (!hash || !document.getElementById(hash.slice(1))) return;
      event.preventDefault();
      closeMenu();
      scrollToAnchor(anchor);
    });
  });
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    const shouldReturnFocus = state.menuOpen;
    closeMenu({ returnFocus: shouldReturnFocus });
    clearPinnedSource();
  });
  marketQuestionToggle?.addEventListener("change", syncMarketQuestionFields);
  contactForm?.addEventListener("submit", composeContactEmail);
  window.addEventListener("scroll", requestScrollUpdate, { passive: true });
  window.addEventListener("resize", () => {
    if (state.menuOpen && !mobileQuery?.matches) closeMenu();
    syncMenu();
    requestScrollUpdate();
  }, { passive: true });
  mobileQuery?.addEventListener?.("change", () => {
    if (state.menuOpen && !mobileQuery.matches) closeMenu();
    syncMenu();
    requestScrollUpdate();
  });
  reducedMotionQuery?.addEventListener?.("change", requestScrollUpdate);

  syncMarketQuestionFields();
  syncMenu();
  syncConditionControls();
  savePreferences();
  applyLanguage(state.language, { persist: false });
  formation?.setAttribute("data-formation-state", state.formationState);
  requestScrollUpdate();
})();
