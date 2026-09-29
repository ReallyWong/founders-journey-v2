import { useEffect, useMemo, useRef, useState, type Dispatch, type SetStateAction } from "react";
import type { GameState, Choice, PendingDecision } from "@/game/types";
import { INTERVIEW_QUESTIONS, STAGE_NAMES } from "@/game/data";
import {
  advanceMonth, applyChoice, setBudgetAbs, currentRunway, fmtMoney, monthlyBurn,
  completeInterview, resolvePitch, resolveHire, resolveEndgame, shutdownCompany,
  setFounderAction, FOUNDER_ACTIONS, dueDiligence,
} from "@/game/engine";
import { saveGame } from "@/game/save";
import BrokerPanel from "@/components/BrokerPanel";
import { canOpenBrokerage } from "@/game/engine";
import { equityAt as brokerEquity } from "@/game/market";
import { ymOf } from "@/game/engine";
import { playSfx, toggleBgm, isBgmOn } from "@/game/sfx";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Props {
  state: GameState;
  setState: Dispatch<SetStateAction<GameState>>;
}

interface LessonView {
  resultText: string;
  lessonTitle?: string;
  lesson?: string;
}

const SPEED_INTERVAL: Record<number, number> = { 1: 2600, 2: 1400, 3: 700 };

export default function GameScreen({ state, setState }: Props) {
  const [lesson, setLesson] = useState<LessonView | null>(null);
  const [resolved, setResolved] = useState<PendingDecision | null>(null);
  const [confirmShutdown, setConfirmShutdown] = useState(false);
  const [showBroker, setShowBroker] = useState(false);
  const [pickedQs, setPickedQs] = useState<string[]>([]);
  // P0-3：已尽调揭示的 hidden 选项（key = 决策标识:选项id），仅本次决策有效
  const [revealed, setRevealed] = useState<string[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  // 时间加速循环
  useEffect(() => {
    if (state.speed === 0 || !state.alive || state.pendingDecision) return;
    const t = setInterval(() => {
      setState((prev: GameState) => advanceMonth(prev));
    }, SPEED_INTERVAL[state.speed]);
    return () => clearInterval(t);
  }, [state.speed, state.alive, state.pendingDecision, setState]);

  // 日志自动滚动
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [state.log.length]);

  // 自动存档：任何变化时保存进行中的对局（真实模式为单次生命，不存档）
  useEffect(() => {
    if (state.alive && state.difficulty !== "realism" && state.difficulty !== "hell") saveGame(state);
  }, [state]);

  // 决策出现时清空临时状态
  useEffect(() => {
    if (state.pendingDecision) {
      setLesson(null);
      setPickedQs([]);
    }
  }, [state.pendingDecision?.title]);

  const runway = currentRunway(state);
  const burn = monthlyBurn(state);
  const stageName = STAGE_NAMES[state.stage];
  const isInterview = state.pendingDecision?.kind === "interview";

  const qScore = useMemo(
    () => pickedQs.reduce((a, id) => a + (INTERVIEW_QUESTIONS.find((q) => q.id === id)?.score ?? 0), 0),
    [pickedQs]
  );

  const handleChoice = (c: Choice) => {
    setResolved(state.pendingDecision);
    playSfx("click");
    if (state.pendingDecision?.kind === "pitch" && state.pendingDecision.investor) {
      const n = resolvePitch(state, c.id, state.pendingDecision.investor, state.pendingDecision.round);
      setState(n);
      if (c.id === "accept" || c.id === "negotiate-up") {
        playSfx("cash");
        setLesson({ resultText: `🎉 融资成功！${n.raised[n.raised.length - 1]?.investor} 打款到账。`, lessonTitle: "创业课 · 交割才是终点", lesson: "TS 签署到钱到账之间隔着尽调、协议谈判、打款三个鬼门关。职业选手在交割完成前从不对外宣布「融资成功」。这一课，你记下了。" });
      } else {
        setLesson({ resultText: c.resultText || state.pendingDecision.scene, lessonTitle: c.lessonTitle, lesson: c.lesson });
      }
      return;
    }
    if (state.pendingDecision?.kind === "hire" && state.pendingDecision.candidates) {
      setState(resolveHire(state, c.id, state.pendingDecision.candidates));
      setLesson(null);
      return;
    }
    if (state.pendingDecision?.kind === "ipo" || state.pendingDecision?.kind === "acquire") {
      const n = resolveEndgame(state, c.id);
      setState(n);
      if (c.id === "hold") {
        setLesson({ resultText: c.resultText, lessonTitle: "创业课 · 延迟满足", lesson: "拒绝提前退出需要极大的定力。亚马逊 1997 年上市前拒绝了无数收购要约，扎克伯格拒绝雅虎 10 亿美元。时间是好公司最好的朋友。" });
      } else setLesson(null);
      return;
    }
    const n = applyChoice(state, c);
    setState(n);
    if ((c.effects.cash ?? 0) >= 20) playSfx("cash");
    setLesson({ resultText: c.resultText, lessonTitle: c.lessonTitle, lesson: c.lesson });
    setRevealed([]); // 决策结束即失效
  };

  // P0-3：效果摘要（普通选项明牌显示；hidden 选项未揭示前显示 ？？？）
  const effectSummary = (c: Choice): string => {
    const e = c.effects;
    const parts: string[] = [];
    if (e.cash) parts.push(`现金${e.cash > 0 ? "+" : ""}${e.cash}`);
    if (e.cashMult && e.cashMult !== 1) parts.push(`现金×${e.cashMult}`);
    if (e.mrrPct) parts.push(`MRR${e.mrrPct > 0 ? "+" : ""}${e.mrrPct}%`);
    if (e.usersPct) parts.push(`用户${e.usersPct > 0 ? "+" : ""}${e.usersPct}%`);
    if (e.valuationPct) parts.push(`估值${e.valuationPct > 0 ? "+" : ""}${e.valuationPct}%`);
    if (e.morale) parts.push(`士气${e.morale > 0 ? "+" : ""}${e.morale}`);
    if (e.health) parts.push(`健康${e.health > 0 ? "+" : ""}${e.health}`);
    if (e.reputation) parts.push(`口碑${e.reputation > 0 ? "+" : ""}${e.reputation}`);
    if (e.product) parts.push(`产品${e.product > 0 ? "+" : ""}${e.product}`);
    if (e.awareness) parts.push(`知名度${e.awareness > 0 ? "+" : ""}${e.awareness}`);
    if (e.team) parts.push(`团队${e.team > 0 ? "+" : ""}${e.team}`);
    if (e.loan) parts.push(e.loan > 0 ? `举债+${e.loan}` : `减债${e.loan}`);
    if (e.debt) parts.push(e.debt > 0 ? `负债+${e.debt}` : `减债${e.debt}`);
    if (e.months) parts.push(`时间+${e.months}月`);
    return parts.join(" · ");
  };

  const handleInterviewSubmit = () => {
    if (pickedQs.length !== 3) return;
    setResolved(state.pendingDecision);
    const n = completeInterview(state, qScore);
    setState(n);
    setLesson({
      resultText: `访谈结束，你带着 ${qScore}/9 分的洞察回到工作室。`,
      lessonTitle: "创业课 · The Mom Test 复盘",
      lesson:
        qScore >= 7
          ? "你问的全是行为类问题：真实 workaround、量化损失、转介绍。这是高手访谈——你得到的是证据，不是恭维。Stripe 的预售、Dropbox 的候补名单，都是这么验证出来的。"
          : qScore >= 4
            ? "你问到了一些真实痛点，但也混进了「你觉得酷吗」这类诱导性问题。记住：用户会出于礼貌欺骗你，不会出于礼貌付钱。"
            : "大部分问题都在问用户「你喜不喜欢我的想法」——得到的只有谎言和恭维。Rob Fitzpatrick《The Mom Test》：谈论他们的生活，而不是你的方案。",
    });
  };

  const stat = (label: string, value: string, danger = false, good = false) => (
    <div className="rounded-lg bg-white border border-slate-200 shadow-sm px-3 py-2 min-w-[88px]">
      <div className="text-[10px] uppercase tracking-wider text-slate-400">{label}</div>
      <div className={`text-sm font-bold ${danger ? "text-rose-600" : good ? "text-emerald-600" : "text-slate-800"}`}>{value}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 text-slate-800 p-3 md:p-6">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* 顶栏 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xl font-black text-slate-900">
              {state.name} <span className="text-slate-500 font-normal text-sm">· {state.region.flag} {state.region.city} · {state.industry.icon} {state.industry.name}</span>
            </div>
            <div className="text-sm text-slate-500 flex flex-wrap items-center gap-x-2 gap-y-1">
              <span>{state.year} 年 {state.season}（第 {state.month + 1} 个月） · <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">{stageName}</Badge></span>
              {state.difficulty === "easy" && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">🎓 教学</Badge>}
              {(state.difficulty === "realism" || state.difficulty === "hell") && <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">🔥 真实模式 · 单次生命</Badge>}
              {state.cofounder && <Badge className="bg-sky-100 text-sky-700 hover:bg-sky-100">🤝 {state.cofounder.name} · {state.cofounder.role}</Badge>}
              {state.scenario && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">🎬 剧本模式</Badge>}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(() => {
              const eligible = state.brokerage || canOpenBrokerage(state);
              return (
                <Button
                  size="sm" variant="outline"
                  className={state.brokerage ? "border-emerald-300 text-emerald-700 hover:bg-emerald-50" : eligible ? "border-amber-300 text-amber-700 hover:bg-amber-50" : "border-slate-200 text-slate-300"}
                  disabled={!!state.pendingDecision || !eligible}
                  title={eligible ? undefined : "公司存活满 6 个月或完成任意一轮融资后，可开立个人证券账户"}
                  onClick={() => setShowBroker(true)}
                >{state.brokerage ? `📈 证券 ${fmtMoney(state, brokerEquity(state.brokerage, ymOf(state)))}` : "🏦 券商开户"}</Button>
              );
            })()}
            <Button
              size="sm" variant="outline"
              className="border-slate-300 text-slate-600"
              onClick={() => { toggleBgm(); setState({ ...state }); }}
            >{isBgmOn() ? "🔊 BGM 开" : "🔇 BGM 关"}</Button>
            <span className="text-xs text-slate-500 mr-1">时间加速</span>
            {([0, 1, 2, 3] as const).map((sp) => (
              <Button
                key={sp}
                size="sm"
                variant={state.speed === sp ? "default" : "outline"}
                className={state.speed === sp ? "bg-indigo-500 hover:bg-indigo-400" : "border-slate-300 text-slate-600"}
                disabled={!!state.pendingDecision}
                onClick={() => setState({ ...state, speed: state.speed === sp ? 0 : sp })}
              >
                {sp === 0 ? "⏸" : sp === 1 ? "▶ 1x" : sp === 2 ? "⏩ 2x" : "⏩⏩ 4x"}
              </Button>
            ))}
            <Button
              size="sm" variant="outline" className="border-slate-300 text-slate-600"
              disabled={!!state.pendingDecision}
              onClick={() => setState(advanceMonth(state))}
            >下一月 ⏭</Button>
          </div>
        </div>

        {/* 核心指标 */}
        <div className="flex flex-wrap gap-2">
          {stat("现金", fmtMoney(state, state.cash), state.cash < burn * 2)}
          {stat("现金跑道", runway > 99 ? "99+ 月" : `${runway.toFixed(1)} 月`, runway < 4)}
          {stat("估值", fmtMoney(state, state.valuation))}
          {stat("月营收 MRR", fmtMoney(state, state.mrr), false, state.mrr > 10)}
          {stat("用户", state.users.toLocaleString())}
          {stat("产品", `${Math.round(state.product)}%`)}
          {stat("团队", `${state.team} 人`)}
          {stat("总债务", fmtMoney(state, state.debt + (state.loan ?? 0)), state.debt + (state.loan ?? 0) > 60)}{state.loan ? ` ⚠️其中高利贷 ${fmtMoney(state, state.loan)}` : ""}{state.debt + (state.loan ?? 0) > 90 ? " 🚨濒临崩盘" : ""}
          {state.brokerage && stat("个人净资产", fmtMoney(state, state.personalWealth ?? 0), false, (state.personalWealth ?? 0) > 500)}
        </div>

        {/* P0-2 创始人行动点：每月四选一亲自压阵（月初重置，手动模式强制重选） */}
        <div className="rounded-lg border border-indigo-200 bg-indigo-50/60 px-3 py-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-indigo-700">
              🎯 创始人本月行动
              {!state.founderAction && state.speed < 2 && <span className="ml-1 text-rose-600 font-normal">（尚未安排——不选的领域会自己长出问题）</span>}
              {state.speed >= 2 && <span className="ml-1 text-slate-500 font-normal">（自动跑图：续用上月选择）</span>}
            </span>
            {FOUNDER_ACTIONS.map((a) => (
              <button
                key={a.id}
                type="button"
                title={a.desc}
                disabled={!!state.pendingDecision}
                onClick={() => setState(setFounderAction(state, a.id))}
                className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
                  state.founderAction === a.id
                    ? "bg-indigo-500 text-white border-indigo-500"
                    : "bg-white text-slate-600 border-slate-300 hover:border-indigo-400 hover:text-indigo-600"
                } ${state.pendingDecision ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {a.icon} {a.label}
              </button>
            ))}
          </div>
        </div>

        {/* 状态条 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "团队士气", v: state.morale, color: "bg-emerald-500" },
            { label: "创始人健康", v: state.health, color: "bg-sky-500" },
            { label: "市场口碑", v: (state.reputation + 100) / 2, raw: state.reputation, color: "bg-amber-500" },
            { label: "产品完成度", v: state.product, color: "bg-purple-500" },
            { label: "📣 知名度", v: state.awareness, color: "bg-pink-500" },
            { label: "🤝 渠道可及", v: state.accessibility, color: "bg-indigo-500" },
          ].map((b) => (
            <div key={b.label} className="rounded-lg bg-white border border-slate-200 shadow-sm px-3 py-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-500">{b.label}</span>
                <span className="text-slate-700 font-medium">{b.raw !== undefined ? `${b.raw > 0 ? "+" : ""}${Math.round(b.raw)}` : Math.round(b.v)}</span>
              </div>
              <Progress value={b.v} className="h-2 bg-slate-200" />
            </div>
          ))}
        </div>

        {/* 预算分配 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-slate-700">月度预算分配（总和 100%）</CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              🔧 研发 → 产品完成度（MVP 与增长期生效）｜ 📣 投放 → 知名度：每月自动漏水 10%，停投就会被市场遗忘 ｜ 🤝 销售 → 渠道可及性（漏水较慢）+ 营收转化效率。新客 = 知名度 × 渠道 × 产品力
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-x-6 gap-y-3">
            {([
              ["rd", "🔧 研发迭代", "#8b5cf6"],
              ["marketing", "📣 市场投放", "#f59e0b"],
              ["sales", "🤝 销售商务", "#0ea5e9"],
            ] as const).map(([key, label, color]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-xs text-slate-500 w-20">{label}</span>
                <input
                  type="range" min={0} max={100} step={5}
                  value={state.budget[key]}
                  disabled={!!state.pendingDecision}
                  onChange={(e) => setState((prev) => setBudgetAbs(prev, key, parseInt(e.target.value, 10)))}
                  className="w-36 h-2 cursor-pointer disabled:opacity-40"
                  style={{ accentColor: color }}
                />
                <span className="text-xs text-slate-700 w-9">{state.budget[key]}%</span>
              </div>
            ))}
            <div className="ml-auto text-xs text-slate-500 self-center">
              月净消耗 ≈ {fmtMoney(state, burn - state.mrr)}（烧 {fmtMoney(state, burn)} / 收 {fmtMoney(state, state.mrr)}）
            </div>
          </CardContent>
        </Card>

        {/* 融资历史 + 投资组合 + 危险操作 */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {state.raised.length > 0 && (
            <span className="text-slate-500">
              融资历程：{state.raised.map((r) => `${r.round} ${fmtMoney(state, r.amount)}(-${r.dilution}%)`).join(" · ")}
            </span>
          )}
          {(state.portfolio?.length ?? 0) > 0 && (
            <span className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-500">💼 投资组合（{state.portfolio!.length}）：</span>
              {state.portfolio!.map((p, i) => (
                <Badge key={i} className="bg-violet-100 text-violet-700 hover:bg-violet-100">{p}</Badge>
              ))}
            </span>
          )}
          <div className="ml-auto">
            {confirmShutdown ? (
              <span className="flex items-center gap-2">
                <span className="text-rose-600">确定关停公司？{state.debt > 30 ? "（债务未清，将走向清算）" : ""}</span>
                <Button size="sm" variant="destructive" onClick={() => setState(shutdownCompany(state))}>确认</Button>
                <Button size="sm" variant="outline" className="border-slate-300 text-slate-600" onClick={() => setConfirmShutdown(false)}>取消</Button>
              </span>
            ) : (
              <Button size="sm" variant="outline" className="border-rose-300 text-rose-600 hover:bg-rose-50"
                onClick={() => setConfirmShutdown(true)}>🕯️ 主动关停</Button>
            )}
          </div>
        </div>

        {/* 日志 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="py-3"><CardTitle className="text-sm text-slate-700">📜 创业编年史</CardTitle></CardHeader>
          <CardContent>
            <ScrollArea className="h-56 pr-4">
              <div ref={logRef} className="space-y-1.5 text-sm">
                {state.log.map((l, i) => (
                  <div key={i} className={
                    l.type === "bad" ? "text-rose-700" :
                    l.type === "good" ? "text-emerald-700" :
                    l.type === "money" ? "text-amber-700" :
                    l.type === "system" ? "text-indigo-700 font-medium" : "text-slate-600"
                  }>
                    <span className="text-slate-400 text-xs mr-2">[{l.month + 1}月]</span>{l.text}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* ── 决策弹窗 ── */}
      {state.pendingDecision && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl bg-white border-slate-200 shadow-xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="text-xl text-slate-900">{state.pendingDecision.title}</CardTitle>
              <p className="text-sm text-slate-600 whitespace-pre-line leading-relaxed">{state.pendingDecision.scene}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              {!lesson && isInterview && (
                <div className="space-y-3">
                  <div className="text-xs text-slate-500">从下面选出你要认真准备的 3 个访谈问题（已选 {pickedQs.length}/3 · 预期洞察强度 {qScore}/9）：</div>
                  <div className="space-y-2">
                    {INTERVIEW_QUESTIONS.map((q) => {
                      const picked = pickedQs.includes(q.id);
                      return (
                        <button
                          key={q.id}
                          disabled={!picked && pickedQs.length >= 3}
                          onClick={() => setPickedQs(picked ? pickedQs.filter((x) => x !== q.id) : [...pickedQs, q.id])}
                          className={`w-full text-left p-3 rounded-lg border text-sm transition-all disabled:opacity-40 ${
                            picked ? "border-indigo-500 bg-indigo-50" : "border-slate-200 bg-white hover:border-slate-400"
                          }`}
                        >
                          {picked && "✅ "}{q.text}
                        </button>
                      );
                    })}
                  </div>
                  <Button className="w-full bg-indigo-500 hover:bg-indigo-400" disabled={pickedQs.length !== 3} onClick={handleInterviewSubmit}>
                    开始访谈 →
                  </Button>
                </div>
              )}

              {!lesson && !isInterview && (
                <div className="space-y-2">
                  {state.pendingDecision.choices.map((c) => {
                    const decKey = `${state.pendingDecision!.eventId ?? state.pendingDecision!.title}:${c.id}`;
                    const isRevealed = revealed.includes(decKey);
                    return (
                      <div key={c.id} className="w-full text-left p-3.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-all text-sm leading-relaxed text-slate-700">
                        <button className="w-full text-left" onClick={() => handleChoice(c)}>
                          {c.text}
                        </button>
                        {/* P0-3：普通选项明牌效果；hidden 选项需尽调揭示 */}
                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          {c.hidden && !isRevealed ? (
                            <>
                              <span className="text-xs text-slate-400">🎲 效果未知（传闻：可能伤现金，也可能是机会）</span>
                              <button
                                type="button"
                                disabled={state.cash < 3}
                                title={state.cash < 3 ? "现金不足 3 万——穷人没有信息特权" : "花 3 万揭示该选项的真实效果"}
                                onClick={() => {
                                  setState((prev) => dueDiligence(prev));
                                  setRevealed((r) => [...r, decKey]);
                                }}
                                className="text-xs rounded-full border border-amber-300 bg-amber-50 text-amber-700 px-2.5 py-0.5 hover:bg-amber-100 disabled:opacity-40 disabled:cursor-not-allowed"
                              >
                                🕵️ 尽调（3 万）
                              </button>
                            </>
                          ) : (
                            effectSummary(c) && <span className="text-xs text-slate-500">{effectSummary(c)}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {lesson && (
                <div className="space-y-3">
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{lesson.resultText}</p>
                  {lesson.lesson && (
                    <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
                      <div className="text-amber-800 font-semibold text-sm mb-1">📖 {lesson.lessonTitle ?? "创业课"}</div>
                      <p className="text-sm text-amber-900/80 leading-relaxed">{lesson.lesson}</p>
                    </div>
                  )}
                  <Button
                    className="w-full bg-indigo-500 hover:bg-indigo-400"
                    onClick={() => {
                      // 只关闭产生本课程的那个决策；若期间引擎已排入新决策（如访谈/招聘），予以保留
                      setState((prev) => ({ ...prev, pendingDecision: prev.pendingDecision === resolved ? null : prev.pendingDecision }));
                      setLesson(null);
                    }}
                  >
                    继续 ➜
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      {showBroker && <BrokerPanel state={state} setState={setState} onClose={() => setShowBroker(false)} />}
    </div>
  );
}
