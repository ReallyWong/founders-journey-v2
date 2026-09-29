// ─── v1.8 投资系统：证券账户面板（开户 / 银证转账 / 买卖 / 持仓 / v1.9 两融） ──
import { useMemo, useState, type Dispatch, type SetStateAction } from "react";
import type { GameState } from "@/game/types";
import {
  openBrokerageAccount, brokerTransfer, brokerBuy, brokerBuyMargin, brokerSell, ymOf, canOpenBrokerage,
} from "@/game/engine";
import { listTickers, getBar, getBars, equityAt, canTrade, maintenanceRatio, type Brokerage } from "@/game/market";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  state: GameState;
  setState: Dispatch<SetStateAction<GameState>>;
  onClose: () => void;
}

const ONE_LINERS: Record<string, string> = {
  SHCOMP: "沪市全部股票的平均数——中国经济的晴雨表",
  CSI300: "沪深最大的 300 家公司——A股的「国家队指数」",
  CHINEXT: "创业板：成长性高，波动也最大",
  MAOTAI: "A股股王。好公司也要扛得住腰斩",
  CATL: "动力电池龙头（2018 年上市）",
  QQQ: "纳斯达克100——美股科技成长代表",
  AAPL: "苹果：复利的化身，但 2008 年也曾深亏",
  MSFT: "微软：最长寿的科技巨头之一",
  TSLA: "特斯拉：波动之王，2011 年上市",
  GME: "游戏驿站：轧空行情教科书，回撤 -94%",
  // ── v2.0 大宗（A股商品ETF 代理）──
  GOLD: "黄金ETF：避险之王，对冲股市崩盘的传统答案",
  SOYBEAN: "豆粕ETF：农产品周期，2019 年才上市",
  OIL: "嘉实原油（QDII）：2020 年亲历负油价奇观",
  // ── v2.0 港股（T+0）──
  HSI: "恒生指数：港股大盘，2008 年曾一年腰斩",
  TENCENT: "腾讯控股：港股股王，2005 年上市至今的复利机器",
  ALIBABA: "阿里巴巴-SW（2019 年港股二次上市）",
  MEITUAN: "美团-W（2018 年上市）：平台经济的火箭与深坑",
};

// 近 12 个月走势缩略图（SVG polyline，窗口对齐当前行情年月）
function Sparkline({ mkt, ticker, ym }: { mkt: string; ticker: string; ym: string }) {
  const all = getBars(mkt, ticker);
  const i = all.findIndex((b) => b.m === ym);
  const bars = (i >= 0 ? all.slice(Math.max(0, i - 11), i + 1) : all.slice(-12));
  if (bars.length < 2) return null;
  const vals = bars.map((b) => b.c);
  const min = Math.min(...vals), max = Math.max(...vals);
  const up = vals[vals.length - 1] >= vals[0];
  const pts = vals.map((v, i) => `${(i / (vals.length - 1)) * 100},${30 - ((v - min) / (max - min || 1)) * 26}`).join(" ");
  return (
    <svg viewBox="0 0 100 32" className="w-24 h-8" preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke={up ? "#10b981" : "#f43f5e"} strokeWidth="2" />
    </svg>
  );
}

export default function BrokerPanel({ state, setState, onClose }: Props) {
  const [mkt, setMkt] = useState<"cn" | "hk" | "us">("cn");
  const [ticker, setTicker] = useState("CSI300");
  const [amount, setAmount] = useState("");
  const [transferAmt, setTransferAmt] = useState("");
  const b = state.brokerage;
  const ym = ymOf(state);

  const tickers = useMemo(() => listTickers(mkt), [mkt]);
  const curBar = getBar(mkt, ticker, ym);
  const equity = b ? equityAt(b, ym) : 0;
  const tier2Hint = b && b.unlockLevel < 2;

  const patch = (fn: (s: GameState) => GameState) => setState((prev) => fn(prev));

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 flex items-center justify-center p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <Card className="w-full max-w-lg bg-white border-slate-200 shadow-xl max-h-[85vh] overflow-y-auto">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-slate-900 flex items-center justify-between">
              <span>📈 证券账户 <span className="text-xs font-normal text-slate-400">v1.8 历史沙盒 · 真实行情 · 教育模拟非投资建议</span></span>
              <button className="text-slate-400 hover:text-slate-600 text-sm" onClick={onClose}>✕</button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!b && (
              <div className="space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  公司经营步入正轨，你开始考虑让钱生钱。开户后可将「创始人分红」转入证券账户，
                  在<strong>真实历史行情</strong>的沙盒里交易（当前时间：{ym}）。
                  新手期只能买指数/ETF——先学会不亏，再学着赚。
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <Button className="bg-rose-600 hover:bg-rose-500" disabled={!canOpenBrokerage(state)}
                    onClick={() => { patch((s) => openBrokerageAccount(s, "cn")); }}>
                    🇨🇳 开 A股账户
                    <div className="text-[10px] font-normal opacity-80">含港股通+商品ETF · T+1（港股 T+0）· 印花税 0.05%</div>
                  </Button>
                  <Button className="bg-sky-600 hover:bg-sky-500" disabled={!canOpenBrokerage(state)}
                    onClick={() => { patch((s) => openBrokerageAccount(s, "us")); setMkt("us"); }}>
                    🇺🇸 开美股账户
                    <div className="text-[10px] font-normal opacity-80">T+0 · 无印花税 · 美元计价</div>
                  </Button>
                </div>
                {!canOpenBrokerage(state) && (
                  <p className="text-xs text-slate-400">开户条件：公司存活满 6 个月或完成过一轮融资。</p>
                )}
              </div>
            )}

            {b && (
              <>
                {/* 总览 */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    ["净资产", `${equity.toFixed(1)} 万`],
                    ["可用现金", `${b.cash.toFixed(1)} 万`],
                    ["累计已实现盈亏", `${b.realizedPnl >= 0 ? "+" : ""}${b.realizedPnl.toFixed(1)} 万`],
                  ].map(([l, v]) => (
                    <div key={l} className="rounded-lg bg-slate-50 border border-slate-200 px-2 py-2">
                      <div className="text-[10px] text-slate-400">{l}</div>
                      <div className={`text-sm font-bold ${String(v).startsWith("-") ? "text-rose-600" : "text-slate-800"}`}>{v}</div>
                    </div>
                  ))}
                </div>
                {/* v1.9 两融状态条 */}
                {(b.borrowed ?? 0) > 0.01 ? (
                  (() => {
                    const mr = maintenanceRatio(b as Brokerage, ym);
                    const pct = mr * 100;
                    const danger = pct < 130;
                    const critical = pct < 115;
                    return (
                      <div className={`rounded-lg border px-3 py-2 text-xs ${critical ? "border-rose-400 bg-rose-50 text-rose-700" : danger ? "border-amber-300 bg-amber-50 text-amber-700" : "border-slate-200 bg-slate-50 text-slate-600"}`}>
                        ⚡ 两融：借款 <b>{(b.borrowed ?? 0).toFixed(1)} 万</b>（年化 8%）｜维持担保比例 <b>{pct.toFixed(0)}%</b>
                        {critical ? " —— 🚨 低于强平线 115%，下月若不反弹将被强制平仓！" : danger ? " —— ⚠️ 低于预警线 130%，请追加保证金或减仓" : "（预警线 130% / 强平线 115%）"}
                      </div>
                    );
                  })()
                ) : b.unlockLevel >= 3 ? (
                  <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 px-3 py-1.5 text-[11px] text-indigo-600">
                    ⚡ 融资融券已开通：买入时勾选「融资」可向券商借钱（上限 = 净资产 1 倍，月息 ≈0.67%）。巴菲特看见会叹气，利弗莫尔看见会微笑。
                  </div>
                ) : null}

                {/* 银证转账 */}
                <div className="flex items-center gap-2">
                  <input
                    type="number" min={0} placeholder="转账金额（万）" value={transferAmt}
                    onChange={(e) => setTransferAmt(e.target.value)}
                    className="w-36 rounded border border-slate-300 px-2 py-1 text-sm"
                  />
                  <Button size="sm" variant="outline" className="border-slate-300"
                    onClick={() => { patch((s) => brokerTransfer(s, parseFloat(transferAmt) || 0)); setTransferAmt(""); }}>
                    🏦 公司 → 证券（分红）
                  </Button>
                  <span className="text-[10px] text-slate-400">单向：不可挪用回公司</span>
                </div>

                {/* 市场切换 */}
                <div className="flex gap-2 flex-wrap">
                  {(["cn", "hk", "us"] as const).map((m) => (
                    <button key={m} onClick={() => { setMkt(m); setTicker(m === "cn" ? "CSI300" : m === "hk" ? "HSI" : "QQQ"); }}
                      className={`rounded-full px-3 py-1 text-xs font-medium border ${mkt === m ? "bg-indigo-500 text-white border-indigo-500" : "bg-white text-slate-600 border-slate-300"}`}>
                      {m === "cn" ? "🇨🇳 A股·大宗" : m === "hk" ? "🇭🇰 港股·T+0" : "🇺🇸 美股"}
                    </button>
                  ))}
                  <span className="ml-auto text-xs text-slate-400 self-center">
                    {tier2Hint ? `🔒 新手期（指数/ETF）· 交易满 3 个月解锁个股` : "✅ 个股已解锁"}
                  </span>
                </div>

                {/* 交易表单 */}
                <div className="rounded-lg border border-slate-200 p-3 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <select value={ticker} onChange={(e) => setTicker(e.target.value)}
                      className="rounded border border-slate-300 px-2 py-1 text-sm bg-white">
                      {tickers.map((t) => {
                        const locked = canTrade(b as Brokerage, mkt, t.id) !== null;
                        return <option key={t.id} value={t.id}>{locked ? "🔒 " : ""}{t.name}（{t.id}）</option>;
                      })}
                    </select>
                    {curBar ? (
                      <span className="text-xs text-slate-500">本月收盘 <b className="text-slate-800">{curBar.c}</b> {getRulesSafe(mkt).currency}</span>
                    ) : (
                      <span className="text-xs text-amber-600">行情沙盒已走到尽头（2005–2024），可持有/卖出，不可开新仓</span>
                    )}
                    <Sparkline mkt={mkt} ticker={ticker} ym={ym} />
                  </div>
                  {ONE_LINERS[ticker] && <p className="text-[11px] text-slate-400">{ONE_LINERS[ticker]}</p>}
                  <div className="flex items-center gap-2">
                    <input type="number" min={0} placeholder="买入金额（万）" value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-36 rounded border border-slate-300 px-2 py-1 text-sm" />
                    <Button size="sm" className="bg-rose-600 hover:bg-rose-500"
                      onClick={() => { patch((s) => brokerBuy(s, mkt, ticker, parseFloat(amount) || 0)); setAmount(""); }}>
                      买入
                    </Button>
                    {b.unlockLevel >= 3 && (
                      <Button size="sm" variant="outline"
                        className="border-indigo-300 text-indigo-700 hover:bg-indigo-50"
                        title="向券商借钱买入：现金不足部分自动借款（上限 = 净资产 1 倍），月息 ≈0.67%，维持担保比例 <115% 将被强平"
                        onClick={() => { patch((s) => brokerBuyMargin(s, mkt, ticker, parseFloat(amount) || 0)); setAmount(""); }}>
                        ⚡ 融资买入
                      </Button>
                    )}
                  </div>
                </div>

                {/* 持仓 */}
                {b.positions.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-500">持仓（本月收盘价估值）</div>
                    {b.positions.filter((p) => p.mkt === mkt || true).map((p) => {
                      const bar = getBar(p.mkt, p.ticker, ym);
                      const price = bar ? bar.c : 0;
                      const pnl = price * p.shares - p.cost;
                      const pnlPct = p.cost > 0 ? (pnl / p.cost) * 100 : 0;
                      const name = listTickers(p.mkt).find((t) => t.id === p.ticker)?.name ?? p.ticker;
                      return (
                        <div key={p.mkt + p.ticker} className="flex items-center gap-2 text-xs rounded border border-slate-200 px-2 py-1.5">
                          <span className="font-medium text-slate-700">{p.mkt === "cn" ? "🇨🇳" : "🇺🇸"} {name}</span>
                          <span className="text-slate-400">{p.shares.toFixed(0)} 股{p.locked > 0.01 ? `（🔒T+1 ${p.locked.toFixed(0)}）` : ""}</span>
                          <span className={pnl >= 0 ? "text-emerald-600" : "text-rose-600"}>
                            {pnl >= 0 ? "+" : ""}{pnl.toFixed(1)}万（{pnlPct >= 0 ? "+" : ""}{pnlPct.toFixed(0)}%）
                          </span>
                          <button className="ml-auto text-indigo-600 hover:underline disabled:opacity-40"
                            disabled={p.shares - p.locked <= 0.01}
                            onClick={() => patch((s) => brokerSell(s, p.mkt, p.ticker, p.shares - p.locked))}>
                            清仓
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function getRulesSafe(mkt: string) {
  return mkt === "cn"
    ? { currency: "¥" }
    : { currency: "$" };
}
