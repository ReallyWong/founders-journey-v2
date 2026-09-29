// ─── v2.1 NPC roster：头像 + 阵营色 + 台词前缀解析 ───────────────────────────
// 设计稿：manual/v2.1-NPC对话化设计稿.md
// 头像文件：public/npcs/{id}.webp（缺文件时回退 initials 字母头像）

export interface Npc {
  id: string;
  name: string;        // 名字条显示
  role: string;        // 身份副标
  color: string;       // 阵营底色（名字条/气泡色条）
  initial: string;     // 回退头像用文字
}

export const NPCS: Record<string, Npc> = {
  narrator: { id: "narrator", name: "旁白", role: "", color: "#64748B", initial: "叙" },
  "vc-zhou": { id: "vc-zhou", name: "周远帆", role: "远帆资本 · 合伙人", color: "#3B4CC8", initial: "周" },
  "angel-li": { id: "angel-li", name: "李曼姨", role: "天使投资人", color: "#3B4CC8", initial: "李" },
  "corp-chen": { id: "corp-chen", name: "陈战", role: "战投总监", color: "#3B4CC8", initial: "陈" },
  "lp-song": { id: "lp-song", name: "宋太", role: "LP · 出资人", color: "#3B4CC8", initial: "宋" },
  "bro-tech": { id: "bro-tech", name: "阿凯", role: "联合创始人 · CTO", color: "#0E9F8A", initial: "凯" },
  "bro-sales": { id: "bro-sales", name: "大鹏", role: "联合创始人 · 销售", color: "#0E9F8A", initial: "鹏" },
  "emp-xiao": { id: "emp-xiao", name: "小满", role: "1 号员工", color: "#0E9F8A", initial: "满" },
  mom: { id: "mom", name: "妈", role: "", color: "#D9A13B", initial: "妈" },
  "reporter-wen": { id: "reporter-wen", name: "温记者", role: "科技媒体", color: "#E2703A", initial: "温" },
  regulator: { id: "regulator", name: "专员", role: "监管问询", color: "#8A7F5C", initial: "专" },
  rival: { id: "rival", name: "对手", role: "竞品创始人", color: "#A63D40", initial: "对" },
  bather: { id: "bather", name: "老白", role: "澡堂老板", color: "#6B4FA0", initial: "白" },
  "broker-wu": { id: "broker-wu", name: "吴经理", role: "券商客户经理", color: "#5B7A99", initial: "吴" },
  "advisor-qin": { id: "advisor-qin", name: "秦顾问", role: "尽调顾问", color: "#8B5E3C", initial: "秦" },
  "user-liu": { id: "user-liu", name: "刘姐", role: "种子用户", color: "#3AA5D9", initial: "刘" },
};

// scene 文本里「名字：」前缀 → NPC 匹配（支持 roster 全名与常用简称）
const NAME_ALIASES: Record<string, string> = {};
for (const npc of Object.values(NPCS)) {
  if (npc.id !== "narrator") NAME_ALIASES[npc.name] = npc.id;
}

export interface Bubble {
  npc: Npc;
  text: string;
}

// 解析 scene → 气泡序列：
// - 有 speaker 且无「名字：」分段 → 整段为该 NPC 台词
// - 含「名字：」前缀的行 → 该 NPC 气泡；其余行 → 旁白气泡
// - 无 speaker 无分段 → 整段旁白
export function parseScene(scene: string, speaker?: string): Bubble[] {
  const lines = scene.split("\n").map((l) => l.trim()).filter(Boolean);
  const hasDialogue = lines.some((l) => /^[^：:]{1,8}[：:]/.test(l) && NAME_ALIASES[l.slice(0, l.search(/[：:]/))]);
  if (!hasDialogue) {
    const npc = NPCS[speaker ?? "narrator"] ?? NPCS.narrator;
    return [{ npc, text: scene.trim() }];
  }
  const bubbles: Bubble[] = [];
  for (const line of lines) {
    const m = line.match(/^([^：:]{1,8})[：:]([\s\S]*)$/);
    const npcId = m ? NAME_ALIASES[m[1].trim()] : undefined;
    if (npcId) bubbles.push({ npc: NPCS[npcId], text: (m![2] ?? "").trim() });
    else if (bubbles.length && bubbles[bubbles.length - 1].npc.id === "narrator") bubbles[bubbles.length - 1].text += "\n" + line;
    else bubbles.push({ npc: NPCS.narrator, text: line });
  }
  return bubbles;
}
