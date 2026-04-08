const bookmarkCodeEl = document.querySelector("#bookmarkCode");
const copyButton = document.querySelector("#copyButton");
const dragBookmark = document.querySelector("#dragBookmark");
const statusEl = document.querySelector("#status");

function dashboardBookmark() {
  const OVERLAY_ID = "codex-canvas-dashboard";
  const STYLE_ID = "codex-canvas-dashboard-style";
  const STORAGE_KEY = "codex-canvas-dashboard-dismissed";
  const host = location.hostname.toLowerCase();

  if (!host.includes("instructure.com") && !document.querySelector('meta[name="csrf-token"]')) {
    alert("Open your Canvas site first, then click this bookmark.");
    return;
  }

  if (document.getElementById(OVERLAY_ID)) {
    document.getElementById(OVERLAY_ID).remove();
    const existingStyle = document.getElementById(STYLE_ID);
    if (existingStyle) existingStyle.remove();
    return;
  }

  const TARGET_ORIGIN = location.origin;
  const dismissedAssignments = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"));
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
#${OVERLAY_ID}{position:fixed;inset:0;z-index:2147483647;background:linear-gradient(160deg,rgba(9,16,22,.8),rgba(15,31,39,.68));backdrop-filter:blur(16px);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;color:#0f172a}
#${OVERLAY_ID} *{box-sizing:border-box}
.codex-shell{position:absolute;inset:18px;overflow:auto;border-radius:32px;background:linear-gradient(180deg,#fbfcff,#f2f6fb 45%,#eef3f8);box-shadow:0 40px 100px rgba(0,0,0,.34);padding:24px;border:1px solid rgba(255,255,255,.45)}
.codex-topbar{display:flex;justify-content:space-between;gap:16px;align-items:flex-start;margin-bottom:18px}
.codex-title h1{margin:0;font-size:clamp(30px,3.2vw,46px);line-height:1;letter-spacing:-.04em}
.codex-title p{margin:10px 0 0;color:#526071;max-width:68ch;line-height:1.5}
.codex-actions{display:flex;gap:10px;flex-wrap:wrap}
.codex-button{appearance:none;border:none;border-radius:999px;padding:12px 16px;font:inherit;font-weight:700;cursor:pointer;background:#14304a;color:#fff}
.codex-button.alt{background:#ddeaf4;color:#15314d}
.codex-button.warn{background:#d95b43}
.codex-panel{background:linear-gradient(180deg,rgba(255,255,255,.92),rgba(248,251,255,.92));border:1px solid rgba(20,48,74,.08);border-radius:28px;padding:18px 18px 10px}
.codex-utility{display:none;margin-bottom:16px;padding:14px;border-radius:22px;background:#f7fafe;border:1px solid rgba(20,48,74,.08)}
.codex-utility.active{display:block}
.codex-utility-top{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:10px}
.codex-utility-title{display:grid;gap:4px}
.codex-utility-title strong{font-size:18px}
.codex-utility-title span{color:#64748b;font-size:14px}
.codex-calendar-days,.codex-grade-grid,.codex-stack,.codex-list,.codex-course-grid{display:grid;gap:10px}
.codex-day{padding:12px 14px;border-radius:18px;background:#fff;border:1px solid rgba(20,48,74,.08)}
.codex-day-head{display:flex;justify-content:space-between;gap:8px;align-items:center;margin-bottom:10px}
.codex-day-head strong{font-size:15px}
.codex-gpa-box{padding:14px 16px;border-radius:18px;background:#fff;border:1px solid rgba(20,48,74,.08)}
.codex-gpa-box strong{display:block;font-size:30px;line-height:1}
.codex-gpa-box span{display:block;margin-top:8px;color:#64748b;font-size:14px}
.codex-overview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:18px}
.codex-metric{padding:16px 18px;border-radius:22px;background:linear-gradient(180deg,#ffffff,#edf4fb);border:1px solid rgba(20,48,74,.08)}
.codex-metric.buttonish{cursor:pointer;transition:transform 140ms ease,box-shadow 140ms ease}
.codex-metric.buttonish:hover{transform:translateY(-1px);box-shadow:0 12px 24px rgba(20,48,74,.08)}
.codex-metric strong{display:block;font-size:30px;line-height:1;letter-spacing:-.04em}
.codex-metric span{display:block;margin-top:8px;color:#5f6b7b;font-size:14px}
.codex-popover{margin:14px 0 18px;padding:14px;border-radius:20px;background:#f6f9fc;border:1px solid rgba(20,48,74,.08)}
.codex-section{overflow:hidden;border:1px solid rgba(20,48,74,.08);border-radius:24px;background:#ffffff}
.codex-section summary{list-style:none;cursor:pointer;padding:18px 20px;display:flex;justify-content:space-between;align-items:center;gap:16px}
.codex-section summary::-webkit-details-marker{display:none}
.codex-section summary:hover{background:#f7fafc}
.codex-section-title{display:grid;gap:4px}
.codex-section-title strong{font-size:18px}
.codex-section-title span{color:#64748b;font-size:14px}
.codex-chevron{width:36px;height:36px;border-radius:999px;background:#e7eef6;color:#15314d;display:inline-flex;align-items:center;justify-content:center;font-weight:700}
.codex-section[open] .codex-chevron{background:#14304a;color:#fff}
.codex-section-body{padding:0 16px 16px}
.codex-item{display:flex;justify-content:space-between;gap:14px;align-items:flex-start;padding:14px 16px;border-radius:18px;background:#f8fbfe;border:1px solid rgba(20,48,74,.08)}
.codex-main{min-width:0}
.codex-link{font-weight:700;color:#18324f;text-decoration:none}
.codex-link:hover{text-decoration:underline}
.codex-meta{margin-top:6px;color:#607086;font-size:14px;line-height:1.45}
.codex-pill{white-space:nowrap;padding:8px 12px;border-radius:999px;background:#e7f0f8;color:#14304a;font-weight:700;font-size:13px}
.codex-pill.warn{background:#ffebe6;color:#9f3117}
.codex-pill.good{background:#e7f7ed;color:#15603b}
.codex-course{padding:16px;border-radius:20px;background:#f8fbfe;border:1px solid rgba(20,48,74,.08)}
.codex-course-top{display:flex;justify-content:space-between;gap:14px;align-items:flex-start}
.codex-course-actions,.codex-item-actions{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}
.codex-mini{appearance:none;border:none;border-radius:999px;padding:8px 12px;font:inherit;font-size:13px;font-weight:700;cursor:pointer;background:#ddeaf4;color:#173451}
.codex-mini.ai{background:#14304a;color:#fff}
.codex-mini.done{background:#e7f5ea;color:#18553a}
.codex-empty,.codex-error,.codex-loading{padding:16px;border-radius:18px;background:#f8fbfe;color:#5f6b6d}
.codex-error{background:#fff0ec;color:#8a2d1d}
.codex-toast{position:fixed;right:24px;bottom:24px;background:#14304a;color:#fff;padding:14px 16px;border-radius:16px;box-shadow:0 20px 40px rgba(0,0,0,.22);max-width:320px}
@media (max-width:720px){.codex-shell{inset:8px;padding:14px;border-radius:24px}.codex-topbar{flex-direction:column}.codex-overview{grid-template-columns:1fr}.codex-section summary{padding:16px}.codex-utility-top{flex-direction:column}}
  `;
  document.head.appendChild(style);

  const overlay = document.createElement("div");
  overlay.id = OVERLAY_ID;
  overlay.innerHTML = `
    <div class="codex-shell">
      <div class="codex-topbar">
        <div class="codex-title">
          <h1>Student dashboard</h1>
          <p>Everything in one place, with collapsible sections for classes, missing work, due dates, tests, and study help.</p>
        </div>
        <div class="codex-actions">
          <button class="codex-button alt" data-action="toggle-grades">Grades</button>
          <button class="codex-button alt" data-action="toggle-calendar">Calendar</button>
          <button class="codex-button alt" data-action="toggle-gpa">GPA</button>
          <button class="codex-button" data-action="refresh">Refresh</button>
          <button class="codex-button warn" data-action="close">Close</button>
        </div>
      </div>
      <div class="codex-panel">
        <div id="codex-utility" class="codex-utility"></div>
        <div id="codex-metrics" class="codex-loading">Loading dashboard...</div>
        <div id="codex-missing-popover-anchor"></div>
        <div class="codex-stack">
          <details class="codex-section" open>
            <summary>
              <div class="codex-section-title">
                <strong>Needs Attention</strong>
                <span>Classes below a B+ or with missing work.</span>
              </div>
              <span class="codex-chevron">+</span>
            </summary>
            <div class="codex-section-body"><div id="codex-attention" class="codex-loading">Loading classes...</div></div>
          </details>
          <details class="codex-section" open>
            <summary>
              <div class="codex-section-title">
                <strong>My Classes</strong>
                <span>Filtered to keep your real academic classes.</span>
              </div>
              <span class="codex-chevron">+</span>
            </summary>
            <div class="codex-section-body"><div id="codex-courses" class="codex-loading">Loading courses...</div></div>
          </details>
          <details class="codex-section" open>
            <summary>
              <div class="codex-section-title">
                <strong>Missing Assignments</strong>
                <span>Mark items done locally when you finish them.</span>
              </div>
              <span class="codex-chevron">+</span>
            </summary>
            <div class="codex-section-body"><div id="codex-missing" class="codex-loading">Loading missing work...</div></div>
          </details>
          <details class="codex-section">
            <summary>
              <div class="codex-section-title">
                <strong>Due This Week</strong>
                <span>Your next assignments for the next 7 days.</span>
              </div>
              <span class="codex-chevron">+</span>
            </summary>
            <div class="codex-section-body"><div id="codex-week" class="codex-loading">Loading this week's work...</div></div>
          </details>
          <details class="codex-section">
            <summary>
              <div class="codex-section-title">
                <strong>Tests And Quizzes Coming</strong>
                <span>Upcoming assessments detected from Canvas titles.</span>
              </div>
              <span class="codex-chevron">+</span>
            </summary>
            <div class="codex-section-body"><div id="codex-tests" class="codex-loading">Loading upcoming tests...</div></div>
          </details>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);

  const byId = (id) => overlay.querySelector("#" + id);

  function saveDismissed() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(dismissedAssignments)));
  }

  function toast(message) {
    const existing = overlay.querySelector(".codex-toast");
    if (existing) existing.remove();
    const node = document.createElement("div");
    node.className = "codex-toast";
    node.textContent = message;
    overlay.appendChild(node);
    setTimeout(() => node.remove(), 2600);
  }

  function fmtDate(value) {
    if (!value) return "No due date";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "No due date";
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    }).format(date);
  }

  function dueInDays(value) {
    if (!value) return null;
    return Math.ceil((new Date(value).getTime() - Date.now()) / 86400000);
  }

  function isLikelyFillerCourse(course) {
    const haystack = ((course.name || "") + " " + (course.course_code || "")).toLowerCase();
    return ["homeroom", "advisory", "resource", "resources", "orientation", "sandbox", "test course", "demo", "training", "counseling", "student support", "welcome", "student summit", "ihs commons"].some((term) => haystack.includes(term));
  }

  function gradeScore(course) {
    const enrollment = course.enrollments?.find((entry) => entry.type === "student") || course.enrollments?.[0] || {};
    return typeof enrollment.computed_current_score === "number" ? enrollment.computed_current_score : null;
  }

  function gradeLabel(course) {
    const enrollment = course.enrollments?.find((entry) => entry.type === "student") || course.enrollments?.[0] || {};
    if (typeof enrollment.computed_current_score === "number") return Math.round(enrollment.computed_current_score * 10) / 10 + "%";
    return enrollment.computed_current_grade || "--";
  }

  function assignmentKey(item) {
    return String(item.assignment_id || item.plannable_id || item.id || item.html_url || item.title || item.name);
  }

  function itemTitle(item) {
    return item.title || item.assignment?.name || item.assignment_name || item.name || item.plannable?.title || "Untitled assignment";
  }

  function buildStudyPromptForCourse(course, courseItems) {
    const upcoming = courseItems.slice(0, 8).map((item) => "- " + itemTitle(item) + " (" + fmtDate(item.due_at || item.plannable_date) + ")").join("\n");
    return [
      "I am studying for " + course.name + ".",
      "Create a practice test and study guide based on these upcoming topics or assignments.",
      "Focus on helping me learn the material instead of giving me real test answers.",
      "Include:",
      "- a short summary of the main topics",
      "- 10 practice questions with answers explained",
      "- 3 harder challenge questions",
      "- a quick review checklist",
      "Upcoming items:",
      upcoming || "- No upcoming items listed"
    ].join("\n");
  }

  function buildStudyPromptForAssignment(item) {
    return [
      "Help me understand this assignment for " + (item.course_name || item.context_name || "this course") + ': "' + itemTitle(item) + '".',
      "Do not write the final submission for me.",
      "Instead, give me:",
      "- a plain-English explanation of what the assignment is asking",
      "- a checklist of what I should complete",
      "- a step-by-step plan to finish it",
      "- an outline or brainstorming help if writing is involved",
      "- 3 questions I should ask myself before turning it in",
      "Due date: " + fmtDate(item.due_at || item.plannable_date || item.assignment?.due_at)
    ].join("\n");
  }

  async function copyText(text, successMessage) {
    try {
      await navigator.clipboard.writeText(text);
      toast(successMessage);
    } catch {
      window.prompt("Copy this text:", text);
    }
  }

  async function fetchJson(path) {
    const response = await fetch(TARGET_ORIGIN + path, { credentials: "include", headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error("Canvas returned " + response.status + " for " + path);
    return response.json();
  }

  function renderError(id, error) {
    byId(id).className = "codex-error";
    byId(id).textContent = error.message || "Could not load this section.";
  }

  function renderEmpty(id, message) {
    byId(id).className = "codex-empty";
    byId(id).textContent = message;
  }

  function renderAssignmentList(targetId, items, emptyMessage) {
    if (!items.length) return renderEmpty(targetId, emptyMessage);
    byId(targetId).className = "codex-list";
    byId(targetId).innerHTML = items.map((item) => {
      const key = assignmentKey(item);
      const dueLabel = fmtDate(item.due_at || item.plannable_date || item.assignment?.due_at);
      const courseName = item.course_name || item.context_name || "Course";
      const dayCount = dueInDays(item.due_at || item.plannable_date || item.assignment?.due_at);
      const pill = dayCount === null ? dueLabel : dayCount < 0 ? "Past due" : dayCount === 0 ? "Due today" : dayCount === 1 ? "Due tomorrow" : "Due in " + dayCount + " days";
      return `
        <div class="codex-item">
          <div class="codex-main">
            <a class="codex-link" href="${item.html_url || "#"}" target="_blank" rel="noopener">${itemTitle(item)}</a>
            <div class="codex-meta">${courseName}<br>${dueLabel}</div>
            <div class="codex-item-actions">
              <button class="codex-mini ai" data-action="assignment-study" data-item-key="${key}">AI Study Prompt</button>
              <button class="codex-mini done" data-action="mark-done" data-item-key="${key}">Mark Done</button>
            </div>
          </div>
          <div class="codex-pill ${dayCount !== null && dayCount < 0 ? "warn" : ""}">${pill}</div>
        </div>
      `;
    }).join("");
  }

  function renderMetrics(data) {
    byId("codex-metrics").className = "codex-overview";
    byId("codex-metrics").innerHTML = `
      <div class="codex-metric"><strong>${data.realCourses.length}</strong><span>real classes</span></div>
      <div class="codex-metric"><strong>${data.attentionCourses.length}</strong><span>need attention</span></div>
      <button type="button" class="codex-metric buttonish" data-action="toggle-missing-popover"><strong>${data.missingItems.length}</strong><span>missing assignments</span></button>
    `;
    byId("codex-missing-popover-anchor").innerHTML = data.showMissingPopover ? `<div class="codex-popover" id="codex-missing-popover"></div>` : "";
    if (data.showMissingPopover) renderAssignmentList("codex-missing-popover", data.missingItems.slice(0, 8), "No missing assignments right now.");
  }

  function groupItemsByDay(items) {
    const groups = new Map();
    items.forEach((item) => {
      const raw = item.plannable_date || item.due_at || item.assignment?.due_at;
      if (!raw) return;
      const key = new Date(raw).toDateString();
      const list = groups.get(key) || [];
      list.push(item);
      groups.set(key, list);
    });
    return Array.from(groups.entries()).sort((a, b) => new Date(a[0]) - new Date(b[0]));
  }

  function estimateGpaValue(course) {
    const score = gradeScore(course);
    const letter = gradeLabel(course).toUpperCase();
    if (score !== null) {
      if (score >= 93) return 4.0;
      if (score >= 90) return 3.7;
      if (score >= 87) return 3.3;
      if (score >= 83) return 3.0;
      if (score >= 80) return 2.7;
      if (score >= 77) return 2.3;
      if (score >= 73) return 2.0;
      if (score >= 70) return 1.7;
      if (score >= 67) return 1.3;
      if (score >= 65) return 1.0;
      return 0.0;
    }
    if (letter.startsWith("A")) return letter === "A-" ? 3.7 : 4.0;
    if (letter.startsWith("B")) return letter === "B+" ? 3.3 : letter === "B-" ? 2.7 : 3.0;
    if (letter.startsWith("C")) return letter === "C+" ? 2.3 : letter === "C-" ? 1.7 : 2.0;
    if (letter.startsWith("D")) return letter === "D+" ? 1.3 : letter === "D-" ? 0.7 : 1.0;
    if (letter.startsWith("F")) return 0.0;
    return null;
  }

  function renderUtilityPanel(data) {
    const utility = byId("codex-utility");
    const mode = overlay.__utilityMode;
    if (!mode) {
      utility.className = "codex-utility";
      utility.innerHTML = "";
      return;
    }
    utility.className = "codex-utility active";

    if (mode === "calendar") {
      const grouped = groupItemsByDay(data.weekItems.slice(0, 20));
      utility.innerHTML = `
        <div class="codex-utility-top">
          <div class="codex-utility-title"><strong>Calendar View</strong><span>Your upcoming work grouped by day.</span></div>
          <button class="codex-mini" data-action="close-utility">Close panel</button>
        </div>
        <div id="codex-calendar-body" class="codex-calendar-days"></div>
      `;
      const body = utility.querySelector("#codex-calendar-body");
      body.innerHTML = grouped.length ? grouped.map(([day, items]) => `
        <div class="codex-day">
          <div class="codex-day-head">
            <strong>${new Intl.DateTimeFormat(undefined, { weekday: "long", month: "short", day: "numeric" }).format(new Date(day))}</strong>
            <span class="codex-pill">${items.length} item${items.length === 1 ? "" : "s"}</span>
          </div>
          <div class="codex-list">
            ${items.map((item) => `
              <div class="codex-item">
                <div class="codex-main">
                  <a class="codex-link" href="${item.html_url || "#"}" target="_blank" rel="noopener">${itemTitle(item)}</a>
                  <div class="codex-meta">${item.course_name || item.context_name || "Course"}<br>${fmtDate(item.plannable_date || item.due_at || item.assignment?.due_at)}</div>
                </div>
                <div class="codex-pill">${dueInDays(item.plannable_date || item.due_at || item.assignment?.due_at) === 0 ? "Today" : "Upcoming"}</div>
              </div>
            `).join("")}
          </div>
        </div>
      `).join("") : `<div class="codex-empty">Nothing upcoming on the calendar right now.</div>`;
      return;
    }

    if (mode === "grades") {
      utility.innerHTML = `
        <div class="codex-utility-top">
          <div class="codex-utility-title"><strong>Grades Snapshot</strong><span>Your current grades from the classes shown in this dashboard.</span></div>
          <button class="codex-mini" data-action="close-utility">Close panel</button>
        </div>
        <div class="codex-grade-grid">
          ${data.realCourses.map((course) => {
            const missingCount = data.missingByCourse.get(String(course.id)) || 0;
            const pillClass = gradeScore(course) !== null && gradeScore(course) >= 90 ? "good" : gradeScore(course) !== null && gradeScore(course) < 87 ? "warn" : "";
            return `
              <div class="codex-item">
                <div class="codex-main">
                  <a class="codex-link" href="${course.html_url || TARGET_ORIGIN + "/courses/" + course.id}" target="_blank" rel="noopener">${course.name}</a>
                  <div class="codex-meta">${missingCount ? missingCount + " missing assignment" + (missingCount === 1 ? "" : "s") : "No missing work flagged"}</div>
                </div>
                <div class="codex-pill ${pillClass}">${gradeLabel(course)}</div>
              </div>
            `;
          }).join("")}
        </div>
      `;
      return;
    }

    if (mode === "gpa") {
      const values = data.realCourses.map(estimateGpaValue).filter((value) => value !== null);
      const gpa = values.length ? (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(2) : "--";
      utility.innerHTML = `
        <div class="codex-utility-top">
          <div class="codex-utility-title"><strong>Estimated GPA</strong><span>Calculated from current classes using a standard unweighted 4.0 scale.</span></div>
          <button class="codex-mini" data-action="close-utility">Close panel</button>
        </div>
        <div class="codex-gpa-box">
          <strong>${gpa}</strong>
          <span>${values.length} class${values.length === 1 ? "" : "es"} included. This is an estimate and may not match your school's exact weighting rules.</span>
        </div>
      `;
    }
  }

  function renderAttention(data) {
    if (!data.attentionCourses.length) return renderEmpty("codex-attention", "Everything looks above your B+ line right now.");
    byId("codex-attention").className = "codex-list";
    byId("codex-attention").innerHTML = data.attentionCourses.map((course) => {
      const missingCount = data.missingByCourse.get(String(course.id)) || 0;
      const score = gradeScore(course);
      const status = missingCount > 0 ? missingCount + " missing" : score !== null ? Math.round(score * 10) / 10 + "%" : gradeLabel(course);
      return `
        <div class="codex-item">
          <div class="codex-main">
            <a class="codex-link" href="${course.html_url || TARGET_ORIGIN + "/courses/" + course.id}" target="_blank" rel="noopener">${course.name}</a>
            <div class="codex-meta">${missingCount > 0 ? "Missing work needs attention" : "Current grade is under B+"}</div>
          </div>
          <div class="codex-pill warn">${status}</div>
        </div>
      `;
    }).join("");
  }

  function renderCourses(data) {
    if (!data.realCourses.length) return renderEmpty("codex-courses", "No real classes were detected.");
    byId("codex-courses").className = "codex-course-grid";
    byId("codex-courses").innerHTML = data.realCourses.map((course) => {
      const courseItems = data.itemsByCourse.get(String(course.id)) || [];
      const missingCount = data.missingByCourse.get(String(course.id)) || 0;
      const score = gradeScore(course);
      const pillClass = score !== null && score >= 90 ? "good" : missingCount > 0 || (score !== null && score < 90) ? "warn" : "";
      return `
        <div class="codex-course">
          <div class="codex-course-top">
            <div class="codex-main">
              <a class="codex-link" href="${course.html_url || TARGET_ORIGIN + "/courses/" + course.id}" target="_blank" rel="noopener">${course.name}</a>
              <div class="codex-meta">${course.course_code || "Canvas course"}<br>${courseItems.length} upcoming item${courseItems.length === 1 ? "" : "s"}${missingCount ? " • " + missingCount + " missing" : ""}</div>
            </div>
            <div class="codex-pill ${pillClass}">${gradeLabel(course)}</div>
          </div>
          <div class="codex-course-actions">
            <button class="codex-mini ai" data-action="course-study" data-course-id="${course.id}">Study Prompt</button>
            <a class="codex-mini" href="${course.html_url || TARGET_ORIGIN + "/courses/" + course.id}" target="_blank" rel="noopener">Open Course</a>
          </div>
        </div>
      `;
    }).join("");
  }

  function detectTests(items) {
    return items.filter((item) => ["test", "quiz", "exam", "midterm", "final"].some((word) => itemTitle(item).toLowerCase().includes(word)));
  }

  async function load() {
    ["codex-metrics", "codex-attention", "codex-courses", "codex-missing", "codex-week", "codex-tests"].forEach((id) => {
      byId(id).className = "codex-loading";
      byId(id).textContent = "Loading...";
    });
    try {
      const today = new Date();
      const end = new Date(today);
      end.setDate(end.getDate() + 14);
      const [courses, plannerItems, missingItems] = await Promise.all([
        fetchJson("/api/v1/courses?enrollment_state=active&state[]=available&include[]=total_scores&per_page=100"),
        fetchJson("/api/v1/planner/items?start_date=" + encodeURIComponent(today.toISOString()) + "&end_date=" + encodeURIComponent(end.toISOString()) + "&per_page=100"),
        fetchJson("/api/v1/users/self/missing_submissions")
      ]);
      const realCourses = courses.filter((course) => !isLikelyFillerCourse(course));
      const realCourseIds = new Set(realCourses.map((course) => String(course.id)));
      const activePlannerItems = plannerItems.filter((item) => realCourseIds.has(String(item.course_id || item.context_id)));
      const activeMissingItems = missingItems.filter((item) => realCourseIds.has(String(item.course_id))).filter((item) => !dismissedAssignments.has(assignmentKey(item)));
      const weekItems = activePlannerItems.filter((item) => !dismissedAssignments.has(assignmentKey(item))).filter((item) => {
        const days = dueInDays(item.plannable_date || item.due_at);
        return days !== null && days <= 7;
      }).sort((a, b) => new Date(a.plannable_date || a.due_at) - new Date(b.plannable_date || b.due_at));
      const tests = detectTests(activePlannerItems).filter((item) => !dismissedAssignments.has(assignmentKey(item))).sort((a, b) => new Date(a.plannable_date || a.due_at) - new Date(b.plannable_date || b.due_at));
      const missingByCourse = new Map();
      activeMissingItems.forEach((item) => missingByCourse.set(String(item.course_id), (missingByCourse.get(String(item.course_id)) || 0) + 1));
      const itemsByCourse = new Map();
      activePlannerItems.forEach((item) => {
        const key = String(item.course_id || item.context_id);
        const list = itemsByCourse.get(key) || [];
        list.push(item);
        itemsByCourse.set(key, list);
      });
      const attentionCourses = realCourses.filter((course) => {
        const score = gradeScore(course);
        return (score !== null && score < 87) || (missingByCourse.get(String(course.id)) || 0) > 0;
      });
      const data = { realCourses, attentionCourses, missingItems: activeMissingItems, weekItems, tests, itemsByCourse, missingByCourse, showMissingPopover: overlay.__showMissingPopover || false };
      overlay.__dashboardData = data;
      renderMetrics(data);
      renderUtilityPanel(data);
      renderAttention(data);
      renderCourses(data);
      renderAssignmentList("codex-missing", activeMissingItems, "No missing assignments right now.");
      renderAssignmentList("codex-week", weekItems.slice(0, 12), "Nothing due this week.");
      renderAssignmentList("codex-tests", tests.slice(0, 12), "No upcoming tests or quizzes detected.");
    } catch (error) {
      ["codex-metrics", "codex-attention", "codex-courses", "codex-missing", "codex-week", "codex-tests"].forEach((id) => renderError(id, error));
    }
  }

  overlay.addEventListener("click", async (event) => {
    const trigger = event.target.closest("button,[data-action]");
    if (!trigger) return;
    const action = trigger.dataset.action;
    if (action === "close") { overlay.remove(); style.remove(); return; }
    if (action === "refresh") return load();
    if (action === "toggle-missing-popover") {
      overlay.__showMissingPopover = !overlay.__showMissingPopover;
      if (overlay.__dashboardData) {
        overlay.__dashboardData.showMissingPopover = overlay.__showMissingPopover;
        renderMetrics(overlay.__dashboardData);
      }
      return;
    }
    if (action === "toggle-grades" || action === "toggle-calendar" || action === "toggle-gpa") {
      const mode = action.replace("toggle-", "");
      overlay.__utilityMode = overlay.__utilityMode === mode ? "" : mode;
      if (overlay.__dashboardData) renderUtilityPanel(overlay.__dashboardData);
      return;
    }
    if (action === "close-utility") {
      overlay.__utilityMode = "";
      if (overlay.__dashboardData) renderUtilityPanel(overlay.__dashboardData);
      return;
    }
    if (action === "mark-done") {
      dismissedAssignments.add(trigger.dataset.itemKey);
      saveDismissed();
      toast("Marked done and hidden from missing work.");
      return load();
    }
    if (action === "assignment-study") {
      const data = overlay.__dashboardData;
      const allItems = [...(data?.missingItems || []), ...(data?.weekItems || []), ...(data?.tests || [])];
      const item = allItems.find((entry) => assignmentKey(entry) === trigger.dataset.itemKey);
      if (item) await copyText(buildStudyPromptForAssignment(item), "Study prompt copied for this assignment.");
      return;
    }
    if (action === "course-study") {
      const data = overlay.__dashboardData;
      const course = data?.realCourses.find((entry) => String(entry.id) === trigger.dataset.courseId);
      if (course) await copyText(buildStudyPromptForCourse(course, data.itemsByCourse.get(String(course.id)) || []), "Study prompt copied for this course.");
    }
  });

  load();
}

const bookmarkletCode = `javascript:(${dashboardBookmark.toString()})();`;

bookmarkCodeEl.value = bookmarkletCode;
dragBookmark.href = bookmarkletCode;

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#b42318" : "";
}

copyButton.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(bookmarkletCode);
    bookmarkCodeEl.focus();
    bookmarkCodeEl.select();
    setStatus("Bookmark code copied. Paste it into a new bookmark URL field.");
  } catch {
    bookmarkCodeEl.focus();
    bookmarkCodeEl.select();
    setStatus("Clipboard was blocked, so the code is selected for you to copy manually.", true);
  }
});
