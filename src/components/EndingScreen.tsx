import { useEffect, useRef, useState } from "react";
import type { GameState } from "@/game/types";
import { playSfx } from "@/game/sfx";
import { recordWin, persistAchievements } from "@/game/save";
import { fmtMoney, investmentEndgame, ACHIEVEMENTS } from "@/game/engine";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  state: GameState;
  onRestart: () => void;
}

const GRADE_STYLE: Record<string, string> = {
  S: "text-amber-500 border-amber-500 bg-amber-50",
  A: "text-emerald-600 border-emerald-500 bg-emerald-50",
  B: "text-sky-600 border-sky-500 bg-sky-50",
  C: "text-slate-500 border-slate-400 bg-slate-50",
  D: "text-orange-500 border-orange-500 bg-orange-50",
  F: "text-rose-600 border-rose-500 bg-rose-50",
};

const GRADE_COLOR: Record<string, string> = {
  S: "#f59e0b", A: "#10b981", B: "#0ea5e9", C: "#64748b", D: "#f97316", F: "#e11d48",
};

const FALLBACK_URL = "https://reallywong.github.io/founders-journey-v4/";
// 分享链接始终指向当前部署地址（本地试玩则指向本机链接）
const playUrl = (): string => {
  try { return window.location.origin + window.location.pathname; } catch { return FALLBACK_URL; }
};

function shareText(state: GameState): string {
  const e = state.ending!;
  const months = `${Math.floor(state.month / 12)} 年 ${state.month % 12} 个月`;
  return `【创业人生】${state.name} 在 ${state.region.name} 创业（${state.industry.name}），${months}后迎来结局「${e.title}」，评级 ${e.grade}。\n创业人生似下棋，快来体验吧！👇\n${playUrl()}`;
}

// 用 canvas 绘制分享战报卡（1080×1440），返回 dataURL；qrDataUrl 为真实二维码（指向当前部署地址）
async function drawShareCard(state: GameState, qrDataUrl: string): Promise<string> {
  const e = state.ending!;
  const gradeColor = GRADE_COLOR[e.grade] ?? "#64748b";
  const W = 1080, H = 1440;
  const cv = document.createElement("canvas");
  cv.width = W; cv.height = H;
  const ctx = cv.getContext("2d")!;

  // 背景：暖色渐变 + 棋盘格暗纹
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#fffbeb"); bg.addColorStop(0.5, "#ffffff"); bg.addColorStop(1, "#f0f9ff");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  ctx.globalAlpha = 0.05; ctx.fillStyle = "#0f172a";
  const cell = 90;
  for (let y = 0; y < H / cell; y++) for (let x = 0; x < W / cell; x++)
    if ((x + y) % 2 === 0) ctx.fillRect(x * cell, y * cell, cell, cell);
  ctx.globalAlpha = 1;

  const cx = W / 2;
  ctx.textAlign = "center";

  // 顶部标题
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 44px 'Microsoft YaHei', sans-serif";
  ctx.fillText("创 业 人 生", cx, 110);
  ctx.fillStyle = "#64748b";
  ctx.font = "26px 'Microsoft YaHei', sans-serif";
  ctx.fillText("Founder's Journey · 我的创业战报", cx, 155);

  // 评级徽章
  ctx.beginPath(); ctx.arc(cx, 320, 105, 0, Math.PI * 2);
  ctx.fillStyle = gradeColor + "22"; ctx.fill();
  ctx.lineWidth = 10; ctx.strokeStyle = gradeColor; ctx.stroke();
  ctx.fillStyle = gradeColor;
  ctx.font = "bold 130px 'Arial Black', sans-serif";
  ctx.fillText(e.grade, cx, 365);

  // 结局标题
  ctx.fillStyle = "#0f172a";
  ctx.font = "bold 64px 'Microsoft YaHei', sans-serif";
  ctx.fillText(e.title.replace(/^\S+\s/, ""), cx, 530);

  // 身份行
  ctx.fillStyle = "#475569";
  ctx.font = "34px 'Microsoft YaHei', sans-serif";
  ctx.fillText(`${state.name} · ${state.region.flag} ${state.region.name} · ${state.industry.icon} ${state.industry.name}`, cx, 600);

  // 数据卡（2 列）
  const stats = e.stats.slice(0, 6);
  const cardW = 440, cardH = 110, gap = 40;
  stats.forEach((s, i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x = cx - cardW - gap / 2 + col * (cardW + gap);
    const y = 680 + row * (cardH + 30);
    ctx.fillStyle = "#f8fafc";
    ctx.strokeStyle = "#e2e8f0"; ctx.lineWidth = 2;
    const r = 20;
    ctx.beginPath();
    ctx.roundRect(x, y, cardW, cardH, r);
    ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#94a3b8";
    ctx.font = "24px 'Microsoft YaHei', sans-serif";
    ctx.fillText(s.label, x + cardW / 2, y + 42);
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 34px 'Microsoft YaHei', sans-serif";
    ctx.fillText(s.value, x + cardW / 2, y + 86);
  });

  // 底部标语 + 真实二维码（扫码直达当前部署地址）
  ctx.fillStyle = gradeColor;
  ctx.font = "bold 40px 'Microsoft YaHei', sans-serif";
  ctx.fillText("创业人生似下棋，快来体验吧！", cx, 1150);
  const qrImg = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = qrDataUrl;
  });
  const qrSize = 190;
  ctx.drawImage(qrImg, cx - qrSize / 2, 1180, qrSize, qrSize);
  ctx.fillStyle = "#64748b";
  ctx.font = "24px 'Microsoft YaHei', sans-serif";
  ctx.fillText(playUrl(), cx, 1405);
  ctx.font = "22px 'Microsoft YaHei', sans-serif";
  ctx.fillText(`随机种子 #${state.rngSeed}${state.tournamentCode ? ` · 比拼码 ${state.tournamentCode}` : ""}`, cx, 1435);

  return cv.toDataURL("image/png");
}

export default function EndingScreen({ state, onRestart }: Props) {
  const e = state.ending!;
  const [shareState, setShareState] = useState<"idle" | "working" | "done" | "err">("idle");
  const [card, setCard] = useState<string | null>(null);
  const cardUrl = useRef<string | null>(null);
  // v2.0 终局成就 + 彩蛋结局
  const endgame = investmentEndgame(state, e.id);
  const allAchievements = [...new Set([...(state.achievements ?? []), ...endgame.ids])];
  // 结局音效：S 敲钟 / A 到账 / D、F 低沉失败音；A/S 级通关登记全图鉴（解锁隐藏剧本）
  useEffect(() => {
    if (e.grade === "S") playSfx("ipo-bell");
    else if (e.grade === "A") playSfx("cash");
    else if (e.grade === "D" || e.grade === "F") playSfx("fail");
    if (e.grade === "A" || e.grade === "S") recordWin(state.region.id, state.industry.id, state.scenario?.id, e.grade);
    if (allAchievements.length > 0) persistAchievements(allAchievements); // v2.0：跨局累计
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const doShare = async () => {
    const text = shareText(state);
    setShareState("working");
    try {
      // 生成海报（含真实二维码，指向当前部署地址）
      if (!cardUrl.current) {
        const QRCode = (await import("qrcode")).default;
        const qr = await QRCode.toDataURL(playUrl(), { width: 380, margin: 1, color: { dark: "#0f172a", light: "#ffffff" } });
        cardUrl.current = await drawShareCard(state, qr);
      }
      setCard(cardUrl.current);
      // 触发下载
      const a = document.createElement("a");
      a.href = cardUrl.current;
      a.download = `创业人生战报-${state.name}-${e.grade}.png`;
      document.body.appendChild(a); a.click(); a.remove();
      // 复制文案（失败不阻塞）
      try { await navigator.clipboard.writeText(text); } catch { /* ignore */ }
      setShareState("done");
    } catch {
      // 海报生成失败兜底：只复制文案
      try { await navigator.clipboard.writeText(text); setShareState("done"); } catch { setShareState("err"); }
    }
  };

  const shareLabel =
    shareState === "working" ? "⏳ 正在生成海报…"
    : shareState === "done" ? "✅ 海报已生成！点击重新下载"
    : shareState === "err" ? "⚠️ 海报生成失败，点击重试"
    : "📤 分享战报（生成海报图）";

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50 text-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white border-slate-200 shadow-lg">
        <CardHeader className="text-center space-y-3">
          <div className={`inline-flex mx-auto items-center justify-center w-20 h-20 rounded-full border-4 text-4xl font-black ${GRADE_STYLE[e.grade]}`}>
            {e.grade}
          </div>
          <CardTitle className="text-3xl text-slate-900">{e.title}</CardTitle>
          <p className="text-slate-500 text-sm">
            {state.name} · {state.region.flag} {state.region.name} · {state.industry.icon} {state.industry.name}
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">{e.narrative}</p>
          {endgame.flavor && (
            <p className="text-sm text-amber-800 bg-amber-50 border border-amber-300 rounded-lg p-3 leading-relaxed whitespace-pre-line">{endgame.flavor}</p>
          )}
          {(state.personalWealth ?? 0) < 0 && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3 leading-relaxed">
              🌋 爆仓番外：公司故事落幕时，你的证券账户还倒欠 {fmtMoney(state, -(state.personalWealth ?? 0))}。强平不是终点——是利息开始替时间上班的起点。
            </p>
          )}
          {allAchievements.length > 0 && (
            <div className="rounded-lg border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-3">
              <div className="text-xs font-bold text-amber-700 mb-2">🏅 本局成就（{allAchievements.length}）</div>
              <div className="flex flex-wrap gap-2">
                {allAchievements.map((id) => {
                  const meta = ACHIEVEMENTS[id];
                  if (!meta) return null;
                  return (
                    <span key={id} title={meta.desc} className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-white px-2.5 py-1 text-xs text-amber-800 shadow-sm">
                      {meta.icon} {meta.name}
                    </span>
                  );
                })}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {e.stats.map((s) => (
              <div key={s.label} className="rounded-lg bg-slate-50 border border-slate-200 px-3 py-2 text-center">
                <div className="text-[10px] uppercase tracking-wider text-slate-400">{s.label}</div>
                <div className="text-sm font-bold text-slate-800">{s.value}</div>
              </div>
            ))}
            {state.brokerage && (
              <div className="rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-center">
                <div className="text-[10px] uppercase tracking-wider text-emerald-500">个人净资产（含证券账户）</div>
                <div className="text-sm font-bold text-emerald-700">{fmtMoney(state, state.personalWealth ?? 0)}</div>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
            <div className="text-amber-800 font-semibold text-sm mb-1">📖 最后一课</div>
            <p className="text-sm text-amber-900/80 leading-relaxed">{e.lesson}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 py-6 text-slate-700 border-slate-300 disabled:opacity-60" onClick={doShare} disabled={shareState === "working"}>
              {shareLabel}
            </Button>
            <Button className="flex-1 text-lg py-6 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500" onClick={onRestart}>
              🔄 再创业一次（这次会更强）
            </Button>
          </div>
          {shareState === "done" && card && (
            <div className="text-center space-y-2">
              <img src={card} alt="创业人生战报海报" className="w-60 mx-auto rounded-lg border border-slate-200 shadow" />
              <p className="text-xs text-slate-500">海报已生成并开始下载（如浏览器拦截，可长按上图保存）；战报文案已复制到剪贴板，直接粘贴发给朋友即可。</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
