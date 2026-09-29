// ─── 音效播放（音频文件位于 public/sfx/，由 audio_generation 技能生成） ────
// 所有播放均为 best-effort：无声环境、浏览器自动播放策略下静默失败。

let bgmEl: HTMLAudioElement | null = null;
let bgmOn = false;

function base(): string {
  return (import.meta as unknown as { env?: { BASE_URL?: string } }).env?.BASE_URL ?? "/";
}

export function playSfx(name: "click" | "cash" | "ipo-bell" | "fail"): void {
  try {
    const a = new Audio(`${base()}sfx/${name}.mp3`);
    a.volume = name === "click" ? 0.35 : 0.6;
    void a.play().catch(() => { /* 用户尚未交互或无声环境 */ });
  } catch { /* ignore */ }
}

export function isBgmOn(): boolean {
  return bgmOn;
}

export function toggleBgm(): boolean {
  try {
    if (!bgmEl) {
      bgmEl = new Audio(`${base()}sfx/bgm-loop.mp3`);
      bgmEl.loop = true;
      bgmEl.volume = 0.25;
    }
    if (bgmOn) {
      bgmEl.pause();
      bgmOn = false;
    } else {
      void bgmEl.play().catch(() => { /* 忽略 */ });
      bgmOn = true;
    }
  } catch { /* ignore */ }
  return bgmOn;
}
