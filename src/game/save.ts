// ─── 对局存档 / 读档 ─────────────────────────────────────────────────────────
// 仅存 localStorage（本机）。任何 state 变化时若 alive 则自动保存；
// 通关（alive=false）或开启新局时清除。读档时强制 speed=0 防止时间意外推进。
import type { GameState } from "./types";

const KEY = "fj_save";

export function saveGame(s: GameState): void {
  try { localStorage.setItem(KEY, JSON.stringify({ ...s, speed: 0 })); } catch { /* 空间不足等场景静默 */ }
}

export function loadGame(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as GameState;
    if (!s || s.alive !== true || !s.region?.id || !s.industry?.id || typeof s.month !== "number") return null;
    return { ...s, speed: 0 };
  } catch { return null; }
}

export function clearSave(): void {
  try { localStorage.removeItem(KEY); } catch { /* ignore */ }
}

// ─── 全图鉴解锁（v1.7ultra）：通关记录登记 ──────────────────────────────────
// 达成 A/S 级结局记一次「通关」；集齐全部城市 + 全部行业解锁隐藏剧本「雷曼时刻（2008）」
import { REGIONS, INDUSTRIES } from "./data";

const UNLOCK_KEY = "fj_unlocks_v1";

export interface UnlockProgress {
  regions: string[]; // 已通关的城市 id
  industries: string[]; // 已通关的行业 id
  scenarioGrades?: Record<string, string>; // 剧本 id → 最好成绩（v1.7ultra 二重彩蛋）
}

export function getUnlocks(): UnlockProgress {
  try {
    const raw = localStorage.getItem(UNLOCK_KEY);
    if (!raw) return { regions: [], industries: [] };
    const p = JSON.parse(raw) as UnlockProgress;
    return { regions: p.regions ?? [], industries: p.industries ?? [], scenarioGrades: p.scenarioGrades ?? {} };
  } catch { return { regions: [], industries: [] }; }
}

// 结局为 A/S 级时由结算页调用一次；附带记录剧本最好成绩（只升不降）
export function recordWin(regionId: string, industryId: string, scenarioId?: string, grade?: string): UnlockProgress {
  const p = getUnlocks();
  const regions = p.regions.includes(regionId) ? p.regions : [...p.regions, regionId];
  const industries = p.industries.includes(industryId) ? p.industries : [...p.industries, industryId];
  const scenarioGrades = { ...(p.scenarioGrades ?? {}) };
  if (scenarioId && grade) {
    const prev = scenarioGrades[scenarioId];
    const order = ["D", "C", "B", "A", "S"];
    if (!prev || order.indexOf(grade) > order.indexOf(prev)) scenarioGrades[scenarioId] = grade;
  }
  const next = { regions, industries, scenarioGrades };
  try { localStorage.setItem(UNLOCK_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  return next;
}

// ─── v2.0：投资成就跨局累计（localStorage，纯展示向） ─────────────────────────
const ACH_KEY = "fj_achievements";

export function getPersistedAchievements(): string[] {
  try { return JSON.parse(localStorage.getItem(ACH_KEY) || "[]"); } catch { return []; }
}

export function persistAchievements(ids: string[]): string[] {
  const all = [...new Set([...getPersistedAchievements(), ...ids])];
  try { localStorage.setItem(ACH_KEY, JSON.stringify(all)); } catch { /* ignore */ }
  return all;
}

// 查询某剧本的最好成绩（二重彩蛋解锁判断用）
export function getScenarioGrade(scenarioId: string): string | undefined {
  return getUnlocks().scenarioGrades?.[scenarioId];
}

export function isScenarioUnlocked(totalRegions: number, totalIndustries: number): boolean {
  const p = getUnlocks();
  return p.regions.length >= totalRegions && p.industries.length >= totalIndustries;
}

// 🥚 开发者秘钥（v1.7ultra）：创建界面连点标题 7 下触发——解锁全部城市/行业通关记录与全部彩蛋剧本
export function unlockEverything(): UnlockProgress {
  const next: UnlockProgress = {
    regions: REGIONS.map((r) => r.id),
    industries: INDUSTRIES.map((i) => i.id),
    scenarioGrades: { lehman2008: "S", jobs1976: "S" },
  };
  try { localStorage.setItem(UNLOCK_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  return next;
}
