"use strict";
importScripts("config.js");
const E = OvertureExtension;
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {});
async function setFor(tabId, url) {
  try { await chrome.sidePanel.setOptions(E.meetingParams(url).meet ? { tabId, path: "sidepanel.html", enabled: true } : { tabId, enabled: false }); } catch (_) {}
}
chrome.tabs.onUpdated.addListener((id, info, tab) => { if (info.url || info.status === "complete") setFor(id, tab.url); });
chrome.tabs.onActivated.addListener(async ({ tabId }) => { try { const tab = await chrome.tabs.get(tabId); await setFor(tabId, tab.url); } catch (_) {} });
chrome.runtime.onInstalled.addListener(async () => {
  const tabs = await chrome.tabs.query({});
  await Promise.all(tabs.map(async (tab) => {
    await setFor(tab.id, tab.url);
    if (E.meetingParams(tab.url).meet) await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["config.js", "captions.js"] }).catch(() => {});
    if (E.panelInfo(tab.url)) await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["config.js", "hosted-bridge.js"] }).catch(() => {});
  }));
});
// A normal Overture tab uses first-party cookies. Credentials never pass through the extension.
async function panelTargets(meetTab) {
  const meet = E.meetingParams(meetTab.url).meet;
  if (!meet) return [];
  return (await chrome.tabs.query({ url: E.origin + "/panel.html*" })).filter((tab) => {
    const panel = E.panelInfo(tab.url);
    return panel && panel.tabId === meetTab.id && panel.meet === meet;
  });
}
async function readerForPanel(sender, type) {
  const panel = sender.tab && E.panelInfo(sender.tab.url);
  if (!panel || sender.frameId !== 0) throw new Error("Unrecognized Overture panel.");
  const meet = await chrome.tabs.get(panel.tabId);
  if (E.meetingParams(meet.url).meet !== panel.meet) throw new Error("This Meet tab has closed or changed meetings.");
  return chrome.tabs.sendMessage(panel.tabId, { type });
}
chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (!message || sender.id !== chrome.runtime.id) return;
  if (["overture-captions", "overture-captions-status", "overture-call-ended"].includes(message.type) && sender.tab && sender.frameId === 0 && E.meetingParams(sender.tab.url).meet) {
    panelTargets(sender.tab).then((tabs) => Promise.all(tabs.map((tab) => chrome.tabs.sendMessage(tab.id, { ...message, meetTabId: sender.tab.id }).catch(() => {})))).catch(() => {});
  } else if (["overture-captions-snapshot", "overture-captions-reset"].includes(message.type)) {
    readerForPanel(sender, message.type).then(respond, (error) => respond({ error: error.message }));
    return true;
  }
});
// If a Meet tab closes before pagehide can deliver, finalize the transcript already received.
chrome.tabs.onRemoved.addListener(async (tabId) => {
  try {
    const tabs = await chrome.tabs.query({ url: E.origin + "/panel.html*" });
    await Promise.all(tabs.filter((tab) => { const p = E.panelInfo(tab.url); return p && p.tabId === tabId; })
      .map((tab) => chrome.tabs.sendMessage(tab.id, { type: "overture-call-ended", meetTabId: tabId, lines: [], events: [], box: false }).catch(() => {})));
    chrome.runtime.sendMessage({ type: "overture-meet-tab-closed", meetTabId: tabId }).catch(() => {});
  } catch (_) {}
});
