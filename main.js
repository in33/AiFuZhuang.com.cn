/* ============================================================
   AI服装 AiFuZhuang.com.cn v2 — 智能定制工作台
   纯原生 JS：六维配置 · 实时预览 · 估价 · 提示词 · 远程打印工单
   ============================================================ */
"use strict";

/* ---------------- 数据 ---------------- */
const STYLES = [
  { key: "qipao", name: "旗袍", photo: "assets/qipao.jpg", base: 1680, pos: "50% 74%", silhouettes: ["S 型修身", "A 型改良", "H 型直身", "鱼尾摆"], prompt: "shanghai qipao cheongsam dress" },
  { key: "suit", name: "西装", photo: "assets/suit.jpg", base: 2280, pos: "50% 55%", silhouettes: ["修身平肩", "意式垂坠", "Oversize 宽松", "燕尾礼服"], prompt: "tailored bespoke suit" },
  { key: "gown", name: "晚礼服", photo: "assets/gown.jpg", base: 3280, pos: "50% 45%", silhouettes: ["鱼尾 X 型", "A 字长摆", "高腰希腊式", "蓬裙公主"], prompt: "haute couture evening gown" },
  { key: "coat", name: "大衣", photo: "assets/coat.jpg", base: 1880, pos: "50% 40%", silhouettes: ["O 型茧形", "A 字直筒", "X 型束腰", "H 型落肩"], prompt: "long wool coat" },
  { key: "shirt", name: "衬衫", photo: "assets/shirt.jpg", base: 380, pos: "50% 50%", silhouettes: ["合体收腰", "落肩宽松", "古巴领休闲", "立领中式"], prompt: "casual shirt" },
];

const FABRICS = [
  { key: "silk", name: "真丝", mult: 1.35, sw: "linear-gradient(135deg,#e8d9c0,#c9a97e 45%,#efe3cf 60%,#c2a075)", note: "垂坠光泽" },
  { key: "wool", name: "羊绒", mult: 1.45, sw: "repeating-linear-gradient(45deg,#c8b394 0 3px,#b49d7d 3px 6px)", note: "软糯厚实" },
  { key: "linen", name: "亚麻", mult: 1.15, sw: "repeating-linear-gradient(0deg,#e5ddcb 0 2px,#d8cfba 2px 4px),repeating-linear-gradient(90deg,#e5ddcb 0 2px,#d8cfba 2px 4px)", note: "透气挺括" },
  { key: "velvet", name: "丝绒", mult: 1.25, sw: "radial-gradient(circle at 30% 30%,#3d3d52,#1c1c28 70%)", note: "哑光深邃" },
  { key: "cotton", name: "棉布", mult: 1.0, sw: "linear-gradient(135deg,#e9e9e9,#d5d5d5)", note: "亲肤日常" },
];

const COLORS = [
  { name: "黛青", hex: "#2e6f68" }, { name: "藏蓝", hex: "#27406e" }, { name: "月白", hex: "#e9e6da" },
  { name: "绛红", hex: "#93303e" }, { name: "燕麦", hex: "#d9c9a8" }, { name: "乌金", hex: "#8a6d2f" },
  { name: "靛蓝", hex: "#33578a" }, { name: "藕粉", hex: "#dda4b2" },
];

const PATTERNS = [
  { key: "none", name: "素色" },
  { key: "jacquard", name: "提花" },
  { key: "stripe", name: "条纹" },
  { key: "plaid", name: "格纹" },
];

const MOTIFS = [
  { key: "none", name: "无" },
  { key: "dragon", name: "龙纹", svg: `<path d="M8 4c6-3 14-2 16 3 1.6 4-1 7-5 8l6 9h-5l-5-7-4 7H6l6-10C7 13 4 10 5 7c.6-1.6 1.7-2.5 3-3z"/>` },
  { key: "crane", name: "仙鹤", svg: `<path d="M4 22c2-8 8-9 10-14 1.5-3.5 6-4 8-1.5 1.6 2-.3 5-3.4 5.6C22 16 18 21 12 21l6 3H4z"/>` },
  { key: "orchid", name: "兰草", svg: `<path d="M14 25c0-6-1-10-5-14 4 1 6 4 7 7 0-5 2-8 6-10-2 4-3 8-3 12l4-3c-2 3-3 5-3 8h-6z"/>` },
  { key: "phoenix", name: "凤凰", svg: `<path d="M15 3c4 0 7 3 7 6 0 4-4 5-7 4 3 3 8 3 10 8-5-1-9-2-12-5 1 4 4 6 4 9-3-2-6-4-7-8-3 1-6 0-7-2 3 0 5-2 5-4-2-4 1-8 7-8z"/>` },
  { key: "geo", name: "几何", svg: `<path d="M4 4h8v8H4zM14 14h8v8h-8zM14 4h8l-8 8zM4 14l8 8H4z"/>` },
  { key: "taichi", name: "太极", svg: `<path d="M15 3a12 12 0 1 1 0 24 12 12 0 0 1 0-24zm0 3a4.5 4.5 0 0 0 0 9 4.5 4.5 0 0 1 0 9 9 9 0 0 0 0-18zm0 3a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6zm0 10.4a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6z"/>` },
];

const AI_EXAMPLES = [
  "想要一件优雅的旗袍，秋天穿去婚宴，面料垂坠些，别太隆重",
  "给酒店高管团队订秋冬职业大衣，稳重大气，耐穿保暖，可绣集团徽章",
  "年会晚宴的礼服，华丽一点，绛红或金色，要有钉珠工艺",
];

/* ---------------- 状态 ---------------- */
const state = { style: STYLES[0], silhouette: STYLES[0].silhouettes[0], fabric: FABRICS[0], color: COLORS[0], pattern: PATTERNS[0], motif: MOTIFS[0], qty: 1 };

const $ = (s) => document.querySelector(s);

/* ---------------- 左侧面板渲染 ---------------- */
function renderStyles() {
  $("#styleRow").innerHTML = STYLES.map((s) => `
    <button class="style-btn ${s.key === state.style.key ? "on" : ""}" data-k="${s.key}" type="button">
      ${styleIcon(s.key)}${s.name}
    </button>`).join("");
  $("#styleRow").onclick = (e) => {
    const b = e.target.closest(".style-btn");
    if (!b) return;
    state.style = STYLES.find((s) => s.key === b.dataset.k);
    state.silhouette = state.style.silhouettes[0];
    renderStyles(); renderSilhouettes(); updatePreview();
  };
}

function styleIcon(k) {
  const icons = {
    qipao: `<svg viewBox="0 0 30 30"><path d="M15 3l4 3-1.5 3.5c2 1 3.5 3 3.5 5.5l1 12h-14l1-12c0-2.5 1.5-4.5 3.5-5.5L11 6z"/><path d="M15 3v6"/></svg>`,
    suit: `<svg viewBox="0 0 30 30"><path d="M15 4l4 2 4 3-2 5h-12l-2-5 4-3z"/><path d="M15 4l-3 4 3 12 3-12z"/><path d="M9 14l-2 12h16l-2-12"/></svg>`,
    gown: `<svg viewBox="0 0 30 30"><path d="M12 3h6l1 5c2 1 3 3 3 5l3 14H5l3-14c0-2 1-4 3-5z"/><path d="M12 3c1 2 5 2 6 0"/></svg>`,
    coat: `<svg viewBox="0 0 30 30"><path d="M10 4h10l4 5-3 3v16H9V12L6 9z"/><path d="M15 4v10m0 0h-3m3 0h3"/><circle cx="15" cy="17" r="0.8"/><circle cx="15" cy="21" r="0.8"/></svg>`,
    shirt: `<svg viewBox="0 0 30 30"><path d="M12 4l3 3 3-3 6 3-2 5h-14l-2-5z"/><path d="M15 7v19M8 12v14M22 12v14"/></svg>`,
  };
  return icons[k];
}

function renderSilhouettes() {
  $("#silhouetteRow").innerHTML = state.style.silhouettes
    .map((s) => `<span class="opt ${s === state.silhouette ? "on" : ""}" data-v="${s}">${s}</span>`).join("");
  $("#silhouetteRow").onclick = (e) => {
    const o = e.target.closest(".opt");
    if (!o) return;
    state.silhouette = o.dataset.v;
    renderSilhouettes(); updatePreview();
  };
}

function renderFabrics() {
  $("#fabricRow").innerHTML = FABRICS.map((f) => `
    <div class="fab ${f.key === state.fabric.key ? "on" : ""}" data-k="${f.key}">
      <div class="fab-swatch" style="background:${f.sw}"></div><span>${f.name}</span>
    </div>`).join("");
  $("#fabricRow").onclick = (e) => {
    const f = e.target.closest(".fab");
    if (!f) return;
    state.fabric = FABRICS.find((x) => x.key === f.dataset.k);
    renderFabrics(); updatePreview();
  };
}

function renderColors() {
  $("#colorRow").innerHTML = COLORS.map((c) => `
    <div class="color-dot ${c.name === state.color.name ? "on" : ""}" data-n="${c.name}" style="background:${c.hex}" title="${c.name}"></div>`).join("");
  $("#colorRow").onclick = (e) => {
    const d = e.target.closest(".color-dot");
    if (!d) return;
    state.color = COLORS.find((c) => c.name === d.dataset.n);
    renderColors(); updatePreview();
  };
}

function renderPatterns() {
  $("#patternRow").innerHTML = PATTERNS.map((p) => `
    <span class="opt ${p.key === state.pattern.key ? "on" : ""}" data-k="${p.key}">${p.name}</span>`).join("");
  $("#patternRow").onclick = (e) => {
    const o = e.target.closest(".opt");
    if (!o) return;
    state.pattern = PATTERNS.find((p) => p.key === o.dataset.k);
    renderPatterns(); updatePreview();
  };
}

function renderMotifs() {
  $("#motifRow").innerHTML = MOTIFS.map((m) => `
    <button class="motif ${m.key === state.motif.key ? "on" : ""}" data-k="${m.key}" type="button">
      ${m.key === "none" ? `<svg viewBox="0 0 30 30"><circle cx="15" cy="15" r="9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/></svg>${m.name}` : `${m.svg}${m.name}`}
    </button>`).join("");
  $("#motifRow").onclick = (e) => {
    const b = e.target.closest(".motif");
    if (!b) return;
    state.motif = MOTIFS.find((m) => m.key === b.dataset.k);
    renderMotifs(); updatePreview();
  };
}

/* ---------------- 预览 + 估价 ---------------- */
function patternCSS() {
  switch (state.pattern.key) {
    case "stripe": return "repeating-linear-gradient(90deg, rgba(255,255,255,0.35) 0 6px, rgba(255,255,255,0) 6px 22px)";
    case "plaid": return "repeating-linear-gradient(90deg, rgba(255,255,255,0.28) 0 10px, rgba(255,255,255,0) 10px 34px), repeating-linear-gradient(0deg, rgba(255,255,255,0.28) 0 10px, rgba(255,255,255,0) 10px 34px)";
    case "jacquard": return "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.30) 6px, transparent 7px), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.30) 6px, transparent 7px), radial-gradient(circle at 75% 25%, rgba(255,240,200,0.35) 4px, transparent 5px), radial-gradient(circle at 25% 75%, rgba(255,240,200,0.35) 4px, transparent 5px)";
    default: return "none";
  }
}
const PATTERN_SIZE = { stripe: "auto", plaid: "auto", jacquard: "64px 64px", none: "auto" };
const PATTERN_OP = { none: 0, stripe: 0.35, plaid: 0.4, jacquard: 0.45 };

function calcPrice() {
  let p = state.style.base * state.fabric.mult;
  if (state.pattern.key === "jacquard") p += 220;
  if (state.pattern.key === "plaid") p += 90;
  if (state.pattern.key === "stripe") p += 60;
  if (state.motif.key !== "none") p += 180;
  const lo = Math.round(p / 10) * 10;
  return { lo, hi: Math.round(lo * 1.12) };
}

function updatePreview() {
  const photo = $("#pvPhoto");
  photo.style.opacity = 0;
  setTimeout(() => {
    photo.src = state.style.photo;
    photo.style.objectPosition = state.style.pos;
    photo.style.opacity = 1;
  }, 180);

  $("#pvTint").style.background = state.color.hex;
  $("#pvTint").style.opacity = state.color.name === "月白" ? 0.08 : 0.22;

  const pat = $("#pvPattern");
  pat.style.background = patternCSS();
  pat.style.backgroundSize = PATTERN_SIZE[state.pattern.key];
  pat.style.opacity = PATTERN_OP[state.pattern.key];

  const m = $("#pvMotif");
  if (state.motif.key === "none") { m.classList.remove("show"); }
  else { m.innerHTML = state.motif.svg; m.classList.add("show"); }

  $("#specChips").innerHTML = `
    <span>款式<b>${state.style.name}</b></span><span>廓形<b>${state.silhouette}</b></span>
    <span>面料<b>${state.fabric.name} · ${state.fabric.note}</b></span><span>主色<b>${state.color.name}</b></span>
    <span>花型<b>${state.pattern.name}</b></span><span>刺绣<b>${state.motif.key === "none" ? "无" : state.motif.name}</b></span>`;

  const { lo, hi } = calcPrice();
  $("#priceNum").textContent = `¥${lo.toLocaleString()} – ${hi.toLocaleString()}`;
}

/* ---------------- AI 解构 ---------------- */
function deconstruct(text) {
  const t = text || "";
  const found = { style: null, silhouette: null, fabric: null, color: null, pattern: null, motif: null, scene: "" };
  found.style = STYLES.find((s) => t.includes(s.name)) ||
    (/(旗袍|中式)/.test(t) ? STYLES[0] : /西服|西装|正装|商务/.test(t) ? STYLES[1] : /礼服|晚宴|年会|红毯/.test(t) ? STYLES[2] : /大衣|外套|风衣/.test(t) ? STYLES[3] : /衬衫|衬衣|T恤/.test(t) ? STYLES[4] : null);
  if (found.style) {
    found.silhouette = found.style.silhouettes.find((s) => t.includes(s.slice(0, 2))) || found.style.silhouettes[0];
  }
  found.fabric = FABRICS.find((f) => t.includes(f.name)) ||
    (/垂坠|光泽|真丝/.test(t) ? FABRICS[0] : /保暖|羊绒|呢|耐穿/.test(t) ? FABRICS[1] : /透气|亚麻|清爽/.test(t) ? FABRICS[2] : /丝绒|深邃/.test(t) ? FABRICS[3] : null);
  found.color = COLORS.find((c) => t.includes(c.name)) ||
    (/优雅|黛|青/.test(t) ? COLORS[0] : /稳重|藏蓝|深/.test(t) ? COLORS[1] : /华丽|绛红|红/.test(t) ? COLORS[3] : /金色|鎏金|乌金/.test(t) ? COLORS[5] : /温柔|粉|藕/.test(t) ? COLORS[7] : null);
  found.pattern = /提花/.test(t) ? PATTERNS[1] : /条纹/.test(t) ? PATTERNS[2] : /格纹|格子/.test(t) ? PATTERNS[3] : PATTERNS[0];
  found.motif = /徽章|logo|LOGO|集团|标志/.test(t) ? MOTIFS[1] : /龙/.test(t) ? MOTIFS[1] : /鹤/.test(t) ? MOTIFS[2] : /兰|竹/.test(t) ? MOTIFS[3] : /凤/.test(t) ? MOTIFS[4] : /太极|中式/.test(t) ? MOTIFS[6] : MOTIFS[0];
  found.scene = /婚宴|婚礼/.test(t) ? "婚宴社交" : /年会|晚宴|红毯/.test(t) ? "晚宴红毯" : /酒店|职业|商务|高管/.test(t) ? "商务职业" : /秋天|秋冬|冬/.test(t) ? "秋冬出行" : "日常场景";
  return found;
}

function runAI(text) {
  const input = text || $("#aiInput").value.trim();
  const out = $("#aiOut");
  if (!input) { out.textContent = "请输入一句话描述，或点示例体验"; return; }
  out.textContent = "AI 解构中：分词 → 情感识别 → 参数映射 …";
  setTimeout(() => {
    const f = deconstruct(input);
    if (f.style) { state.style = f.style; state.silhouette = f.silhouette; }
    if (f.fabric) state.fabric = f.fabric;
    if (f.color) state.color = f.color;
    state.pattern = f.pattern;
    state.motif = f.motif;
    renderStyles(); renderSilhouettes(); renderFabrics(); renderColors(); renderPatterns(); renderMotifs(); updatePreview();
    out.textContent = `✓ 解构完成：${state.style.name} · ${state.silhouette} · ${state.fabric.name} · ${state.color.name} · ${state.pattern.name}花型 · ${f.scene} · 刺绣${state.motif.key === "none" ? "无" : state.motif.name}`;
  }, 900);
}

/* ---------------- 提示词弹窗 ---------------- */
function buildPrompt() {
  const zh = `款式：${state.style.name} · ${state.silhouette}\n面料：${state.fabric.name}（${state.fabric.note}）\n主色：${state.color.name}\n花型：${state.pattern.name}\n刺绣：${state.motif.key === "none" ? "无" : state.motif.name + "徽章（胸口）"}\n渲染：服装产品摄影，人台展示，柔和棚拍光，细腻面料质感，极简背景`;
  const en = `Professional fashion product photography of a ${state.style.prompt}, ${state.silhouette} silhouette, ${state.fabric.name} fabric with ${state.fabric.note} texture, ${state.color.name} color tone${state.pattern.key !== "none" ? ", " + state.pattern.name + " pattern" : ""}${state.motif.key !== "none" ? ", embroidered " + state.motif.name + " emblem badge on chest" : ""}, displayed on a dress form, soft studio lighting, fine fabric detail, minimal background, photorealistic`;
  return { zh, en };
}
$("#promptBtn").addEventListener("click", () => {
  const { zh, en } = buildPrompt();
  $("#pmTitle").textContent = `${state.style.name} · ${state.color.name} · ${state.fabric.name}`;
  $("#pmZh").textContent = zh;
  $("#pmEn").textContent = en;
  openModal("#promptModal");
});

/* ---------------- 远程打印工单 ---------------- */
const PRINTERS = { dtg: "沪上数码直喷工场 · DTG-07", heat: "松江热转印线 · HT-02", laser: "集团激光裁床 · LC-01" };
let jobTimer = null;

$("#printBtn").addEventListener("click", () => {
  $("#printStep1").hidden = false;
  $("#printStep2").hidden = true;
  openModal("#printModal");
});
$("#qtyMinus").addEventListener("click", () => { state.qty = Math.max(1, state.qty - 1); $("#qtyNum").textContent = state.qty; });
$("#qtyPlus").addEventListener("click", () => { state.qty = Math.min(20, state.qty + 1); $("#qtyNum").textContent = state.qty; });

$("#sendJob").addEventListener("click", () => {
  const printer = document.querySelector('input[name="printer"]:checked').value;
  const no = "FZ-2026-" + String(Math.floor(1000 + Math.random() * 9000));
  $("#jobNo").textContent = no;
  $("#jobPrinter").textContent = PRINTERS[printer];
  $("#jobMeta").textContent = `${state.style.name} · ${state.fabric.name} · ${state.color.name}`;
  $("#jobQty").textContent = `${state.qty} 份` + ($("#printNote").value.trim() ? " · 含工艺备注" : "");
  $("#jobTitle").textContent = `工单 ${no}`;
  $("#printStep1").hidden = true;
  $("#printStep2").hidden = false;

  const steps = document.querySelectorAll("#printStep2 .job-steps i");
  const statusEl = $("#jobStatus");
  const stages = ["已接收 · 排队中", "排版处理中 · RIP 输出", "打印中 · 进行时", "质检中 · 尺寸与色差", "出货 · 预计 48h 内送达"];
  let i = 0;
  clearInterval(jobTimer);
  const tick = () => {
    statusEl.textContent = stages[i];
    steps.forEach((s, k) => s.classList.toggle("on", k <= i));
    if (++i >= stages.length) clearInterval(jobTimer);
  };
  tick();
  jobTimer = setInterval(tick, 1800);
});

/* ---------------- 弹窗通用 ---------------- */
function openModal(sel) { $(sel).classList.add("open"); document.body.style.overflow = "hidden"; }
function closeModal() {
  document.querySelectorAll(".modal.open").forEach((m) => m.classList.remove("open"));
  document.body.style.overflow = "";
  clearInterval(jobTimer);
}
document.querySelectorAll(".modal").forEach((m) => {
  m.addEventListener("click", (e) => { if (e.target.hasAttribute("data-close")) closeModal(); });
});
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

/* 复制 */
document.querySelectorAll(".copy-btn").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const text = document.getElementById(btn.dataset.copy).textContent;
    try { await navigator.clipboard.writeText(text); }
    catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); ta.remove();
    }
    btn.textContent = "已复制 ✓"; btn.classList.add("ok");
    setTimeout(() => { btn.textContent = "复制"; btn.classList.remove("ok"); }, 1600);
  });
});

/* ---------------- AI 示例 ---------------- */
document.querySelectorAll(".ai-example").forEach((b) => {
  b.addEventListener("click", () => {
    $("#aiInput").value = AI_EXAMPLES[+b.dataset.ex];
    runAI(AI_EXAMPLES[+b.dataset.ex]);
  });
});
$("#aiBtn").addEventListener("click", () => runAI());

/* ---------------- 首屏 3D 视角：鼠标拖拽旋转 / 平移 ---------------- */
const stack = $("#heroStack");
if (stack) {
  let rx = 6, ry = -12, tx = 0, ty = 0;
  let dragging = false, px = 0, py = 0;
  const apply = () => { stack.style.transform = `translate(${tx}px, ${ty}px) rotateX(${rx}deg) rotateY(${ry}deg)`; };
  apply();
  stack.addEventListener("pointerdown", (e) => {
    dragging = true; px = e.clientX; py = e.clientY;
    stack.setPointerCapture(e.pointerId);
    stack.style.transition = "none";
  });
  stack.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - px, dy = e.clientY - py;
    ry = Math.max(-85, Math.min(85, ry + dx * 0.45));
    rx = Math.max(-45, Math.min(45, rx - dy * 0.35));
    tx = Math.max(-60, Math.min(60, tx + dx * 0.15));
    ty = Math.max(-40, Math.min(40, ty + dy * 0.15));
    px = e.clientX; py = e.clientY;
    apply();
  });
  const release = () => { dragging = false; stack.style.transition = "transform .7s cubic-bezier(0.22, 1, 0.36, 1)"; };
  stack.addEventListener("pointerup", release);
  stack.addEventListener("pointercancel", release);
}

/* ---------------- 启动 ---------------- */
renderStyles(); renderSilhouettes(); renderFabrics(); renderColors(); renderPatterns(); renderMotifs();
updatePreview();
