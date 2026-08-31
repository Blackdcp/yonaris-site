document.documentElement.classList.add('js');

const copy = {
  en: {
    skip: 'Skip to content', navLabel: 'Primary navigation', mobileNavLabel: 'Mobile navigation', footerNavLabel: 'Footer navigation', openMenu: 'Open menu', closeMenu: 'Close menu',
    navProduct: 'Product', navCasework: 'Casework', navCompany: 'Company', navTalk: 'Talk to Yonaris', footerContact: 'Contact',
    brandPosition: 'AI-Native MarTech Infrastructure', heroTitle: 'Know what buyers are being told—and what to change.', heroBody: 'Yonaris shows marketing teams what AI and digital channels are telling buyers, which evidence is shaping the shortlist, what action can change it, and what actually changed afterwards.', heroPrimary: 'See Yonaris in action', heroSecondary: 'Talk to Yonaris', heroFootnote: 'One question. Several public answers. One reviewable record.',
    recordLabel: 'Interactive market record', marketRecord: 'Market record', buyerQuestion: 'Buyer question', representativeQuestion: 'Which analytics partner can support an enterprise marketing team across several markets without losing local context or evidence?', marketLabel: 'Market', languageLabel: 'Language', scopeLabel: 'Scope', selectedChannels: '4 selected channels', channelsLabel: 'Observed channels', channelAi: 'AI Answers', channelSearch: 'Search', channelEditorial: 'Editorial', channelCompany: 'Company', judgementLabel: 'Judgement', evidenceLabel: 'Evidence', gapLabel: 'Gap',
    beforeSalesLabel: 'Before sales begins', marketTitle: 'The first comparison is already taking shape.', marketBody: 'Buyers can form a first comparison across AI answers, search, public evidence and third-party sources before sales begins. Yonaris makes the information shaping that comparison visible and reviewable.', marketClosing: 'This is what the market is telling buyers before the sales conversation begins.',
    archiveLabel: 'What remains attached to every record', archiveQuestion: 'Buyer question', archiveQuestionBody: 'The question, audience and alternatives being compared.', archiveConditions: 'Market conditions', archiveConditionsBody: 'Language, local terms and observation scope.', archiveEvidence: 'Evidence relationships', archiveEvidenceBody: 'Sources, missing context and contradictions.', archiveBoundary: 'Decision boundary', archiveBoundaryBody: 'What changed, what did not and what cannot be claimed.',
    productLabel: 'The Yonaris workflow', productTitle: 'From one buyer question to the next market action.', productIntro: 'Observe the answer, trace the evidence, put action under review, then ask the same question again.', workflowStepsLabel: 'Workflow steps', stage1Short: 'Question', stage2Short: 'Answer', stage3Short: 'Evidence', stage4Short: 'Action', stage5Short: 'Review', stage1Title: 'Buyer questions', stage1Body: 'Start with the question—and the market, audience, language and alternatives around it.', stage2Title: 'Current answers', stage2Body: 'See what selected AI, search, editorial and company-owned channels are telling buyers now.', stage3Title: 'Sources and gaps', stage3Body: 'Trace each comparison reason to the evidence that supports it, the context it lacks, or the contradiction it contains.', stage4Title: 'Actions under review', stage4Body: 'Turn the clearest gap into a prioritised action for the team to review, approve or reject.', stage5Title: 'Outcome review', stage5Body: 'Ask the same question again under recorded conditions. Keep changed, unchanged and non-attributable findings separate.', sharedRecordLabel: 'Shared record stage', sharedRecord: 'Shared record', recordContinuity: 'Record continuity', conditionsAttached: 'Conditions attached',
    humanAgentLabel: 'Human / Agent', humanAgentTitle: 'One fact. Two readers. No conflicting versions.', humanAgentBody: 'People need context and a useful next move. Agents need a stable claim, source, scope, timestamp and boundary. Both readings come from the same public record.', factRecord: 'Fact record', humanFinding: 'A relevant selection reason became visible; the recommendation order did not change.', reviewed: 'Reviewed', projectionLabel: 'Record projection', whatHappened: 'What happened', whatHappenedBody: 'A relevant selection reason became visible in the reviewed record.', whyMatters: 'Why it matters', whyMattersBody: 'Buyers can now inspect why the capability may fit this market.', reviewNext: 'What to review next', reviewNextBody: 'Whether the same reason appears again under recorded conditions.', agentClaim: 'Claim', agentClaimValue: 'Selection reason visible', stableId: 'Stable ID', agentSource: 'Source', agentSourceValue: 'Public record / attached', agentScope: 'Scope', agentScopeValue: 'Selected channels / APAC / EN', agentObserved: 'Observed at', boundaryLabel: 'Boundary', agentBoundaryValue: 'Recommendation order unchanged; non-attributable', humanAgentBoundary: 'A structured public record can help a fact be found and checked. It does not guarantee crawling, retrieval, ranking, recommendation or citation.',
    caseLabel: 'Representative casework', caseTitle: 'One question, from first answer to review.', caseBody: 'Follow one representative record from the first observation to the reviewed action, the later review, and the limits that remain.', caseDisclosure: 'Representative casework—not a customer performance claim.', reviewComparison: 'Review comparison', beforeReview: 'Before review', comparisonControlLabel: 'Move between before and after review', before: 'Before', after: 'After', selectionReason: 'Selection reason', publicEvidence: 'Public evidence', recommendationOrder: 'Recommendation order', attribution: 'Attribution', whatStayedSame: 'What stayed the same', orderUnchanged: 'Recommendation order did not change', whatCannotBeClaimed: 'What cannot be claimed', causalBoundary: 'One review cannot prove that the content change caused the answer change or produced a commercial result.',
    companyLabel: 'What Yonaris keeps clear', companyTitle: 'Built for the moment before the sales conversation.', principleVisible: 'Visible', principleVisibleBody: 'Observed answers, related evidence and gaps stay connected.', principleReviewable: 'Reviewable', principleReviewableBody: 'Actions are prioritised for people to approve, adjust or reject.', principleBounded: 'Bounded', principleBoundedBody: 'Changed, unchanged and non-attributable findings remain separate.', notAPromise: 'Not a promise of', promiseBoundary: 'Exhaustive coverage, guaranteed ranking, guaranteed citation, autonomous execution, causal proof, or a commercial result from a single change.',
    contactLabel: 'Start with the question', contactTitle: 'Curious where Yonaris could fit?', contactBody: 'You don’t need a brief—or even a clearly defined problem. Tell us what you’re curious about.', conversationRecord: 'Conversation / new record', formEmail: 'Work email *', formEmailPlaceholder: 'you@company.com', formName: 'Name', formNamePlaceholder: 'How should we address you?', formCompany: 'Company or website', formCompanyPlaceholder: 'Company / URL', formQuestion: 'What are you curious about?', formQuestionPlaceholder: 'A buyer question, market, or something that feels unclear', formSubmit: 'Start a conversation', formNote: 'This opens your email app. Your message goes to hello@yonaris.com.', footerStatement: 'Built for evidence-aware marketing decisions.',
    documentTitle: 'Yonaris — AI-Native MarTech Infrastructure', documentDescription: 'Yonaris shows marketing teams what AI and digital channels are telling buyers, which evidence shapes comparison, and what to review next.'
  },
  zh: {
    skip: '跳到主要内容', navLabel: '主导航', mobileNavLabel: '移动端导航', footerNavLabel: '页脚导航', openMenu: '打开菜单', closeMenu: '关闭菜单',
    navProduct: '产品', navCasework: '案例拆解', navCompany: '关于 Yonaris', navTalk: '联系 Yonaris', footerContact: '联系 Yonaris',
    brandPosition: 'AI 原生营销科技基础设施', heroTitle: '看清客户听到了什么，再决定哪里值得改。', heroBody: 'Yonaris 把 AI 和数字渠道中的答案、比较理由与证据连在一起，帮助营销团队看清品牌为什么进入或退出备选、下一步先处理什么，以及复核后哪些发生了变化。', heroPrimary: '看看 Yonaris 怎么工作', heroSecondary: '先聊聊', heroFootnote: '一个问题，多份公开答案，一条可复核记录。',
    recordLabel: '互动市场记录', marketRecord: '市场记录', buyerQuestion: '客户问题', representativeQuestion: '为什么竞品先进入了客户的备选，而我们的优势没有成为选择理由？', marketLabel: '市场', languageLabel: '语言', scopeLabel: '范围', selectedChannels: '4 个已选渠道', channelsLabel: '已观测渠道', channelAi: 'AI 答案', channelSearch: '搜索结果', channelEditorial: '行业内容', channelCompany: '品牌信息', judgementLabel: '判断', evidenceLabel: '证据', gapLabel: '缺口',
    beforeSalesLabel: '销售介入之前', marketTitle: '第一轮比较，已经在形成。', marketBody: '销售介入前，第一轮比较可能已经在 AI、搜索、公开证据和第三方来源中形成。Yonaris 让影响这轮比较的信息变得可见、可复核。', marketClosing: '这就是客户联系销售之前，已经形成的第一轮判断。',
    archiveLabel: '每条记录始终保留的内容', archiveQuestion: '客户问题', archiveQuestionBody: '正在比较的问题、人群与备选对象。', archiveConditions: '市场条件', archiveConditionsBody: '语言、当地用语与观测范围。', archiveEvidence: '证据关系', archiveEvidenceBody: '来源、缺失的语境与信息矛盾。', archiveBoundary: '判断边界', archiveBoundaryBody: '什么变了、什么没变，以及什么不能下结论。',
    productLabel: 'Yonaris 工作流', productTitle: '从一个市场问题，到团队下一步该做什么。', productIntro: '观察答案、追溯证据、把行动交给团队审阅，再在相同条件下复核。', workflowStepsLabel: '工作流程步骤', stage1Short: '问题', stage2Short: '答案', stage3Short: '证据', stage4Short: '行动', stage5Short: '复核', stage1Title: '客户问题', stage1Body: '先把问题，以及对应的市场、人群、语言和比较对象放进来。', stage2Title: '当前答案', stage2Body: '看清 AI、搜索、行业内容和品牌公开信息正在怎样回答客户。', stage3Title: '来源与证据缺口', stage3Body: '把每一个比较理由追溯到支持它的证据、缺失的语境或相互矛盾的信息。', stage4Title: '待团队审阅', stage4Body: '把最值得处理的缺口变成一项有优先级的行动，由团队决定批准、调整还是放弃。', stage5Title: '结果复核', stage5Body: '在记录下来的条件中再次提出同一个问题，把已变化、未变化和无法归因的结果分开。', sharedRecordLabel: '共享记录舞台', sharedRecord: '共享记录', recordContinuity: '记录连续性', conditionsAttached: '条件已关联',
    humanAgentLabel: 'Human / Agent', humanAgentTitle: '同一个事实，让人看得懂，也让 Agent 读得准。', humanAgentBody: '人需要知道事实意味着什么、下一步审阅什么；Agent 需要稳定的事实陈述、来源、范围、时间戳和边界。两种视图始终关联同一条记录。', factRecord: '事实记录', humanFinding: '品牌的选择理由已经出现，但推荐顺序没有变化。', reviewed: '已审阅', projectionLabel: '记录投影视图', whatHappened: '发生了什么', whatHappenedBody: '经复核的记录中，已经出现一条相关的选择理由。', whyMatters: '为什么重要', whyMattersBody: '客户现在可以核对这项能力为什么可能适用于当前市场。', reviewNext: '下一步看什么', reviewNextBody: '在记录条件中复核同一个理由是否再次出现。', agentClaim: '事实陈述', agentClaimValue: '选择理由已可见', stableId: '稳定标识', agentSource: '来源', agentSourceValue: '公开记录 / 已关联', agentScope: '适用范围', agentScopeValue: '已选渠道 / 亚太 / 英文', agentObserved: '观测时间', boundaryLabel: '边界', agentBoundaryValue: '推荐顺序未变；无法归因', humanAgentBoundary: '结构化公开记录有助于事实被找到和核对，但不保证抓取、检索、排名、推荐或引用。',
    caseLabel: '代表性案例拆解', caseTitle: '看一个市场问题如何被完整拆解。', caseBody: '从最初答案、证据缺口到团队行动和后续复核，一次看清判断是怎么形成的，也看清哪些结论仍然不能下。', caseDisclosure: '代表性案例演示，不构成客户效果声明。', reviewComparison: '复核比较', beforeReview: '复核前', comparisonControlLabel: '在复核前后之间切换', before: '之前', after: '之后', selectionReason: '选择理由', publicEvidence: '公开证据', recommendationOrder: '推荐顺序', attribution: '归因', whatStayedSame: '什么没有变化', orderUnchanged: '推荐顺序没有变化', whatCannotBeClaimed: '什么不能下结论', causalBoundary: '单次复核不能证明变化由某一项内容造成，也不能据此声称已经带来商业结果。',
    companyLabel: 'Yonaris 坚持保留什么', companyTitle: '客户开口之前，很多判断已经发生了。', principleVisible: '可见', principleVisibleBody: '观测答案、相关证据与缺口始终保持关联。', principleReviewable: '可审阅', principleReviewableBody: '行动先被排序，再由团队批准、调整或放弃。', principleBounded: '有边界', principleBoundedBody: '已变化、未变化和无法归因的发现始终分开。', notAPromise: '不承诺', promiseBoundary: '覆盖所有答案、保证排名、保证引用、绕过团队自动执行、因果证明，或单次变化带来的商业结果。',
    contactLabel: '从问题开始', contactTitle: '想知道 Yonaris 能不能帮上忙？', contactBody: '不用准备方案，也不用先把问题想完整。告诉我们你最想弄清楚什么。', conversationRecord: '对话 / 新记录', formEmail: '工作邮箱 *', formEmailPlaceholder: 'you@company.com', formName: '怎么称呼你', formNamePlaceholder: '你的称呼', formCompany: '公司或官网', formCompanyPlaceholder: '公司 / 网址', formQuestion: '你想了解什么？', formQuestionPlaceholder: '一个客户问题、市场，或任何让你觉得不够清楚的地方', formSubmit: '开始聊聊', formNote: '点击后会打开你的邮件应用，并将邮件发送至 hello@yonaris.com。', footerStatement: '为重视证据的营销决策而建。',
    documentTitle: 'Yonaris — AI 原生营销科技基础设施', documentDescription: 'Yonaris 帮助营销团队看清 AI 与数字渠道正在告诉客户什么、哪些证据影响比较，以及下一步该审阅什么。'
  }
};

const channelData = {
  en: {
    ai: { judgement: 'Included because local-market support is stated.', evidence: 'Public source attached to the claim.', gap: 'Conditions vary by market and need to stay visible.', status: 'Reason visible' },
    search: { judgement: 'Mentioned, but not advanced into the comparison.', evidence: 'Capability page is indexed and inspectable.', gap: 'The page does not connect the capability to this selection criterion.', status: 'Context missing' },
    editorial: { judgement: 'Alternative A advances on documented market context.', evidence: 'Third-party review states supported markets and operating conditions.', gap: 'Your company is described without the same evidence relationship.', status: 'Evidence gap' },
    company: { judgement: 'The capability is published with inconsistent scope.', evidence: 'Two company-owned pages describe the same capability.', gap: 'Supported markets differ between the two public descriptions.', status: 'Review required' }
  },
  zh: {
    ai: { judgement: '因明确说明当地市场支持而进入备选。', evidence: '相关陈述已关联公开来源。', gap: '不同市场的适用条件仍需保持可见。', status: '理由可见' },
    search: { judgement: '品牌被提到，却没有进入下一轮比较。', evidence: '能力页面可被找到和核对。', gap: '页面没有把这项能力连接到当前选择标准。', status: '缺少语境' },
    editorial: { judgement: '竞品因可核对的市场语境进入备选。', evidence: '第三方评测说明了支持市场与适用条件。', gap: '我们的品牌没有关联同等清晰的证据关系。', status: '证据缺口' },
    company: { judgement: '能力已经公开，但适用范围并不一致。', evidence: '两份品牌公开页面描述了同一项能力。', gap: '两份说明中的支持市场不同。', status: '需要审阅' }
  }
};

const workflowData = {
  en: [
    { code: 'INPUT / CONDITIONS', title: 'Buyer questions', summary: 'Start with one consequential question and keep its conditions attached.', details: [['Market', 'APAC'], ['Audience', 'Enterprise marketing'], ['Language', 'English'], ['Alternatives', 'A / B / C']], status: 'Conditions attached' },
    { code: 'OBSERVE / CHANNELS', title: 'Current answers', summary: 'Selected channels are observed separately before findings are brought together.', details: [['AI answers', 'Reason visible'], ['Search', 'Mention only'], ['Editorial', 'Alternative advances'], ['Company', 'Scope mismatch']], status: 'Four answers recorded' },
    { code: 'TRACE / SOURCES', title: 'Sources and gaps', summary: 'Each comparison reason is traced to supporting evidence, missing context or contradiction.', details: [['Attached', '3 sources'], ['Missing', '1 relationship'], ['Contradiction', '1 scope'], ['Review', 'Required']], status: 'Evidence mapped' },
    { code: 'DECIDE / HUMAN REVIEW', title: 'Action under review', summary: 'The clearest gap becomes a bounded action for the team to approve, adjust or reject.', details: [['Priority', '01'], ['Action', 'Clarify scope'], ['Source', 'Attach public record'], ['Owner', 'Human team']], status: 'Awaiting approval' },
    { code: 'RECHECK / OUTCOME', title: 'Outcome review', summary: 'The same question is asked again under recorded conditions without collapsing different findings.', details: [['Changed', 'Reason visible'], ['Unchanged', 'Order'], ['Attribution', 'Not established'], ['Commercial result', 'Not claimed']], status: 'Review complete' }
  ],
  zh: [
    { code: '输入 / 记录条件', title: '客户问题', summary: '从一个关键问题开始，并始终关联对应的判断条件。', details: [['市场', '亚太'], ['人群', '企业营销团队'], ['语言', '英文'], ['比较对象', 'A / B / C']], status: '条件已关联' },
    { code: '观测 / 已选渠道', title: '当前答案', summary: '先分别观察不同渠道，再把发现带回同一条记录。', details: [['AI 答案', '理由可见'], ['搜索结果', '仅被提到'], ['行业内容', '竞品进入备选'], ['品牌信息', '范围不一致']], status: '已记录四份答案' },
    { code: '追溯 / 来源', title: '来源与证据缺口', summary: '把每个比较理由追溯到支持证据、缺失语境或信息矛盾。', details: [['已关联', '3 条来源'], ['缺失', '1 条关系'], ['矛盾', '1 处范围'], ['审阅', '必需']], status: '证据关系已整理' },
    { code: '决策 / 团队审阅', title: '待团队审阅', summary: '把最清晰的缺口变成边界明确的行动，由团队批准、调整或放弃。', details: [['优先级', '01'], ['行动', '明确范围'], ['来源', '关联公开记录'], ['负责人', '团队']], status: '等待批准' },
    { code: '复核 / 结果', title: '结果复核', summary: '在记录条件中再次提出同一个问题，并把不同性质的发现分开。', details: [['已变化', '理由可见'], ['未变化', '推荐顺序'], ['归因', '未建立'], ['商业结果', '未声称']], status: '复核完成' }
  ]
};

const comparisonData = {
  en: [
    { output: 'Before review', title: 'Capability mentioned. No clear reason to advance.', body: 'The company appears in the answer, but the capability is not connected to this buyer’s selection criterion.', evidence: 'Capability published; relevance not attached', order: 'Alternative A remains first', attribution: 'Not assessed before review' },
    { output: 'After review', title: 'A relevant selection reason is now visible.', body: 'The capability’s scope and supported markets are connected to a public source a buyer can inspect.', evidence: 'Scope, market and source connected', order: 'Alternative A remains first', attribution: 'Change observed; cause not established' }
  ],
  zh: [
    { output: '复核前', title: '能力被提到，却没有进入下一轮比较的明确理由。', body: '品牌出现在答案中，但这项能力没有连接到客户的选择标准。', evidence: '能力已公开；相关性未关联', order: '竞品 A 仍排在首位', attribution: '复核前未评估' },
    { output: '复核后', title: '一条相关的选择理由已经出现。', body: '能力的适用范围与支持市场已连接到客户可以核对的公开来源。', evidence: '范围、市场与来源已连接', order: '竞品 A 仍排在首位', attribution: '观察到变化；没有建立因果' }
  ]
};

let language = 'en';
let activeChannel = 'ai';
let activeWorkflow = 0;
let activeProjection = 'human';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function text(key) { return copy[language][key] ?? copy.en[key] ?? key; }

function animatePanel(node) {
  if (!node || prefersReducedMotion.matches) return;
  node.classList.remove('is-changing');
  void node.offsetWidth;
  node.classList.add('is-changing');
}

function updateChannel(channel, focus = false) {
  activeChannel = channel;
  const data = channelData[language][channel];
  const panel = document.querySelector('.channel-panel');
  document.querySelectorAll('[data-channel]').forEach((button) => {
    const selected = button.dataset.channel === channel;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    if (selected && focus) button.focus();
  });
  document.querySelector('[data-channel-judgement]').textContent = data.judgement;
  document.querySelector('[data-channel-evidence]').textContent = data.evidence;
  document.querySelector('[data-channel-gap]').textContent = data.gap;
  document.querySelector('[data-channel-status]').textContent = data.status;
  panel.setAttribute('aria-labelledby', `channel-${channel}`);
  animatePanel(panel);
}

function updateWorkflow(index, focus = false) {
  activeWorkflow = index;
  const data = workflowData[language][index];
  document.querySelectorAll('[data-workflow-button]').forEach((button) => {
    const selected = Number(button.dataset.workflowButton) === index;
    if (selected) button.setAttribute('aria-current', 'step'); else button.removeAttribute('aria-current');
    if (selected && focus) button.focus({ preventScroll: true });
  });
  document.querySelectorAll('[data-workflow-step]').forEach((step) => step.classList.toggle('is-active', Number(step.dataset.workflowStep) === index));
  document.querySelector('[data-shared-index]').textContent = `${String(index + 1).padStart(2, '0')} / 05`;
  document.querySelector('[data-shared-code]').textContent = data.code;
  document.querySelector('[data-shared-title]').textContent = data.title;
  document.querySelector('[data-shared-summary]').textContent = data.summary;
  data.details.forEach(([label, value], detailIndex) => {
    document.querySelector(`[data-shared-label-${detailIndex + 1}]`).textContent = label;
    document.querySelector(`[data-shared-value-${detailIndex + 1}]`).textContent = value;
  });
  document.querySelector('[data-shared-status]').textContent = data.status;
  document.querySelectorAll('.record-continuity i').forEach((bar, barIndex) => bar.classList.toggle('is-complete', barIndex <= index));
  animatePanel(document.querySelector('.shared-record-body'));
}

function updateProjection(projection, focus = false) {
  activeProjection = projection;
  const human = document.querySelector('[data-human-projection]');
  const agent = document.querySelector('[data-agent-projection]');
  const panel = document.querySelector('.projection-panel');
  document.querySelectorAll('[data-projection]').forEach((button) => {
    const selected = button.dataset.projection === projection;
    button.setAttribute('aria-selected', String(selected));
    button.tabIndex = selected ? 0 : -1;
    if (selected && focus) button.focus();
  });
  human.hidden = projection !== 'human';
  agent.hidden = projection !== 'agent';
  panel.setAttribute('aria-labelledby', projection === 'human' ? 'human-tab' : 'agent-tab');
  animatePanel(panel);
}

function updateComparison() {
  const slider = document.querySelector('[data-review-slider]');
  if (!slider) return;
  const index = Number(slider.value);
  const data = comparisonData[language][index];
  document.querySelector('[data-comparison-output]').textContent = data.output;
  document.querySelector('[data-case-title]').textContent = data.title;
  document.querySelector('[data-case-body]').textContent = data.body;
  document.querySelector('[data-case-evidence]').textContent = data.evidence;
  document.querySelector('[data-case-order]').textContent = data.order;
  document.querySelector('[data-case-attribution]').textContent = data.attribution;
  slider.setAttribute('aria-valuetext', data.output);
  document.querySelector('[data-comparison]').dataset.state = index ? 'after' : 'before';
  animatePanel(document.querySelector('.comparison-content'));
}

function applyLanguage(nextLanguage) {
  language = nextLanguage;
  const dictionary = copy[language];
  document.documentElement.lang = language === 'zh' ? 'zh-CN' : 'en';
  document.documentElement.dataset.language = language;
  document.title = dictionary.documentTitle;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = dictionary.documentDescription;
  document.querySelectorAll('[data-i18n]').forEach((node) => {
    const value = dictionary[node.dataset.i18n];
    if (value !== undefined) node.textContent = value;
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => { node.placeholder = text(node.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-aria]').forEach((node) => { node.setAttribute('aria-label', text(node.dataset.i18nAria)); });
  const toggle = document.querySelector('[data-language-toggle]');
  toggle.textContent = language === 'en' ? '中文' : 'English';
  toggle.setAttribute('aria-label', language === 'en' ? '切换到中文' : 'Switch to English');
  const expanded = document.querySelector('[data-menu-toggle]').getAttribute('aria-expanded') === 'true';
  document.querySelector('[data-menu-label]').textContent = text(expanded ? 'closeMenu' : 'openMenu');
  updateChannel(activeChannel);
  updateWorkflow(activeWorkflow);
  updateComparison();
}

document.querySelector('[data-language-toggle]').addEventListener('click', () => applyLanguage(language === 'en' ? 'zh' : 'en'));

const menuToggle = document.querySelector('[data-menu-toggle]');
const mobileNav = document.querySelector('[data-mobile-nav]');
function closeMenu() {
  menuToggle.setAttribute('aria-expanded', 'false');
  document.querySelector('[data-menu-label]').textContent = text('openMenu');
  mobileNav.hidden = true;
  document.body.classList.remove('menu-open');
}
menuToggle.addEventListener('click', () => {
  const willOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(willOpen));
  document.querySelector('[data-menu-label]').textContent = text(willOpen ? 'closeMenu' : 'openMenu');
  mobileNav.hidden = !willOpen;
  document.body.classList.toggle('menu-open', willOpen);
});
mobileNav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeMenu(); });
window.addEventListener('resize', () => { if (window.innerWidth > 820) closeMenu(); }, { passive: true });

const channelTabs = Array.from(document.querySelectorAll('[data-channel]'));
channelTabs.forEach((button, index) => {
  button.addEventListener('click', () => updateChannel(button.dataset.channel));
  button.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % channelTabs.length;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + channelTabs.length) % channelTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = channelTabs.length - 1;
    updateChannel(channelTabs[next].dataset.channel, true);
  });
});

document.querySelectorAll('[data-workflow-button]').forEach((button) => {
  button.addEventListener('click', () => updateWorkflow(Number(button.dataset.workflowButton), true));
});

const projectionTabs = Array.from(document.querySelectorAll('[data-projection]'));
projectionTabs.forEach((button, index) => {
  button.addEventListener('click', () => updateProjection(button.dataset.projection));
  button.addEventListener('keydown', (event) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let next = index;
    if (event.key === 'ArrowRight') next = (index + 1) % projectionTabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + projectionTabs.length) % projectionTabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = projectionTabs.length - 1;
    updateProjection(projectionTabs[next].dataset.projection, true);
  });
});

document.querySelector('[data-review-slider]').addEventListener('input', updateComparison);
document.querySelector('[data-review-slider]').addEventListener('change', updateComparison);

const progress = document.querySelector('[data-scroll-progress]');
let scrollFrame = 0;
function updateScrollProgress() {
  const maximum = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${maximum > 0 ? Math.min(window.scrollY / maximum, 1) : 0})`;
  scrollFrame = 0;
}
window.addEventListener('scroll', () => { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollProgress); }, { passive: true });

const navSections = document.querySelectorAll('[data-section]');
if ('IntersectionObserver' in window) {
  const workflowObserver = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) updateWorkflow(Number(visible.target.dataset.workflowStep));
  }, { rootMargin: '-32% 0px -48% 0px', threshold: [0, .25, .5, .75] });
  document.querySelectorAll('[data-workflow-step]').forEach((step) => workflowObserver.observe(step));

  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      document.querySelectorAll('[data-nav-link]').forEach((link) => {
        const target = link.getAttribute('href').slice(1);
        if (target === entry.target.id) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  navSections.forEach((section) => navObserver.observe(section));
}

const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !prefersReducedMotion.matches) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); revealObserver.unobserve(entry.target); }
    });
  }, { rootMargin: '0px 0px -7% 0px', threshold: .08 });
  reveals.forEach((node) => revealObserver.observe(node));
} else {
  reveals.forEach((node) => node.classList.add('is-visible'));
}

document.querySelector('[data-contact-form]').addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const labels = language === 'zh' ? ['工作邮箱', '称呼', '公司或官网', '想了解的事情'] : ['Work email', 'Name', 'Company or website', 'What I am curious about'];
  const fields = ['email', 'name', 'company', 'question'];
  const body = fields.map((field, index) => `${labels[index]}: ${data.get(field) || '—'}`).join('\n\n');
  const subject = language === 'zh' ? 'Yonaris 咨询' : 'Yonaris enquiry';
  window.location.href = `mailto:hello@yonaris.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});

updateScrollProgress();
applyLanguage('en');
updateProjection('human');
