import { useRef, useState } from "react";
import { REGIONS, INDUSTRIES, NAMES, ENDINGS, COFOUNDERS, SCENARIOS } from "@/game/data";
import { getUnlocks, isScenarioUnlocked, getScenarioGrade, unlockEverything } from "@/game/save";
import { loadCareer } from "@/game/telemetry";
import { loadGame } from "@/game/save";
import type { Gender, Difficulty } from "@/game/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StartOptions {
  difficulty: Difficulty;
  cofounderId?: string;
  scenarioId?: string;
  tournamentCode?: string;
  deepInvestors?: boolean;
  marketLinkage?: boolean;
}

interface Props {
  onStart: (name: string, gender: Gender, regionId: string, industryId: string, opts: StartOptions) => void;
  onContinue?: () => void;
}

const GRADE_RANK: Record<string, number> = { S: 7, A: 6, B: 5, C: 4, D: 3, F: 2 };

const DIFFICULTIES: { id: Difficulty; name: string; desc: string }[] = [
  { id: "easy", name: "🎓 教学", desc: "初始资金 ×1.5，危机事件大幅减少。第一次创业的温柔世界。" },
  { id: "standard", name: "⚖️ 标准", desc: "设计者的预期体验。危机与机会并存，九死一生但值得。" },
  { id: "realism", name: "🔥 真实模式", desc: "危机更多、融资更难、不自动存档（单次生命，不能读档）。这就是真实创业者的世界。" },
  { id: "hell", name: "🇨🇳 地狱 · 中国特别版", desc: "真实模式规则之上：危机触发率 65%，独有系统性风险事件（监管、税务、稽查、账户冻结）。在这里活下来的创业者，配得上任何掌声。" },
];

export default function CharacterCreation({ onStart, onContinue }: Props) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<Gender>("male");
  const [regionId, setRegionId] = useState(REGIONS[0].id);
  const [industryId, setIndustryId] = useState(INDUSTRIES[0].id);
  const [difficulty, setDifficulty] = useState<Difficulty>("standard");
  const [cofounderId, setCofounderId] = useState<string>("");
  const [scenarioId, setScenarioId] = useState<string>("");
  const [tourney, setTourney] = useState<string>("");
  const [deepInv, setDeepInv] = useState<boolean>(false);
  const [linkage, setLinkage] = useState<boolean>(true);
  const [showAll, setShowAll] = useState(false);
  const [devMode, setDevMode] = useState(false);
  const devClicks = useRef<number[]>([]);
  const [angelUnlocked] = useState(() => {
    try { return localStorage.getItem("fj_angel_unlocked") === "1"; } catch { return false; }
  });
  const [career] = useState(() => loadCareer());
  const careerIndustries = Object.entries(career.industries).sort((a, b) => b[1] - a[1]);
  const favIndustry = careerIndustries[0]?.[0];
  const favRegion = Object.entries(career.regions).sort((a, b) => b[1] - a[1])[0]?.[0];
  // 成就解锁：本地生涯 + 旧版通关计数合并计算
  const totalRuns = Math.max(career.runs, (() => { try { return parseInt(localStorage.getItem("fj_completions") || "0", 10); } catch { return 0; } })());
  const regionUnlocked = (r: (typeof REGIONS)[number]): boolean => {
    if (!r.unlock) return true;
    if (r.unlock === "finish_any") return totalRuns >= 1;
    if (r.unlock === "grade_A") return (GRADE_RANK[career.bestGrade] ?? 0) >= GRADE_RANK.A;
    if (r.unlock === "runs5") return totalRuns >= 5;
    return true;
  };
  // v1.5：VC/PE 基金需达成 A 级以上结局解锁
  const vcpeUnlocked = (GRADE_RANK[career.bestGrade] ?? 0) >= GRADE_RANK.A;
  const industryUnlocked = (i: (typeof INDUSTRIES)[number]): boolean => {
    if (i.id === "vcpe") return vcpeUnlocked;
    return !(i.locked && !angelUnlocked);
  };
  const savedRun = onContinue ? loadGame() : null;

  const scenario = SCENARIOS.find((sc) => sc.id === scenarioId);
  // 剧本模式锁定出身与行业
  const effRegionId = scenario ? scenario.regionId : regionId;
  const effIndustryId = scenario ? scenario.industryId : industryId;
  const region = REGIONS.find((r) => r.id === effRegionId)!;
  const industry = INDUSTRIES.find((i) => i.id === effIndustryId)!;
  const startCash = scenario ? scenario.startCash : (industry.startCash ?? 15);
  const effCash = difficulty === "easy" ? Math.round(startCash * 1.5) : startCash;
  const cofounder = COFOUNDERS.find((c) => c.id === cofounderId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2 pt-4">
          <div className="text-5xl">🚀</div>
          <h1
            className="text-4xl font-black tracking-tight text-slate-900 select-none"
            title="连点 7 下试试"
            onClick={() => {
              // 🥚 开发者秘钥：3 秒内连点 7 下 → 解锁全部彩蛋（免肝版）
              const now = Date.now();
              devClicks.current = [...devClicks.current.filter((t) => now - t < 3000), now];
              if (devClicks.current.length >= 7) {
                devClicks.current = [];
                unlockEverything();
                setDevMode(true);
              }
            }}
          >创业人生</h1>
          <p className="text-slate-500">Founder's Journey · 一部可以玩的创业教科书</p>
          {devMode && (
            <p className="text-sm font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5 inline-block">
              🥚 开发者模式已开启：全部城市 / 行业 / 彩蛋剧本已解锁（含雷曼时刻、车库极客、刀尖起舞）
            </p>
          )}
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            从车库到敲钟，从融资到破产。你的每个决定都对应一个真实的商业案例 ——
            灵感来自《硅谷》剧集与无数真实创业史。
          </p>
        </div>

        {/* 角色 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-slate-800">① 你是谁？</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3 items-center">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="创始人姓名（可留空随机）"
                className="bg-white border-slate-300 text-slate-800 max-w-xs"
              />
              <Button
                variant="outline" size="sm"
                className="border-slate-300 text-slate-600"
                onClick={() => setName(gender === "female" ? NAMES.female[Math.floor(Math.random() * NAMES.female.length)] : NAMES.male[Math.floor(Math.random() * NAMES.male.length)])}
              >🎲 随机</Button>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setGender("male")}
                className={`flex-1 p-3 rounded-lg border transition-all ${gender === "male" ? "border-indigo-500 bg-indigo-50 font-semibold" : "border-slate-300 bg-white hover:border-slate-400"}`}
              >👨 男性</button>
              <button
                onClick={() => setGender("female")}
                className={`flex-1 p-3 rounded-lg border transition-all ${gender === "female" ? "border-pink-500 bg-pink-50 font-semibold" : "border-slate-300 bg-white hover:border-slate-400"}`}
              >👩 女性</button>
            </div>
          </CardContent>
        </Card>

        {/* 出生地 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-slate-800">② 从哪里出发？</CardTitle></CardHeader>
          <CardContent>
            <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 ${scenario ? "pointer-events-none opacity-50" : ""}`}>
              {REGIONS.map((r) => {
                const locked = !regionUnlocked(r);
                return (
                  <button
                    key={r.id}
                    disabled={locked}
                    onClick={() => setRegionId(r.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${locked ? "border-slate-200 bg-slate-50 opacity-70" : effRegionId === r.id ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-white hover:border-slate-400"}`}
                  >
                    <div className="font-semibold text-slate-800">{locked ? "🔒" : r.flag} {locked ? "？？？" : r.name}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">{locked ? (r.unlockHint ?? "成就解锁") : r.description}</div>
                  </button>
                );
              })}
            </div>
            {scenario && <p className="text-xs text-indigo-600 mt-2">🎬 剧本模式已锁定出身地：{region.name}（该剧本改编自真实历史事件）</p>}
            <button className="text-xs text-indigo-600 mt-3 hover:underline" onClick={() => setShowAll(!showAll)}>
              {showAll ? "收起详情 ▲" : "查看该地区利弊与投资生态 ▼"}
            </button>
            {showAll && (
              <div className="mt-3 p-3 rounded-lg bg-slate-50 border border-slate-200 text-sm space-y-2">
                <div className="text-slate-600">🌍 {region.investorScene}</div>
                <div className="grid sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <div className="text-emerald-600 font-semibold mb-1">优势</div>
                    {region.pros.map((p) => <div key={p} className="text-slate-600">+ {p}</div>)}
                  </div>
                  <div>
                    <div className="text-rose-600 font-semibold mb-1">挑战</div>
                    {region.cons.map((c) => <div key={c} className="text-slate-600">− {c}</div>)}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 行业 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-slate-800">③ 做什么生意？</CardTitle></CardHeader>
          <CardContent>
            <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 ${scenario ? "pointer-events-none opacity-50" : ""}`}>
              {INDUSTRIES.map((i) => {
                const locked = !industryUnlocked(i);
                const lockHint = i.id === "vcpe" ? "达成 A 级以上结局解锁" : "通关任意一局（不跑路）解锁";
                return (
                  <button
                    key={i.id}
                    disabled={locked}
                    onClick={() => setIndustryId(i.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${locked ? "border-slate-200 bg-slate-50 opacity-70" : effIndustryId === i.id ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-white hover:border-slate-400"}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{locked ? "🔒" : i.icon}</span>
                      {i.locked && !locked && <span className="text-[10px] font-bold text-amber-600 bg-amber-100 rounded px-1.5 py-0.5">已解锁</span>}
                    </div>
                    <div className="font-semibold text-sm mt-1 text-slate-800">{i.name}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-3">{locked ? lockHint : i.description}</div>
                    {!locked && i.mechanic && (
                      <div className="text-[11px] mt-1.5 text-indigo-700 bg-indigo-50 border border-indigo-100 rounded px-1.5 py-1 leading-snug">{i.mechanic}</div>
                    )}
                  </button>
                );
              })}
            </div>
            {scenario && <p className="text-xs text-indigo-600 mt-2">🎬 剧本模式已锁定行业：{industry.name}（{scenario.title}的固定设定）</p>}
          </CardContent>
        </Card>

        {/* 难度 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-slate-800">④ 用多高的真实度模拟？</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {DIFFICULTIES.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setDifficulty(d.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${difficulty === d.id ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-white hover:border-slate-400"}`}
                >
                  <div className="font-semibold text-slate-800 text-sm">{d.name}</div>
                  <div className="text-xs text-slate-500 mt-1 leading-snug">{d.desc}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 联合创始人 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-slate-800">⑤ 找合伙人吗？（可选）</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <button
                onClick={() => setCofounderId("")}
                className={`p-3 rounded-lg border text-left transition-all ${cofounderId === "" ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-white hover:border-slate-400"}`}
              >
                <div className="font-semibold text-slate-800 text-sm">🚶 独自创业</div>
                <div className="text-xs text-slate-500 mt-1 leading-snug">股权不用分，但所有的雷都得自己一个人扛。团队从 1 人起步。</div>
              </button>
              {COFOUNDERS.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCofounderId(c.id)}
                  className={`p-3 rounded-lg border text-left transition-all ${cofounderId === c.id ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-white hover:border-slate-400"}`}
                >
                  <div className="font-semibold text-slate-800 text-sm">{c.name} · {c.role}</div>
                  <div className="text-xs text-slate-500 mt-1 line-clamp-2">{c.desc}</div>
                  <div className="text-[11px] mt-1.5 text-emerald-700 bg-emerald-50 border border-emerald-100 rounded px-1.5 py-1 leading-snug">{c.bonus}</div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 剧本模式 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader><CardTitle className="text-lg text-slate-800">⑥ 剧本模式（可选）</CardTitle></CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setScenarioId("")}
                className={`p-3 rounded-lg border text-left transition-all ${scenarioId === "" ? "border-indigo-500 bg-indigo-50" : "border-slate-300 bg-white hover:border-slate-400"}`}
              >
                <div className="font-semibold text-slate-800 text-sm">🎲 标准模式</div>
                <div className="text-xs text-slate-500 mt-1 leading-snug">自由创业：自选出身、行业与合伙人，随机事件驱动的开放剧本。</div>
              </button>
              {SCENARIOS.map((sc) => {
                // v1.7ultra：隐藏彩蛋剧本的两种锁定形态——
                // ① 全图鉴解锁（雷曼时刻）② 二重彩蛋：指定剧本达成指定成绩后解锁（车库极客）
                let locked = false;
                let lockReason: "collection" | "grade" = "collection";
                let lockHint = "";
                if (sc.unlockScenarioId) {
                  const need = sc.unlockMinGrade ?? "S";
                  lockReason = "grade";
                  lockHint = sc.unlockHint ?? "";
                  locked = getScenarioGrade(sc.unlockScenarioId) !== need;
                } else if (sc.hidden) {
                  locked = !isScenarioUnlocked(REGIONS.length, INDUSTRIES.length);
                }
                if (locked) {
                  const p = getUnlocks();
                  return (
                    <div
                      key={sc.id}
                      className="p-3 rounded-lg border border-dashed border-slate-300 bg-gradient-to-br from-slate-50 to-slate-100 select-none"
                    >
                      <div className="font-semibold text-slate-400 text-sm">🥚 ？？？（隐藏剧本）</div>
                      <div className="text-xs text-slate-400 mt-1 leading-snug">
                        {lockReason === "grade" ? lockHint : "集齐全部图鉴后解锁的彩蛋——像《头号玩家》的第三把钥匙。"}
                      </div>
                      {lockReason === "collection" && (
                        <div className="text-[11px] mt-1.5 text-slate-500 bg-white/70 border border-slate-200 rounded px-1.5 py-1 leading-snug">
                          通关进度：城市 {p.regions.length}/{REGIONS.length} · 行业 {p.industries.length}/{INDUSTRIES.length}
                        </div>
                      )}
                    </div>
                  );
                }
                return (
                  <button
                    key={sc.id}
                    onClick={() => setScenarioId(sc.id)}
                    className={`p-3 rounded-lg border text-left transition-all ${scenarioId === sc.id ? "border-amber-500 bg-amber-50" : "border-slate-300 bg-white hover:border-slate-400"}`}
                  >
                    <div className="font-semibold text-slate-800 text-sm">{sc.hidden ? "🥚" : "🎬"} {sc.title}</div>
                    <div className="text-xs text-slate-500 mt-1 line-clamp-2">{sc.tagline}</div>
                    <div className="text-[11px] mt-1.5 text-amber-700 bg-amber-50 border border-amber-100 rounded px-1.5 py-1 leading-snug">{sc.endingHint}</div>
                    <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">{sc.realHistory}</div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 课堂比拼：输入比拼码，全班打同一局 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-slate-700">🏆 同局比拼（可选）</CardTitle>
            <p className="text-xs text-slate-500 mt-1">
              输入老师/朋友发的比拼码，所有玩家将使用<b>同一个随机种子</b>打同一局，通关后成绩自动上榜，24 小时后在年报页见分晓。留空则为普通单机局。
            </p>
          </CardHeader>
          <CardContent className="pb-4">
            <Input
              value={tourney}
              onChange={(ev) => setTourney(ev.target.value.trim().slice(0, 32))}
              placeholder="比拼码，例如 CLASS-2026-A 或任意文字"
              className="bg-slate-50 border-slate-300 text-slate-800 placeholder:text-slate-400"
            />
            {tourney && (
              <p className="text-xs text-indigo-600 mt-2">
                🎲 本局随机种子由「{tourney}」生成——同一个码，同一局人生。通关后记得把战报分享给对手。
              </p>
            )}
            <p className="text-xs text-slate-400 mt-2">
              📋 成绩榜（年报页）：<a className="text-indigo-500 underline" href="./board.html" target="_blank" rel="noreferrer">打开 board.html 查看比拼年报</a>（支持 ?seed=比拼码 直达）
            </p>
          </CardContent>
        </Card>

        {/* v1.7：深度机构模式 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="py-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={deepInv} onChange={(e) => setDeepInv(e.target.checked)} className="mt-1 w-4 h-4 accent-indigo-600" />
              <span>
                <span className="text-sm font-semibold text-slate-800">🏦 深度机构模式（推荐给老玩家）</span>
                <span className="block text-xs text-slate-500 mt-1 leading-snug">
                  开启后，投资机构拥有记忆：拒绝过你的机构不会再出现，投过你的机构有 50% 概率带着 1.25 倍支票回来跟投（胜率 +12%）。融资从「抽卡」变成「经营关系」。
                </span>
              </span>
            </label>
          </CardContent>
        </Card>

        {/* v2.0：市场↔经营联动 */}
        <Card className="bg-white border-slate-200 shadow-sm">
          <CardContent className="py-4">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={linkage} onChange={(e) => setLinkage(e.target.checked)} className="mt-1 w-4 h-4 accent-indigo-600" />
              <span>
                <span className="text-sm font-semibold text-slate-800">🔗 市场↔经营联动（默认开启）</span>
                <span className="block text-xs text-slate-500 mt-1 leading-snug">
                  真实历史股灾月（2008/2015/2020）会自动成为本局的资本寒冬窗口；持仓暴跌时恐慌会蔓延到融资谈判。关闭后回归纯创业节奏，与 v1.9 行为一致。
                </span>
              </span>
            </label>
          </CardContent>
        </Card>

        {savedRun && onContinue && (
          <Button
            className="w-full text-lg py-6 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500"
            onClick={onContinue}
          >
            📂 继续上次的创业（{savedRun.region.city} · {savedRun.industry.name} · 第 {savedRun.month + 1} 个月 · 现金 {savedRun.region.currency}{Math.round(savedRun.cash)} 万）
          </Button>
        )}

        <Button
          className="w-full text-lg py-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500"
          onClick={() => onStart(name, gender, effRegionId, effIndustryId, { difficulty, cofounderId: cofounderId || undefined, scenarioId: scenarioId || undefined, tournamentCode: tourney || undefined, deepInvestors: deepInv || undefined, marketLinkage: linkage })}
        >
          🚀 开始创业（初始资金 {region.currency}{effCash} 万 · {industry.name} · {region.city}{scenario ? ` · 🎬 ${scenario.title}` : ""}{cofounder ? ` · 🤝 ${cofounder.name}` : ""}{difficulty !== "standard" ? ` · ${difficulty === "easy" ? "🎓 教学" : "🔥 真实模式"}` : ""}）
        </Button>

        {/* 生涯统计 · 结局图鉴 */}
        {career.runs > 0 && (
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="py-3">
              <CardTitle className="text-sm text-slate-700">
                📖 你的创业生涯：{career.runs} 次创业 ｜ 最佳评级 {career.bestGrade}
                {favIndustry && ` ｜ 最常赛道 ${INDUSTRIES.find((i) => i.id === favIndustry)?.icon ?? ""}${INDUSTRIES.find((i) => i.id === favIndustry)?.name ?? ""}`}
                {favRegion && ` ｜ 常驻 ${REGIONS.find((r) => r.id === favRegion)?.city ?? ""}`}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="flex flex-wrap gap-2">
                {Object.values(ENDINGS).map((e) => {
                  const n = career.endings[e.id] ?? 0;
                  return (
                    <span key={e.id} title={n > 0 ? `达成 ${n} 次` : "尚未达成"}
                      className={`text-xs rounded-full px-2.5 py-1 border ${n > 0 ? "bg-amber-50 border-amber-300 text-amber-800" : "bg-slate-50 border-slate-200 text-slate-400"}`}>
                      {n > 0 ? e.title : `❓ ${e.grade} 级结局`}
                      {n > 1 && ` ×${n}`}
                    </span>
                  );
                })}
              </div>
              <p className="text-[11px] text-slate-400 mt-2">收集全部 11 种结局（含剧本模式专属结局），成为真正的连续创业者。（匿名通关数据用于改善游戏平衡）</p>
            </CardContent>
          </Card>
        )}

        <p className="text-center text-xs text-slate-400 pb-6">
          提示：55+ 真实创业场景改编事件 · 12 大行业各有专属流程与危机 · 剧本模式重现 2010 千团大战与 2020 口罩风云 · 每个选择附带创业课讲解 · 支持 1x/2x/4x 时间加速
        </p>
      </div>
    </div>
  );
}
