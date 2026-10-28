"use strict";
const E = OvertureExtension;
const frame = document.getElementById("overture"), off = document.getElementById("off"), title = document.getElementById("status-title"), detail = document.getElementById("status-detail"), toolbar = document.getElementById("toolbar"), status = document.getElementById("connection-status");
let binding = null, shown = "", panelReady = false, generation = 0, readyTimeout = null, readerStatus = "Waiting for captions";
const setStatus = (heading, body) => { title.textContent = heading; detail.textContent = body; off.hidden = false; toolbar.hidden = true; frame.hidden = true; };
const hello = () => { if (binding && frame.contentWindow) frame.contentWindow.postMessage({ type: "overture-extension-ready", extensionOrigin: E.extensionOrigin, meetTabId: binding.tabId }, E.origin); };
function deliver(payload) {
  for (const batch of E.envelopes(payload)) frame.contentWindow.postMessage(batch, E.origin);
  if (payload.ended || payload.type === "overture-call-ended") frame.contentWindow.postMessage({ type: "overture-call-ended", lines: [], events: [], extensionOrigin: E.extensionOrigin }, E.origin);
}
async function readerCommand(type) {
  if (!binding) return;
  const expected = binding;
  try {
    const tab = await chrome.tabs.get(expected.tabId);
    if (E.meetingParams(tab.url).meet !== expected.meet) throw new Error("The Meet tab has changed meetings.");
    const payload = await chrome.tabs.sendMessage(expected.tabId, { type });
    if (binding !== expected || !payload) return;
    if (type === "overture-captions-snapshot") {
      deliver(payload);
      frame.contentWindow.postMessage({ type: "overture-captions-status", box: !!payload.box, recoveryDropped: Number(payload.recoveryDropped) || 0 }, E.origin);
      status.textContent = payload.box ? "Caption reader connected" : "Turn on CC in Meet";
    }
  } catch (_) { status.textContent = "Reload the Meet tab to connect captions"; }
}
async function refresh(force) {
  const revision = ++generation;
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const params = E.meetingParams(tab && tab.url);
    if (params.meet && (!binding || binding.tabId !== tab.id || binding.meet !== params.meet)) binding = { ...params, tabId: tab.id };
    if (!binding) { setStatus("Open your Google Meet call", "Open Overture from a Google Meet tab, then turn on captions (CC)."); return; }
    const src = E.panelUrl(binding, binding.tabId, false);
    if (!force && shown === src) return;
    panelReady = false;
    clearTimeout(readyTimeout);
    setStatus("Connecting to Overture…", "The hosted app may need a moment to wake up.");
    const controller = new AbortController(), timeout = setTimeout(() => controller.abort(), 25000);
    try {
      const response = await fetch(E.origin + "/api/status", { cache: "no-store", credentials: "omit", signal: controller.signal });
      if (!response.ok) throw new Error("Overture returned HTTP " + response.status + ".");
    } finally { clearTimeout(timeout); }
    if (revision !== generation) return;
    shown = src; frame.src = src; frame.hidden = false;
    clearTimeout(readyTimeout);
    readyTimeout = setTimeout(() => { if (!panelReady) setStatus("Connect your Overture account", "Open the connected call panel below to sign in and use first-party cookies. Keep it open during the call; captions flow automatically."); }, 20000);
  } catch (error) {
    if (revision !== generation) return;
    shown = ""; setStatus("Overture is unavailable", error.name === "AbortError" ? "The hosted app took too long to respond. Try again in a moment." : "Could not reach the hosted app. Check your connection, then try again.");
  }
}
async function openConnectedPanel() {
  if (!binding) return;
  const url = E.panelUrl(binding, binding.tabId, true);
  const tabs = await chrome.tabs.query({ url: E.origin + "/panel.html*" });
  const existing = tabs.find((tab) => { const p = E.panelInfo(tab.url); return p && p.meet === binding.meet && p.tabId === binding.tabId; });
  if (existing) await chrome.tabs.update(existing.id, { active: true });
  else await chrome.tabs.create({ url });
}
chrome.runtime.onMessage.addListener((message, sender) => {
  if (message && sender.id === chrome.runtime.id && !sender.tab && message.type === "overture-meet-tab-closed" && binding && message.meetTabId === binding.tabId) {
    status.textContent = "Call ended"; if (panelReady) deliver({ type: "overture-call-ended", lines: [], events: [] }); return;
  }
  if (!message || sender.id !== chrome.runtime.id || !sender.tab || sender.frameId !== 0 || !binding || sender.tab.id !== binding.tabId || E.meetingParams(sender.tab.url).meet !== binding.meet) return;
  if (message.type === "overture-captions-status") {
    readerStatus = message.box ? "Caption reader connected" : "Turn on CC in Meet";
    status.textContent = readerStatus;
    if (panelReady) frame.contentWindow.postMessage({ type: message.type, box: !!message.box, recoveryDropped: Number(message.recoveryDropped) || 0 }, E.origin);
  } else if (panelReady && ["overture-captions", "overture-call-ended"].includes(message.type)) deliver(message);
});
window.addEventListener("message", (event) => {
  if (event.origin !== E.origin || event.source !== frame.contentWindow || !event.data) return;
  if (event.data.type === "overture-captions-reset") readerCommand("overture-captions-reset");
  if (event.data.type === "overture-panel-ready") {
    clearTimeout(readyTimeout);
    if (!event.data.connected || !event.data.live) {
      panelReady = false; setStatus("Sign in to Overture", "Open the connected call panel, sign in with Google, and return to this Meet call. If embedded sign-in is blocked, keep the connected panel open during the call."); return;
    }
    const wasReady = panelReady;
    panelReady = true; off.hidden = true; frame.hidden = false; toolbar.hidden = false; status.textContent = readerStatus;
    if (!wasReady) readerCommand("overture-captions-snapshot");
  }
});
frame.addEventListener("load", hello);
setInterval(() => { if (!panelReady && shown) hello(); }, 3000);
document.getElementById("retry").addEventListener("click", () => refresh(true));
document.getElementById("open-panel").addEventListener("click", openConnectedPanel);
document.getElementById("open-panel-toolbar").addEventListener("click", openConnectedPanel);
chrome.tabs.onActivated.addListener(() => refresh(false));
chrome.tabs.onUpdated.addListener((tabId, info) => { if (info.url) refresh(false); });
refresh(false);
