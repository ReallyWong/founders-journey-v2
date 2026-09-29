// ─── 创业人生 · 投资系统引擎（v1.8 PoC） ──────────────────────────────────────
// 历史沙盒市场：真实月 K 线（markets.json）+ 各市场规则 DNA（T+1/涨跌停/印花税）
// 纯函数设计：不依赖 GameState，方便 bot 回归与将来接入主引擎
import MARKETS from "./markets.json";

export interface MarketBar { m: string; o: number; c: number; h: number; l: number; }

interface TickerDef { id: string; name: string; kind: string; bars: MarketBar[]; }

export interface MarketRules {
  name: string; currency: string; t1: boolean; limitPct: number;
  stampTaxSell: number; commission: number; minCommission: number;
}

export interface Position {
  ticker: string;
  mkt: string;         // 所属市场（"cn" | "hk" | "us"），跨市场持仓结算用
  shares: number;      // 总持仓
  locked: number;      // T+1：本月买入、次月解锁的部分（A股）
  cost: number;        // 累计买入成本（用于实现盈亏）
  heldSince?: string;  // v2.0：首次买入年月 "2005-01"——「时间玫瑰」成就计时用
}

export interface Trade {
  ym: string; ticker: string; side: "buy" | "sell";
  shares: number; price: number; fee: number;
}

export interface Brokerage {
  cash: number;
  positions: Position[];
  realizedPnl: number;
  history: Trade[];    // 最多保留 24 条
  startYm: string;     // 开户年月 "2007-01"
  unlockLevel: 1 | 2 | 3; // 三层解锁：1=指数/ETF，2=+个股，3=+杠杆（v1.9）
  borrowed?: number;   // v1.9 两融：未偿还借款（旧存档缺省视为 0）
}

// ─── 数据访问 ────────────────────────────────────────────────────────────────
const TICKER_INDEX: Record<string, Map<string, MarketBar>> = {};
const RULES: Record<string, MarketRules & { tickers: TickerDef[] }> = {};

for (const [mktId, mkt] of Object.entries(MARKETS) as [string, MarketRules & { tickers: TickerDef[] }][]) {
  if (mktId === "meta") continue;
  RULES[mktId] = mkt;
  for (const t of mkt.tickers) {
    TICKER_INDEX[mktId + ":" + t.id] = new Map(t.bars.map((b) => [b.m, b]));
  }
}

export function listTickers(mkt: string): { id: string; name: string; kind: string; firstYm: string | null }[] {
  return (RULES[mkt].tickers ?? []).map((t) => ({
    id: t.id, name: t.name, kind: t.kind,
    firstYm: t.bars.length ? t.bars[0].m : null,
  }));
}

export function getBar(mkt: string, ticker: string, ym: string): MarketBar | undefined {
  return TICKER_INDEX[mkt + ":" + ticker]?.get(ym);
}

// 较上一根可交易月线的涨跌幅（用于涨跌停判断；次新股/上市首月返回 null）
export function pctChange(mkt: string, ticker: string, ym: string): number | null {
  const bars = (RULES[mkt].tickers ?? []).find((t) => t.id === ticker)?.bars;
  if (!bars) return null;
  const i = bars.findIndex((b) => b.m === ym);
  if (i <= 0) return null;
  return bars[i].c / bars[i - 1].c - 1;
}

// v2.0 联动：三大市场基准指数在指定行情月的最大跌幅（<=0）。
// 用「当月最低价 / 上月收盘」而非月收盘——月频下收盘会稀释股灾（2020-03 月收仅 -8%，月内实际 -22%）
const CRASH_INDEXES = [["cn", "SHCOMP"], ["hk", "HSI"], ["us", "QQQ"]] as const;
export function crashIndexDrop(ym: string): number {
  let worst = 0;
  for (const [mkt, ticker] of CRASH_INDEXES) {
    const bars = (RULES[mkt].tickers ?? []).find((t) => t.id === ticker)?.bars;
    if (!bars) continue;
    const i = bars.findIndex((b) => b.m === ym);
    if (i <= 0) continue;
    const drop = bars[i].l / bars[i - 1].c - 1;
    if (drop < worst) worst = drop;
  }
  return worst;
}

// 取某标的全部 K 线（UI 画走势缩略图用）
export function getBars(mkt: string, ticker: string): MarketBar[] {
  return (RULES[mkt].tickers ?? []).find((t) => t.id === ticker)?.bars ?? [];
}

export function getRules(mkt: string): MarketRules {
  return RULES[mkt];
}

// ─── 账户操作（返回错误字符串或 null） ───────────────────────────────────────
export function openBrokerage(cash: number, startYm: string): Brokerage {
  return { cash, positions: [], realizedPnl: 0, history: [], startYm, unlockLevel: 1, borrowed: 0 };
}

// 标的所属交易层级：1=指数/ETF（开户可买），2=个股（交易满 3 个月解锁），3=杠杆（v1.9）
function tickerTier(kind: string): 1 | 2 | 3 {
  return kind === "index" || kind === "etf" ? 1 : 2;
}

export function canTrade(b: Brokerage, mkt: string, ticker: string): string | null {
  const t = (RULES[mkt].tickers ?? []).find((x) => x.id === ticker);
  if (!t) return "标的不存在";
  if (tickerTier(t.kind) > b.unlockLevel)
    return t.kind === "stock" ? "个股交易将在累计交易满 3 个月后解锁" : "该标的尚未解锁";
  return null;
}

export function buy(b: Brokerage, mkt: string, ticker: string, ym: string, amount: number): string | null {
  const rules = RULES[mkt];
  const bar = getBar(mkt, ticker, ym);
  if (!bar) return "该标的当月无可交易行情（可能尚未上市；历史行情沙盒覆盖 2005–2024，超区段后不可新开仓）";
  const tierErr = canTrade(b, mkt, ticker);
  if (tierErr) return tierErr;
  if (amount <= 0) return "买入金额必须为正";
  // 注：涨跌停是「日」频机制，月频引擎不模拟（月度涨跌常超 ±10%，属合法波动）；limitPct 字段保留供未来日频版使用
  const fee = Math.max(amount * rules.commission, rules.minCommission || 0);
  const total = amount + fee;
  if (total > b.cash) return "可用资金不足";
  const shares = amount / bar.c;
  const pos = b.positions.find((p) => p.ticker === ticker && p.mkt === mkt);
  if (pos) {
    pos.cost += amount; pos.shares += shares;
    if (rules.t1) pos.locked += shares;
  } else {
    b.positions.push({ ticker, mkt, shares, locked: rules.t1 ? shares : 0, cost: amount, heldSince: ym });
  }
  b.cash -= total;
  b.history.push({ ym, ticker, side: "buy", shares, price: bar.c, fee });
  if (b.history.length > 24) b.history = b.history.slice(-24);
  return null;
}

export function sell(b: Brokerage, mkt: string, ticker: string, ym: string, shares: number): string | null {
  const rules = RULES[mkt];
  const bar = getBar(mkt, ticker, ym);
  if (!bar) return "该标的当月无可交易行情";
  const pos = b.positions.find((p) => p.ticker === ticker && p.mkt === mkt);
  if (!pos) return "无持仓";
  const available = pos.shares - pos.locked;
  if (shares > available + 1e-9) return rules.t1 ? `T+1：本月买入的份额锁定，可卖 ${available.toFixed(2)} 股` : "持仓不足";
  // 涨跌停为日频机制，月频引擎不模拟（见 buy 注）
  const gross = shares * bar.c;
  const fee = Math.max(gross * rules.commission, rules.minCommission || 0) + gross * rules.stampTaxSell;
  const avgCost = pos.cost / pos.shares;
  b.realizedPnl += (bar.c - avgCost) * shares - fee;
  b.cash += gross - fee;
  pos.shares -= shares;
  pos.cost -= avgCost * shares;
  if (pos.shares <= 1e-9) b.positions = b.positions.filter((p) => p !== pos);
  b.history.push({ ym, ticker, side: "sell", shares, price: bar.c, fee });
  if (b.history.length > 24) b.history = b.history.slice(-24);
  return null;
}

// 月末结算：T+1 解锁 + 按持仓所属市场分别估值（权益 = 现金 + Σ 持仓市值）
export function settleMonth(b: Brokerage, _mkt: string, ym: string): number {
  for (const pos of b.positions) pos.locked = 0;
  return equityAt(b, ym);
}

// 跨市场总净资产（数据耗尽后按最后收盘价冻结估值——不吞掉持仓；融资借款为负债，已扣除）
export function equityAt(b: Brokerage, ym: string): number {
  let equity = b.cash;
  for (const pos of b.positions) {
    const bars = getBars(pos.mkt, pos.ticker);
    const bar = getBar(pos.mkt, pos.ticker, ym) ?? (bars.length ? bars[bars.length - 1] : undefined);
    equity += pos.shares * (bar ? bar.c : 0);
  }
  return equity - borrowedOf(b);
}

// 最大回撤（给定权益曲线）
export function maxDrawdown(equity: number[]): number {
  let peak = equity[0] ?? 0, mdd = 0;
  for (const v of equity) {
    peak = Math.max(peak, v);
    mdd = Math.min(mdd, v / peak - 1);
  }
  return mdd;
}

// ─── v1.9 两融（融资融券·月频版） ────────────────────────────────────────────
// 规则即玩法：维持担保比例 = 总资产 / 借款；预警线 130%，强平线 115%（真实两融标准）
export const MARGIN_CALL_RATIO = 1.3;   // 预警：追加保证金通知
export const MARGIN_FORCE_RATIO = 1.15; // 强平：券商强行卖出持仓还债
export const MARGIN_ANNUAL_RATE = 0.08; // 融资年化利率 8%（月息 ≈ 0.667%）

export function borrowedOf(b: Brokerage): number {
  return b.borrowed ?? 0;
}

// 维持担保比例 = 总资产（现金+持仓市值，不扣负债） / 借款；无借款返回 Infinity
export function maintenanceRatio(b: Brokerage, ym: string): number {
  const borrowed = borrowedOf(b);
  if (borrowed <= 0) return Infinity;
  let gross = b.cash;
  for (const pos of b.positions) {
    const bars = getBars(pos.mkt, pos.ticker);
    const bar = getBar(pos.mkt, pos.ticker, ym) ?? (bars.length ? bars[bars.length - 1] : undefined);
    gross += pos.shares * (bar ? bar.c : 0);
  }
  return gross / borrowed;
}

export interface MarginSettleResult {
  equity: number;
  borrowed: number;
  interest: number;      // 本月计提利息
  marginCall: boolean;   // 触及预警线（130%）
  liquidated: boolean;   // 已强平
}

// 月末两融结算：计提利息 → 维持担保比例检查 → 强平。由引擎月度结算调用（在 settleMonth 解锁 T+1 之前）
export function marginSettle(b: Brokerage, ym: string): MarginSettleResult {
  let borrowed = borrowedOf(b);
  let interest = 0, marginCall = false, liquidated = false;

  // 1. 计提利息：先扣现金，现金不够的部分计入借款（利滚利）
  if (borrowed > 0) {
    interest = borrowed * (MARGIN_ANNUAL_RATE / 12);
    if (b.cash >= interest) b.cash -= interest;
    else { borrowed += interest - Math.max(0, b.cash); b.cash = Math.min(b.cash, 0); }
  }

  // 2. 维持担保比例检查（扣息后的最新估值，真实口径：总资产/借款）
  const ratio = borrowed > 0 ? maintenanceRatio(b, ym) : Infinity;
  if (borrowed > 0 && ratio < MARGIN_CALL_RATIO) marginCall = true;

  // 3. 强平：按本月收盘价（数据耗尽则用最后收盘价）清仓全部持仓偿还借款
  if (borrowed > 0 && ratio < MARGIN_FORCE_RATIO) {
    liquidated = true;
    for (const pos of b.positions) {
      const bars = getBars(pos.mkt, pos.ticker);
      const bar = getBar(pos.mkt, pos.ticker, ym) ?? (bars.length ? bars[bars.length - 1] : undefined);
      if (!bar) continue;
      const rules = RULES[pos.mkt];
      const gross = pos.shares * bar.c;
      const fee = Math.max(gross * rules.commission, rules.minCommission || 0) + gross * rules.stampTaxSell;
      const avgCost = pos.cost / pos.shares;
      b.realizedPnl += (bar.c - avgCost) * pos.shares - fee;
      b.cash += gross - fee;
      b.history.push({ ym, ticker: pos.ticker, side: "sell", shares: pos.shares, price: bar.c, fee });
    }
    b.positions = [];
    // 4. 现金还债；还不上的部分留作欠款（净资产可以为负——爆仓不是清零，是负债）
    const repay = Math.min(b.cash, borrowed);
    b.cash -= repay;
    borrowed -= repay;
    if (b.history.length > 24) b.history = b.history.slice(-24);
  }

  b.borrowed = borrowed;
  return { equity: equityAt(b, ym), borrowed, interest, marginCall, liquidated };
}

// 融资买入：total = 买入总金额；不足部分自动借款。约束：买入后借款 ≤ 买入前净资产（最大 2 倍总仓位）
export function buyMargin(b: Brokerage, mkt: string, ticker: string, ym: string, total: number): string | null {
  if (b.unlockLevel < 3) return "融资融券尚未解锁（个人净资产 ≥ 100 万后自动开通）";
  const rules = RULES[mkt];
  const bar = getBar(mkt, ticker, ym);
  if (!bar) return "该标的当月无可交易行情（可能尚未上市；历史行情沙盒覆盖 2005–2024，超区段后不可新开仓）";
  if (total <= 0) return "买入金额必须为正";
  const fee = Math.max(total * rules.commission, rules.minCommission || 0);
  const equityBefore = equityAt(b, ym);
  const borrowedBefore = borrowedOf(b);
  const needBorrow = Math.max(0, total + fee - b.cash);
  if (borrowedBefore + needBorrow > equityBefore + 0.01)
    return `融资额度不足：券商最多借到你净资产的 1 倍（当前借款 ${borrowedBefore.toFixed(0)}，净资产 ${equityBefore.toFixed(0)}）`;
  b.cash -= total + fee - needBorrow; // 现金不够的部分由借款支付（含手续费）
  if (b.cash < 0) { b.borrowed = borrowedBefore + needBorrow - b.cash; b.cash = 0; }
  else b.borrowed = borrowedBefore + needBorrow;
  const shares = total / bar.c;
  const pos = b.positions.find((p) => p.ticker === ticker && p.mkt === mkt);
  if (pos) {
    pos.cost += total; pos.shares += shares;
    if (rules.t1) pos.locked += shares;
  } else {
    b.positions.push({ ticker, mkt, shares, locked: rules.t1 ? shares : 0, cost: total, heldSince: ym });
  }
  b.history.push({ ym, ticker, side: "buy", shares, price: bar.c, fee });
  if (b.history.length > 24) b.history = b.history.slice(-24);
  return null;
}
