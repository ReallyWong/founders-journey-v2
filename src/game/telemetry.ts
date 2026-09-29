// ─── 匿名通关统计上报 + 本地生涯记录 ─────────────────────────────────────────
// 上报：ntfy.sh 公共主题（无需注册、无身份标识、fire-and-forget）。
// 消息仅含对局结果数据（结局/月数/行业/地区/估值），不含任何个人信息。
// 本地：fj_career 存玩家自己的生涯统计，驱动「结局图鉴」。

export interface RunReport {
  endingId: string;
  grade: string;
  months: number;
  industryId: string;
  regionId: string;
  valuation: number;
  mrr: number;
  eggCount: number;
  difficulty?: string;
  scenarioId?: string;
}

// Supabase：永久持久化主通道（白名单字段 + 边界校验在数据库端，匿名只可写不可读）
const SUPABASE_URL = "https://tejyzdubrbiigouznaeh.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRlanl6ZHVicmJpaWdvdXpuYWVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg4MDkzMTgsImV4cCI6MjA5NDM4NTMxOH0._m7GLDjF2b6dLkQIQoTo4UrYVwDBwtr4i3hHZrVHm9g";
// ntfy：备用通道（12 小时缓存，仅作过渡期的冗余）
const TOPIC = "https://ntfy.sh/fj-founders-journey-v3";

export function reportRun(r: RunReport): void {
  try {
    if (typeof fetch === "undefined" || typeof navigator === "undefined") return;
    fetch(`${SUPABASE_URL}/rest/v1/runs`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        ending_id: r.endingId, grade: r.grade, months: r.months,
        industry_id: r.industryId, region_id: r.regionId,
        valuation: r.valuation, mrr: r.mrr, egg_count: r.eggCount,
        difficulty: r.difficulty ?? null, scenario_id: r.scenarioId ?? null,
      }),
      keepalive: true,
    }).catch(() => {});
    const body = JSON.stringify({ v: 1, ts: Date.now(), ...r });
    fetch(TOPIC, {
      method: "POST",
      headers: { Title: "FJ-run", Priority: "low", Cache: "2592000" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch { /* 静默失败，绝不影响游戏 */ }
}

// ─── 课堂比拼上报（v1.6-beta） ──────────────────────────────────────────────
// 比拼码即 tournaments.seed：玩家输入同一个码 → 同一随机种子 → 同一局。
// 首次有人用该码开局时自动建局（24 小时后封盘）；每次通关上报一条 entry。
export function reportTournament(company: string, seed: string, report: RunReport & { rngSeed?: number }): void {
  try {
    if (typeof fetch === "undefined") return;
    const headers = {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    };
    (async () => {
      const find = await fetch(
        `${SUPABASE_URL}/rest/v1/tournaments?seed=eq.${encodeURIComponent(seed)}&select=id&limit=1`,
        { headers }
      );
      const arr = await find.json();
      let tid: string | undefined = Array.isArray(arr) && arr[0]?.id;
      if (!tid) {
        const create = await fetch(`${SUPABASE_URL}/rest/v1/tournaments`, {
          method: "POST",
          headers: { ...headers, Prefer: "return=representation" },
          body: JSON.stringify({ seed, closes_at: new Date(Date.now() + 864e5).toISOString() }),
        });
        const carr = await create.json();
        tid = Array.isArray(carr) && carr[0]?.id;
        if (!tid) return;
      }
      await fetch(`${SUPABASE_URL}/rest/v1/tournament_entries`, {
        method: "POST",
        headers: { ...headers, Prefer: "return=minimal" },
        body: JSON.stringify({ tournament_id: tid, company, report }),
        keepalive: true,
      }).catch(() => {});
    })().catch(() => {});
  } catch { /* 静默失败，绝不影响游戏 */ }
}

// ─── 本地生涯统计（结局图鉴） ────────────────────────────────────────────────
export interface Career {
  runs: number;
  endings: Record<string, number>;
  industries: Record<string, number>;
  regions: Record<string, number>;
  bestGrade: string;
  eggs: Record<string, number>;
}

const GRADE_RANK: Record<string, number> = { S: 7, A: 6, B: 5, C: 4, D: 3, F: 2 };

export function loadCareer(): Career {
  try {
    const raw = localStorage.getItem("fj_career");
    if (raw) return JSON.parse(raw) as Career;
  } catch { /* ignore */ }
  return { runs: 0, endings: {}, industries: {}, regions: {}, bestGrade: "-", eggs: {} };
}

export function recordRun(c: Career, r: RunReport): Career {
  const n: Career = {
    runs: c.runs + 1,
    endings: { ...c.endings, [r.endingId]: (c.endings[r.endingId] ?? 0) + 1 },
    industries: { ...c.industries, [r.industryId]: (c.industries[r.industryId] ?? 0) + 1 },
    regions: { ...c.regions, [r.regionId]: (c.regions[r.regionId] ?? 0) + 1 },
    bestGrade: (GRADE_RANK[r.grade] ?? 0) > (GRADE_RANK[c.bestGrade] ?? 0) ? r.grade : c.bestGrade,
    eggs: { ...c.eggs },
  };
  try { localStorage.setItem("fj_career", JSON.stringify(n)); } catch { /* ignore */ }
  return n;
}
