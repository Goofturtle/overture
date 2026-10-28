// Read Google Meet's own captions. This does not capture audio or run speech recognition.
// Stable caption text is a best-effort observation, not an ASR guarantee. Keep exact heard text.
"use strict";
(() => {
  const reader = String(Date.now()) + Math.random().toString(36).slice(2, 8);
  document.documentElement.dataset.overtureCaptions = reader;
  const UI_WORDS = new Set(["captions", "live captions", "english", "turn off captions", "turn on captions", "caption settings"]);
  const ICON = /^(?:closed_caption|closed_caption_off|settings|translate|language|more_vert|expand_less|expand_more)$/;
  const states = new Map(), all = new Map(), nodeIds = new WeakMap(), suppressed = new Map();
  let nodeSequence = 0, utteranceSequence = 0, startedAt = Date.now(), generation = 0, inCall = false, missed = 0, ticks = 0, ended = false, dropped = 0;
  const captionsBox = () => document.querySelector('[role="region"][aria-label*="aption" i]') || document.querySelector('div[jsname="dsyhDe"]') || document.querySelector(".a4cQT");
  const lineList = (el) => el.innerText.split("\n").map((s) => s.replace(/\s+/g, " ").trim()).filter((s) => s && s.length < 1000 && !ICON.test(s) && !UI_WORDS.has(s.toLowerCase()));
  const looksLikeName = (s) => s === "You" || (s.split(" ").length <= 4 && !/[.,!?;:"]/.test(s) && /^[A-ZÀ-ɏ]/.test(s));
  function captionsOf(box) {
    const isBlock = (el) => el.querySelector("img, svg") && lineList(el).length >= 2;
    const blocks = [...box.querySelectorAll("div")].filter((el) => isBlock(el) && ![...el.children].some(isBlock));
    if (blocks.length) return blocks.map((b) => { if (!nodeIds.has(b)) nodeIds.set(b, ++nodeSequence); const ls = lineList(b); return { key: "node:" + nodeIds.get(b), speaker: ls[0], text: ls.slice(1).join(" ") }; });
    const ls = lineList(box), out = []; let who = "";
    ls.forEach((l, i) => { if (looksLikeName(l) && ls[i + 1] && !looksLikeName(ls[i + 1])) who = l; else out.push({ key: "slot:" + out.length, speaker: who, text: l }); });
    return out;
  }
  function send(type, extra) { try { chrome.runtime.sendMessage(Object.assign({ type }, extra || {})).catch(() => {}); } catch (e) { /* reloaded/closed */ } }
  const clock = (at) => { const s = Math.max(0, Math.floor((at - startedAt) / 1000)); return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0"); };
  const asLine = (e) => "[" + e.time + "] " + (e.speaker || "Speaker") + ": " + e.text;
  function emit(entry, out) {
    if (!entry.text || entry.text === entry.emittedText) return;
    const event = { id: entry.id, speaker: entry.speaker, text: entry.text, time: clock(entry.at), at: entry.at, final: true };
    entry.emittedText = entry.text; all.set(entry.id, event); out.push(event);
    // Only the transcript recovery buffer is bounded; every emitted event has already been delivered live.
    while (all.size > 20000) { all.delete(all.keys().next().value); dropped++; }
  }
  function publish(events) { if (events.length) send("overture-captions", { lines: events.map(asLine), events }); }
  function flush() { const events = []; for (const entry of states.values()) emit(entry, events); publish(events); }
  function snapshot() { const events = Array.from(all.values()); return { lines: events.map(asLine), events, box: !!captionsBox(), buffered: events.length, recoveryDropped: dropped, ended }; }
  function finish() {
    if (ended) return;
    flush(); ended = true; inCall = false;
    send("overture-call-ended", snapshot());
  }
  function reset() {
    suppressed.clear(); const visible = captionsBox();
    if (visible) captionsOf(visible).forEach((c) => suppressed.set(c.key, c.text));
    states.clear(); all.clear(); generation++; utteranceSequence = 0; startedAt = Date.now(); dropped = 0; ended = false;
    send("overture-captions-status", { box: !!captionsBox(), buffered: 0, recoveryDropped: 0 });
  }
  const similarity = (a, b) => { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i / Math.max(1, Math.min(a.length, b.length)); };
  function tick() {
    const box = captionsBox(), leave = document.querySelector('[aria-label*="Leave call" i]');
    if (ticks++ % 3 === 0) send("overture-captions-status", { box: !!box, buffered: all.size, recoveryDropped: dropped });
    if (leave) { if (!inCall && !all.size) startedAt = Date.now(); inCall = true; ended = false; missed = 0; }
    else if (inCall && ++missed >= 2) { finish(); return; }
    const visible = new Set(), events = [];
    for (const c of box ? captionsOf(box) : []) {
      visible.add(c.key);
      const baseline = suppressed.get(c.key);
      if (baseline) {
        if (c.text === baseline) continue;
        if (c.text.startsWith(baseline)) { c.text = c.text.slice(baseline.length).trim(); if (!c.text) continue; }
        else if (similarity(c.text, baseline) >= .35) continue; // an ASR correction of pre-switch text still belongs to the old call
        else suppressed.delete(c.key);
      }
      let entry = states.get(c.key);
      // A reused DOM block beginning a different utterance is not a caption correction.
      const fresh = !entry || !entry.visible || entry.speaker !== c.speaker || (entry.emittedText && c.text !== entry.text && !c.text.startsWith(entry.text) && !entry.text.startsWith(c.text) && similarity(c.text, entry.text) < .35);
      if (fresh) {
        if (entry) emit(entry, events);
        entry = { id: reader + ":" + generation + ":" + (++utteranceSequence), speaker: c.speaker, text: c.text, at: Date.now(), stable: 0, emittedText: "", visible: true };
        states.set(c.key, entry);
      } else if (entry.text !== c.text) { entry.text = c.text; entry.stable = 0; }
      else entry.stable++;
      entry.visible = true;
      if (entry.stable >= 2) emit(entry, events);
    }
    // A caption removed by Meet is flushed from its last observed text, including the final utterance on leaving.
    for (const [key, entry] of states) if (!visible.has(key) && entry.visible) { emit(entry, events); entry.visible = false; }
    publish(events);
  }
  if (chrome.runtime.onMessage) chrome.runtime.onMessage.addListener((message, sender, respond) => {
    if (sender.id && sender.id !== chrome.runtime.id) return;
    if (message && message.type === "overture-captions-reset") { reset(); if (respond) respond({ ok: true }); }
    if (message && message.type === "overture-captions-snapshot") { flush(); if (respond) respond(snapshot()); }
  });
  window.addEventListener("pagehide", () => { if (inCall || states.size) finish(); });
  const timer = setInterval(() => {
    if (document.documentElement.dataset.overtureCaptions !== reader || !(chrome.runtime && chrome.runtime.id)) { clearInterval(timer); return; }
    tick();
  }, 1000);
})();
