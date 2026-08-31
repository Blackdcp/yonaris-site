document.documentElement.classList.add('js');

const translations = {
  en: {
    skip: 'Skip to content', homeLabel: 'Yonaris home', navLabel: 'Primary navigation', mobileNavLabel: 'Mobile navigation', footerNavLabel: 'Footer navigation', openMenu: 'Open menu', closeMenu: 'Close menu', navProduct: 'Product', navCasework: 'Casework', navTalk: 'Talk to Yonaris',
    brandLine: 'AI-native MarTech infrastructure', heroTitle: 'Before sales,\nthe view is forming', heroBody: 'See what buyers hear in public channels, why it shapes decisions, and what deserves attention first.', theatreLabel: 'Product journey', stageLabel: 'Product stages', followRecord: 'Follow the record', pause: 'Pause', play: 'Play', pauseAnimation: 'Pause automatic stages', playAnimation: 'Play automatic stages',
    stageQuestion: 'Question', stageAnswers: 'Answers', stageEvidence: 'Evidence', stageAction: 'Action', stageReview: 'Review', questionText: 'Which partner can support several markets without losing local context?', questionNote: 'APAC · Enterprise marketing · English',
    channelAiLabel: 'AI answers', channelAiValue: 'Alternative A advances', channelSearchLabel: 'Search', channelSearchValue: 'Your company is mentioned', channelEditorialLabel: 'Editorial', channelEditorialValue: 'Market support is cited', channelCompanyLabel: 'Company', channelCompanyValue: 'Capability is published',
    claim: 'Claim', evidenceClaim: 'Supports local-market teams', source: 'Source', sourceAttached: 'Public source attached', gapNote: 'Gap: your capability lacks the same inspectable relationship.', actionText: 'Clarify scope and supported markets. Attach a source a buyer can inspect.', humanReview: 'For human review', changed: 'Changed', unchanged: 'Unchanged', reasonAppears: 'Selection reason appears', orderSame: 'Recommendation order stays the same', boundary: 'Change observed; cause not established.',
    productTitle: 'From question\nto next move', productBody: 'Start with one real question, connect answers, evidence, gaps, and review, then decide what to do next.', storyLabel: 'Product scenes', questionIn: 'Question in', apac: 'APAC', englishCode: 'EN', enterprise: 'Enterprise', answersOut: 'Public answers', answerAiShortLabel: 'AI', answerAiShortValue: 'Alternative advances', answerSearchShortLabel: 'Search', answerSearchShortValue: 'Mention only', answerEditorialShortLabel: 'Editorial', answerEditorialShortValue: 'Evidence cited', answerCompanyShortLabel: 'Company', answerCompanyShortValue: 'Scope unclear', reasonTrace: 'Reason traced', selectionReason: 'Selection reason', localSupport: 'Local-market support', publicEvidence: 'Public evidence', conditionsSource: 'Conditions + source', openGap: 'Open gap — your published capability is not connected to this criterion.', nextMove: 'Next move', actionShort: 'Clarify the capability’s scope and supported markets.', reviewedByTeam: 'Reviewed by team', approved: 'Approved', sameConditions: 'Same conditions, later review', nowVisible: 'Now visible', stillSame: 'Still the same',
    humanTitle: 'One fact,\ntwo readings', humanBody: 'Teams get a clear conclusion. Agents get a structured record. The meaning stays the same.', clearConclusion: 'Clear conclusion', humanConclusion: 'A selection reason became visible. Recommendation order did not change.', humanNext: 'Next: review whether the reason appears again under the same conditions.', claimValue: 'selection reason visible', scope: 'Scope', sourceValue: 'public record · attached', agentScopeValue: 'APAC · EN · selected channels', observedAt: 'Observed at', boundaryLabel: 'Boundary', boundaryValue: 'order unchanged · cause not established', wipeLabel: 'Move between Human and Agent readings', wipeValue: '{human}% Human view, {agent}% Agent view', sameMeaning: 'Same fact, source, scope and boundary.',
    caseTitle: 'See one full\ncasework', caseBody: 'Follow the path from first answer to later review, including what changed and what still cannot be claimed.', caseStageLabel: 'Before and after casework comparison', caseStateLabel: 'Casework state', before: 'Before', after: 'After', capability: 'Multi-market capability', reasonMissing: 'No inspectable reason', reasonVisible: 'Reason is now inspectable', sourceDisconnected: 'Published capability · relationship missing', sourceConnected: 'Scope + markets · public source attached', recommendationOrder: 'Recommendation order', alternativeA: 'Alternative A', yourCompany: 'Your company', caseDisclosure: 'Representative casework—not a customer performance claim.',
    startHere: 'Start here', ctaTitle: 'One question\nis enough', ctaBody: 'You do not need a full brief. Bring the question you want to understand, and start there.',
    documentTitle: 'Yonaris — Before sales, the view is forming', documentDescription: 'Yonaris helps teams see what buyers hear in public channels, why it shapes decisions, and what deserves attention first.'
  },
  zh: {
    skip: '跳到主要内容', homeLabel: 'Yonaris 首页', navLabel: '主导航', mobileNavLabel: '移动端导航', footerNavLabel: '页脚导航', openMenu: '打开菜单', closeMenu: '关闭菜单', navProduct: '产品', navCasework: '案例拆解', navTalk: '联系 Yonaris',
    brandLine: 'AI 原生营销科技基础设施', heroTitle: '销售之前，\n判断已在发生', heroBody: '看清客户在公开渠道里听到了什么，为什么形成判断，以及哪里值得先改。', theatreLabel: '产品过程', stageLabel: '产品阶段', followRecord: '跟随同一条记录', pause: '暂停', play: '播放', pauseAnimation: '暂停自动切换', playAnimation: '播放自动切换',
    stageQuestion: '问题', stageAnswers: '答案', stageEvidence: '依据', stageAction: '行动', stageReview: '复核', questionText: '哪一家合作伙伴能支持多个市场，同时保留当地语境？', questionNote: '亚太 · 企业营销团队 · 英文',
    channelAiLabel: 'AI 答案', channelAiValue: '竞品 A 进入备选', channelSearchLabel: '搜索', channelSearchValue: '你的公司被提到', channelEditorialLabel: '行业内容', channelEditorialValue: '当地市场支持被引用', channelCompanyLabel: '品牌信息', channelCompanyValue: '能力已经公开',
    claim: '陈述', evidenceClaim: '支持当地市场团队', source: '来源', sourceAttached: '已关联公开来源', gapNote: '缺口：你的能力缺少同样可核对的关联。', actionText: '明确适用范围与支持市场，关联客户可以核对的来源。', humanReview: '交由团队审阅', changed: '已变化', unchanged: '未变化', reasonAppears: '选择理由已经出现', orderSame: '推荐顺序仍然没有变化', boundary: '观察到变化；未建立因果。',
    productTitle: '从问题\n到下一步', productBody: '从一个真实问题出发，串起答案、依据、缺口与复核，帮助团队决定下一步。', storyLabel: '产品场景', questionIn: '输入问题', apac: '亚太', englishCode: '英文', enterprise: '企业客户', answersOut: '公开答案', answerAiShortLabel: 'AI', answerAiShortValue: '竞品进入备选', answerSearchShortLabel: '搜索', answerSearchShortValue: '仅被提到', answerEditorialShortLabel: '行业内容', answerEditorialShortValue: '引用了依据', answerCompanyShortLabel: '品牌信息', answerCompanyShortValue: '范围不清楚', reasonTrace: '追溯理由', selectionReason: '选择理由', localSupport: '当地市场支持', publicEvidence: '公开依据', conditionsSource: '条件 + 来源', openGap: '待处理缺口——已公开的能力没有连接到这项选择标准。', nextMove: '下一步', actionShort: '明确这项能力的适用范围与支持市场。', reviewedByTeam: '经团队审阅', approved: '已批准', sameConditions: '相同条件，后续复核', nowVisible: '现在可见', stillSame: '仍然没变',
    humanTitle: '同一事实，\n两种读法', humanBody: '给团队的是清晰结论，给 Agent 的是结构化记录；内容一致，只是表达不同。', clearConclusion: '清晰结论', humanConclusion: '一条选择理由已经出现，推荐顺序没有变化。', humanNext: '下一步：在相同条件下复核这条理由是否再次出现。', claimValue: '选择理由已可见', scope: '适用范围', sourceValue: '公开记录 · 已关联', agentScopeValue: '亚太 · 英文 · 已选渠道', observedAt: '观测时间', boundaryLabel: '边界', boundaryValue: '顺序未变 · 未建立因果', wipeLabel: '在 Human 与 Agent 读法之间拖动', wipeValue: 'Human 视图 {human}%，Agent 视图 {agent}%', sameMeaning: '事实、来源、范围和边界保持一致。',
    caseTitle: '看一次\n完整拆解', caseBody: '从最初答案到后续复核，清楚看到哪些理由成立，哪些变化仍不能轻易下结论。', caseStageLabel: '案例复核前后对照', caseStateLabel: '案例状态', before: '复核前', after: '复核后', capability: '多市场支持能力', reasonMissing: '没有可核对的理由', reasonVisible: '理由现在可以核对', sourceDisconnected: '能力已公开 · 关联缺失', sourceConnected: '范围 + 市场 · 已关联公开来源', recommendationOrder: '推荐顺序', alternativeA: '竞品 A', yourCompany: '你的公司', caseDisclosure: '代表性案例演示，不构成客户效果声明。',
    startHere: '从这里开始', ctaTitle: '一个问题，\n就够开始', ctaBody: '不用先准备完整方案。带着你最想弄清楚的问题来，我们从那里开始。',
    documentTitle: 'Yonaris — 销售之前，判断已在发生', documentDescription: 'Yonaris 帮助团队看清客户在公开渠道里听到了什么、为什么形成判断，以及哪里值得先改。'
  }
};

let language = 'en';
let theatreStage = 0;
let storyStage = 0;
let caseState = 'before';
let theatreHoverPaused = false;
let theatreFocusPaused = false;
let theatreManualPaused = false;
let theatreUserEnabledMotion = true;
let theatreTimer = 0;
let scrollFrame = 0;
let wheelLocked = false;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
theatreManualPaused = reducedMotion.matches;
theatreUserEnabledMotion = !reducedMotion.matches;

function t(key) { return translations[language][key] ?? translations.en[key] ?? key; }

function setTheatreStage(index, focus = false) {
  theatreStage = (index + 5) % 5;
  const theatre = document.querySelector('[data-hero-theatre]');
  theatre.dataset.stage = String(theatreStage);
  document.querySelectorAll('[data-theatre-scene]').forEach((scene) => {
    const active = Number(scene.dataset.theatreScene) === theatreStage;
    scene.classList.toggle('is-active', active);
    scene.setAttribute('aria-hidden', String(!active));
  });
  document.querySelectorAll('[data-theatre-button]').forEach((button) => {
    const active = Number(button.dataset.theatreButton) === theatreStage;
    button.setAttribute('aria-selected', String(active));
    button.tabIndex = active ? 0 : -1;
    if (active && focus) button.focus();
  });
}

function startTheatre() {
  window.clearInterval(theatreTimer);
  if (!theatreUserEnabledMotion) return;
  theatreTimer = window.setInterval(() => {
    if (!theatreManualPaused && !theatreHoverPaused && !theatreFocusPaused) setTheatreStage(theatreStage + 1);
  }, 4300);
}

function updateTheatreToggle() {
  const button = document.querySelector('[data-theatre-toggle]');
  const label = document.querySelector('[data-theatre-toggle-label]');
  const actionKey = theatreManualPaused ? 'play' : 'pause';
  button.setAttribute('aria-pressed', String(theatreManualPaused));
  button.setAttribute('aria-label', t(theatreManualPaused ? 'playAnimation' : 'pauseAnimation'));
  label.textContent = t(actionKey);
  button.querySelector('i').textContent = theatreManualPaused ? '▶' : 'Ⅱ';
}

function setStoryStage(index) {
  const next = Math.max(0, Math.min(4, index));
  if (next === storyStage && document.querySelector('.story-scene.is-active')) return;
  storyStage = next;
  const canvas = document.querySelector('[data-story-canvas]');
  canvas.dataset.scene = String(storyStage);
  document.querySelector('[data-story-index]').textContent = String(storyStage + 1).padStart(2, '0');
  document.querySelectorAll('[data-story-scene]').forEach((scene) => {
    const active = Number(scene.dataset.storyScene) === storyStage;
    scene.classList.toggle('is-active', active);
    scene.setAttribute('aria-hidden', String(!active));
  });
  document.querySelectorAll('[data-story-button]').forEach((button) => {
    if (Number(button.dataset.storyButton) === storyStage) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
  });
}

function jumpToStoryStage(index) {
  const story = document.querySelector('[data-product-story]');
  const scrollable = story.offsetHeight - window.innerHeight;
  const top = story.offsetTop + (scrollable * index / 4);
  window.scrollTo({ top, behavior: reducedMotion.matches ? 'auto' : 'smooth' });
}

function updateStoryFromScroll() {
  const story = document.querySelector('[data-product-story]');
  const rect = story.getBoundingClientRect();
  const scrollable = story.offsetHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.max(0, Math.min(1, -rect.top / scrollable)) : 0;
  setStoryStage(Math.min(4, Math.floor(progress * 5)));
  scrollFrame = 0;
}

function setCaseState(state, focus = false) {
  caseState = state;
  const stage = document.querySelector('[data-case-stage]');
  stage.dataset.state = state;
  document.querySelectorAll('[data-case-button]').forEach((button) => {
    const active = button.dataset.caseButton === state;
    button.setAttribute('aria-pressed', String(active));
    if (active && focus) button.focus();
  });
  document.querySelector('[data-case-reason]').textContent = t(state === 'before' ? 'reasonMissing' : 'reasonVisible');
  document.querySelector('[data-case-source]').textContent = t(state === 'before' ? 'sourceDisconnected' : 'sourceConnected');
}

function updateLanguage(next) {
  language = next;
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.documentElement.dataset.language = language;
  document.title = t('documentTitle');
  document.querySelector('meta[name="description"]').content = t('documentDescription');
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const translated = translations[language][node.dataset.i18n];
    if (translated !== undefined) node.textContent = translated;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((node) => node.setAttribute('aria-label', t(node.dataset.i18nAria)));
  const toggle = document.querySelector('[data-language-toggle]');
  toggle.textContent = language === 'en' ? '中文' : 'English';
  toggle.setAttribute('aria-label', language === 'en' ? '切换到中文' : 'Switch to English');
  const menuOpen = document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded') === 'true';
  document.querySelector('[data-menu-label]').textContent = t(menuOpen ? 'closeMenu' : 'openMenu');
  setCaseState(caseState);
  updateTheatreToggle();
  updateWipe();
}

document.querySelector('[data-language-toggle]').addEventListener('click', () => updateLanguage(language === 'en' ? 'zh' : 'en'));

const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
function closeMenu(restoreFocus = false) {
  const wasOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', 'false');
  mobileNav.hidden = true;
  document.body.classList.remove('menu-open');
  document.querySelector('[data-menu-label]').textContent = t('openMenu');
  if (restoreFocus && wasOpen) menuToggle.focus();
}
menuToggle.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  mobileNav.hidden = !open;
  document.body.classList.toggle('menu-open', open);
  document.querySelector('[data-menu-label]').textContent = t(open ? 'closeMenu' : 'openMenu');
});
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => closeMenu(false)));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(true); });
window.addEventListener('resize', () => { if (window.innerWidth > 780) closeMenu(false); }, { passive: true });

const theatre = document.querySelector('[data-hero-theatre]');
theatre.addEventListener('mouseenter', () => { theatreHoverPaused = true; });
theatre.addEventListener('mouseleave', () => { theatreHoverPaused = false; });
theatre.addEventListener('focusin', () => { theatreFocusPaused = true; });
theatre.addEventListener('focusout', (event) => { if (!theatre.contains(event.relatedTarget)) theatreFocusPaused = false; });
document.querySelector('[data-theatre-toggle]').addEventListener('click', () => {
  theatreManualPaused = !theatreManualPaused;
  if (!theatreManualPaused && reducedMotion.matches) theatreUserEnabledMotion = true;
  updateTheatreToggle();
  startTheatre();
});
const theatreButtons = Array.from(document.querySelectorAll('[data-theatre-button]'));
theatreButtons.forEach((button, index) => {
  button.addEventListener('click', () => setTheatreStage(index));
  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % 5;
    if (event.key === 'ArrowLeft') next = (index + 4) % 5;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = 4;
    setTheatreStage(next, true);
  });
});

document.querySelectorAll('[data-story-button]').forEach((button) => button.addEventListener('click', () => jumpToStoryStage(Number(button.dataset.storyButton))));

const wipe = document.querySelector('[data-wipe-stage]');
const wipeControl = document.querySelector('[data-wipe-control]');
function updateWipe() {
  wipe.style.setProperty('--split', `${wipeControl.value}%`);
  wipeControl.setAttribute('aria-valuetext', t('wipeValue')
    .replace('{human}', wipeControl.value)
    .replace('{agent}', String(100 - Number(wipeControl.value))));
}
wipeControl.addEventListener('input', updateWipe);

document.querySelectorAll('[data-case-button]').forEach((button) => button.addEventListener('click', () => setCaseState(button.dataset.caseButton, true)));
const caseStage = document.querySelector('[data-case-stage]');
caseStage.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft') setCaseState('before');
  if (event.key === 'ArrowRight') setCaseState('after');
});
caseStage.addEventListener('wheel', (event) => {
  if (wheelLocked || Math.abs(event.deltaY) < 18) return;
  const next = event.deltaY > 0 ? 'after' : 'before';
  if (next === caseState) return;
  event.preventDefault();
  setCaseState(next);
  wheelLocked = true;
  window.setTimeout(() => { wheelLocked = false; }, 500);
}, { passive: false });

function addParallax(node) {
  node.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    const rect = node.getBoundingClientRect();
    node.style.setProperty('--px', `${((event.clientX - rect.left) / rect.width - .5) * 8}px`);
    node.style.setProperty('--py', `${((event.clientY - rect.top) / rect.height - .5) * 8}px`);
  });
  node.addEventListener('pointerleave', () => { node.style.setProperty('--px', '0px'); node.style.setProperty('--py', '0px'); });
}
addParallax(theatre);
addParallax(document.querySelector('[data-story-canvas]'));

window.addEventListener('scroll', () => {
  document.querySelector('[data-header]').classList.toggle('is-scrolled', window.scrollY > 24);
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateStoryFromScroll);
}, { passive: true });

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  reveals.forEach((node) => observer.observe(node));
} else {
  reveals.forEach((node) => node.classList.add('is-visible'));
}

updateLanguage('en');
setTheatreStage(0);
setStoryStage(0);
setCaseState('before');
updateWipe();
updateStoryFromScroll();
startTheatre();
