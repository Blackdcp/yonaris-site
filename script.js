document.documentElement.classList.add('js');

const translations = {
  en: {
    skip: 'Skip to content', navLabel: 'Primary navigation', mobileNavLabel: 'Mobile navigation', footerNavLabel: 'Footer navigation',
    navProduct: 'Product', navCasework: 'Casework', navCompany: 'Company', navTalk: 'Talk to Yonaris', openMenu: 'Open menu', closeMenu: 'Close menu',
    brandPosition: 'AI-Native MarTech Infrastructure',
    heroTitle: 'Know what buyers are being told—and what to change.',
    heroBody: 'Yonaris shows marketing teams what AI and digital channels are telling buyers, which evidence is shaping the shortlist, what action can change it, and what actually changed afterwards.',
    heroPrimary: 'See Yonaris in action', heroSecondary: 'Talk to Yonaris', workflowSummary: 'Workflow summary',
    metaObserve: 'Observe', metaTrace: 'Trace', metaReview: 'Review', metaRecheck: 'Recheck',
    recordLabel: 'Representative market record', recordStatus: 'Observation ready', buyerQuestion: 'Buyer question',
    representativeQuestion: 'Which analytics partner can support an enterprise marketing team across several markets without losing local context or evidence?',
    marketLabel: 'Market', languageLabel: 'Language', observedLabel: 'Observed', channelsLabel: 'Observed channels',
    channelAi: 'AI answers', channelSearch: 'Search', channelEditorial: 'Editorial & reviews', channelOwned: 'Company-owned content',
    included: 'Included because', sourceAttached: 'Source attached', contextMissing: 'Context missing', contradiction: 'Contradiction found', inspection: 'Inspection', traceReason: 'Trace the reason',
    signalAiDetail: 'Local-market coverage is stated and linked to a public source; conditions remain visible.',
    signalSearchDetail: 'A source supports the capability, while its relevance to the question still needs review.',
    signalEditorialDetail: 'The comparison mentions the capability without the market conditions that shape its use.',
    signalOwnedDetail: 'Two public descriptions set different boundaries for the same capability.',
    beforeSalesLabel: 'Before sales begins', marketTitle: 'The first comparison is already taking shape.',
    marketBody: 'Buyers can form a first comparison across AI answers, search, public evidence and third-party sources before sales begins. Yonaris makes the information shaping that comparison visible and reviewable.',
    evidenceMapLabel: 'Evidence relationship map', oneQuestion: 'One buyer question', selectedChannels: 'selected channels', questionNode: 'What should enter the shortlist?',
    reasonVisible: 'Reason visible', evidenceLinked: 'Evidence linked', mentionedOnly: 'Mentioned only', scopeMissing: 'Scope missing', alternativeAdvanced: 'Alternative advanced', contextAttached: 'Context attached', claimMismatch: 'Claim mismatch', reviewRequired: 'Review required',
    marketClosing: 'This is what the market is telling buyers before the sales conversation begins.',
    whoTitle: 'Built for consequential questions', whoBody: 'For marketing and commercial teams facing inconsistent answers, unclear evidence, or a difficult next action.',
    marketsTitle: 'One fact. Different conditions.', marketsBody: 'Market, language, category terms, alternatives and observation conditions stay attached to every question.',
    judgementTitle: 'Human judgement stays in the loop.', judgementBody: 'People decide what is accurate, appropriate and approved—and what the business does next.',
    productLabel: 'The Yonaris workflow', productTitle: 'From one buyer question to the next market action.',
    productIntro: 'Observe the answer, trace the evidence, put action under review, then ask the same question again.', productStagesLabel: 'Product stages',
    stage1Short: 'Question', stage2Short: 'Answer', stage3Short: 'Evidence', stage4Short: 'Action', stage5Short: 'Review',
    stageMode: 'INPUT / RECORDED CONDITIONS', stage1Title: 'Buyer questions', stage1Body: 'Start with the question—and the market, audience, language and alternatives around it.',
    stage2Mode: 'OBSERVATION / SELECTED CHANNELS', stage2Title: 'Current answers', stage2Body: 'See what selected AI, search, editorial and company-owned channels are telling buyers now.',
    stage3Mode: 'TRACE / SOURCES AND GAPS', stage3Title: 'Sources and gaps', stage3Body: 'Trace each comparison reason to the evidence that supports it, the context it lacks, or the contradiction it contains.',
    stage4Mode: 'DECISION / HUMAN REVIEW', stage4Title: 'Actions under review', stage4Body: 'Turn the clearest gap into a prioritised action for the team to review, approve or reject.',
    stage5Mode: 'RECHECK / RECORDED CONDITIONS', stage5Title: 'Outcome review', stage5Body: 'Ask the same question again under recorded conditions. Keep changed, unchanged and non-attributable findings separate.',
    conditionMarket: 'MARKET', conditionAudience: 'AUDIENCE', conditionLanguage: 'LANGUAGE', conditionAlternatives: 'ALTERNATIVES',
    recordIntegrity: 'Record integrity', sourceScope: 'Source scope', attached: 'Attached', humanReview: 'Human review', required: 'Required', outcomeClaim: 'Outcome claim', bounded: 'Bounded',
    humanAgentLabel: 'Human / Agent', humanAgentTitle: 'One fact. Two readers. No conflicting versions.',
    humanAgentBody: 'People need context and a useful next move. Agents need a stable claim, source, scope, timestamp and boundary. Both readings come from the same public record.',
    humanView: 'HUMAN VIEW', reviewed: 'REVIEWED', whatHappened: 'WHAT HAPPENED',
    humanFinding: 'A relevant selection reason became visible; the recommendation order did not change.',
    whyMatters: 'Why it matters', whyMattersBody: 'Buyers can now inspect why the capability may fit this market.', reviewNext: 'What to review next', reviewNextBody: 'Whether the same reason appears under recorded conditions.',
    agentView: 'AGENT VIEW', jsonClaim: '"selection_reason_visible"', jsonScope: '"observed_channels"', jsonStatus: '"reviewed"', jsonBoundary: '"non_attributable"',
    boundaryLabel: 'Boundary', humanAgentBoundary: 'A structured public record can help a fact be found and checked. It does not guarantee crawling, retrieval, ranking, recommendation or citation.',
    caseLabel: 'Representative casework', caseTitle: 'One question, from first answer to review.',
    caseBody: 'Follow one representative record from the first observation to the reviewed action, the later review, and the limits that remain.', caseDisclosure: 'Representative casework—not a customer performance claim.',
    caseStageInitial: 'INITIAL ANSWER', caseInitialTitle: 'Mentioned, without a reason to advance.', caseInitialBody: 'Your company appeared in some observations, but buyers were given no clear reason to advance it into the next comparison.', observedStatus: 'OBSERVED',
    caseStageGap: 'EVIDENCE GAP', caseGapTitle: 'The capability existed. Its selection context did not.', caseGapBody: 'The missing piece was a public evidence relationship connecting the capability to the buyer’s selection criterion.', gapStatus: 'GAP FOUND',
    caseStageAction: 'REVIEWED ACTION', caseActionTitle: 'Clarify scope. Attach an inspectable source.', caseActionBody: 'The team clarified the capability’s scope and supported markets, then attached a source a buyer could inspect.', approvedStatus: 'APPROVED',
    caseStageReview: 'OUTCOME REVIEW', caseReviewTitle: 'One change. One non-change. No causal claim.', caseReviewBody: 'The reason for considering the company became visible. The recommendation order did not change.', changed: 'CHANGED', unchanged: 'UNCHANGED', cannotAttribute: 'CANNOT ATTRIBUTE',
    companyLabel: 'What Yonaris keeps clear', companyTitle: 'Built for the moment before the sales conversation.',
    companyBody: 'Yonaris builds AI-Native MarTech Infrastructure for teams that need to understand what buyers are being told, which evidence shapes comparison, and what to change next.',
    principleVisible: 'Visible', principleVisibleBody: 'Observed answers, related evidence and gaps stay connected.', principleReviewable: 'Reviewable', principleReviewableBody: 'Actions are prioritised for people to approve, adjust or reject.', principleBounded: 'Bounded', principleBoundedBody: 'Changed, unchanged and non-attributable findings remain separate.',
    notAPromise: 'NOT A PROMISE OF', promiseBoundary: 'Exhaustive coverage, guaranteed ranking, guaranteed citation, autonomous execution, causal proof, or a commercial result from a single change.',
    contactLabel: 'Start with the question', contactTitle: 'Curious where Yonaris could fit?', contactBody: 'You don’t need a brief—or even a clearly defined problem. Tell us what you’re curious about.', conversationRecord: 'CONVERSATION / NEW',
    formEmail: 'Work email *', formEmailPlaceholder: 'you@company.com', formName: 'Name', formNamePlaceholder: 'How should we address you?', formCompany: 'Company or website', formCompanyPlaceholder: 'Company / URL', formQuestion: 'What are you curious about?', formQuestionPlaceholder: 'A buyer question, market, or something that feels unclear', formSubmit: 'Start a conversation', formNote: 'This opens your email app. Your message goes to hello@yonaris.com.',
    footerMarkets: 'Markets & languages', footerPrivacy: 'Privacy', footerContact: 'Contact', footerStatement: 'Built for evidence-aware marketing decisions.',
    documentTitle: 'Yonaris — AI-Native MarTech Infrastructure', documentDescription: 'Yonaris shows marketing teams what AI and digital channels are telling buyers, why, and what to review next.',
    marketRecordRail: 'MARKET RECORD / LIVE STRUCTURE', sameRecord: 'SAME RECORD'
  },
  zh: {
    skip: '跳到主要内容', navLabel: '主导航', mobileNavLabel: '移动端导航', footerNavLabel: '页脚导航',
    navProduct: '产品', navCasework: '案例拆解', navCompany: '关于 Yonaris', navTalk: '联系 Yonaris', openMenu: '打开菜单', closeMenu: '关闭菜单',
    brandPosition: 'AI 原生营销科技基础设施',
    heroTitle: '看清客户听到了什么，再决定哪里值得改。',
    heroBody: 'Yonaris 把 AI 和数字渠道中的答案、比较理由与证据连在一起，帮助营销团队看清品牌为什么进入或退出备选、下一步先处理什么，以及复核后哪些发生了变化。',
    heroPrimary: '看看 Yonaris 怎么工作', heroSecondary: '先聊聊', workflowSummary: '工作流程摘要',
    metaObserve: '观察', metaTrace: '追溯', metaReview: '审阅', metaRecheck: '复核',
    recordLabel: '代表性市场记录', recordStatus: '观测记录就绪', buyerQuestion: '客户问题', representativeQuestion: '为什么竞品先进入了客户的备选，而我们的优势没有成为选择理由？',
    marketLabel: '市场', languageLabel: '语言', observedLabel: '观测时间', channelsLabel: '已观测渠道',
    channelAi: 'AI 答案', channelSearch: '搜索结果', channelEditorial: '行业内容与评测', channelOwned: '品牌公开信息',
    included: '进入备选，因为', sourceAttached: '已关联来源', contextMissing: '缺少关键语境', contradiction: '发现信息矛盾', inspection: '查看记录', traceReason: '查看判断从哪里来',
    signalAiDetail: '对当地市场的支持已有公开来源，但适用条件仍需保留。', signalSearchDetail: '来源支持这项能力，但它与当前问题的关联仍需审阅。', signalEditorialDetail: '比较提到了这项能力，却没有说明影响其适用性的市场条件。', signalOwnedDetail: '两份公开说明对同一项能力给出了不同边界。',
    beforeSalesLabel: '销售介入之前', marketTitle: '第一轮比较，已经在形成。',
    marketBody: '很多营销系统擅长统计点击后的行为；但销售介入前，第一轮比较可能已经在 AI、搜索和公开来源中形成。Yonaris 让影响这轮比较的信息变得可见、可复核。',
    evidenceMapLabel: '证据关系图', oneQuestion: '一个客户问题', selectedChannels: '个已选渠道', questionNode: '什么值得进入备选？', reasonVisible: '选择理由可见', evidenceLinked: '证据已关联', mentionedOnly: '仅被提到', scopeMissing: '适用范围缺失', alternativeAdvanced: '竞品进入备选', contextAttached: '语境已关联', claimMismatch: '信息边界不一致', reviewRequired: '需要团队审阅',
    marketClosing: '这就是客户联系销售之前，已经形成的第一轮判断。',
    whoTitle: '为关键市场问题而建', whoBody: '面向答案不一致、证据不清楚，或下一步行动难以排序的营销与商业团队。', marketsTitle: '同一事实，不同条件。', marketsBody: '市场、语言、品类用语、比较对象和观测条件始终关联每个问题。', judgementTitle: '人的判断始终在环。', judgementBody: '事实是否准确、行动是否合适、是否批准执行，仍由团队判断。',
    productLabel: 'Yonaris 工作流', productTitle: '从一个市场问题，到团队下一步该做什么。', productIntro: '观察答案、追溯证据、把行动交给团队审阅，再在相同条件下复核。', productStagesLabel: '产品流程',
    stage1Short: '问题', stage2Short: '答案', stage3Short: '证据', stage4Short: '行动', stage5Short: '复核',
    stageMode: '输入 / 已记录条件', stage1Title: '客户问题', stage1Body: '先把问题，以及对应的市场、人群、语言和比较对象放进来。',
    stage2Mode: '观测 / 已选渠道', stage2Title: '当前答案', stage2Body: '看清 AI、搜索、行业内容和品牌公开信息正在怎样回答客户。',
    stage3Mode: '追溯 / 来源与缺口', stage3Title: '来源与证据缺口', stage3Body: '把每一个比较理由追溯到支持它的证据、缺失的语境或相互矛盾的信息。',
    stage4Mode: '决策 / 团队审阅', stage4Title: '待团队审阅', stage4Body: '把最值得处理的缺口变成一项有优先级的行动，由团队决定批准、调整还是放弃。',
    stage5Mode: '复核 / 已记录条件', stage5Title: '结果复核', stage5Body: '在记录下来的条件中再次提出同一个问题，把已变化、未变化和无法归因的结果分开。',
    conditionMarket: '市场', conditionAudience: '人群', conditionLanguage: '语言', conditionAlternatives: '比较对象', recordIntegrity: '记录完整性', sourceScope: '来源范围', attached: '已关联', humanReview: '团队审阅', required: '必需', outcomeClaim: '结果陈述', bounded: '边界清晰',
    humanAgentLabel: 'Human / Agent', humanAgentTitle: '同一个事实，让人看得懂，也让 Agent 读得准。',
    humanAgentBody: '人需要知道事实意味着什么、下一步审阅什么；Agent 需要稳定的事实陈述、来源、范围、时间戳和边界。两种视图始终关联同一条记录。',
    humanView: '人的视角', reviewed: '已审阅', whatHappened: '发生了什么', humanFinding: '品牌的选择理由已经出现，但推荐顺序没有变化。',
    whyMatters: '为什么重要', whyMattersBody: '客户现在可以核对这项能力为什么可能适用于当前市场。', reviewNext: '下一步看什么', reviewNextBody: '在记录条件中复核同一个理由是否仍然出现。',
    agentView: 'Agent 视角', jsonClaim: '"选择理由已可见"', jsonScope: '"已观测渠道"', jsonStatus: '"已审阅"', jsonBoundary: '"无法归因"',
    boundaryLabel: '边界', humanAgentBoundary: '结构化公开记录有助于事实被找到和核对，但不保证抓取、检索、排名、推荐或引用。',
    caseLabel: '代表性案例拆解', caseTitle: '看一个市场问题如何被完整拆解。', caseBody: '从最初答案、证据缺口到团队行动和后续复核，一次看清判断是怎么形成的，也看清哪些结论仍然不能下。', caseDisclosure: '代表性案例演示，不构成客户效果声明。',
    caseStageInitial: '最初的答案', caseInitialTitle: '被提到，却没有进入下一轮比较的理由。', caseInitialBody: '你的公司偶尔被提到，却没有带着明确理由进入客户的下一轮比较。', observedStatus: '已观测',
    caseStageGap: '证据缺口', caseGapTitle: '能力存在，选择语境却没有出现。', caseGapBody: '真正缺少的是一条公开证据关系，把这项能力连接到客户的选择标准。', gapStatus: '发现缺口',
    caseStageAction: '经团队审阅的行动', caseActionTitle: '明确适用范围，关联可核对来源。', caseActionBody: '团队明确一项关键能力的适用范围和支持市场，并关联客户可以核对的公开来源。', approvedStatus: '已批准',
    caseStageReview: '结果复核', caseReviewTitle: '一个变化，一个未变，不做因果声明。', caseReviewBody: '品牌的选择理由已经出现，但推荐顺序没有变化。', changed: '已变化', unchanged: '未变化', cannotAttribute: '无法归因',
    companyLabel: 'Yonaris 坚持保留什么', companyTitle: '客户开口之前，很多判断已经发生了。', companyBody: 'Yonaris 为需要看清客户听到什么、哪些证据影响比较，以及下一步该改什么的团队提供 AI 原生营销科技基础设施。',
    principleVisible: '可见', principleVisibleBody: '观测答案、相关证据与缺口始终保持关联。', principleReviewable: '可审阅', principleReviewableBody: '行动先被排序，再由团队批准、调整或放弃。', principleBounded: '有边界', principleBoundedBody: '已变化、未变化和无法归因的发现始终分开。',
    notAPromise: '不承诺', promiseBoundary: '覆盖所有答案、保证排名、保证引用、绕过团队自动执行、因果证明，或单次变化带来的商业结果。',
    contactLabel: '从问题开始', contactTitle: '想知道 Yonaris 能不能帮上忙？', contactBody: '不用准备方案，也不用先把问题想完整。告诉我们你最想弄清楚什么。', conversationRecord: '对话 / 新记录',
    formEmail: '工作邮箱 *', formEmailPlaceholder: 'you@company.com', formName: '怎么称呼你', formNamePlaceholder: '你的称呼', formCompany: '公司或官网', formCompanyPlaceholder: '公司 / 网址', formQuestion: '你想了解什么？', formQuestionPlaceholder: '一个客户问题、市场，或任何让你觉得不够清楚的地方', formSubmit: '开始聊聊', formNote: '点击后会打开你的邮件应用，并将邮件发送至 hello@yonaris.com。',
    footerMarkets: '市场与语言', footerPrivacy: '隐私说明', footerContact: '联系 Yonaris', footerStatement: '为重视证据的营销决策而建。',
    documentTitle: 'Yonaris — AI 原生营销科技基础设施', documentDescription: 'Yonaris 帮助营销团队看清 AI 与数字渠道正在告诉客户什么、为什么，以及下一步该审阅什么。', marketRecordRail: '市场记录 / 实时结构', sameRecord: '同一条记录'
  }
};

let currentLanguage = 'en';
let activeStage = 0;

const stageKeys = [
  ['stageMode', 'stage1Title', 'stage1Body'],
  ['stage2Mode', 'stage2Title', 'stage2Body'],
  ['stage3Mode', 'stage3Title', 'stage3Body'],
  ['stage4Mode', 'stage4Title', 'stage4Body'],
  ['stage5Mode', 'stage5Title', 'stage5Body']
];

const stageValues = [
  ['APAC', 'Enterprise', 'English', 'A / B / C'],
  ['AI + Search', 'Editorial', 'Owned', '4 channels'],
  ['3 attached', '1 missing', '1 mismatch', 'Review'],
  ['Priority 01', 'Human review', 'Approve', 'Adjust / Reject'],
  ['Changed 01', 'Unchanged 01', 'Non-attributable', 'Recorded']
];

const stageValuesZh = [
  ['亚太', '企业客户', '英文', 'A / B / C'],
  ['AI + 搜索', '行业内容', '品牌公开信息', '4 个渠道'],
  ['3 条已关联', '1 条缺失', '1 处矛盾', '待审阅'],
  ['优先级 01', '团队审阅', '批准', '调整 / 放弃'],
  ['已变化 01', '未变化 01', '无法归因', '已记录']
];

function t(key) {
  return translations[currentLanguage][key] ?? translations.en[key] ?? key;
}

function updateWorkflowPanel() {
  const [modeKey, titleKey, bodyKey] = stageKeys[activeStage];
  const number = document.querySelector('[data-stage-number]');
  const mode = document.querySelector('.panel-kicker span:last-child');
  const title = document.querySelector('[data-stage-title]');
  const body = document.querySelector('[data-stage-body]');
  const values = currentLanguage === 'zh' ? stageValuesZh[activeStage] : stageValues[activeStage];
  const valueNodes = document.querySelectorAll('[data-stage-visual] em');

  if (number) number.textContent = String(activeStage + 1).padStart(2, '0');
  if (mode) mode.textContent = t(modeKey);
  if (title) title.textContent = t(titleKey);
  if (body) body.textContent = t(bodyKey);
  valueNodes.forEach((node, index) => { node.textContent = values[index]; });
}

function applyLanguage(language) {
  currentLanguage = language;
  const dictionary = translations[language];
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.documentElement.dataset.language = language;
  document.title = dictionary.documentTitle;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = dictionary.documentDescription;

  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const key = node.dataset.i18n;
    if (dictionary[key] !== undefined) node.textContent = dictionary[key];
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
    node.placeholder = dictionary[node.dataset.i18nPlaceholder] ?? node.placeholder;
  });
  document.querySelectorAll('[data-i18n-aria]').forEach((node) => {
    node.setAttribute('aria-label', dictionary[node.dataset.i18nAria] ?? node.getAttribute('aria-label'));
  });

  const toggle = document.querySelector('[data-language-toggle]');
  if (toggle) {
    toggle.textContent = language === 'en' ? '中文' : 'English';
    toggle.setAttribute('aria-label', language === 'en' ? '切换到中文' : 'Switch to English');
  }
  const menuLabel = document.querySelector('[data-menu-toggle] .sr-only');
  if (menuLabel) {
    const expanded = document.querySelector('[data-menu-toggle]')?.getAttribute('aria-expanded') === 'true';
    menuLabel.textContent = t(expanded ? 'closeMenu' : 'openMenu');
  }
  updateWorkflowPanel();

  const activeSignal = document.querySelector('[data-signal].is-active');
  if (activeSignal) updateSignal(activeSignal.dataset.signal, false);
}

function updateSignal(signal, moveFocus = true) {
  const detailKeys = { ai: 'signalAiDetail', search: 'signalSearchDetail', editorial: 'signalEditorialDetail', owned: 'signalOwnedDetail' };
  document.querySelectorAll('[data-signal]').forEach((button) => {
    const selected = button.dataset.signal === signal;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
    if (selected && moveFocus) button.focus({ preventScroll: true });
  });
  const detail = document.querySelector('[data-signal-detail]');
  if (detail) {
    detail.dataset.i18n = detailKeys[signal];
    detail.textContent = t(detailKeys[signal]);
  }
}

document.querySelector('[data-language-toggle]')?.addEventListener('click', () => {
  applyLanguage(currentLanguage === 'en' ? 'zh' : 'en');
});

const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');

function closeMenu() {
  if (!menuToggle || !mobileNav) return;
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.querySelector('.sr-only').textContent = t('openMenu');
  mobileNav.hidden = true;
  document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.querySelector('.sr-only').textContent = t(isOpen ? 'openMenu' : 'closeMenu');
  mobileNav.hidden = isOpen;
  document.body.classList.toggle('menu-open', !isOpen);
});

mobileNav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
window.addEventListener('resize', () => { if (window.innerWidth > 860) closeMenu(); }, { passive: true });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });

document.querySelectorAll('[data-signal]').forEach((button) => {
  button.addEventListener('click', () => updateSignal(button.dataset.signal));
});

document.querySelector('[data-trace-trigger]')?.addEventListener('click', () => {
  document.querySelector('#product')?.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
});

const stageTabs = Array.from(document.querySelectorAll('[data-stage]'));
stageTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectStage(index));
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % stageTabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + stageTabs.length) % stageTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = stageTabs.length - 1;
    selectStage(next, true);
  });
});

function selectStage(index, focus = false) {
  activeStage = index;
  stageTabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  const panel = document.querySelector('#workflow-panel');
  if (panel) panel.setAttribute('aria-labelledby', `stage-tab-${index + 1}`);
  updateWorkflowPanel();
}

const progressBar = document.querySelector('.scroll-progress span');
let progressFrame = 0;
function updateProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const progress = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
  if (progressBar) progressBar.style.transform = `scaleX(${progress})`;
  progressFrame = 0;
}
window.addEventListener('scroll', () => {
  if (!progressFrame) progressFrame = window.requestAnimationFrame(updateProgress);
}, { passive: true });
updateProgress();

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: .08 });
  reveals.forEach((node) => observer.observe(node));
} else {
  reveals.forEach((node) => node.classList.add('is-visible'));
}

document.querySelector('[data-contact-form]')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const subject = currentLanguage === 'zh' ? 'Yonaris 咨询' : 'Yonaris enquiry';
  const labels = currentLanguage === 'zh'
    ? ['工作邮箱', '称呼', '公司或官网', '想了解的事情']
    : ['Work email', 'Name', 'Company or website', 'What I am curious about'];
  const fields = ['email', 'name', 'company', 'question'];
  const body = fields.map((field, index) => `${labels[index]}: ${data.get(field) || '—'}`).join('\n\n');
  window.location.href = `mailto:hello@yonaris.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

applyLanguage('en');
