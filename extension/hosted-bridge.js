"use strict";
(() => {
  const E = OvertureExtension, binding = E.panelInfo(location.href);
  if (window.top === window && !binding && location.pathname === "/" && location.hash === "#/home") {
    try {
      const resume = sessionStorage.getItem("overture:extension:return-panel");
      if (E.panelInfo(resume)) fetch(E.origin + "/api/status", { credentials: "same-origin", cache: "no-store" })
        .then((response) => response.ok ? response.json() : null)
        .then((status) => { if (status && status.google && status.google.connected) location.replace(resume); }).catch(() => {});
    } catch (_) {}
  }
  if (window.top !== window || !binding || window.__overtureHostedBridge) return;
  window.__overtureHostedBridge = true;
  try { sessionStorage.setItem("overture:extension:return-panel", location.href); } catch (_) {}
  const post = (message) => window.postMessage({ ...message, extensionOrigin: E.extensionOrigin }, E.origin);
  const ready = () => post({ type: "overture-extension-ready", extensionOrigin: E.extensionOrigin, meetTabId: binding.tabId });
  function deliver(message) {
    if (message.error) { post({ type: "overture-captions-status", box: false, error: String(message.error).slice(0, 300) }); return; }
    for (const batch of E.envelopes(message)) post(batch);
    post({ type: "overture-captions-status", box: !!message.box, recoveryDropped: Number(message.recoveryDropped) || 0 });
    if (message.type === "overture-call-ended" || message.ended) post({ type: "overture-call-ended", lines: [], events: [] });
  }
  async function command(type) {
    try { const response = await chrome.runtime.sendMessage({ type }); if (response && type === "overture-captions-snapshot") deliver(response); }
    catch (_) { post({ type: "overture-captions-status", box: false, error: "Reload this Overture panel and the Meet tab to reconnect the extension." }); }
  }
  chrome.runtime.onMessage.addListener((message, sender) => {
    if (sender.id !== chrome.runtime.id || message.meetTabId !== binding.tabId) return;
    if (message.type === "overture-captions") { for (const batch of E.envelopes(message)) post(batch); }
    else if (message.type === "overture-captions-status") post({ type: message.type, box: !!message.box, recoveryDropped: Number(message.recoveryDropped) || 0 });
    else if (message.type === "overture-call-ended") deliver(message);
  });
  let acknowledged = false;
  window.addEventListener("message", (event) => {
    if (event.source !== window || event.origin !== E.origin || !event.data) return;
    if (event.data.type === "overture-panel-ready") { if (!acknowledged && event.data.live && event.data.connected) { acknowledged = true; command("overture-captions-snapshot"); } }
    else if (event.data.type === "overture-captions-reset") command("overture-captions-reset");
  });
  ready();
  const handshake = setInterval(() => { if (!acknowledged) ready(); }, 3000);
  window.addEventListener("pagehide", () => clearInterval(handshake), { once: true });
})();
