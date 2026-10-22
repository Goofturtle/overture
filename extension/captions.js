// MOAB on Google Meet: reads Meet's own live captions (only while you have CC turned on) and hands each finished line to MOAB's
// side panel, which passes it to MOAB on this PC to find the people and companies mentioned. Nothing is sent anywhere else and
// nothing is kept here: the lines live in the side panel until the call ends. It also says when you leave the call, so MOAB can
// read the whole transcript once for After the call.
"use strict";
(() => {
  const POLL_MS = 1000;
  const UI_WORDS = new Set(["captions", "live captions", "english", "turn off captions", "turn on captions", "caption settings"]);
  const ICON = /^[a-z_]+$/;          // Material icon ligatures in Meet's text (arrow_downward, more_vert)
  const recent = [];                 // lines already sent, so a line Meet shows again isn't sent twice
  const all = [];                    // the whole call's lines, sent once more when you leave (the side panel may have reloaded)
  let lastLine = "", stable = 0, speaker = "", emitted = "", inCall = false, missed = 0;

  function captionsBox() {
    return document.querySelector('[role="region"][aria-label*="aption" i]') // "Captions"
      || document.querySelector('div[jsname="dsyhDe"]') || document.querySelector(".a4cQT");
  }
  const lineList = (el) => el.innerText.split("\n").map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s && s.length < 600 && !ICON.test(s) && !UI_WORDS.has(s.toLowerCase()));
  // A speaker's name sits on its own line above their words: short, capitalised, no punctuation.
  const looksLikeName = (s) => s === "You" || (s.split(" ").length <= 4 && !/[.,!?;:"]/.test(s) && /^[A-ZÀ-ɏ]/.test(s));

  function send(type, extra) {
    try { chrome.runtime.sendMessage(Object.assign({ type }, extra || {})).catch(() => {}); } catch (e) { /* the extension was reloaded */ }
  }

  function finished(line, next, out) {
    if (looksLikeName(line) && next && !looksLikeName(next)) { speaker = line; return; }
    // Meet keeps adding to the line someone is still saying: send only what's new since it was last sent.
    let words = line;
    if (emitted && line.startsWith(emitted)) words = line.slice(emitted.length).trim();
    if (!words || recent.includes(line)) return;
    recent.push(line);
    if (recent.length > 300) recent.shift();
    emitted = line;
    out.push((speaker ? speaker + ": " : "") + words);
    all.push(out[out.length - 1]);
    if (all.length > 20000) all.shift();
  }

  function tick() {
    const leave = document.querySelector('[aria-label*="Leave call" i]');
    if (leave) { inCall = true; missed = 0; }
    else if (inCall && ++missed >= 2) { // gone for 2 checks in a row (not a toolbar redraw): you left the call
      inCall = false;
      send("moab-call-ended", { lines: all.slice() }); // MOAB reads the whole transcript for After the call
    }
    const box = captionsBox();
    if (!box) return;
    const lines = lineList(box), out = [];
    lines.forEach((line, i) => {
      if (i === lines.length - 1) { // the line being spoken: finished once it hasn't changed for 2 seconds
        stable = line === lastLine ? stable + 1 : 0;
        lastLine = line;
        if (stable < 2) return;
      }
      finished(line, lines[i + 1], out);
    });
    if (out.length) send("moab-captions", { lines: out });
  }
  setInterval(tick, POLL_MS);
})();
