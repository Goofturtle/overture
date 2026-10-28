/* Overture live assistance. Pure rendering/note projection: no microphone, network or identity guessing here. */
(function (root) {
  "use strict";
  const esc = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const clean = (value, max) => String(value == null ? "" : value).trim().slice(0, max || 2000);
  const key = (value) => clean(value).toLowerCase().replace(/[\s\u2018\u2019\u201c\u201d]+/g, " ").replace(/[.,!?;:]+$/g, "");
  const hash = (value) => { let h = 2166136261; for (const c of String(value)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return (h >>> 0).toString(16); };
  const hasSources = (item) => item.sourceVerified === true && ((Array.isArray(item.sources) && item.sources.some((s) => !!sourceLink(s))) || item.evidenceType === "records");
  const uncertain = (item) => (!!item.inferred && !item.confirmed) || !!item.uncertain || ["possible", "no_match", "needs_company", "nokey", "unknown", "notfound"].includes(item.status)
    || (["person", "company"].includes(item.kind) && !["pending", "error"].includes(item.status) && !hasSources(item));
  const sourceName = (source) => ({ captions: "Meet captions", meetily: "Meetily transcript", live: "Your note", notes: "Your notes" }[source] || clean(source, 80) || "Call evidence");
  function sourceLink(source) {
    try { const u = new URL(source.url); return /^https?:$/.test(u.protocol) ? '<a href="' + esc(u.href) + '" target="_blank" rel="noopener noreferrer">' + esc(clean(source.title, 90) || u.hostname) + "</a>" : ""; }
    catch (e) { return ""; }
  }
  function safeProfile(value) {
    try { const url = new URL(value); return /^https?:$/.test(url.protocol) && !url.username && !url.password ? url.href : ""; }
    catch (_) { return ""; }
  }
  function profileLink(label, url, possible) {
    const href = safeProfile(url);
    return href ? '<a class="la-entity-link" style="color:var(--accent,#147b48);text-decoration:underline;text-underline-offset:3px" href="' + esc(href) + '" target="_blank" rel="noopener noreferrer" title="' + (possible ? "Possible profile; identity needs confirmation" : "Open the public source for this profile") + '">' + esc(label) + '</a>' : esc(label);
  }
  function linkedNote(note) {
    const raw = String(note.text || ""), refs = (Array.isArray(note.entities) ? note.entities : []).filter((x) => x && x.verified === true && x.label && safeProfile(x.profileUrl));
    const spans = [];
    refs.forEach((ref) => {
      const escaped = String(ref.label).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const pattern = new RegExp("(^|[^\\p{L}\\p{N}_])(" + escaped + ")(?=$|[^\\p{L}\\p{N}_])", "giu");
      for (const match of raw.matchAll(pattern)) spans.push({ start: match.index + match[1].length, end: match.index + match[0].length, ref });
    });
    let html = "", pos = 0;
    spans.sort((a, b) => a.start - b.start || b.end - a.end).forEach((span) => {
      if (span.start < pos) return;
      html += esc(raw.slice(pos, span.start)) + profileLink(raw.slice(span.start, span.end), span.ref.profileUrl, false); pos = span.end;
    });
    return html + esc(raw.slice(pos));
  }
  function status(item) {
    if (item.status === "error") return ["Lookup unavailable", "error"];
    if (item.status === "pending") return ["Looking up…", "pending"];
    if (item.status === "needs_company") return ["Company unclear — needs confirmation", "uncertain"];
    if (item.status === "no_match") return ["No exact match", "uncertain"];
    if (["person", "company"].includes(item.kind) && !item.inferred && !item.uncertain && !hasSources(item)) return ["Mention heard — not verified", "uncertain"];
    if (uncertain(item)) return ["Possible match — not confirmed", "uncertain"];
    return [item.kind === "point" ? "Said on the call" : item.kind === "term" ? "Term explanation" : hasSources(item) ? (item.evidenceType === "records" ? "Matched in your records" : "Source-backed match") : "Mention heard — not verified", "found"];
  }
  function normalize(assist) {
    assist = assist && typeof assist === "object" ? assist : {};
    return { items: Array.isArray(assist.items) ? assist.items.filter((x) => x && typeof x === "object").slice(-120) : [],
      notes: Array.isArray(assist.notes) ? assist.notes.filter((x) => x && typeof x === "object") : [],
      pending: assist.pending === true, semantic: assist.semantic || null };
  }
  function renderItem(item) {
    const [label, tone] = status(item), heard = clean(item.heard, 600), detail = clean(item.detail, 1800);
    const links = (Array.isArray(item.sources) ? item.sources : []).slice(0, 3).map(sourceLink).filter(Boolean).join(" · ");
    return '<article class="la-card la-' + tone + '"><div class="la-card-head"><span class="la-kind">' + esc(clean(item.kind, 24) || "Insight") + '</span><span class="la-status">' + esc(label) + '</span></div><h3>'
      + (item.kind === "person" && item.profileUrl ? profileLink(clean(item.title, 180), item.profileUrl, uncertain(item)) : esc(clean(item.title, 180) || "Mention heard")) + "</h3>" + (detail ? "<p>" + esc(detail) + "</p>" : "")
      + (heard ? '<p class="la-heard">Heard: “' + esc(heard) + '”</p>' : "")
      + '<div class="la-source">' + esc([item.time || "", item.speaker || "", sourceName(item.source)].filter(Boolean).join(" · ")) + (links ? " · " + links : "") + "</div></article>";
  }
  function renderFeed(assist, error, options) {
    const a = normalize(assist), person = a.items.filter((x) => x.kind === "person").slice(-1)[0];
    const recent = person ? [person].concat(a.items.filter((x) => x !== person).slice(-2).reverse()) : a.items.slice(-3).reverse();
    if (error) return '<div class="la-error" role="status">' + esc(error) + " Captions remain in this panel; lookup results are not available yet.</div>";
    let mode = "";
    if (a.semantic) {
      if (a.semantic.enabled !== true) mode = "Private-call AI analysis is off. Showing extracted call details.";
      else if (a.semantic.error) mode = "Automatic AI analysis is unavailable. Extracted call details remain available; review interpretations and possible matches.";
      else if (a.semantic.pending || ["queued", "running"].includes(a.semantic.status)) mode = "AI is reading new call details. Existing saved notes remain available.";
      else if (a.semantic.mode === "semantic") mode = "AI-assisted call notes. Review interpretations and possible matches.";
      else mode = "Showing extracted call details; automatic AI analysis has no new result yet.";
    }
    const limit = mode ? '<p class="p-hint">' + esc(mode) + '</p>' : '';
    if (options && options.compact) return '<div class="la-feed-head"><h2>Live assistance</h2></div>' + limit + '<p class="p-hint">' + a.notes.length + ' automatic notes available below. Possible matches remain separate.</p>';
    if (!recent.length) return limit + '<p class="la-empty">People, companies, key terms and call points appear here automatically as captions arrive. Important details are saved to Notes; possible matches stay labeled.</p>';
    return '<div class="la-feed-head"><h2>Live assistance</h2><button type="button" class="link-btn" data-tab="notes">All saved in Notes</button></div>' + limit + recent.map(renderItem).join("");
  }
  function projectedNote(note) {
    const isUncertain = uncertain(note), raw = clean(note.text, 3000), heard = clean(note.heard, 600);
    const prefix = isUncertain && !/^possible match|^unconfirmed|^no exact match/i.test(raw) ? "Unconfirmed suggestion: " : "";
    return { id: "assist:" + clean(note.id || hash([note.kind, raw, heard].join("|")), 160), auto: true, assist: true,
      kind: isUncertain ? "Needs confirmation" : clean(note.kind, 40) || "Fact", text: prefix + raw,
      heard, at: clean(note.time || note.at, 64), source: clean(note.source, 80) || "captions", uncertain: isUncertain,
      speaker: clean(note.speaker, 100), sources: (Array.isArray(note.sources) ? note.sources : []).slice(0, 5),
      entityId: clean(note.entityId, 120), confirmed: note.confirmed === true, entities: (Array.isArray(note.entities) ? note.entities : []).filter((x) => x && typeof x === "object").map((x) => ({
        entityId: clean(x.entityId, 120), label: clean(x.label, 120), name: clean(x.name, 120), profileUrl: safeProfile(x.profileUrl), verified: x.verified === true, status: clean(x.status, 30) })) };
  }
  function mergeNotes(existing, incoming) {
    const old = Array.isArray(existing) ? existing : [], manual = old.filter((x) => !x || x.assist !== true), seen = new Set(manual.filter(Boolean).map((x) => key(x.text)));
    const autos = [], ids = new Set();
    for (const raw of Array.isArray(incoming) ? incoming : []) {
      if (!raw || !clean(raw.text)) continue;
      const note = projectedNote(raw), semanticKey = (note.uncertain ? "guess:" : "evidence:") + key(note.kind + "|" + note.text);
      if (ids.has(note.id) || seen.has(semanticKey) || (!note.uncertain && seen.has(key(note.text)))) continue;
      ids.add(note.id); seen.add(semanticKey); autos.push(note);
    }
    // Incoming server notes are a full snapshot. Replace only our projection; never delete/overwrite a manual note.
    return manual.concat(autos);
  }
  function renderNote(note) {
    const heard = clean(note.heard, 600), urls = (Array.isArray(note.sources) ? note.sources : []).map(sourceLink).filter(Boolean).join(" · ");
    const possible = (Array.isArray(note.entities) ? note.entities : []).filter((x) => x && !x.verified && x.profileUrl && x.status === "possible")
      .map((x) => 'Possible profile: ' + profileLink(x.name || x.label, x.profileUrl, true) + ' (identity needs confirmation)').join(" · ");
    return '<li><span class="p-note-kind pill">' + esc(note.kind) + '</span><span class="num muted-line">' + esc(note.at || "") + "</span><p>" + (note.speaker && !note.entityId ? esc(note.speaker) + ' said: ' : '') + linkedNote(note) + "</p>"
      + (possible ? '<p class="la-possible-profile">' + possible + '</p>' : '')
      + (heard ? '<blockquote class="la-note-evidence">Heard: “' + esc(heard) + '”</blockquote>' : "")
      + '<small class="la-source">' + esc([note.speaker, sourceName(note.source)].filter(Boolean).join(" · ")) + (urls ? " · " + urls : "") + "</small></li>";
  }
  function renderNotes(notes) {
    const automatic = (Array.isArray(notes) ? notes : []).filter((x) => x && x.assist), confirmed = automatic.filter((x) => !x.uncertain), guesses = automatic.filter((x) => x.uncertain);
    let html = '<section class="la-auto-notes"><h2>Automatic call notes</h2><p class="p-hint">Statements, decisions, actions, questions and terms captured from the call. These are call evidence, not independently verified facts.</p>';
    html += confirmed.length ? '<ul class="p-note-list" role="list">' + confirmed.map(renderNote).join("") + "</ul>" : '<p class="empty-line">Key details will be saved here as captions arrive.</p>';
    if (guesses.length) html += '<h3 class="la-uncertain-title">Needs confirmation</h3><p class="p-hint">Possible matches and inferred details remain separate from what was confirmed.</p><ul class="p-note-list la-uncertain-notes" role="list">' + guesses.map(renderNote).join("") + "</ul>";
    return html + "</section>";
  }
  const api = { normalize, status, uncertain, mergeNotes, projectedNote, renderItem, renderFeed, renderNotes, linkedNote };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (root) root.OvertureLiveAssist = api;
})(typeof window !== "undefined" ? window : null);
