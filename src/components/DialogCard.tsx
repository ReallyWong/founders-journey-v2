// ─── v2.1 对话框组件：NPC 头像 + 气泡 + 回应选项（轻 AVG） ────────────────────
// 设计稿：manual/v2.1-NPC对话化设计稿.md
import { useState, type Dispatch, type SetStateAction } from "react";
import type { Choice, GameState, PendingDecision } from "@/game/types";
import { parseScene, type Npc } from "@/game/npcs";
import { dueDiligence } from "@/game/engine";

interface Props {
  state: GameState;
  decision: PendingDecision;
  revealed: string[];
  setState: Dispatch<SetStateAction<GameState>>;
  setRevealed: Dispatch<SetStateAction<string[]>>;
  onChoice: (c: Choice) => void;
  effectSummary: (c: Choice) => string;
}

// 头像：有图用图（public/npcs/{id}.webp），缺文件回退 initials 圆形字母
function NpcAvatar({ npc, size = 40 }: { npc: Npc; size?: number }) {
  const [broken, setBroken] = useState(false);
  if (npc.id === "narrator" || broken) {
    return (
      <div className="rounded-full flex items-center justify-center text-white font-bold shrink-0"
        style={{ width: size, height: size, backgroundColor: npc.color, fontSize: size * 0.42 }}>
        {npc.initial}
      </div>
    );
  }
  return (
    <img src={`/npcs/${npc.id}.webp`} alt={npc.name} width={size} height={size}
      onError={() => setBroken(true)}
      className="rounded-full object-cover shrink-0 border-2"
      style={{ borderColor: npc.color, width: size, height: size }} />
  );
}

function Bubble({ npc, text }: { npc: Npc; text: string }) {
  const isNarrator = npc.id === "narrator";
  return (
    <div className={`flex gap-2.5 ${isNarrator ? "pl-1" : ""}`}>
      <NpcAvatar npc={npc} />
      <div className="min-w-0 flex-1">
        {!isNarrator && (
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-xs font-bold" style={{ color: npc.color }}>{npc.name}</span>
            {npc.role && <span className="text-[10px] text-slate-400">{npc.role}</span>}
          </div>
        )}
        <div className="rounded-xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line"
          style={{
            backgroundColor: isNarrator ? "#F1F5F9" : "#FFFFFF",
            border: `1px solid ${isNarrator ? "#E2E8F0" : npc.color + "44"}`,
            borderLeft: `3px solid ${isNarrator ? "#CBD5E1" : npc.color}`,
            color: isNarrator ? "#475569" : "#1E293B",
            fontStyle: isNarrator ? "italic" : "normal",
          }}>
          {text}
        </div>
      </div>
    </div>
  );
}

export default function DialogCard({ state, decision, revealed, setState, setRevealed, onChoice, effectSummary }: Props) {
  const bubbles = parseScene(decision.scene, decision.speaker);
  return (
    <div className="space-y-3.5">
      {/* 台词/旁白气泡序列 */}
      <div className="space-y-3">
        {bubbles.map((b, i) => <Bubble key={i} npc={b.npc} text={b.text} />)}
      </div>

      {/* 回应选项 */}
      <div className="space-y-2">
        {decision.choices.map((c) => {
          const decKey = `${decision.eventId ?? decision.title}:${c.id}`;
          const isRevealed = revealed.includes(decKey);
          return (
            <div key={c.id} className="w-full text-left p-3.5 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50 transition-all text-sm leading-relaxed text-slate-700">
              <button className="w-full text-left" onClick={() => onChoice(c)}>
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
    </div>
  );
}
