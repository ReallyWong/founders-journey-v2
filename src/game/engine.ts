// ─── 创业人生 · 游戏引擎 ────────────────────────────────────────────────────
import type {
  GameState, Gender, PendingDecision, Choice, LogEntry, Ending, Candidate, Difficulty,
} from "./types";
import { openBrokerage, buy as mktBuy, sell as mktSell, equityAt, getRules, getBar, getBars, listTickers, marginSettle, maintenanceRatio, buyMargin, crashIndexDrop, pctChange as mktPctChange, type Brokerage } from "./market";
import { REGIONS, INDUSTRIES, EVENTS, INVESTORS, CANDIDATES, ENDINGS, NAMES, COFOUNDERS, SCENARIOS } from "./data";
import { reportRun, reportTournament, recordRun, loadCareer } from "./telemetry";
import { clearSave } from "./save";

const START_YEAR = 2024;
const MONTH_NAMES = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

// ─── 可播种随机源（v1.6-beta：多人同 seed 比拼的重放基石）────────────────────
// mulberry32：种子相同 ⇒ 整局随机序列相同。注意：读档续玩会重放跳过，
// 与原生连续对局可能有轻微序列偏移（比拼要求单 session 打完，见内部手册）。
let rngState = 0;
let activeSeed: number | null = null;
function nextRandom(): number {
  rngState |= 0;
  rngState = (rngState + 0x6d2b79f5) | 0;
  let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}
export function seedRng(seed: number): void {
  rngState = seed | 0;
  activeSeed = seed | 0;
}
// 比拼码 → 32 位种子（FNV-1a：同码必同局）
export function hashSeed(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  }
  return h | 0;
}
function syncRng(s: GameState): void {
  if (activeSeed !== s.rngSeed) {
    seedRng(s.rngSeed);
    // 近似快进：每月约 31 次取随机（决策+月度+事件），保证读档后序列确定

    const skip = Math.min(3000, s.month * 31);
    for (let i = 0; i < skip; i++) nextRandom();
  }
}

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(nextRandom() * arr.length)];
}

export function randInt(min: number, max: number): number {
  return Math.floor(nextRandom() * (max - min + 1)) + min;
}

export function fmtMoney(s: GameState, v: number): string {
  const abs = Math.abs(v);
  const sign = v < 0 ? "-" : "";
  if (abs >= 10000) return `${sign}${s.region.currency}${(abs / 10000).toFixed(1)}亿`;
  return `${sign}${s.region.currency}${Math.round(abs)}万`;
}

export interface NewGameOptions {
  difficulty?: Difficulty;
  cofounderId?: string;
  scenarioId?: string;
  seed?: number; // v1.6-beta：比拼模式由服务端下发，同 seed = 同一随机序列
  tournamentCode?: string;
  deepInvestors?: boolean; // v1.7：深度机构模式（机构有记忆、跟投、黑名单）
  marketLinkage?: boolean; // v2.0：市场↔经营联动（股灾月触发资本寒冬）；默认开
}

export function newGame(name: string, gender: Gender, regionId: string, industryId: string, opts: NewGameOptions = {}): GameState {
  const difficulty: Difficulty = opts.difficulty ?? "standard";
  const scenario = opts.scenarioId ? SCENARIOS.find((sc) => sc.id === opts.scenarioId) : undefined;
  const cofounder = opts.cofounderId ? COFOUNDERS.find((c) => c.id === opts.cofounderId) : undefined;
  const region = REGIONS.find((r) => r.id === (scenario?.regionId ?? regionId)) ?? REGIONS[0];
  const industry = INDUSTRIES.find((i) => i.id === (scenario?.industryId ?? industryId)) ?? INDUSTRIES[0];
  let startCash = scenario?.startCash ?? industry.startCash ?? 15;
  if (difficulty === "easy") startCash = Math.round(startCash * 1.5);
  // v1.6-beta：播种随机源（比拼同 seed；单机随机）
  const rngSeed = opts.seed ?? (opts.tournamentCode ? hashSeed(opts.tournamentCode) : ((Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) | 0));
  seedRng(rngSeed);
  const isAngel = industry.id === "angel";
  const isVC = industry.id === "vcpe";
  // 🥚 彩蛋：累计通关 3 局的「连续创业者」获得老兵光环
  let veteran = false;
  try { veteran = parseInt(localStorage.getItem("fj_completions") || "0", 10) >= 3; } catch { /* ignore */ }
  const state: GameState = {
    name: name.trim() || (gender === "female" ? pick(NAMES.female) : pick(NAMES.male)),
    gender,
    region,
    industry,
    difficulty,
    cofounder,
    scenario: scenario ? { id: scenario.id, year: scenario.year, queue: scenario.queue.map((q) => ({ ...q })) } : undefined,
    month: 0,
    year: scenario?.year ?? START_YEAR,
    season: MONTH_NAMES[0],
    cash: startCash,
    valuation: isAngel || isVC ? 400 : 60,
    product: 0,
    users: 0,
    mrr: 0,
    morale: 80,
    health: veteran ? 95 : 90,
    reputation: isAngel || isVC ? 15 : veteran ? 8 : 0,
    debt: 0,
    team: cofounder ? 2 : 1,
    stage: "idea",
    stageProgress: 0,
    tags: [],
    log: [
      isAngel
        ? { month: 0, text: `你用上一次创业攒下的第一桶金 ${region.currency}${startCash} 万注册了微型基金。在${region.city}，天使投资人的故事开始了。`, type: "system" }
        : isVC
          ? { month: 0, text: `首期基金 ${region.currency}${startCash} 万募集到位。在${region.city}，VC/PE 投资人的故事开始了——你的「客户」是项目，你的「产品」是眼光。`, type: "system" }
          : scenario
            ? { month: 0, text: `剧本模式 · ${scenario.title}。${scenario.tagline}`, type: "system" }
            : { month: 0, text: `你把全部身家 ${region.currency}${startCash} 万转进公司账户。在${region.city}，${industry.name}的创业故事开始了。`, type: "system" },
    ],
    alive: true,
    raised: [],
    pendingDecision: null,
    eventCooldown: 0,
    budget: { rd: 40, marketing: 30, sales: 30 },
    speed: 0,
    rngSeed,
    tournamentCode: opts.tournamentCode,
    awareness: 5,
    accessibility: 10,
    deepInvestors: opts.deepInvestors ?? false,
    investorRelations: {},
    marketLinkage: opts.marketLinkage ?? true,
  };
  // v1.7：资本寒冬——每局预生成 1-2 段窗口（融资胜率骤降、谈判空间关闭）
  {
    const winters: [number, number][] = [];
    const first = 7 + randInt(0, 10);
    winters.push([first, first + 3 + randInt(0, 3)]);
    if (nextRandom() < 0.5) {
      const second = first + 14 + randInt(0, 12);
      winters.push([second, second + 3 + randInt(0, 4)]);
    }
    state.winterWindows = winters;
  }
  // v2.0：市场↔经营联动——真实股灾月（三大盘指任一月跌 ≤-15%）自动成为资本寒冬窗口
  if (state.marketLinkage) {
    const addWinter = (m: number) => {
      const w: [number, number] = [m, m + 5];
      const all = [...state.winterWindows!, w].sort((a, b) => a[0] - b[0]);
      const merged: [number, number][] = [];
      for (const cur of all) {
        const last = merged[merged.length - 1];
        if (last && cur[0] <= last[1] + 1) last[1] = Math.max(last[1], cur[1]);
        else merged.push([...cur] as [number, number]);
      }
      state.winterWindows = merged;
    };
    for (let m = 6; m < 240; m++) {
      if (crashIndexDrop(marketYmForMonth(scenario?.year, m)) <= -0.15) addWinter(m);
    }
  }
  // 🥚 老兵光环提示
  if (veteran) {
    state.log.push({ month: 0, text: "🥚 彩蛋 · 连续创业者光环：这是你第 3+ 次站上牌桌。经验让你心态更稳（初始健康 95、声望 +8）。老兵不死，只是换个赛道继续折腾。", type: "good" });
  }
  // 难度说明
  if (difficulty === "easy") {
    state.log.push({ month: 0, text: "🎓 教学难度：初始资金 ×1.5，危机事件发生率降低。适合第一次创业的玩家。", type: "system" });
  } else if (difficulty === "realism") {
    state.log.push({ month: 0, text: "🔥 真实模式：危机更多、融资更难，且本局不自动存档（单次生命，不能读档）。这是真实创业者的世界。", type: "bad" });
  } else if (difficulty === "hell") {
    state.log.push({ month: 0, text: "🇨🇳 地狱 · 中国特别版：本局不自动存档。危机触发率 65%，你将直面监管新规、税务稽查、社保稽核、账户冻结等系统性风险——全部取材自真实创业环境。调查不等于定罪，但每一步都要留痕。", type: "bad" });
  }
  // 合伙人入伙
  if (cofounder) {
    state.log.push({ month: 0, text: `🤝 联合创始人 ${cofounder.name}（${cofounder.role}）入伙。${cofounder.bonus}`, type: "good" });
  }
  // 开局事件：灵感来源选择
  state.pendingDecision = {
    kind: "event",
    eventId: "start-idea",
    title: "一切的起点",
    scene: isAngel
      ? `${state.name}在${region.city}的私人会所里翻着一叠 BP。上一段创业落幕，这一局你坐在牌桌的另一侧。投资人的第一步，从哪里开始？`
      : `${state.name}站在${region.city}的街头。你观察了很久${industry.name}这个行业，一个想法在脑子里盘旋了三周。创业的第一步，从哪里开始？`,
    choices: [
      {
        id: "research", text: "先做 2 周桌面调研：市场规模、竞品、政策",
        effects: { months: 1, product: 5, flag: "researched" },
        resultText: "你拉出 30 页调研笔记。市场比想象的大，但对手也比想象的多。至少，你不是在盲目冲锋。",
        lessonTitle: "创业课 · TAM/SAM/SOM",
        lesson: "投资人和创业者都该先回答：总市场（TAM）多大？可服务市场（SAM）多大？你能拿到的（SOM）多大？市场规模决定估值天花板——「在小池塘里当大鱼」常常比「在大池塘当虾米」聪明。",
      },
      {
        id: "talk-users", text: "立刻找 10 个潜在用户聊，验证痛点",
        effects: { months: 1, product: 10, flag: "user-centric" },
        resultText: "三周聊了 14 个人。其中 3 个人的眼睛在发光——你记住了那个眼神，那是付费意愿的样子。",
        lessonTitle: "创业课 · 用户访谈（The Mom Test）",
        lesson: "别问『你会用我的产品吗』（你妈都会说会）。问『你现在怎么解决这个问题的』『上次遇到是什么时候』。行为证据 > 口头恭维。Airbnb 创始人当年挨家挨户给房东拍照片，就是这么聊出来的。",
      },
      {
        id: "just-build", text: "想那么多干嘛，先干起来！",
        effects: { months: 1, product: 12, health: -5, flag: "reckless" },
        resultText: "一个月后原型出来了。你兴奋地发现：用户要的完全是另一个东西。早知道该先聊聊。",
        lessonTitle: "创业课 · 精益创业的代价",
        lesson: "「快速行动、打破常规」在验证前是赌博。Waze、Instagram 都经历过 pivot。先构建（Build）→再衡量（Measure）→再学习（Learn）的成本，远高于先访谈再构建——除非你烧的是别人的钱。",
      },
    ],
  };
  return state;
}

export function log(s: GameState, text: string, type: LogEntry["type"] = "info"): GameState {
  return { ...s, log: [...s.log, { month: s.month, text, type }] };
}

// ─── 应用选择效果 ───────────────────────────────────────────────────────────
export function applyChoice(s: GameState, choice: Choice): GameState {
  syncRng(s);
  let n = { ...s };
  const e = choice.effects;

  if (e.cash) n.cash += e.cash;
  if (e.cashMult) n.cash *= e.cashMult;
  if (e.product) n.product = clamp(n.product + e.product, 0, 100);
  if (e.users) n.users = Math.max(0, n.users + e.users);
  if (e.usersPct) n.users = Math.max(0, Math.round(n.users * (1 + e.usersPct / 100)));
  if (e.mrrPct) n.mrr = Math.max(0, n.mrr * (1 + e.mrrPct / 100));
  if (e.morale) n.morale = clamp(n.morale + e.morale, 0, 100);
  if (e.health) n.health = clamp(n.health + e.health, 0, 100);
  if (e.reputation) n.reputation = clamp(n.reputation + e.reputation, -100, 100);
  if (e.debt) n.debt += e.debt;
  if (e.team) n.team = Math.max(1, n.team + e.team);
  if (e.valuationPct) n.valuation = Math.max(10, n.valuation * (1 + e.valuationPct / 100));
  if (e.flag) n.tags = [...n.tags, e.flag];
  if (e.addTag) n.tags = [...n.tags, e.addTag];
  if (e.portfolioAdd) {
    n.portfolio = [...(n.portfolio ?? []), e.portfolioAdd];
    n.tags = [...n.tags, "has-portfolio"];
  }
  // v1.6-beta：三层债务 + 知名度/渠道 effect
  if (e.loan) n.loan = (n.loan ?? 0) + e.loan;
  if (e.loanMult) n.loan = (n.loan ?? 0) * e.loanMult;
  if (e.awareness) n.awareness = clamp(n.awareness + e.awareness, 0, 100);
  if (e.accessibility) n.accessibility = clamp(n.accessibility + e.accessibility, 0, 100);

  n = log(n, choice.resultText, "info");
  if (e.portfolioAdd) n = log(n, `💼 投资组合 +1：${e.portfolioAdd}（当前 ${n.portfolio!.length} 个项目）`, "money");
  // 剧本模式：结局事件直接终结对局
  if (e.endingId) {
    n.pendingDecision = null;
    return finishGame(n, e.endingId);
  }
  if (e.cash) n = log(n, `现金 ${e.cash > 0 ? "+" : ""}${fmtMoney(n, e.cash)}`, e.cash > 0 ? "money" : "bad");
  if (e.months) {
    n.pendingDecision = null; // 先关闭当前决策，advanceMonth 才会推进时间/触发后续阶段
    for (let i = 0; i < e.months; i++) n = advanceMonth(n);
  }
  n = checkEnding(n);
  return n;
}

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

// ─── P0-2 创始人行动点 ──────────────────────────────────────────────────────
export const FOUNDER_ACTIONS: { id: "code" | "sales" | "investor" | "ops"; icon: string; label: string; desc: string }[] = [
  { id: "code", icon: "⚒️", label: "亲自写代码", desc: "本月产品进度额外 +4；不选则产品 <80 时 15% 概率累积技术债" },
  { id: "sales", icon: "🤝", label: "亲自跑客户", desc: "本月知名度 +6、MRR 转化 ×1.2；不选则 15% 概率丢一个大客户（MRR −10%）" },
  { id: "investor", icon: "💼", label: "亲自见投资人", desc: "本月路演胜率 +10%；融资冷却不因此缩短" },
  { id: "ops", icon: "🧯", label: "亲自盯运营", desc: "本月随机/危机事件触发率 −50%；不选则正常事件率" },
];

export function setFounderAction(s: GameState, action: "code" | "sales" | "investor" | "ops"): GameState {
  const def = FOUNDER_ACTIONS.find((a) => a.id === action)!;
  return log({ ...s, founderAction: action }, `🎯 本月创始人亲自压阵：${def.icon} ${def.label}。${def.desc}。`, "system");
}

// P0-3：尽调顾问——花 3 万揭示本决策中 hidden 选项的真实效果（现金不够时没有信息特权）
export function dueDiligence(s: GameState): GameState {
  if (s.cash < 3) return log(s, "🕵️ 尽调顾问摇头：现金不足 3 万，付不起咨询费——穷人没有信息特权，这本身也是一课。", "bad");
  let n = { ...s, cash: s.cash - 3 };
  n = log(n, `🕵️ 你花 ${fmtMoney(n, 3)} 请了尽调顾问， hidden 选项的真实底牌已揭开。`, "money");
  return n;
}

// ─── 月度推进 ───────────────────────────────────────────────────────────────
export function advanceMonth(s: GameState): GameState {
  if (!s.alive || s.pendingDecision) return s;
  syncRng(s);
  let n: GameState = { ...s };
  // P0-2：月初行动点重置——自动跑图（speed>=2）续用上月选择，手动模式每月强制重选（每回合的「痛」）
  n.founderAction = n.speed >= 2 ? (n.founderAction ?? null) : null;
  n.month += 1;
  n.year = (n.scenario?.year ?? START_YEAR) + Math.floor(n.month / 12);
  n.season = MONTH_NAMES[n.month % 12];
  n.eventCooldown = Math.max(0, n.eventCooldown - 1);

  // v1.8：证券账户月末结算（T+1 解锁 + 市值重估 + 个人净资产同步）
  n = settleBrokerage(n);

  // v1.7：资本寒冬进出提示
  for (const [a, b] of n.winterWindows ?? []) {
    if (n.month === a) n = log(n, "🥶 资本寒冬降临：机构捂紧口袋、裁员新闻刷屏——接下来的几个月，融资胜率大幅下降，谈判空间几乎关闭。活下来就是胜利。", "bad");
    if (n.month === b + 1) n = log(n, "🌤️ 寒冬过去了。幸存的公司会发现：市场上的钱变多了，竞品却变少了——危机是强者的并购季。", "good");
  }

  const region = n.region;
  const mod = region.modifiers;

  // ── 收入（v1.6-beta：知名度/渠道双存量模型，借鉴 Capstone 感知漏斗）──
  // 知名度：营销预算堆出来，每月漏水（停止投放就被人遗忘）；教学难度漏水减半
  // v1.7：「再养一年」的余热——回到 scale 阶段后 6 个月内预算效率 ×1.5
  const boost = n.tags.includes("hold-boost") && n.stage === "scale" ? 1.5 : 1;
  const mktEff = (n.industry.mktEff ?? 0.12) * boost;
  const leak = n.difficulty === "easy" ? 0.05 : 0.10;
  n.awareness = clamp(n.awareness + (n.budget.marketing / 100) * mktEff * 100 * (0.8 + 0.4 * nextRandom()) - n.awareness * leak, 0, 100);
  // 渠道可及性：销售预算铺出来，漏水较慢（渠道资产更持久，但也会老化）
  n.accessibility = clamp(n.accessibility + (n.budget.sales / 100) * 6 - n.accessibility * 0.03, 0, 100);
  let newUsers = n.industry.baseUsers
    * (n.awareness / 100)
    * (0.4 + (n.accessibility / 100) * 0.6)
    * (n.product / 50)
    * (mod.marketAccess ?? 1)
    * (0.7 + 0.6 * nextRandom());
  if (n.stage === "idea" || n.stage === "validate") newUsers = 0;
  n.users = Math.max(0, Math.round(n.users + newUsers));
  const churn = n.users * 0.06;
  n.users = Math.max(0, n.users - Math.round(churn));
  const targetMrr = n.users * n.industry.revenuePerUser * (n.product / 40) * (0.75 + (n.budget.sales / 100) * 0.9) * (n.cofounder?.trait === "sales" ? 1.3 : 1);
  n.mrr += (targetMrr - n.mrr) * 0.35;
  // P0-2 行动点「亲自跑客户」：知名度 +6、MRR 转化 ×1.2
  if (n.founderAction === "sales") {
    n.awareness = clamp(n.awareness + 6, 0, 100);
    n.mrr *= 1.2;
  }

  // ── 成本 ──
  const salaries = n.team * 1.8 * (mod.talentPool ?? 1) + (n.team - 1) * 0.4; // 基本工资 + 办公分摊
  // 产品未成型时市场投放效率低、花费也少（主要是调研物料）
  const marketingBurn = n.product >= 40 ? n.budget.marketing * 0.15 : n.budget.marketing * 0.05;
  // 行业特性开销：硬件备货占款 / 软件云账单 / 跨境物流仓储 / 金融合规（见 industryExtraBurn）
  const burn = (n.industry.baseBurn + salaries + marketingBurn) * (mod.burnMultiplier ?? 1) + industryExtraBurn(n);
  n.cash += n.mrr - burn;
  // v1.6-beta：Big Al 三层债务——先免息亲友额度（≤20万，并入 debt），超出进紧急贷款（月息2.5%复利）
  if (n.cash < 0) {
    const shortfall = -n.cash;
    const creditRoom = Math.max(0, 20 - n.debt);
    const toCredit = Math.min(shortfall, creditRoom);
    const toLoan = shortfall - toCredit;
    n.debt += toCredit;
    n.loan = (n.loan ?? 0) + toLoan;
    n.cash = 0;
    if (toLoan > 0) {
      n = log(n, `🆘 紧急贷款注入 ${fmtMoney(n, toLoan)}（月息 2.5%，年化约 34%）——救急的钱是会上瘾的。`, "bad");
      n.morale = clamp(n.morale - 8, 0, 100);
    } else if (toCredit > 0 && n.debt - toCredit <= 0) {
      n = log(n, `💳 现金见底，亲友信用卡垫付了 ${fmtMoney(n, toCredit)}（免息，但人情也是债）。`, "bad");
    }
  }
  // 紧急贷款复利（桥接资金不分享 upside，只吞噬现金流）
  if ((n.loan ?? 0) > 0) {
    const cur = n.loan ?? 0;
    const interest = cur * 0.025;
    n.loan = cur + interest;
    if (n.month % 3 === 1)
      n = log(n, `💸 紧急贷款月息 ${fmtMoney(n, interest)} 已计入本金——复利的螺旋开始转动。`, "bad");
  }
  // ── v1.7.6 热修：自动扫款还债——现金超过 3 个月烧钱安全垫的部分，先还高息紧急贷款、再还亲友债 ──
  // 现实里没有人会揣着现金看 34% 年化的毒债滚雪球；这个机制让「多挣钱→补窟窿」成为自然闭环。
  {
    const safety = burn * 3;
    let surplus = n.cash - safety;
    if (surplus > 1 && ((n.loan ?? 0) > 0.01 || n.debt > 0.01)) {
      const loanNow = n.loan ?? 0;
      const repayLoan = Math.min(loanNow, surplus);
      if (repayLoan > 0.01) {
        n.loan = Math.max(0, loanNow - repayLoan);
        n.cash -= repayLoan;
        surplus -= repayLoan;
        n = log(n, `🏦 自动还债：余粮优先偿还紧急贷款 ${fmtMoney(n, repayLoan)}（月息 2.5% 的毒债最优先）${n.loan <= 0.01 ? "——毒债清零！" : `，剩余 ${fmtMoney(n, n.loan)}`}`, "good");
      }
      const repayCredit = Math.min(n.debt, Math.max(0, surplus));
      if (repayCredit > 0.01) {
        n.debt = Math.max(0, n.debt - repayCredit);
        n.cash -= repayCredit;
        n = log(n, `💳 自动还债：偿还亲友债 ${fmtMoney(n, repayCredit)}${n.debt <= 0.01 ? "——人情债清零，无债一身轻。" : `，剩余 ${fmtMoney(n, n.debt)}`}`, "good");
      }
    }
  }
  // 连续零收入月数（债务重组事件触发条件）
  n.zeroRev = n.mrr <= 0.5 ? (n.zeroRev ?? 0) + 1 : 0;

  // ── P0-1 现金利息（金铲铲「攒经济」）：账上 >50 万的部分每月吃息，攒钱开始有实感 ──
  // 创业课：现金是期权——18 个月跑道就是谈判桌上的筹码；但利息跑不赢通胀，更跑不赢好的增长机会。
  if (n.cash > 50) {
    const rate = n.difficulty === "easy" ? 0.015 : 0.01;
    const interest = Math.min(10, (n.cash - 50) * rate);
    n.cash += interest;
    if (n.month % 3 === 2)
      n = log(n, `💰 活期理财利息 +${fmtMoney(n, interest)}（账上 ${fmtMoney(n, n.cash)} 躺赚月息 ${(rate * 100).toFixed(1)}%）——现金躺着也有心跳，但跑不赢通胀，更跑不赢 all-in 增长的对手。`, "money");
  }

  // ── v1.7.6 热修：债务红色警戒（每月提醒，让玩家看清跑路的倒计时）──
  const totalDebtNow = n.debt + (n.loan ?? 0);
  if (totalDebtNow > 60 && totalDebtNow <= 90) {
    n = log(n, `🟠 债务警戒：总债务 ${fmtMoney(n, totalDebtNow)}，超过 120 将触发「欠债跑路」结局。距离崩盘还有 ${(120 - totalDebtNow).toFixed(0)} 万缓冲。`, "bad");
  } else if (totalDebtNow > 90) {
    n = log(n, `🔴 濒临崩盘：总债务 ${fmtMoney(n, totalDebtNow)}，距离跑路线只剩 ${(120 - totalDebtNow).toFixed(0)} 万！每月还有复利在滚动。`, "bad");
  }

  // ── 产品进度 ──
  if ((n.stage === "mvp" || n.stage === "growth") && n.product < 100) {
    const cfTechMul = n.cofounder?.trait === "tech" ? 1.2 : 1;
    n.product = clamp(n.product + (n.budget.rd / 100) * 9 * (1 / n.industry.productDifficulty) * cfTechMul * boost, 0, 100);
  }
  // P0-2 行动点「亲自写代码」：产品进度额外 +4
  if (n.founderAction === "code" && n.product < 100) {
    n.product = clamp(n.product + 4, 0, 100);
  }
  // P0-2 未亲自盯的风险：创始人只有一双手，没管的那摊事会自己长出问题
  {
    const riskMul = n.difficulty === "hell" ? 2 : n.difficulty === "easy" ? 0 : 1;
    if (n.founderAction !== "code" && n.product < 80 && n.product > 0 && nextRandom() < 0.15 * riskMul) {
      n.product = clamp(n.product - 6, 0, 100);
      n = log(n, "🧨 你没亲自盯技术，架构债悄悄累积：产品进度 -6%。（创业课：扎克伯格亲自写代码的那三年，Facebook 不需要 COO——创始人的注意力就是技术债的利率。）", "bad");
    }
    if (n.founderAction !== "sales" && ["growth", "seriesA", "scale"].includes(n.stage) && nextRandom() < 0.15 * riskMul) {
      n.mrr *= 0.9;
      n = log(n, "📉 一个大客户续约时被竞对截胡：MRR -10%。（亲自跑客户不是浪费 CEO 时间——马云 1995 年跑业务那一年，中国黄页没有销售总监。）", "bad");
    }
  }

  // ── 行业特性：游戏内容产能（更新跟不上，玩家就流失）──
  if (n.industry.id === "game" && ["growth", "seriesA", "scale"].includes(n.stage)) {
    if (n.budget.rd >= 30) {
      n.product = clamp(n.product + 0.6, 0, 100);
    } else {
      n.product = clamp(n.product - 1.5, 0, 100);
      if (n.month % 3 === 2) n = log(n, "🎮 游戏行业特性：版本内容更新跟不上，玩家正在流失——把研发预算拉到 30% 以上才能维持内容产能。", "bad");
    }
  }

  // ── 行业特性：能源政策补贴（产品 ≥70 视为进入补贴目录，每月 +3 万）──
  if (n.industry.id === "energy" && n.product >= 70) {
    n.cash += 3;
    if (n.month % 3 === 0)
      n = log(n, "🏛️ 能源行业特性：补贴目录款项 +3 万/月（政策红利是重资产赛道的氧气——但补贴退坡事件也在暗处等待）。", "money");
  }
  // ── 行业特性：生物医药里程碑付款（产品进度 = 临床推进，收入到来前先收 BD 首付款）──
  if (n.industry.id === "biotech") {
    if (n.product >= 60 && !n.tags.includes("milestone-60")) {
      n.tags = [...n.tags, "milestone-60"];
      n.cash += 15;
      n = log(n, "💊 里程碑达成：二期数据过关，一家药企支付了 15 万 BD 首付款——在收入到来前，里程碑付款是 biotech 的命脉。", "money");
    }
    if (n.product >= 85 && !n.tags.includes("milestone-85")) {
      n.tags = [...n.tags, "milestone-85"];
      n.cash += 25;
      n = log(n, "💊 里程碑达成：三期入组完成，license-out 首付款 25 万到账。（真实世界：百济神州靠连续里程碑付款活过了最穷的五年。）", "money");
    }
  }

  // ── 行业特性开销的定期解释日志（钱花在哪，必须说清楚）──
  if (n.industry.id === "hardware" && n.mrr > 5 && n.month % 3 === 0)
    n = log(n, "🏭 硬件行业特性：备货占款已计入本月消耗（库存与账期是硬件创业的半条命——参考小米的供应链周转）。", "info");
  if (["ai", "consumer"].includes(n.industry.id) && n.users > 500 && n.month % 3 === 1)
    n = log(n, "☁️ 软件行业特性：云服务账单随用户规模增长（规模不经济是 SaaS 的隐形税，用户越多服务器越贵）。", "info");
  if (n.industry.id === "ecom" && n.users > 300 && n.month % 3 === 2)
    n = log(n, "📦 跨境行业特性：物流与仓储费随单量增长（运费波动直接吃掉跨境品牌的薄毛利）。", "info");

  // ── 估值漂移 ──
  const growthSignal = (n.mrr / Math.max(1, n.valuation / 40)) - 1;
  n.valuation = Math.max(20, n.valuation * (1 + clamp(growthSignal, -0.05, 0.08)) * randInt(95, 106) / 100);
  // 估值下限：现金储备与营收能力支撑公司「底子」（解释「现金多但估值低」：现金托底但不驱动增长）
  n.valuation = Math.max(n.valuation, Math.max(n.cash * 1.5, n.mrr * 6));

  // ── 健康与士气 ──
  n.health = clamp(n.health - (n.speed >= 2 ? 1.2 : 0.6) + (n.cash > 100 ? 0.4 : 0), 0, 100);
  n.morale = clamp(n.morale + (n.cash > 50 ? 1 : -2) + (n.product >= 80 ? 0.5 : 0), 0, 100);

  // ── 阶段推进 ──
  n = advanceStage(n);

  // ── v1.7.6 热修：业务驱动的自然招聘 ──
  // 真实公司：业务每上台阶，团队必须跟着长。此前团队只在融资轮后扩张一次，不融资/剧本模式下
  // 会出现「MRR 32 万、团队 1 人」的失真。现在每季度检查一次人效水位，不足则触发招聘决策。
  {
    const need = n.stage === "growth" ? Math.min(10, 2 + n.mrr / 8)
      : ["seriesA", "scale", "endgame"].includes(n.stage) ? Math.min(30, 4 + n.mrr / 6)
      : 0;
    if (need > 0 && n.team < need && n.month % 3 === 0 && n.cash > burn * 2 && n.mrr > 3) {
      n.pendingDecision = hireDecision(n);
      n = log(n, `👥 业务已经跑到 ${fmtMoney(n, n.mrr)}/月，团队才 ${n.team} 人——人均产出高得反常，招聘势在必行。`, "system");
    }
  }

  // ── 剧本模式：固定事件链强制触发（优先于随机事件）──
  // 终局事件双触发：到月份触发，或玩家一路冲到规模化阶段时提前降临（真实结局优先，不给「跳出剧本」的捷径）
  if (n.alive && !n.pendingDecision && n.scenario && n.scenario.queue.length > 0) {
    const head = n.scenario.queue[0];
    const scDef = SCENARIOS.find((sc) => sc.id === n.scenario!.id);
    const finaleEarly = head.eventId === scDef?.finalEventId && STAGE_ORDER[n.stage] >= 5;
    if (n.month >= head.month || finaleEarly) {
      n.scenario = { ...n.scenario, queue: n.scenario.queue.slice(1) };
      n = triggerEventById(n, head.eventId);
    }
  }

  // ── 随机事件 ──
  if (n.alive && !n.pendingDecision && n.eventCooldown === 0) {
    n = maybeTriggerEvent(n);
  }

  n = checkEnding(n);
  return n;
}

function advanceStage(s: GameState): GameState {
  let n = { ...s };
  switch (n.stage) {
    case "idea":
      if (n.month >= 1) {
        n.stage = "validate";
        n = log(n, "🔍 进入需求验证阶段：你需要找到真正的痛点，而不是想象中的痛点。", "system");
        n.pendingDecision = interviewDecision();
      }
      break;
    case "validate":
      break; // 由访谈结果推进
    case "mvp":
      if (n.product >= 45) {
        n.stage = "seed";
        n = log(n, "⚒️ MVP 初见雏形！是时候见投资人了。", "system");
        n.pendingDecision = pitchDecision(n, "seed");
      }
      break;
    case "seed": {
      // v1.6-alpha：种子轮被拒不再软锁——冷却期满自动开启二次路演
      const r = n.pitchRetry;
      if (r?.round === "seed" && n.month >= r.at) {
        n = { ...n, pitchRetry: undefined };
        n = log(n, "🔄 三个月冷却期结束。你换了 BP、换了投资人名单——种子轮，再战。", "system");
        n.pendingDecision = pitchDecision(n, "seed", true);
      }
      break; // 融资成功推进
    }
    case "growth":
      if (n.mrr >= 25 && n.month > 6) {
        n.stage = "seriesA";
        n = log(n, "📈 营收突破！A 轮的 VC 们开始主动约你了。", "system");
        n.pendingDecision = pitchDecision(n, "A");
      }
      break;
    case "seriesA": {
      // v1.6-alpha：A 轮被拒不再软锁——冷却期满自动开启二次路演
      const r = n.pitchRetry;
      if (r?.round === "A" && n.month >= r.at) {
        n = { ...n, pitchRetry: undefined };
        n = log(n, "🔄 三个月冷却期结束。你调整了增长叙事、补了关键数据——A 轮，再战。", "system");
        n.pendingDecision = pitchDecision(n, "A", true);
      }
      break;
    }
    case "scale": {
      const sr = n.scaleRound ?? 0;
      // v1.6-alpha：被拒后不自动重复触发，改由统一的二次路演机制调度（含估值惩罚）；v1.7 扩展至 D/E 轮
      const noRetryPending = (rd: "B" | "C" | "D" | "E") => n.pitchRetry?.round !== rd;
      if (sr === 0 && noRetryPending("B") && n.mrr >= 60 && n.month > 14) {
        n = log(n, "📈 增长曲线进入了机构视野：B 轮基金带着更厚的支票簿找上门了。（MRR≥60 · 第 15 个月后）", "system");
        n.pendingDecision = pitchDecision(n, "B");
      } else if (sr === 1 && noRetryPending("C") && n.mrr >= 100 && n.month > 22) {
        n = log(n, "🏛️ 准独角兽的牌桌：C 轮机构带着上市资源找上门。（MRR≥100 · 第 23 个月后）", "system");
        n.pendingDecision = pitchDecision(n, "C");
      } else if (sr === 2 && noRetryPending("D") && n.mrr >= 150 && n.month > 30) {
        n = log(n, "🌐 独角兽俱乐部：D 轮基金带着「生态」故事和更长的对赌条款找上门。（MRR≥150 · 第 31 个月后）", "system");
        n.pendingDecision = pitchDecision(n, "D");
      } else if (sr === 3 && noRetryPending("E") && n.valuation >= 5000 && n.month > 38) {
        n = log(n, "👑 Pre-IPO 牌桌：E 轮是上市前最后一轮机构钱，条款密集到律师都要加班。（估值≥5000 万 · 第 39 个月后）", "system");
        n.pendingDecision = pitchDecision(n, "E");
      } else if (sr >= 4 && n.valuation >= 2600 && n.mrr >= 120) {
        // v1.7：上市辅导前必须走完 B/C/D/E 轮——真实公司上市前都经历多轮融资
        n.stage = "endgame";
        n.tags = n.tags.filter((t) => t !== "hold-boost");
        n = log(n, "🏛️ E 轮交割完成，你收到了三家投行递来的上市辅导邀约——敲钟的梦想触手可及。", "good");
        n.pendingDecision = ipoDecision(n);
      }
      // v1.6-alpha：二次路演（冷却期满自动再战，v1.7 扩展至 D/E）
      const rb = n.pitchRetry;
      if (!n.pendingDecision && rb && n.month >= rb.at &&
          ((rb.round === "B" && sr === 0) || (rb.round === "C" && sr === 1) || (rb.round === "D" && sr === 2) || (rb.round === "E" && sr === 3))) {
        n = { ...n, pitchRetry: undefined };
        n = log(n, `🔄 三个月冷却期结束。${rb.round} 轮，再战。`, "system");
        n.pendingDecision = pitchDecision(n, rb.round, true);
      }
      break;
    }
    case "endgame":
      break;
  }
  return n;
}

// ─── 用户访谈 ───────────────────────────────────────────────────────────────
function interviewDecision(): PendingDecision {
  return {
    kind: "interview",
    title: "用户访谈日",
    scene: `你在咖啡馆约到了 5 位潜在用户。第一次做访谈，你只有精力认真准备 3 个问题。选哪三个？（好的问题能挖出真实痛点，差的只能收获礼貌的谎言）`,
    choices: [], // UI 特殊处理：从题库选 3 个
  };
}


// ─── v1.8 投资系统：月度结算 + 账户操作 ──────────────────────────────────────
// 当前年月 → 行情年月 "YYYY-MM"。历史行情覆盖 2005-01..2024-12：
// - 普通模式：开局年 START_YEAR(2024) 映射到行情起点 2005，20 年数据可覆盖游戏内 2043 年前的对局
// - 剧本模式：按真实年份对齐（2008 金融危机剧本正对 2008 年真实行情；早年剧本收敛到 2005）
const MKT_FIRST_YEAR = 2005, MKT_LAST_YEAR = 2024;
export function ymOf(s: GameState): string {
  const raw = s.scenario ? s.year : MKT_FIRST_YEAR + (s.year - START_YEAR);
  const y = Math.max(MKT_FIRST_YEAR, Math.min(MKT_LAST_YEAR, raw));
  return `${y}-${String((s.month % 12) + 1).padStart(2, "0")}`;
}

// 任意游戏月 → 行情年月（与 ymOf 同一映射；scenarioYear 为空 = 普通模式）
function marketYmForMonth(scenarioYear: number | undefined, month: number): string {
  const year = (scenarioYear ?? START_YEAR) + Math.floor(month / 12);
  const raw = scenarioYear ? year : MKT_FIRST_YEAR + (year - START_YEAR);
  const y = Math.max(MKT_FIRST_YEAR, Math.min(MKT_LAST_YEAR, raw));
  return `${y}-${String((month % 12) + 1).padStart(2, "0")}`;
}

// advanceMonth 内调用：两融结算（利息+预警+强平）→ 市值重估 + 个人净资产同步（单向外溢：投资亏盈不卡公司主线）
export function settleBrokerage(s: GameState): GameState {
  if (!s.brokerage) return s;
  const ym = ymOf(s);
  // 新手期晋升：开户满 3 个月后解锁个股交易（一次性提示）
  if (s.brokerage.unlockLevel === 1) {
    const [sy, sm] = s.brokerage.startYm.split("-").map(Number);
    const [cy, cm] = ym.split("-").map(Number);
    if ((cy - sy) * 12 + (cm - sm) >= 3) {
      s = { ...s, brokerage: { ...s.brokerage, unlockLevel: 2 } };
      s = log(s, "🔓 证券账户升级：你已积累 3 个月交易经验，个股交易解锁。记住巴菲特的两条规则：第一，不要亏钱；第二，永远记住第一条。", "good");
    }
  }
  // v1.9：个人净资产 ≥ 100 万解锁两融（第 3 层）
  if ((s.brokerage as Brokerage).unlockLevel === 2 && (s.personalWealth ?? 0) >= 100) {
    s = { ...s, brokerage: { ...(s.brokerage as Brokerage), unlockLevel: 3 } };
    s = log(s, "🔓 券商来电：你的个人净资产已达 100 万，融资融券账户自动开通——你现在可以向券商借钱炒股了。一句忠告：杠杆是放大镜，它放大收益的方式是先把你的亏损放大成破产。", "system");
  }
  // v1.9 两融月末结算（在 T+1 解锁与估值同步之前）
  if (((s.brokerage as Brokerage).borrowed ?? 0) > 0) {
    const b: Brokerage = JSON.parse(JSON.stringify(s.brokerage)) as Brokerage;
    const r = marginSettle(b, ym);
    let n: GameState = { ...s, brokerage: b };
    if (r.liquidated) {
      n = log(n, `🚨 强平！维持担保比例跌破 115%，券商不问意见直接清仓了你的全部持仓${r.borrowed > 0.01 ? `——还完债你还倒欠 ${fmtMoney(s, r.borrowed)}` : "抵债"}。利弗莫尔四次破产才学会的事，你一次就体验了：杠杆不杀人，杠杆只负责把尸体搬下楼。`, "bad");
      n = { ...n, tags: n.tags.includes("margin-blown") ? n.tags : [...n.tags, "margin-blown"] };
    } else if (r.marginCall) {
      n = log(n, `⚠️  margin call：维持担保比例 ${(maintenanceRatio(b, ym) * 100).toFixed(0)}%，跌破 130% 预警线。券商打来电话：「请追加保证金，否则我们将不得不……」。翻译成人话：要么充钱，要么祈祷反弹。`, "bad");
    }
    s = n;
  }
  const equity = equityAt(s.brokerage as Brokerage, ym);
  const prev = s.personalWealth ?? 0;
  let n: GameState = { ...s, personalWealth: equity };
  const move = prev > 0 ? equity / prev - 1 : 0;
  if (Math.abs(move) >= 0.25) {
    n = log(n, `${move > 0 ? "📈" : "📉"} 你的证券账户本月${move > 0 ? "暴赚" : "重挫"} ${(Math.abs(move) * 100).toFixed(0)}%——${move > 0 ? "市场先生发疯了，你可以跟着疯，但记得他是躁郁症患者" : "这就是波动。杠杆会把它变成自杀，现金会把它变成机会"}。`, move > 0 ? "good" : "bad");
  }
  // v2.0 联动：持仓遭遇暴跌月时，创业者的两个世界互相看见
  if (n.marketLinkage && n.brokerage && n.brokerage.positions.length > 0) {
    let worst = 0, worstTicker = "";
    for (const p of n.brokerage.positions) {
      const pc = mktPctChange(p.mkt, p.ticker, ym);
      if (pc !== null && pc < worst) { worst = pc; worstTicker = p.ticker; }
    }
    if (worst <= -0.2) {
      n = log(n, `🔗 联动：你持仓的 ${worstTicker} 本月暴跌 ${(worst * 100).toFixed(0)}%，投资市场的恐慌蔓延到了创业圈——投资人电话会议的气氛变得微妙，LP 们开始问「现金跑道还有几个月」。财富从不孤立，恐慌也是。`, "bad");
    }
  }
  // v2.0 成就扫描（月末持仓检查）
  n = checkBrokerageAchievements(n, ym);
  return n;
}

// 开户（公司存活 ≥6 个月或已完成一轮融资后可开）
export function canOpenBrokerage(s: GameState): boolean {
  return !s.brokerage && s.alive && (s.month >= 6 || s.raised.length > 0);
}

export function openBrokerageAccount(s: GameState, mkt: "cn" | "us"): GameState {
  if (s.brokerage || !canOpenBrokerage(s)) return s;
  const ym = ymOf(s);
  let n: GameState = { ...s, brokerage: openBrokerage(0, ym) };
  const mktName = mkt === "cn" ? "A股" : "美股";
  n = log(n, `🏦 你在${mktName}券商开立了证券账户（历史沙盒行情，从 ${ym} 开始）。${getRules(mkt).t1 ? "记住：这里是 T+1，今天买明天才能卖；" : ""}新手期只能买指数/ETF——先学会不亏，再学着赚。本游戏为教育模拟，不构成投资建议。`, "system");
  return n;
}

// 银证转账：公司现金 → 证券账户（创始人合法分红注资；单向防火墙，不可挪用回公司）
export function brokerTransfer(s: GameState, amount: number): GameState {
  if (!s.brokerage) return log(s, "🏦 尚未开立证券账户。", "bad");
  if (amount <= 0) return s;
  if (amount > s.cash) return log(s, `🏦 公司账上没有这么多可分配现金（当前 ${fmtMoney(s, s.cash)}）。挪用运营资金是「刀尖起舞」里的 sin，不是这里的玩法。`, "bad");
  const b: Brokerage = { ...s.brokerage, cash: s.brokerage.cash + amount };
  const n: GameState = { ...s, cash: s.cash - amount, brokerage: b, personalWealth: (s.personalWealth ?? 0) + amount };
  return log(n, `🏦 银证转账：${fmtMoney(s, amount)} 以「创始人分红」名义从公司转入证券账户。公司现金 -${fmtMoney(s, amount)}。`, "money");
}

export function brokerBuy(s: GameState, mkt: string, ticker: string, amount: number): GameState {
  if (!s.brokerage) return log(s, "🏦 尚未开立证券账户。", "bad");
  const b: Brokerage = JSON.parse(JSON.stringify(s.brokerage));
  const err = mktBuy(b, mkt, ticker, ymOf(s), amount);
  if (err) return log(s, `📈 买入失败：${err}。`, "bad");
  // v2.0 成就标记：买入个股使「佛系定投老人」失效
  const kind = listTickers(mkt).find((t) => t.id === ticker)?.kind;
  const tagged = kind === "stock" && !s.tags.includes("bought-stock") ? { ...s, tags: [...s.tags, "bought-stock"] } : s;
  const n: GameState = { ...tagged, brokerage: b };
  return log(n, `📈 买入 ${ticker} ${fmtMoney(s, amount)}（含手续费，按本月收盘价成交）。`, "money");
}

// v1.9 融资买入（杠杆）：total 为买入总额，现金不足部分自动向券商借款（受 1 倍净资产额度约束）
export function brokerBuyMargin(s: GameState, mkt: string, ticker: string, total: number): GameState {
  if (!s.brokerage) return log(s, "🏦 尚未开立证券账户。", "bad");
  const b: Brokerage = JSON.parse(JSON.stringify(s.brokerage));
  const err = buyMargin(b, mkt, ticker, ymOf(s), total);
  if (err) return log(s, `⚡ 融资买入失败：${err}。`, "bad");
  const borrowed = b.borrowed ?? 0;
  const kind = listTickers(mkt).find((t) => t.id === ticker)?.kind;
  const tagged = kind === "stock" && !s.tags.includes("bought-stock") ? { ...s, tags: [...s.tags, "bought-stock"] } : s;
  const n: GameState = { ...tagged, brokerage: b };
  return log(n, `⚡ 融资买入 ${ticker} 共 ${fmtMoney(s, total)}（含手续费），其中借款 ${fmtMoney(s, borrowed)}，维持担保比例 ${(maintenanceRatio(b, ymOf(s)) * 100).toFixed(0)}%。杠杆不是钱变多了，是你的胆子变大了——而胆子不付利息，借款付。`, "money");
}

export function brokerSell(s: GameState, mkt: string, ticker: string, shares: number): GameState {
  if (!s.brokerage) return log(s, "🏦 尚未开立证券账户。", "bad");
  const b: Brokerage = JSON.parse(JSON.stringify(s.brokerage));
  const cashBefore = b.cash;
  const err = mktSell(b, mkt, ticker, ymOf(s), shares);
  if (err) return log(s, `📈 卖出失败：${err}。`, "bad");
  // v2.0 成就标记：卖出行为使「佛系定投老人」失效
  const tagged = s.tags.includes("sold-any") ? s : { ...s, tags: [...s.tags, "sold-any"] };
  const n: GameState = { ...tagged, brokerage: b };
  return log(n, `📈 卖出 ${ticker} ${shares.toFixed(0)} 股，回笼 ${fmtMoney(s, b.cash - cashBefore)}。`, "money");
}

// ─── v2.0 投资成就系统 ────────────────────────────────────────────────────────
export const ACHIEVEMENTS: Record<string, { icon: string; name: string; desc: string }> = {
  tenbagger: { icon: "🏆", name: "十倍股猎手", desc: "单只持仓浮盈 ≥900%——你骑上了一头鲸鱼" },
  contrarian2008: { icon: "🧊", name: "逆行者", desc: "全程无杠杆扛过 2008 全年且未清仓——别人恐惧时你在场" },
  timeRose: { icon: "💎", name: "巴菲特的时间玫瑰", desc: "单只个股连续持有 ≥10 年——复利开始替你上班" },
  marginSurvivor: { icon: "🎢", name: "爆仓幸存者", desc: "强平负债后净资产重回 100 万——死过一次的人不恐慌" },
  globeTrotter: { icon: "🌏", name: "环球投资者", desc: "同一时刻持有三个市场的标的——鸡蛋分放在三个篮子里" },
  commodityHunter: { icon: "🛢️", name: "大宗猎手", desc: "黄金/豆粕/原油浮盈 ≥100%——你读懂了周期" },
  dcaElder: { icon: "🧓", name: "佛系定投老人", desc: "只买指数/ETF、从未卖出，净资产 >1000 万——慢即是快" },
  wealthFree: { icon: "💰", name: "财富自由提前退休", desc: "个人净资产 ≥ 公司估值 ×2——你给自己发了离职通知书" },
  twiceBroke: { icon: "🎢", name: "双料破产", desc: "公司倒闭 + 账户爆仓——你破产了两次，但只死了一次" },
};

function award(s: GameState, id: string): GameState {
  if (!s.brokerage || (s.achievements ?? []).includes(id)) return s;
  const meta = ACHIEVEMENTS[id];
  const n: GameState = { ...s, achievements: [...(s.achievements ?? []), id] };
  return log(n, `🏅 成就解锁：${meta.icon} ${meta.name}——${meta.desc}`, "good");
}

function monthsBetween(a: string, b: string): number {
  const [ay, am] = a.split("-").map(Number);
  const [by, bm] = b.split("-").map(Number);
  return (by - ay) * 12 + (bm - am);
}

// 月末结算后调用：扫描持仓，解锁过程型成就
function checkBrokerageAchievements(s: GameState, ym: string): GameState {
  const b = s.brokerage;
  if (!b) return s;
  let n = s;
  // 爆仓幸存者：强平后净资产回正到 100 万（无持仓也要检查——本金回正即算重生）
  if (n.tags.includes("margin-blown") && (n.personalWealth ?? 0) >= 100) n = award(n, "marginSurvivor");
  if (b.positions.length === 0) return n;
  const tickersOf = (mkt: string) => listTickers(mkt);
  for (const p of b.positions) {
    const kind = tickersOf(p.mkt).find((t) => t.id === p.ticker)?.kind ?? "stock";
    const value = p.shares * (positionPrice(p, ym) ?? 0);
    const ret = p.cost > 0 ? value / p.cost - 1 : 0;
    if (ret >= 9) n = award(n, "tenbagger");
    if (["GOLD", "SOYBEAN", "OIL"].includes(p.ticker) && ret >= 1) n = award(n, "commodityHunter");
    if (kind === "stock" && p.heldSince && monthsBetween(p.heldSince, ym) >= 120) n = award(n, "timeRose");
  }
  // 逆行者：2008 年 12 月仍有持仓且无杠杆
  if (ym === "2008-12" && (b.borrowed ?? 0) <= 0 && b.positions.length > 0) n = award(n, "contrarian2008");
  // 环球投资者：三个市场同时持仓
  if (new Set(b.positions.map((p) => p.mkt)).size >= 3) n = award(n, "globeTrotter");
  return n;
}

// 持仓当前价（数据耗尽后按最后收盘价冻结）
function positionPrice(p: { mkt: string; ticker: string }, ym: string): number | null {
  const bars = getBars(p.mkt, p.ticker);
  if (!bars.length) return null;
  return (getBar(p.mkt, p.ticker, ym) ?? bars[bars.length - 1]).c;
}

// 结算页调用：终局型成就 + 彩蛋结局文案
export function investmentEndgame(s: GameState, endingId: string): { ids: string[]; flavor: string | null } {
  const ids: string[] = [];
  let flavor: string | null = null;
  const wealth = s.personalWealth ?? 0;
  if (["ipo", "acquired"].includes(endingId) && s.brokerage && wealth >= s.valuation * 2) {
    ids.push("wealthFree");
    flavor = "💰 彩蛋结局 · 财富自由提前退休：你的个人净资产已经是公司估值的两倍——敲钟那天你突然意识到，从明天起，工作对你而言只剩「想做的事」。你给自己发了离职通知书，而董事会竟然批了。";
  }
  if (s.tags.includes("margin-blown") && endingId === "bankrupt") {
    ids.push("twiceBroke");
    flavor = "🎢 彩蛋结局 · 双料破产：公司倒闭、账户爆仓，你在同一年破产了两次——但你只死了一次。听说你已经在写下一家的商业计划书了。利弗莫尔为你鼓掌。";
  }
  if (s.brokerage && !s.tags.includes("bought-stock") && !s.tags.includes("sold-any") && wealth > 1000) {
    ids.push("dcaElder");
    flavor = (flavor ? flavor + "\n\n" : "") + "🧓 彩蛋结局 · 佛系定投老人：你从未买过个股、从未按过一次卖出。别人盯盘你盯产品，最后你的账户悄悄超过了绝大多数交易天才。慢，即是快。";
  }
  return { ids, flavor };
}

export function completeInterview(s: GameState, score: number): GameState {
  let n = { ...s };
  n.interviewScore = score;
  const productGain = 5 + score * 2.2;
  n.product = clamp(n.product + productGain, 0, 100);
  n = log(n, `访谈结束。有效洞察：${score}/9 分。痛点强度 ${score >= 6 ? "很强，有人当场想付定金" : score >= 3 ? "真实但不够锋利" : "多半是礼貌的客套"}。`, score >= 6 ? "good" : "info");
  n.tags = [...n.tags, "interviewed"];
  n.stage = "mvp";
  n = log(n, "⚒️ 进入 MVP 开发阶段。记住：MVP 不是简陋的产品，是「刚好能验证核心假设」的产品。", "system");
  n = log(n, "💡 创业课：The Mom Test —— 别问用户「你会买吗」，问「你现在怎么解决的」。行为证据永远大于口头恭维。", "info");
  return n;
}

// ─── 融资路演 ───────────────────────────────────────────────────────────────
// 多轮次融资阶梯：种子 → A → B → C（v1.5.1）。每轮金额与稀释递增，成功后驱动团队扩张。
// 多轮次融资阶梯：种子 → A → B → C → D → E（v1.7）。每轮金额与稀释递增，成功后驱动团队扩张。
export type Round = "seed" | "A" | "B" | "C" | "D" | "E";

const ROUND_NAMES: Record<Round, string> = { seed: "种子轮", A: "A轮", B: "B轮", C: "C轮", D: "D轮", E: "E轮" };
const ROUND_TITLES: Record<Round, string> = { seed: "🌱 种子轮路演", A: "📈 A 轮路演", B: "🚀 B 轮路演", C: "🏭 C 轮路演", D: "🌐 D 轮路演", E: "👑 E 轮（Pre-IPO）路演" };
// 各轮金额区间（万）与谈判后的稀释系数
const ROUND_CHECKS: Record<Round, [number, number]> = { seed: [0, 0], A: [500, 1500], B: [1000, 3000], C: [2500, 6000], D: [4000, 9000], E: [6000, 15000] };

// v1.7：资本寒冬判定
function isWinter(s: GameState): boolean {
  return (s.winterWindows ?? []).some(([a, b]) => s.month >= a && s.month <= b);
}

function pitchDecision(s: GameState, round: Round, isRetry = false): PendingDecision {
  // v1.7 深度机构模式：拒绝过你的机构不会再上桌（黑名单）；投过你的机构优先来跟投
  const relations = s.deepInvestors ? (s.investorRelations ?? {}) : {};
  const blacklisted = new Set(Object.entries(relations).filter(([, v]) => v === "rejected").map(([k]) => k));
  const pool = INVESTORS.filter((inv) => !blacklisted.has(inv.name));
  const followOn = pool.find((inv) => relations[inv.name] === "invested");
  const investor = followOn && nextRandom() < 0.5 ? followOn : pick(pool.length ? pool : INVESTORS);
  const isFollowOn = relations[investor.name] === "invested";
  const isSeed = round === "seed";
  let amount: number;
  let ask: number;
  if (isSeed) {
    amount = Math.round(randInt(investor.checkSize[0], investor.checkSize[1]) * (s.region.modifiers.fundingBonus ?? 1));
    ask = investor.ask;
  } else {
    amount = Math.round(randInt(ROUND_CHECKS[round][0], ROUND_CHECKS[round][1]) * (s.region.modifiers.fundingBonus ?? 1));
    // 轮次越往后，机构占比要求略降但金额更大
    ask = clamp(round === "A" ? Math.max(10, investor.ask - 5) : round === "B" ? clamp(investor.ask - 6, 8, 14) : clamp(investor.ask - 8, 6, 12), 6, 20);
  }
  // v1.7：跟投的老股东加码信任（金额 +25%）
  if (isFollowOn) amount = Math.round(amount * 1.25);
  // v1.6-alpha：连续受挫的投资人会要求更多股份（每次失败 +2%，上限 +6%）
  ask = clamp(ask + Math.min(6, (s.pitchFailCount ?? 0) * 2), 6, 25);
  const check: Record<string, number> = {
    营收数据: s.mrr * 2,
    市场规模: s.industry.fundingAppeal * 30,
    增长速度: s.users / 8,
    合规架构: s.tags.includes("licensed") ? 50 : 10,
    现金流健康度: s.cash,
    创始人魅力: s.reputation + (s.tags.includes("celebrity-founder") ? 20 : 0),
    战略协同: s.product,
    能否并表: s.team * 8,
  };
  const fitScore = (check[investor.preference] ?? 20) / 60;
  const cfBonus = s.cofounder?.trait === "mentor" ? 0.08 : 0;
  const realismPenalty = (s.difficulty ?? "standard") === "realism" ? -0.05 : 0;
  // v1.6-alpha：连续受挫后更难融——市场闻得到绝望（每次失败 -4% 胜率，下限 10%）
  const failPenalty = Math.min(0.15, (s.pitchFailCount ?? 0) * 0.04);
  // v1.7：基础胜率 35%→25%（融资本该九死一生）；跟投信任 +12%；基金类隐藏职业募资场景不同，降幅减半
  const baseWin = (s.industry.id === "vcpe" || s.industry.id === "angel") ? 0.32 : 0.25;
  const followBonus = isFollowOn ? 0.12 : 0;
  // v1.7：资本寒冬——投资人捂紧口袋（胜率 −15%）
  const winter = isWinter(s);
  const winterPenalty = winter ? 0.15 : 0;
  const winProb = clamp(baseWin + realismPenalty + cfBonus + followBonus + fitScore * 0.5 + (s.tags.includes("backup-investors") ? 0.1 : 0) - failPenalty - winterPenalty + (s.founderAction === "investor" ? 0.1 : 0), 0.05, 0.92);

  const roll = nextRandom();
  const negRoll = nextRandom();
  const acceptId = roll < winProb ? "accept" : "accept-anyway";
  // v1.7：寒冬里谈判空间几乎关闭（谈判胜率砍半）
  const negId = negRoll < winProb * (winter ? 0.25 : 0.55) ? "negotiate-up" : "negotiate-fail";
  const acceptText = `接受：${s.region.currency}${amount} 万换 ${ask}%`;
  const negText = winter
    ? `硬谈：同金额但只给 ${Math.round(ask * 0.75)}%（寒冬里谈判大概率谈崩）`
    : `谈判：同金额但只给 ${Math.round(ask * 0.75)}%（可能谈崩）`;
  const growthHint = round === "B"
    ? "\n\n💼 B 轮的钱主要投向组织扩张：到账后团队预计翻倍，烧钱速度会显著加快。"
    : round === "C"
      ? "\n\n💼 C 轮的钱投向供应链与国际化，组织进入大跃进。"
      : round === "D"
        ? "\n\n💼 D 轮的钱开始讲「生态」与「第二曲线」——账上趴着大钱，所有人都在等你花。"
        : round === "E"
          ? "\n\n💼 E 轮（Pre-IPO）的钱要的是确定性：上市对赌、回购条款、董事会席位，每一条都得谈。"
          : "";
  // v1.6-alpha：二次路演的开场白（上次被拒的市场记忆）
  const retryScene = isRetry
    ? `上次被${s.pitchFailCount && s.pitchFailCount > 1 ? "第 " + s.pitchFailCount + " 次" : ""}拒后，你花了三个月重整 BP、换了一批投资人名单，还下调了估值预期。这是一次新的路演——对方不知道你的伤疤，但市场记得。\n\n`
    : "";
  // v1.7：机构关系与寒冬的开场白
  const relationScene = isFollowOn
    ? `🤝 ${investor.name} 是你的老股东——「上一轮我赌对了，这一轮我加注。」\n\n`
    : winter
      ? `🥶 资本寒冬。${investor.name} 的会议室空了一半，LP 的电话比以往任何时候都多。「不是你不优秀，是大家都没钱了。」\n\n`
      : "";

  return {
    kind: "pitch",
    round,
    title: isRetry ? `${ROUND_TITLES[round]} · 再战` : ROUND_TITLES[round],
    scene: `${retryScene}${relationScene}${investor.name}（${investor.style}）听完了你的 20 分钟路演。对方最看重「${investor.preference}」。\n\n你的关键数据：MRR ${fmtMoney(s, s.mrr)} · 用户 ${s.users.toLocaleString()} · 产品完成度 ${Math.round(s.product)}% · 团队 ${s.team} 人\n\n对方开口：「我们最多出 ${s.region.currency}${amount} 万，要 ${ask}% 的股份。你可以考虑，但我下周还要见你的两个竞品。」${growthHint}`,
    investor: { ...investor, checkSize: [amount, amount], ask },
    choices: [
      { id: acceptId, text: acceptText, effects: {}, resultText: "" },
      { id: negId, text: negText, effects: {}, resultText: "" },
    ],
  };
}

export function resolvePitch(s: GameState, choiceId: string, investor: NonNullable<PendingDecision["investor"]>, round?: Round): GameState {
  syncRng(s);
  let n = { ...s };
  const rd: Round = round ?? (n.stage === "seed" ? "seed" : "A");
  const amount = investor.checkSize[0];
  const ask = investor.ask;
  if (choiceId === "accept" || choiceId === "accept-anyway") {
    if (choiceId === "accept") {
      n.cash += amount;
      n.valuation = Math.max(n.valuation, amount / (ask / 100));
      n.raised = [...n.raised, { round: ROUND_NAMES[rd], amount, dilution: ask, investor: investor.name }];
      n = log(n, `🎉 ${investor.name} 打款 ${fmtMoney(n, amount)}！稀释 ${ask}%。`, "good");
      n.morale = clamp(n.morale + 12, 0, 100);
      n.awareness = clamp(n.awareness + 15, 0, 100); // 融资成功自带 PR 效应（TechCrunch 效应）
      n.pitchRetry = undefined;
      if (n.deepInvestors) n.investorRelations = { ...(n.investorRelations ?? {}), [investor.name]: "invested" };
      n = applyRoundOutcome(n, rd);
    } else {
      if (n.deepInvestors) n.investorRelations = { ...(n.investorRelations ?? {}), [investor.name]: "rejected" };
      n = log(n, `${investor.name} 婉拒了：「我们再看看。」（你的「${investor.preference}」数据不够打动对方）`, "bad");
      n.morale = clamp(n.morale - 8, 0, 100);
      n.eventCooldown = 2;
      // v1.6-alpha：融资失败不再软锁——3 个月冷却后可二次路演，但估值预期下调 10%
      n.pitchRetry = { round: rd, at: n.month + 3 };
      n.pitchFailCount = (n.pitchFailCount ?? 0) + 1;
      n.valuation = Math.max(20, n.valuation * 0.9);
      n = log(n, "📉 融资受挫会留下市场记忆：3 个月冷却期后可再次路演（估值预期已下调 10%）。越拖越贱卖是融资的铁律——最优秀的创始人在账上还有 6 个月钱时就开始融资。", "info");
      n = log(n, "💡 创业课：融资是匹配游戏——基金有自己的赛道 thesis 和美元规模，被 100 家拒绝只说明匹配没发生，不代表你不行。Airbnb 曾被 7 个 YC 合伙人中的 5 个拒绝。", "info");
    }
  } else if (choiceId === "negotiate-up") {
    n.cash += amount;
    n.valuation = Math.max(n.valuation, amount / ((ask * 0.75) / 100));
    n.raised = [...n.raised, { round: ROUND_NAMES[rd], amount, dilution: Math.round(ask * 0.75), investor: investor.name }];
    n = log(n, `🎉 谈判成功！${fmtMoney(n, amount)} 到账，只稀释 ${Math.round(ask * 0.75)}%。`, "good");
    n.morale = clamp(n.morale + 15, 0, 100);
    n.awareness = clamp(n.awareness + 15, 0, 100);
    n.pitchRetry = undefined;
    if (n.deepInvestors) n.investorRelations = { ...(n.investorRelations ?? {}), [investor.name]: "invested" };
    n = applyRoundOutcome(n, rd);
  } else {
    n = log(n, `${investor.name} 脸色冷了下来：「这不是菜市场。」谈判破裂。`, "bad");
    n.morale = clamp(n.morale - 10, 0, 100);
    n.eventCooldown = 2;
    // v1.6-alpha：谈判破裂同样可二次路演（冷却 + 估值惩罚）
    n.pitchRetry = { round: rd, at: n.month + 3 };
    n.pitchFailCount = (n.pitchFailCount ?? 0) + 1;
    if (n.deepInvestors) n.investorRelations = { ...(n.investorRelations ?? {}), [investor.name]: "rejected" };
    n.valuation = Math.max(20, n.valuation * 0.9);
    n = log(n, "📉 谈崩了。3 个月冷却期后可再次路演，但估值预期已下调 10%。", "info");
  }
  n = checkEnding(n);
  return n;
}

// 融资成功后的阶段推进 + 团队扩张（钱到位 → 组织跟上，这是仿真多轮次的核心）
function applyRoundOutcome(n: GameState, rd: Round): GameState {
  let s: GameState = n;
  const growTeam = (min: number, max: number) => {
    const add = randInt(min, max);
    if (add > 0) {
      s.team += add;
      s = log(s, `📈 融资到位，团队从 ${s.team - add} 人扩张到 ${s.team} 人（工资单显著变厚——烧钱速度同步上升）。`, "system");
    }
  };
  switch (rd) {
    case "seed":
      s.stage = "growth";
      s = log(s, "🚀 进入增长期：招人、投放、迭代，烧钱的速度决定成长的速度。", "system");
      s.pendingDecision = hireDecision(s);
      break;
    case "A":
      s.stage = "scale";
      s.scaleRound = 0;
      growTeam(2, 4);
      s = log(s, "🏭 进入规模化阶段：B 轮（MRR≥60）与 C 轮（MRR≥100）的机构已在观望，组织必须跟上增长。", "system");
      s.pendingDecision = hireDecision(s);
      break;
    case "B":
      s.scaleRound = 1;
      growTeam(4, 7);
      break;
    case "C":
      s.scaleRound = 2;
      growTeam(6, 10);
      break;
    case "D":
      s.scaleRound = 3;
      growTeam(8, 12);
      s = log(s, "🌐 D 轮交割：你开始被叫「独角兽」了——但这个称号一半是光环，一半是靶子。", "system");
      break;
    case "E":
      s.scaleRound = 4;
      growTeam(10, 15);
      s = log(s, "👑 E 轮（Pre-IPO）交割：投行、审计、律所全部进场，每一张发票都开始昂贵。", "system");
      break;
  }
  return s;
}

// ─── 招聘 ───────────────────────────────────────────────────────────────────
function hireDecision(s: GameState): PendingDecision {
  const c1 = pick(CANDIDATES);
  let c2 = pick(CANDIDATES);
  while (c2.name === c1.name) c2 = pick(CANDIDATES);
  return {
    kind: "hire",
    title: "👥 关键招聘",
    scene: `业务起量了，你必须为关键岗位做决定。钱只够马上招一个，另一个岗位靠现有团队硬扛。`,
    candidate: c1,
    candidates: [c1, c2],
    choices: [
      { id: "h1", text: `招 ${c1.name}（${c1.role}）· 月薪 ${s.region.currency}${c1.salary}万 · ${c1.quirk}`, effects: {}, resultText: "" },
      { id: "h2", text: `招 ${c2.name}（${c2.role}）· 月薪 ${s.region.currency}${c2.salary}万 · ${c2.quirk}`, effects: {}, resultText: "" },
      { id: "none", text: "都不合适，再等等（本月错过招聘窗口）", effects: { months: 0 }, resultText: "" },
    ],
  };
}

export function resolveHire(s: GameState, choiceId: string, candidates: [Candidate, Candidate]): GameState {
  syncRng(s);
  let n: GameState = { ...s, pendingDecision: null };
  if (choiceId === "none") {
    n = log(n, "你决定宁缺毋滥。团队的产出暂时承压，但人心没有散。", "info");
    return n;
  }
  const c = choiceId === "h1" ? candidates[0] : candidates[1];
  n.team += 1;
  n.cash -= c.salary * 3; // 签约成本
  if (c.good) {
    n.product = clamp(n.product + c.skill / 8, 0, 100);
    n.morale = clamp(n.morale + 8, 0, 100);
    n.mrr *= 1.15;
    n = log(n, `✅ ${c.name} 入职！${c.role} 到位，${c.skill > 85 ? "大神级" : "靠谱"}选手让团队士气大振。`, "good");
  } else {
    n.morale = clamp(n.morale - 10, 0, 100);
    n.product = clamp(n.product - 5, 0, 100);
    n.cash -= c.salary * 3;
    n = log(n, `⚠️ ${c.name} 入职后原形毕露：${c.quirk}。三个月后不得不补偿离职，白烧 ${fmtMoney(n, c.salary * 6)}。`, "bad");
    n.team -= 1;
    n = log(n, "💡 创业课：招聘错人的成本 = 6 个月工资 × 机会成本 + 团队士气损耗。Google 的规则：宁可错过，不可招错。「A 级人才会招来 A 级，B 级会招来 C 级」——这是乔布斯的用人铁律。", "info");
  }
  return n;
}

// ─── 事件触发 ───────────────────────────────────────────────────────────────
const STAGE_ORDER: Record<string, number> = { idea: 1, validate: 2, mvp: 3, seed: 3, growth: 4, seriesA: 5, scale: 5, endgame: 6 };

// 难度决定随机事件发生率：教学 22% / 标准 38% / 真实 50%
// P0-2 行动点「亲自盯运营」：本月危机/随机事件触发率减半
function eventChance(s: GameState): number {
  const d = s.difficulty ?? "standard";
  const base = d === "easy" ? 0.22 : d === "realism" ? 0.5 : d === "hell" ? 0.65 : 0.38;
  return s.founderAction === "ops" ? base * 0.5 : base;
}

// 剧本模式：按 ID 强制触发事件（无视阶段条件；已触发过则跳过，防止重复）
function triggerEventById(s: GameState, eventId: string): GameState {
  const ev = EVENTS.find((e) => e.id === eventId);
  if (!ev || s.tags.includes(`ev-${ev.id}`)) return s;
  let n = { ...s };
  n.tags = [...n.tags, `ev-${ev.id}`];
  n.eventCooldown = 1;
  n.pendingDecision = { kind: "event", eventId: ev.id, title: ev.title, scene: ev.scene, speaker: ev.speaker, choices: ev.choices };
  return n;
}

function maybeTriggerEvent(s: GameState): GameState {
  const stageNum = STAGE_ORDER[s.stage];
  // 🥚 彩蛋/专属事件：weight 为 0 不走随机池，条件满足时优先触发（剧本事件 sc- 除外，由固定队列调度）
  const egg = EVENTS.find((ev) =>
    !ev.id.startsWith("sc-") &&
    (ev.id.startsWith("egg-") || ev.weight === 0) &&
    !(ev.hellOnly && s.difficulty !== "hell") &&
    !s.tags.includes(`ev-${ev.id}`) &&
    stageNum >= ev.minStage &&
    (!ev.maxStage || stageNum <= ev.maxStage) &&
    (!ev.condition || ev.condition(s))
  );
  if (egg && nextRandom() < 0.5) {
    let n = { ...s };
    n.tags = [...n.tags, `ev-${egg.id}`];
    n.eventCooldown = 2;
    n.pendingDecision = { kind: "event", eventId: egg.id, title: egg.title, scene: egg.scene, speaker: egg.speaker, choices: egg.choices };
    return n;
  }
  const eligible = EVENTS.filter((ev) => {
    if (ev.id.startsWith("egg-") || ev.weight <= 0) return false; // 彩蛋/专属事件不走随机池
    if (ev.hellOnly && s.difficulty !== "hell") return false; // 中国特别版系统性风险仅地狱难度
    if (ev.once && s.tags.includes(`ev-${ev.id}`)) return false;
    if (stageNum < ev.minStage) return false;
    if (ev.maxStage && stageNum > ev.maxStage) return false;
    if (ev.condition && !ev.condition(s)) return false;
    return true;
  });
  if (!eligible.length || nextRandom() > eventChance(s)) return s;
  const totalW = eligible.reduce((a, e) => a + e.weight, 0);
  let r = nextRandom() * totalW;
  let chosen = eligible[0];
  for (const ev of eligible) {
    r -= ev.weight;
    if (r <= 0) { chosen = ev; break; }
  }
  let n = { ...s };
  if (chosen.once) n.tags = [...n.tags, `ev-${chosen.id}`];
  n.eventCooldown = 2;
  n.pendingDecision = {
    kind: "event",
    eventId: chosen.id,
    title: chosen.title,
    scene: chosen.scene,
    choices: chosen.choices,
  };
  return n;
}

// ─── 终局决策 ───────────────────────────────────────────────────────────────
// v1.7：三市场 IPO——美股重增长、港股要现金流、A 股要合规盈利；hold 改为加速经营
const IPO_MARKETS = {
  us: {
    name: "🗽 美股（纳斯达克）",
    req: "重增长：MRR > 100、团队 ≥10、创始人健康 >25；允许亏损上市，但之后要面对做空报告与集体诉讼的风险。",
    test: (n: GameState) => n.mrr > 100 && n.team >= 10 && n.health > 25 && !n.tags.includes("toxic-terms"),
    failReason: (n: GameState) => (n.team < 10 ? "「公司治理不健全：" + n.team + " 人的团队撑不起上市公司的运作」" : "「增长故事不够性感」"),
    fee: 0.08,
    valMult: 1.15,
    failFee: 0.06,
    note: "美股给你的估值最高（×1.15），但上市后每个季度都要对华尔街交卷。",
  },
  hk: {
    name: "🇭🇰 港股（港交所）",
    req: "重现金流：MRR > 100 且账上现金为正、声望 >-10；流动性折价明显，估值 ×0.85，但审核速度最快。",
    test: (n: GameState) => n.mrr > 100 && n.cash > 0 && n.reputation > -10 && !n.tags.includes("toxic-terms"),
    failReason: () => "「持续经营现金流存疑」",
    fee: 0.06,
    valMult: 0.85,
    failFee: 0.05,
    note: "港股是稳态选择：估值打折，但离你的供应链和用户最近。",
  },
  cn: {
    name: "🇨🇳 A 股（科创板/创业板）",
    req: "重合规盈利：MRR > 100 且连续健康（无 toxic-terms、声望 >0）、持有 licensed 标签更佳；审核最严，但上市后估值 ×1.3（锁定期 3 年）。",
    test: (n: GameState) => n.mrr > 100 && n.reputation > 0 && !n.tags.includes("toxic-terms") && n.health > 25,
    failReason: (n: GameState) => (n.reputation <= 0 ? "「发行人市场声誉存在争议」" : "「持续盈利能力存疑」"),
    fee: 0.1,
    valMult: 1.3,
    failFee: 0.12,
    note: "A 股估值最高（×1.3）但锁定期 3 年——敲钟那天你依然不能套现，这才是真实的中国资本市场。",
  },
} as const;
type IpoMarket = keyof typeof IPO_MARKETS;

function ipoDecision(s: GameState): PendingDecision {
  const teamWarn = s.team < 10 ? `\n\n⚠️ 投行尽职调提醒你：上市公司需要健全的组织治理，团队至少 10 人（当前 ${s.team} 人）。` : "";
  return {
    kind: "ipo",
    title: "🏛️ 命运的十字路口",
    scene: `E 轮交割完成，投行、律所、审计师都到位了。现在要选择上市地——这不是选股票代码，是选未来五年你每天要面对谁：华尔街的空头、港股的流动性，还是 A 股的发审委。\n\n当然，你也可以选择另一条路——把公司卖给那个出价 ${fmtMoney(s, s.valuation * 1.6)} 的巨头。${teamWarn}`,
    choices: [
      { id: "ipo-us", text: `${IPO_MARKETS.us.name}：${IPO_MARKETS.us.note}`, effects: {}, resultText: "" },
      { id: "ipo-hk", text: `${IPO_MARKETS.hk.name}：${IPO_MARKETS.hk.note}`, effects: {}, resultText: "" },
      { id: "ipo-cn", text: `${IPO_MARKETS.cn.name}：${IPO_MARKETS.cn.note}`, effects: {}, resultText: "" },
      { id: "sell", text: `接受收购报价 ${fmtMoney(s, s.valuation * 1.6)}`, effects: {}, resultText: "" },
      { id: "hold", text: "再养一年：全力做厚营收，等更好的窗口", effects: {}, resultText: "" },
    ],
  };
}

export function resolveEndgame(s: GameState, choiceId: string): GameState {
  syncRng(s);
  let n = { ...s };
  const m = choiceId.startsWith("ipo-") ? (choiceId.slice(4) as IpoMarket) : null;
  if (m) {
    const market = IPO_MARKETS[m];
    if (market.test(n)) {
      n.valuation = n.valuation * market.valMult;
      n.tags = [...n.tags, `ipo-${m}`];
      n = log(n, `🌍 你选择 ${market.name}。承销团定价时给了 ${market.valMult}× 的市场系数。`, "good");
      n = finishGame(n, "ipo");
    } else {
      n.cash -= n.valuation * market.failFee;
      n = log(n, `💥 ${market.name} 审核被拒！${market.failReason(n)}。上市费用 ${fmtMoney(n, n.valuation * market.failFee)} 打了水漂，市场开始唱衰你。`, "bad");
      n.reputation = clamp(n.reputation - 15, -100, 100);
      n.morale = clamp(n.morale - 15, 0, 100);
      n.stage = "scale";
      n.pendingDecision = null;
      n = checkEnding(n);
    }
  } else if (choiceId === "sell") {
    n = finishGame(n, "acquired");
  } else {
    // v1.7：「再养一年」修复——不是白等，是全员冲刺的 6 个月（预算效果 ×1.5），窗口自然变好
    n.tags = [...n.tags, "hold-boost"];
    n.month += 6;
    n.year = (n.scenario?.year ?? START_YEAR) + Math.floor(n.month / 12);
    n.cash += n.mrr * 8;
    n.product = clamp(n.product + 12, 0, 100);
    n.valuation = Math.max(n.valuation, n.valuation * 1.25);
    n = log(n, "📈 再养的一年：你砍掉了所有虚荣项目，全员扑在营收上——预算效率 +50%，营收与估值实实在在涨了一截。好饭不怕晚，但饭是真的熟了。", "good");
    n = log(n, "💡 创业课：上市窗口是等不来的，是养出来的。宁德时代 2018 年上市前连续 24 个季度盈利——「等一年」的价值不在时间，在于这 12 个月你做了什么。", "info");
    if (n.valuation >= 5000 && n.mrr >= 200 && n.team >= 10) n = finishGame(n, "ipo");
    else {
      n.pendingDecision = ipoDecision(n);
      n.stage = "endgame";
    }
  }
  return n;
}

export function finishGame(s: GameState, endingId: string): GameState {
  const base = ENDINGS[endingId];
  clearSave(); // 对局结束，清掉进行中的存档
  // 通关解锁：完成任意一局且不跑路（欠债跑路除外），解锁隐藏职业「天使投资人」
  if (endingId !== "runaway") {
    try { localStorage.setItem("fj_angel_unlocked", "1"); } catch { /* ignore */ }
  }
  // 连续创业者计数：累计通关 3 局后，新开局获得「老兵光环」彩蛋
  try {
    const done = parseInt(localStorage.getItem("fj_completions") || "0", 10) + 1;
    localStorage.setItem("fj_completions", String(done));
  } catch { /* ignore */ }
  // 匿名通关统计上报（fire-and-forget，失败静默）+ 本地生涯记录
  try {
    const report = {
      endingId, grade: base.grade, months: s.month,
      industryId: s.industry.id, regionId: s.region.id,
      valuation: Math.round(s.valuation), mrr: Math.round(s.mrr),
      eggCount: s.tags.filter((t) => t.startsWith("egg-")).length,
      difficulty: s.difficulty ?? "standard",
      scenarioId: s.scenario?.id,
    };
    reportRun(report);
    if (s.tournamentCode) reportTournament(s.name, s.tournamentCode, { ...report, rngSeed: s.rngSeed });
    recordRun(loadCareer(), report);
  } catch { /* 绝不影响游戏 */ }
  const ending: Ending = {
    ...base,
    stats: [
      { label: "创业时长", value: `${Math.floor(s.month / 12)} 年 ${s.month % 12} 个月` },
      { label: "最终估值", value: fmtMoney(s, s.valuation) },
      { label: "累计融资", value: fmtMoney(s, s.raised.reduce((a, r) => a + r.amount, 0)) },
      { label: "月营收 (MRR)", value: fmtMoney(s, s.mrr) },
      { label: "用户规模", value: s.users.toLocaleString() },
      { label: "团队规模", value: `${s.team} 人` },
      { label: "融资轮次", value: s.raised.map((r) => r.round).join(" → ") || "未融资" },
    ],
  };
  return { ...s, alive: false, speed: 0, ending, pendingDecision: null };
}

// ─── 结局检查 ───────────────────────────────────────────────────────────────
function checkEnding(s: GameState): GameState {
  if (!s.alive) return s;
  let n = s;
  if (n.health <= 0) return finishGame(n, "burnout");
  if (n.morale <= 0 && n.cash < 5) return finishGame(n, "shutdown");
  const totalDebt = n.debt + (n.loan ?? 0);
  if (totalDebt > 120) {
    return finishGame(n, "runaway");
  }
  if (totalDebt > 60 && n.cash <= 0 && n.mrr < n.industry.baseBurn) {
    // 债务深重且看不到收入：破产清算（亲友债 + 紧急贷款一起算总账）
    return finishGame(n, "bankrupt");
  }
  if (n.month > 96) {
    // 8 年仍未上市：按估值给结局
    if (n.valuation > 1500) return finishGame(n, "acquihire");
    return finishGame(n, "shutdown");
  }
  return n;
}

// ─── 主动操作 ───────────────────────────────────────────────────────────────
export function adjustBudget(s: GameState, key: "rd" | "marketing" | "sales", delta: number): GameState {
  const b = { ...s.budget };
  b[key] = clamp(b[key] + delta, 0, 100);
  // 保持总和 100
  const others = (["rd", "marketing", "sales"] as const).filter((k) => k !== key);
  const otherSum = b[others[0]] + b[others[1]];
  if (otherSum > 0) {
    const scale = (100 - b[key]) / otherSum;
    b[others[0]] = Math.round(b[others[0]] * scale);
    b[others[1]] = 100 - b[key] - b[others[0]];
  } else {
    b[others[0]] = Math.round((100 - b[key]) / 2);
    b[others[1]] = 100 - b[key] - b[others[0]];
  }
  return { ...s, budget: b };
}

// 滑杆直接设定某一项（按 5% 取整，其余两项等比例缩放，总和保持 100）
export function setBudgetAbs(s: GameState, key: "rd" | "marketing" | "sales", value: number): GameState {
  const b = { ...s.budget };
  b[key] = clamp(Math.round(value / 5) * 5, 0, 100);
  const others = (["rd", "marketing", "sales"] as const).filter((k) => k !== key);
  const rest = 100 - b[key];
  const otherSum = b[others[0]] + b[others[1]];
  if (otherSum > 0) {
    const scale = rest / otherSum;
    b[others[0]] = Math.round((b[others[0]] * scale) / 5) * 5;
    b[others[1]] = rest - b[others[0]];
  } else {
    b[others[0]] = Math.round(rest / 2 / 5) * 5;
    b[others[1]] = rest - b[others[0]];
  }
  b[others[1]] = clamp(b[others[1]], 0, 100);
  b[others[0]] = 100 - b[key] - b[others[1]];
  return { ...s, budget: b };
}

export function shutdownCompany(s: GameState): GameState {
  return finishGame(s, s.debt + (s.loan ?? 0) > 30 ? "bankrupt" : "shutdown");
}

export function currentRunway(s: GameState): number {
  const burn = Math.max(0.1, monthlyBurn(s) - s.mrr);
  return s.cash / burn;
}

export function monthlyBurn(s: GameState): number {
  const mod = s.region.modifiers;
  const salaries = s.team * 1.8 * (mod.talentPool ?? 1) + (s.team - 1) * 0.4;
  const marketingBurn = s.product >= 40 ? s.budget.marketing * 0.15 : s.budget.marketing * 0.05;
  return (s.industry.baseBurn + salaries + marketingBurn) * (mod.burnMultiplier ?? 1) + industryExtraBurn(s);
}

// ─── 行业特性：差异化月度开销 ────────────────────────────────────────────────
// 不同赛道有不同的「日常真实」：
//   硬件  → 备货占款：MRR 的 30% 要投入下一批生产（库存吞现金）
//   软件  → 云账单：用户越多服务器越贵（规模不经济）
//   跨境  → 物流仓储：随单量线性增长（运费吃掉薄毛利）
//   金融  → 合规成本：拿牌照后每月 2.5 万的持续风控合规开销
function industryExtraBurn(s: GameState): number {
  const id = s.industry.id;
  const modMul = s.region.modifiers.burnMultiplier ?? 1;
  if (id === "hardware" && s.mrr > 5) return s.mrr * 0.3;
  if ((id === "ai" || id === "consumer") && s.users > 500) return s.users * 0.0004 * modMul;
  if (id === "ecom" && s.users > 300) return s.users * 0.0008 * modMul;
  if (id === "fintech") return s.tags.includes("licensed") ? 2.5 : 1;
  return 0;
}
