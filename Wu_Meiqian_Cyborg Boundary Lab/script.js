// ---- global state ----
let identityDrift = 0; // -100 (human)  ~  +100 (machine)
const IDENTITY_KEY = "boundary_identity_drift";
const IDENTITY_TYPE_KEY = "boundary_identity_type";

// audio cache (only on pages有这些元素的时候才会找到)
const sounds = {};

function loadSound(id) {
  const el = document.getElementById(id);
  if (el) {
    sounds[id] = el;
  }
}

function playSound(id) {
  const s = sounds[id];
  if (!s) return;
  // 重置到开头，避免连点没声音
  s.currentTime = 0;
  s.play().catch(() => {});
}

// ---- theme toggle (所有页面通用) ----
function toggleTheme() {
  const body = document.body;
  const current = body.getAttribute("data-theme") || "dark";
  const next = current === "dark" ? "light" : "dark";
  body.setAttribute("data-theme", next);

  playSound("snd-toggle");
}

// ---- update UI 上的 identity 数字 & 情绪文本 ----
function updateIdentityUI(delta = 0) {
  identityDrift = Math.max(-100, Math.min(100, identityDrift + delta));

  const valueSpan = document.getElementById("identity-value");
  const moodLabel = document.getElementById("mood-label");
  const statusText = document.getElementById("status-text");

  if (valueSpan) valueSpan.textContent = identityDrift.toFixed(0);

  let mood = "neutral";
  let msg = "Hover, click, draw, and press H or M. The interface is watching how you decide.";

  if (identityDrift <= -25) {
    mood = "soft / human-leaning";
    msg = "You linger, hesitate, and wander. The system reads this as “human softness.”";
  } else if (identityDrift >= 25) {
    mood = "efficient / machine-leaning";
    msg = "Your inputs are sharp and quick. The system reads this as machinic efficiency.";
  }

  if (moodLabel) moodLabel.textContent = mood;
  if (statusText) statusText.textContent = msg;

  // 轻微 glitch 效果 + 音效（偏 machine 时）
  if (identityDrift >= 25) {
    const statusPanel = document.querySelector(".status-panel");
    if (statusPanel) {
      statusPanel.classList.add("glitch");
      playSound("snd-glitch");
      setTimeout(() => statusPanel.classList.remove("glitch"), 250);
    }
  }

  // 把当前 drift 存起来，反射页要用
  try {
    localStorage.setItem(IDENTITY_KEY, String(identityDrift));
  } catch (_) {}
}

// ---- choice 按钮点击（play.html 的 inline onclick 会调用这个） ----
function handleChoice(choice) {
  if (choice === "human") {
    updateIdentityUI(-15);
    playSound("snd-human-choice");
  } else if (choice === "machine") {
    updateIdentityUI(15);
    playSound("snd-machine-choice");
  }

  const prompt = document.getElementById("prompt-text");
  if (!prompt) return;

  if (choice === "human") {
    prompt.textContent =
      "You hesitated and reflected. But was that resistance, or just another scripted role?";
  } else {
    prompt.textContent =
      "You optimized and submitted. Was it faster—or simply easier to align with the interface?";
  }

  // 当 drift 强烈偏向一边时，显示“看结果”按钮
  const endLink = document.getElementById("end-link");
  if (endLink && endLink.classList.contains("hidden")) {
    if (Math.abs(identityDrift) >= 25) {
      endLink.classList.remove("hidden");
      playSound("snd-reveal");
    }
  }

  // 记录当前 identity 类型
  const type = identityDrift <= 0 ? "human" : "machine";
  try {
    localStorage.setItem(IDENTITY_TYPE_KEY, type);
  } catch (_) {}
}

// ---- drawing panel: 根据速度微调 drift + 播放画笔音效 ----
function initDrawingPanel() {
  const canvas = document.getElementById("draw-area");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let drawing = false;
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;
  let lastBrushMode = ""; // "slow" | "fast"

  // 初始清空
  ctx.fillStyle = "#050509";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  function startStroke(e) {
    const rect = canvas.getBoundingClientRect();
    lastX = e.clientX - rect.left;
    lastY = e.clientY - rect.top;
    lastTime = performance.now();
    drawing = true;
  }

  function endStroke() {
    drawing = false;
    lastBrushMode = "";
  }

  function draw(e) {
    if (!drawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const now = performance.now();

    const dx = x - lastX;
    const dy = y - lastY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const dt = now - lastTime || 1;
    const speed = dist / dt; // px/ms 粗糙速度

    // 画线
    ctx.strokeStyle = "#ff4f8b";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.stroke();

    lastX = x;
    lastY = y;
    lastTime = now;

    // 根据速度调整 drift
    const SLOW = 0.15;
    const FAST = 0.6;

    if (speed < SLOW) {
      updateIdentityUI(-0.4);
      if (lastBrushMode !== "slow") {
        playSound("snd-brush-slow");
        lastBrushMode = "slow";
      }
    } else if (speed > FAST) {
      updateIdentityUI(0.4);
      if (lastBrushMode !== "fast") {
        playSound("snd-brush-fast");
        lastBrushMode = "fast";
      }
    }
  }

  canvas.addEventListener("mousedown", startStroke);
  canvas.addEventListener("mouseup", endStroke);
  canvas.addEventListener("mouseleave", endStroke);
  canvas.addEventListener("mousemove", draw);

  // 清空按钮
  const clearBtn = document.getElementById("clear-drawing");
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      ctx.fillStyle = "#050509";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
  }
}

// ---- 键盘 H / M 快捷键 ----
function initKeyboardBias() {
  document.addEventListener("keydown", (e) => {
    if (e.key === "h" || e.key === "H") {
      updateIdentityUI(-10);
      playSound("snd-human-choice");
      const prompt = document.getElementById("prompt-text");
      if (prompt) {
        prompt.textContent =
          "You declared “H”. The system notes your insistence on the human side.";
      }
    }
    if (e.key === "m" || e.key === "M") {
      updateIdentityUI(10);
      playSound("snd-machine-choice");
      const prompt = document.getElementById("prompt-text");
      if (prompt) {
        prompt.textContent =
          "You declared “M”. The interface smiles in machine language.";
      }
    }
  });
}

// ---- reflection 页面：显示最终结果 + 跳转到 human/machine 页面 ----
function initReflectionPage() {
  const finalP = document.getElementById("final-identity");
  if (!finalP) return; // 不在 reflection.html 就直接跳过

  let drift = 0;
  try {
    drift = parseFloat(localStorage.getItem(IDENTITY_KEY) || "0");
  } catch (_) {}

  if (Number.isNaN(drift)) drift = 0;

  const type = drift <= 0 ? "human" : "machine";
  try {
    localStorage.setItem(IDENTITY_TYPE_KEY, type);
  } catch (_) {}

  let message = "";
  if (type === "human") {
    message =
      `Your drift landed at ${drift.toFixed(
        0
      )}. The interface leans toward calling you “more human” — slower, softer, and slightly resistant to its tempo.`;
  } else {
    message =
      `Your drift landed at ${drift.toFixed(
        0
      )}. The interface leans toward calling you “more machine” — efficient, direct, and aligned with its preferred path.`;
  }

  finalP.textContent = message;

  // 设置 “Continue” 按钮到对应页面
  const resultLink = document.getElementById("result-link");
  if (resultLink) {
    if (type === "human") {
      resultLink.href = "human.html";
      resultLink.textContent = "Continue along the human path";
    } else {
      resultLink.href = "machine.html";
      resultLink.textContent = "Continue along the machine path";
    }
    resultLink.classList.remove("hidden");
  }
}

// ---- 初始化入口 ----
document.addEventListener("DOMContentLoaded", () => {
  // 载入可能存在的音频元素
  [
    "snd-brush-slow",
    "snd-brush-fast",
    "snd-human-choice",
    "snd-machine-choice",
    "snd-glitch",
    "snd-toggle",
    "snd-reveal",
  ].forEach(loadSound);

  // play 页面：有画布就初始化绘画和键盘
  if (document.getElementById("draw-area")) {
    initDrawingPanel();
    initKeyboardBias();
    // 恢复上一次 drift（如果有）
    try {
      const stored = parseFloat(localStorage.getItem(IDENTITY_KEY) || "0");
      if (!Number.isNaN(stored)) {
        identityDrift = stored;
      }
    } catch (_) {}
    updateIdentityUI(0);
  }

  // reflection 页面
  initReflectionPage();
  if (document.getElementById("human-text")) {
    initAnimatedText("human-text", {
      nextPage: "boundary.html",
      delayBetween: 1500
    });
  }

  if (document.getElementById("machine-text")) {
    initAnimatedText("machine-text", {
      nextPage: "boundary.html",
      delayBetween: 1500
    });
  }

  if (document.getElementById("boundary-text")) {
    initAnimatedText("boundary-text", {
      delayBetween: 2000,
      onComplete: () => {
        const btn = document.getElementById("restart-btn");
        if (btn) {
          btn.classList.remove("hidden");
        }
      }
    });
  }

});

// 把函数挂到全局，给 HTML inline onclick 用
window.handleChoice = handleChoice;
window.toggleTheme = toggleTheme;

function initAnimatedText(containerId, options = {}) {
  const { nextPage = null, onComplete = null, delayBetween = 1400 } = options;

  const container = document.getElementById(containerId);
  if (!container) return;

  const lines = Array.from(container.querySelectorAll("[data-line]"));
  if (!lines.length) return;

  // 初始设成隐藏
  lines.forEach((line) => {
    line.classList.add("line-hidden");
  });

  let index = 0;

  function revealNext() {
    if (index < lines.length) {
      const line = lines[index];
      line.classList.remove("line-hidden");
      line.classList.add("line-visible");
      index += 1;

      setTimeout(revealNext, delayBetween);
    } else {
      // 全部显示完
      if (typeof onComplete === "function") {
        onComplete();
      }
      if (nextPage) {
        setTimeout(() => {
          window.location.href = nextPage;
        }, 2000);
      }
    }
  }

  revealNext();
}
