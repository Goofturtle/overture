"use strict";
(function (root) {
  const origin = "https://overture-nd0q.onrender.com";
  const extensionId = "geemcgoloailklihnpghgindneohhccc";
  const extensionOrigin = "chrome-extension://" + extensionId;
  function meetingParams(value) {
    let url;
    try { url = new URL(value); } catch (_) { return {}; }
    if (url.protocol !== "https:" || url.hostname !== "meet.google.com") return {};
    const match = url.pathname.match(/^\/([a-z]{3}-[a-z]{4}-[a-z]{3})(?:\/|$)/i);
    return match ? { meet: match[1].toLowerCase() } : {};
  }
  function panelUrl(params, tabId, firstParty) {
    const query = new URLSearchParams({ host: "ext" });
    if (params.meet) query.set("meet", params.meet);
    if (Number.isInteger(tabId)) query.set("tab", String(tabId));
    if (firstParty) query.set("bridge", extensionId);
    return origin + "/panel.html?" + query;
  }
  function panelInfo(value) {
    try {
      const url = new URL(value), meet = url.searchParams.get("meet"), tab = url.searchParams.get("tab");
      if (url.origin !== origin || url.pathname !== "/panel.html" || url.searchParams.get("bridge") !== extensionId || !/^[a-z]{3}-[a-z]{4}-[a-z]{3}$/.test(meet || "") || !/^\d+$/.test(tab || "")) return null;
      return { meet, tabId: Number(tab) };
    } catch (_) { return null; }
  }
  function event(value) {
    if (!value || typeof value !== "object" || value.final !== true || typeof value.id !== "string" || !/^[a-zA-Z0-9:_-]{1,80}$/.test(value.id) || typeof value.text !== "string") return null;
    return { id: value.id, speaker: String(value.speaker || "").slice(0, 80), text: value.text.slice(0, 1000), time: String(value.time || "").slice(0, 20), at: Number(value.at) || 0, final: true };
  }
  function envelopes(payload) {
    const rawEvents = (Array.isArray(payload.events) ? payload.events : []).slice(-20000);
    const events = rawEvents.map(event).filter(Boolean);
    const lines = rawEvents.length ? events.map((item) => (item.time ? "[" + item.time + "] " : "") + (item.speaker || "Speaker") + ": " + item.text) : (Array.isArray(payload.lines) ? payload.lines : []).slice(-20000).map((line) => String(line).slice(0, 1200));
    const result = [];
    for (let i = 0; i < Math.max(lines.length, events.length); i += 50) result.push({ type: "overture-captions", lines: lines.slice(i, i + 50), events: events.slice(i, i + 50), extensionOrigin });
    return result;
  }
  root.OvertureExtension = Object.freeze({ origin, extensionId, extensionOrigin, meetingParams, panelUrl, panelInfo, envelopes });
  if (typeof module !== "undefined") module.exports = root.OvertureExtension;
})(globalThis);
