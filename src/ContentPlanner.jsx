import { useState, useMemo } from "react";
import {
  Calendar, Instagram, Youtube, Linkedin, Twitter, Music2, Plus, X,
  Sparkles, Clock, Hash, FileText,
  ChevronLeft, ChevronRight, Trash2, Wand2,
  BarChart3, Download, Menu, ChevronRight as ChevronRightIcon,
  Share2, DollarSign
} from "lucide-react";
// Add these new imports
import AIGenerator from './components/AIGenerator';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ExportPanel from './components/ExportPanel';
import RepurposeHub from './components/RepurposeHub';
import MonetizationDashboard from './components/MonetizationDashboard';

const PLATFORMS = {
  instagram: { label: "Instagram", icon: Instagram, color: "#be3d12" },
  youtube: { label: "YouTube", icon: Youtube, color: "#c01818de" },
  linkedin: { label: "LinkedIn", icon: Linkedin, color: "#2F5C8A" },
  tiktok: { label: "TikTok", icon: Music2, color: "#25F4EE" },
  twitter: { label: "X", icon: Twitter, color: "#741fad" },
};

const FORMATS = ["Reel", "Carousel", "Static Post", "Long-form Video", "Short/Reel", "Article", "Thread", "Story"];

const IDEA_BANK = {
  instagram: [
    { title: "Behind-the-scenes of your process", format: "Reel", hook: "Nobody shows you THIS part of the process..." },
    { title: "Before/after transformation", format: "Carousel", hook: "Swipe to see what changed in 30 days" },
    { title: "3 mistakes beginners make", format: "Carousel", hook: "I wish someone told me this sooner" },
    { title: "Quick tip in 15 seconds", format: "Reel", hook: "Save this for later ↓" },
    { title: "Day in the life", format: "Story", hook: "Come along with me today" },
  ],
  youtube: [
    { title: "Full tutorial / how-to", format: "Long-form Video", hook: "By the end of this video, you'll be able to..." },
    { title: "I tried X for 30 days", format: "Long-form Video", hook: "Here's exactly what happened" },
    { title: "Answering your questions", format: "Short/Reel", hook: "You asked, I'm answering" },
    { title: "Tool/product comparison", format: "Long-form Video", hook: "Which one is actually worth your money?" },
  ],
  linkedin: [
    { title: "Lesson from a recent failure", format: "Article", hook: "I got this wrong. Here's what I learned." },
    { title: "Industry trend breakdown", format: "Thread", hook: "Everyone's talking about X. Here's what it actually means." },
    { title: "Career milestone reflection", format: "Static Post", hook: "One year ago I couldn't have imagined this." },
    { title: "Contrarian take on best practice", format: "Article", hook: "Unpopular opinion: X is overrated." },
  ],
  tiktok: [
    { title: "Trend remix with your niche twist", format: "Short/Reel", hook: "Using this sound but make it [your topic]" },
    { title: "POV skit", format: "Short/Reel", hook: "POV: you finally figured out..." },
    { title: "Rapid-fire tips", format: "Short/Reel", hook: "5 things in 30 seconds, go" },
  ],
  twitter: [
    { title: "Hot take thread", format: "Thread", hook: "Unpopular opinion:" },
    { title: "Lessons learned this week", format: "Thread", hook: "This week taught me:" },
    { title: "Resource roundup", format: "Thread", hook: "Bookmark this thread. Everything you need on X." },
  ],
};

const HASHTAG_BANK = {
  instagram: ["#contentcreator", "#smallbusiness", "#reelsinstagram", "#growthtips", "#creatoreconomy"],
  youtube: ["#youtubetips", "#tutorial", "#howto", "#creator"],
  linkedin: ["#leadership", "#careergrowth", "#futureofwork", "#personalbranding"],
  tiktok: ["#fyp", "#learnontiktok", "#smallbiztok", "#tiktoktips"],
  twitter: ["#buildinpublic", "#threads", "#growth"],
};

// const STORAGE_KEY_ITEMS = "content-planner:items";
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function uid() { return Math.random().toString(36).slice(2, 10); }
function fmtDate(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`; }

const seedItems = () => {
  const today = new Date();
  const mk = (offset, platform, title, format, status) => {
    const d = new Date(today); d.setDate(d.getDate() + offset);
    return { id: uid(), date: fmtDate(d), platform, title, format, status, caption: "", hashtags: "" };
  };
  return [
    mk(0, "instagram", "Studio setup tour", "Reel", "scheduled"),
    mk(1, "linkedin", "What I learned shipping v2", "Article", "draft"),
    mk(2, "youtube", "Full walkthrough: editing workflow", "Long-form Video", "idea"),
    mk(4, "tiktok", "3 tools I can't work without", "Short/Reel", "idea"),
    mk(-1, "instagram", "Client result carousel", "Carousel", "published"),
  ];
};

export default function ContentPlanner() {
  const [items, setItems] = useState(seedItems);
  const [view, setView] = useState("calendar"); // calendar | ideas | repurpose | schedule
  const [cursor, setCursor] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [platformFilter, setPlatformFilter] = useState("all");
  const [editingItem, setEditingItem] = useState(null);
  const [ideaPlatform, setIdeaPlatform] = useState("instagram");
  const [scriptTopic, setScriptTopic] = useState("");
  const [scriptOut, setScriptOut] = useState(null);
  const [toast, setToast] = useState(null);
  const [filterStatus, setFilterStatus] = useState(null);

  const [navOpen, setNavOpen] = useState(true);

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 1800); };

  const filteredItems = useMemo(
    () => items.filter(i => {
      const platformMatch = platformFilter === "all" || i.platform === platformFilter;
      const statusMatch = !filterStatus || i.status === filterStatus;
      return platformMatch && statusMatch;
    }),
    [items, platformFilter, filterStatus]
  );

  const itemsByDate = useMemo(() => {
    const map = {};
    filteredItems.forEach(i => { (map[i.date] ||= []).push(i); });
    return map;
  }, [filteredItems]);

  const monthGrid = useMemo(() => {
    const year = cursor.getFullYear(), month = cursor.getMonth();
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  function addItem(date, platform) {
    const item = { id: uid(), date: fmtDate(date), platform, title: "New idea", format: FORMATS[0], status: "idea", caption: "", hashtags: "" };
    setItems(prev => [...prev, item]);
    setEditingItem(item.id);
  }

  function updateItem(id, patch) {
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...patch } : i));
  }

  function deleteItem(id) {
    setItems(prev => prev.filter(i => i.id !== id));
    setEditingItem(null);
  }

  function cycleStatus(id) {
    const order = ["idea", "draft", "scheduled", "published"];
    setItems(prev => prev.map(i => {
      if (i.id !== id) return i;
      const next = order[(order.indexOf(i.status) + 1) % order.length];
      return { ...i, status: next };
    }));
  }

  function addIdeaToCalendar(idea, platform) {
    const d = selectedDate || new Date();
    const item = { id: uid(), date: fmtDate(d), platform, title: idea.title, format: idea.format, status: "idea", caption: idea.hook, hashtags: "" };
    setItems(prev => [...prev, item]);
    showToast(`Added "${idea.title}" to ${fmtDate(d)}`);
  }

  // function generateRepurpose() {
  //   if (!repurposeText.trim()) return;
  //   const base = repurposeText.trim();
  //   const shortLine = base.length > 90 ? base.slice(0, 87) + "…" : base;
  //   setRepurposeOut({
  //     instagram: {
  //       format: "Carousel (5–7 slides)",
  //       content: `Slide 1 — Hook: "${shortLine}"\nSlide 2–5: break the core idea into one point per slide, one sentence each.\nSlide 6: key takeaway, bolded.\nSlide 7: CTA — "Save this + follow for more."`
  //     },
  //     youtube: {
  //       format: "Short (30–45s)",
  //       content: `Cold open on the single strongest claim from the piece.\nCut to 2–3 quick supporting beats, jump cuts, on-screen text for each.\nEnd on the takeaway line, spoken directly to camera.`
  //     },
  //     linkedin: {
  //       format: "Text post",
  //       content: `Open with a 1-line contrarian or personal framing of: "${shortLine}"\nFollow with 3 short paragraphs expanding the idea, one insight per paragraph.\nClose with a question to invite comments.`
  //     },
  //     twitter: {
  //       format: "Thread (5–8 tweets)",
  //       content: `Tweet 1: the hook, standalone and punchy.\nTweets 2–6: one idea per tweet, numbered.\nFinal tweet: summary + link back to the full piece.`
  //     },
  //     tiktok: {
  //       format: "Short/Reel (15–30s)",
  //       content: `Text overlay states the hook in the first 2 seconds.\nQuick cuts illustrating each point, captions burned in.\nEnd card: "follow for part 2" or similar loop-back CTA.`
  //     },
  //   });
  // }

  function generateScript() {
    if (!scriptTopic.trim()) return;
    const topic = scriptTopic.trim();
    setScriptOut({
      topic,
      hook: `Stop scrolling — here's why "${topic}" matters more than you think.`,
      beats: [
        { label: "Hook (0–3s)", text: `Open on the boldest claim or biggest mistake about ${topic}. No intro, no "hey guys."` },
        { label: "Setup (3–10s)", text: `One sentence framing the problem or question the viewer has about ${topic}.` },
        { label: "Value (10–40s)", text: `Deliver 2–3 concrete points. Use on-screen text for each point. Show, don't just tell — b-roll or demo if possible.` },
        { label: "Payoff (40–50s)", text: `Land the single takeaway in one clear sentence. This is the line people will screenshot/quote.` },
        { label: "CTA (50–60s)", text: `Direct ask: "Follow for part 2" / "Comment X for the template" / "Save this."` },
      ],
      caption: `${topic} — here's what actually works (and what doesn't). Save this for later.`,
    });
  }

  const totalScheduled = items.filter(i => i.status === "scheduled").length;
  const totalPublished = items.filter(i => i.status === "published").length;
  const totalIdeas = items.filter(i => i.status === "idea").length;
  const totalDraft = items.filter(i => i.status === "draft").length;

  const NAV = [
    { id: "calendar", label: "Calendar", icon: Calendar },
    { id: "ideas", label: "Idea Bank", icon: Sparkles },
    { id: "script", label: "Script Builder", icon: FileText },
    { id: "repurpose", label: "Repurpose Hub", icon: Share2 },
    { id: "schedule", label: "Best Times", icon: Clock },
    { id: "ai", label: "AI Generator", icon: Sparkles },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "export", label: "Export", icon: Download },
    { id: "monetization", label: "Monetization", icon: DollarSign },
  ];

  return (
    <div style={styles.app}>
      <style>{fontImports}</style>
      {toast && <div style={styles.toast}>{toast}</div>}

      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>

          <button
            onClick={() => setNavOpen(!navOpen)}
            style={styles.hamburgerBtn}
            className="hamburger-btn"
            aria-label="Toggle navigation"
          >
            <Menu size={20} color="#FFFFFF" />
          </button>

          <div style={styles.logoMark}>CP</div>
          <div>
            <div style={styles.wordmark}>The Desk</div>
            <div style={styles.tagline}>content planning &amp; production</div>
          </div>
        </div>
        <div style={styles.statRow}>
          <Stat label="Ideas" value={totalIdeas} color="#5C7A6B" active={filterStatus === 'idea'}
            onClick={() => setFilterStatus(filterStatus === 'idea' ? null : 'idea')} />
          <Stat label="Drafts" value={totalDraft} color="#B5502F" active={filterStatus === 'draft'}
            onClick={() => setFilterStatus(filterStatus === 'draft' ? null : 'draft')} />
          <Stat label="Scheduled" value={totalScheduled} color="#2F5C8A" active={filterStatus === 'scheduled'}
            onClick={() => setFilterStatus(filterStatus === 'scheduled' ? null : 'scheduled')} />
          <Stat label="Published" value={totalPublished} color="#8BC34A" active={filterStatus === 'published'}
            onClick={() => setFilterStatus(filterStatus === 'published' ? null : 'published')} />
        </div>
      </header>

      <div style={styles.body}>
        {/* Sidebar nav */}
        <nav style={{
          ...styles.nav,
          // display: navOpen ? 'flex' : 'none',
          transform: navOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          // boxShadow: navOpen ? '2px 0 20px rgba(0,0,0,0.3)' : 'none',
        }}>
          {NAV.map(n => {
            const Icon = n.icon;
            const active = view === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setView(n.id)}
                style={{ ...styles.navBtn, ...(active ? styles.navBtnActive : {}) }}
              >
                <Icon size={16} strokeWidth={2} />
                <span>{n.label}</span>
                {active && <span style={styles.navIndicator} />}
              </button>
            );
          })}
          <div style={styles.navDivider} />
          <div style={styles.navLabel}>Filter platform</div>
          <button onClick={() => setPlatformFilter("all")} style={{ ...styles.navBtn, ...(platformFilter === "all" ? styles.navBtnActive : {}) }}>
            <span style={styles.dot} /><span>All platforms</span>
          </button>
          {Object.entries(PLATFORMS).map(([key, p]) => {
            const Icon = p.icon;
            return (
              <button key={key} onClick={() => setPlatformFilter(key)} style={{ ...styles.navBtn, ...(platformFilter === key ? styles.navBtnActive : {}) }}>
                <Icon size={16} color={p.color} strokeWidth={2} />
                <span>{p.label}</span>
              </button>
            );
          })}

          {/* NEW: Mobile close button */}
          <button
            onClick={() => setNavOpen(false)}
            style={styles.navCloseBtn}
          >
            <X size={18} />
            Close Menu
          </button>
        </nav>

        {/* Main panel */}
        <main style={{
          ...styles.main,
          marginLeft: navOpen ? '220px' : '0',
          transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          width: navOpen ? 'calc(100% - 220px)' : '100%',
        }}>
          {/* Toggle button when nav is closed */}
          {!navOpen && (
            <button
              onClick={() => setNavOpen(true)}
              style={styles.navOpenBtn}
            >
              <ChevronRightIcon size={18} color="#FFFFFF" />
              <span style={styles.navOpenLabel}>Open Menu</span>
            </button>
          )}
          {/* Filter Status Bar */}
          {filterStatus && (
            <div style={styles.filterStatusBar}>
              <span style={styles.filterStatusLabel}>
                🔍 Showing: <strong>{filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}</strong>
                {' '}({filteredItems.length} {filteredItems.length === 1 ? 'item' : 'items'})
              </span>
              <button
                onClick={() => setFilterStatus(null)}
                style={styles.filterClearBtn}
              >
                <X size={14} />
                Clear Filter
              </button>
            </div>
          )}


          {view === "calendar" && (
            <CalendarView
              cursor={cursor} setCursor={setCursor} monthGrid={monthGrid}
              itemsByDate={itemsByDate} selectedDate={selectedDate} setSelectedDate={setSelectedDate}
              addItem={addItem} editingItem={editingItem} setEditingItem={setEditingItem}
              updateItem={updateItem} deleteItem={deleteItem} cycleStatus={cycleStatus}
            />
          )}
          {view === "ideas" && (
            <IdeaBankView
              ideaPlatform={ideaPlatform} setIdeaPlatform={setIdeaPlatform}
              addIdeaToCalendar={addIdeaToCalendar} selectedDate={selectedDate}
            />
          )}
          {view === "script" && (
            <ScriptView scriptTopic={scriptTopic} setScriptTopic={setScriptTopic} scriptOut={scriptOut} generateScript={generateScript} />
          )}
          {view === "repurpose" && (
            <RepurposeHub
              onAddToCalendar={(item) => {
                setItems(prev => [...prev, item]);
                showToast(`✅ ${item.platform} content added to calendar!`);
              }}
            />
          )}
          {view === "schedule" && <ScheduleView />}
          {view === "ai" && (
            <AIGenerator
              onAddToCalendar={(item) => {
                setItems(prev => [...prev, item]);
                showToast(`✨ AI generated "${item.title}" added to calendar`);
              }}
              selectedDate={selectedDate}
            />
          )}
          {view === "analytics" && (
            <AnalyticsDashboard items={items} />
          )}
          {view === "export" && (
            <ExportPanel items={items} />
          )}
          {view === "monetization" && (
            <MonetizationDashboard items={items} />
          )}
        </main>
      </div>
    </div>
  );
}

function Stat({ label, value, color, active, onClick }) {
  return (
    <div style={{
      ...styles.statItem,
      ...(active ? styles.statItemActive : {}),
      ...(onClick ? { cursor: 'pointer' } : {}),
    }}
      onClick={onClick}
    >
      <div style={{
        ...styles.statValue,
        color: active ? color : color,
        ...(active ? styles.statValueActive : {}),
      }}>{value}</div>
      <div style={styles.statLabel}>{label}</div>
      {active && <div style={styles.statActiveIndicator} />}
    </div>
  );
}

/* ---------------- CALENDAR ---------------- */
function CalendarView({ cursor, setCursor, monthGrid, itemsByDate, setSelectedDate, addItem, editingItem, setEditingItem, updateItem, deleteItem, cycleStatus }) {
  const today = fmtDate(new Date());
  return (
    <div>
      <div style={styles.panelHeader}>
        <div style={styles.monthNavRow}>
          <button style={styles.iconBtn} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}><ChevronLeft size={18} /></button>
          <h2 style={styles.monthTitle}>{monthNames[cursor.getMonth()]} <span style={styles.monthYear}>{cursor.getFullYear()}</span></h2>
          <button style={styles.iconBtn} onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}><ChevronRight size={18} /></button>
        </div>
        <button style={styles.todayBtn} onClick={() => setCursor(new Date())}>Today</button>
      </div>

      <div style={styles.weekRow}>
        {dayNames.map(d => <div key={d} style={styles.weekDayLabel}>{d}</div>)}
      </div>

      <div style={styles.grid}>
        {monthGrid.map((d, idx) => {
          if (!d) return <div key={idx} style={styles.emptyCell} />;
          const key = fmtDate(d);
          const dayItems = itemsByDate[key] || [];
          const isToday = key === today;
          return (
            <div key={idx} style={{ ...styles.dayCell, ...(isToday ? styles.dayCellToday : {}) }} onClick={() => setSelectedDate(d)}>
              <div style={styles.dayCellTop}>
                <span style={{ ...styles.dayNum, ...(isToday ? styles.dayNumToday : {}) }}>{d.getDate()}</span>
                <button style={styles.addDayBtn} onClick={(e) => { e.stopPropagation(); addItem(d, "instagram"); }}><Plus size={12} /></button>
              </div>
              <div style={styles.dayItems}>
                {dayItems.slice(0, 3).map(i => {
                  const P = PLATFORMS[i.platform];
                  const Icon = P.icon;
                  return (
                    <div key={i.id} style={{ ...styles.pill, borderColor: P.color }} onClick={(e) => { e.stopPropagation(); setEditingItem(i.id); }}>
                      <Icon size={10} color={P.color} />
                      <span style={styles.pillText}>{i.title}</span>
                      <StatusDot status={i.status} />
                    </div>
                  );
                })}
                {dayItems.length > 3 && <div style={styles.moreLabel}>+{dayItems.length - 3} more</div>}
              </div>
            </div>
          );
        })}
      </div>

      {editingItem && (
        <ItemEditor
          item={findItemGlobal(itemsByDate, editingItem)}
          onClose={() => setEditingItem(null)}
          onUpdate={updateItem}
          onDelete={deleteItem}
          onCycle={cycleStatus}
        />
      )}
    </div>
  );
}

function findItemGlobal(itemsByDate, id) {
  for (const arr of Object.values(itemsByDate)) {
    const found = arr.find(i => i.id === id);
    if (found) return found;
  }
  return null;
}

function StatusDot({ status }) {
  const colors = { idea: "#9AA79C", draft: "#B5502F", scheduled: "#2F5C8A", published: "#1E2320" };
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: colors[status], flexShrink: 0 }} />;
}

function ItemEditor({ item, onClose, onUpdate, onDelete, onCycle }) {
  if (!item) return null;
  // const P = PLATFORMS[item.platform];
  const statusLabels = { idea: "Idea", draft: "Draft", scheduled: "Scheduled", published: "Published" };
  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modalCard} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <select value={item.platform} onChange={e => onUpdate(item.id, { platform: e.target.value })} style={styles.selectInput}>
            {Object.entries(PLATFORMS).map(([k, p]) => <option key={k} value={k}>{p.label}</option>)}
          </select>
          <button style={styles.iconBtn} onClick={onClose}> <X size={16} /></button>
        </div>
        <input
          value={item.title}
          onChange={e => onUpdate(item.id, { title: e.target.value })}
          style={styles.titleInput}
          placeholder="Content title"
        />
        <div style={styles.editorRow}>
          <select value={item.format} onChange={e => onUpdate(item.id, { format: e.target.value })} style={styles.selectInputSmall}>
            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <input type="date" value={item.date} onChange={e => onUpdate(item.id, { date: e.target.value })} style={styles.selectInputSmall} />
          <button style={styles.statusBtn} onClick={() => onCycle(item.id)}>
            <StatusDot status={item.status} /> {statusLabels[item.status]}
          </button>
        </div>
        <label style={styles.fieldLabel}>Caption / hook</label>
        <textarea value={item.caption} onChange={e => onUpdate(item.id, { caption: e.target.value })} style={styles.textarea} rows={3} placeholder="Write your caption or hook..." />
        <label style={styles.fieldLabel}>Hashtags</label>
        <input value={item.hashtags} onChange={e => onUpdate(item.id, { hashtags: e.target.value })} style={styles.selectInput} placeholder="#tag1 #tag2 #tag3" />
        <div style={styles.modalFooter}>
          <button style={styles.dangerBtn} onClick={() => onDelete(item.id)}><Trash2 size={13} /> Delete</button>
          <button style={styles.primaryBtn} onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- IDEA BANK ---------------- */
function IdeaBankView({ ideaPlatform, setIdeaPlatform, addIdeaToCalendar, selectedDate }) {
  const ideas = IDEA_BANK[ideaPlatform];
  const tags = HASHTAG_BANK[ideaPlatform];
  return (
    <div>
      <SectionHeader
        eyebrow="Generate"
        title="Idea Bank"
        desc={`Ready-to-use concepts for ${PLATFORMS[ideaPlatform].label}${selectedDate ? ` — adding to ${fmtDate(selectedDate)}` : " — pick a calendar day first, or add to today"}.`}
      />
      <div style={styles.platformTabs}>
        {Object.entries(PLATFORMS).map(([key, p]) => {
          const Icon = p.icon;
          const active = ideaPlatform === key;
          return (
            <button key={key} onClick={() => setIdeaPlatform(key)} style={{ ...styles.platformTab, ...(active ? { borderColor: p.color, color: p.color, background: "#FBF8F1" } : {}) }}>
              <Icon size={14} /> {p.label}
            </button>
          );
        })}
      </div>

      <div style={styles.cardGrid}>
        {ideas.map((idea, idx) => (
          <div key={idx} style={{ ...styles.ideaCard, transform: `rotate(${(idx % 2 === 0 ? -1 : 1) * (0.4 + (idx % 3) * 0.3)}deg)` }}>
            <div style={styles.ideaFormatTag}>{idea.format}</div>
            <div style={styles.ideaTitle}>{idea.title}</div>
            <div style={styles.ideaHook}>"{idea.hook}"</div>
            <button style={styles.ideaAddBtn} onClick={() => addIdeaToCalendar(idea, ideaPlatform)}>
              <Plus size={13} /> Add to calendar
            </button>
          </div>
        ))}
      </div>

      <SectionHeader eyebrow="Suggested" title="Hashtags" desc="A starting set — swap in niche-specific tags for reach." small />
      <div style={styles.tagRow}>
        {tags.map(t => (
          <span key={t} style={styles.hashtagChip}><Hash size={11} />{t.replace("#", "")}</span>
        ))}
      </div>
    </div>
  );
}

/* ---------------- SCRIPT BUILDER ---------------- */
function ScriptView({ scriptTopic, setScriptTopic, scriptOut, generateScript }) {
  return (
    <div>
      <SectionHeader eyebrow="Build" title="Script Builder" desc="Turn a topic into a beat-by-beat short-video script." />
      <div style={styles.inputRow}>
        <input
          value={scriptTopic}
          onChange={e => setScriptTopic(e.target.value)}
          placeholder="e.g. why most people fail at consistency"
          style={styles.bigInput}
          onKeyDown={e => e.key === "Enter" && generateScript()}
        />
        <button style={styles.primaryBtn} onClick={generateScript}><Wand2 size={14} /> Generate script</button>
      </div>

      {scriptOut && (
        <div style={styles.scriptCard}>
          <div style={styles.scriptHookLine}>"{scriptOut.hook}"</div>
          <div style={styles.scriptBeats}>
            {scriptOut.beats.map((b, i) => (
              <div key={i} style={styles.scriptBeatRow}>
                <div style={styles.scriptBeatLabel}>{b.label}</div>
                <div style={styles.scriptBeatText}>{b.text}</div>
              </div>
            ))}
          </div>
          <div style={styles.scriptCaptionBox}>
            <div style={styles.fieldLabel}>Suggested caption</div>
            <div style={styles.scriptCaptionText}>{scriptOut.caption}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- REPURPOSE ---------------- */
// function RepurposeView({ repurposeText, setRepurposeText, repurposeOut, generateRepurpose }) {
//   return (
//     <div>
//       <SectionHeader eyebrow="Transform" title="Repurpose" desc="Paste one idea, main point, or existing post — get a plan for every platform." />
//       <textarea
//         value={repurposeText}
//         onChange={e => setRepurposeText(e.target.value)}
//         placeholder="Paste your blog intro, video summary, or core idea here..."
//         style={{ ...styles.textarea, minHeight: 90 }}
//         rows={4}
//       />
//       <button style={{ ...styles.primaryBtn, marginTop: 10 }} onClick={generateRepurpose}><Repeat2 size={14} /> Repurpose across platforms</button>

//       {repurposeOut && (
//         <div style={styles.repurposeGrid}>
//           {Object.entries(repurposeOut).map(([key, val]) => {
//             const P = PLATFORMS[key];
//             const Icon = P.icon;
//             return (
//               <div key={key} style={styles.repurposeCard}>
//                 <div style={styles.repurposeCardHead}>
//                   <Icon size={15} color={P.color} />
//                   <span style={{ color: P.color, fontWeight: 600 }}>{P.label}</span>
//                   <span style={styles.repurposeFormatTag}>{val.format}</span>
//                 </div>
//                 <div style={styles.repurposeContent}>{val.content}</div>
//               </div>
//             );
//           })}
//         </div>
//       )}
//     </div>
//   );
// }

/* ---------------- SCHEDULE / BEST TIMES ---------------- */
const BEST_TIMES = {
  instagram: [{ day: "Tue–Thu", time: "11am–1pm & 7–9pm", note: "Reels peak in evening scroll windows" }],
  youtube: [{ day: "Fri–Sat", time: "2–4pm", note: "Weekend leisure viewing" }],
  linkedin: [{ day: "Tue–Thu", time: "8–10am", note: "Commute + start-of-workday browsing" }],
  tiktok: [{ day: "Tue, Thu, Sun", time: "7–9pm", note: "Evening leisure scrolling" }],
  twitter: [{ day: "Mon–Fri", time: "8–10am & 6–7pm", note: "News-cycle and commute windows" }],
};

function ScheduleView() {
  return (
    <div>
      <SectionHeader eyebrow="Optimize" title="Best Publishing Times" desc="General benchmarks — validate against your own audience insights over time." />
      <div style={styles.scheduleList}>
        {Object.entries(PLATFORMS).map(([key, p]) => {
          const Icon = p.icon;
          const info = BEST_TIMES[key][0];
          return (
            <div key={key} style={styles.scheduleRow}>
              <div style={styles.scheduleRowLeft}>
                <Icon size={18} color={p.color} />
                <span style={{ fontWeight: 600, color: "#1E2320" }}>{p.label}</span>
              </div>
              <div style={styles.scheduleRowMid}>
                <span style={styles.scheduleDay}>{info.day}</span>
                <span style={styles.scheduleTime}>{info.time}</span>
              </div>
              <div style={styles.scheduleNote}>{info.note}</div>
            </div>
          );
        })}
      </div>
      <div style={styles.tipBox}>
        <strong>Rule of thumb:</strong> consistency beats perfect timing. Pick a cadence you can sustain — 3x/week beats a daily streak you abandon after two weeks.
      </div>
    </div>
  );
}

function SectionHeader({ eyebrow, title, desc, small }) {
  return (
    <div style={{ marginBottom: small ? 12 : 20 }}>
      <div style={styles.eyebrow}>{eyebrow}</div>
      <h2 style={small ? styles.sectionTitleSmall : styles.sectionTitle}>{title}</h2>
      {desc && <p style={styles.sectionDesc}>{desc}</p>}
    </div>
  );
}

/* ---------------- STYLES ---------------- */
const fontImports = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,500&family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
`;

const styles = {
  app: {
    fontFamily: "'Inter', sans-serif",
    background: "#1E2320",
    color: "#4B4640",
    minHeight: "100%",
    padding: 0,
  },
  toast: {
    position: "fixed", top: 16, right: 16, background: "#1E2320", color: "#F4EFE4",
    padding: "10px 16px", borderRadius: 6, fontSize: 13, fontFamily: "'Inter', sans-serif",
    zIndex: 999, boxShadow: "0 8px 24px rgba(0,0,0,0.3)",
  },
  header: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "18px 24px", borderBottom: "1px solid #3C4A45", background: "#1E2320",
    position: "fixed", left: 0, right: 0, top: 0, height: "78px",
    boxSizing: "border-box",
    zIndex: 1001,
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 12, flexShrink: 0 },
  logoMark: {
    width: 38, height: 38, borderRadius: 8, background: "#5C7A6B", color: "#F4EFE4",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 15, flexShrink: 0,
  },
  wordmark: { fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 20, color: "#F4EFE4", lineHeight: 1.1 },
  tagline: { fontSize: 11, color: "#9AA79C", fontFamily: "'IBM Plex Mono', monospace", letterSpacing: 0.3 },
  statRow: { display: "flex", gap: 22, flexShrink: 0, },
  statItem: {
    textAlign: "center", padding: "6px 14px",
    borderRadius: 8,
    transition: "all 0.2s ease",
    position: "relative",
    cursor: "pointer",
    ':hover': {
      background: "rgba(255,255,255,0.05)",
    },
  },
    statItemActive: {
      background: "rgba(255,255,255,0.08)",
      boxShadow: "0 0 0 2px rgba(255,255,255,0.1)",
    },
    statValueActive: {
      transform: "scale(1.1)",
    },
    statActiveIndicator: {
      width: 4,
      height: 4,
      borderRadius: "50%",
      margin: "4px auto 0",
      transition: "all 0.3s ease",
    },
    statValue: { fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 22, lineHeight: 1, transition: "color 0.2s ease", },
    statLabel: { fontSize: 10, color: "#9AA79C", fontFamily: "'IBM Plex Mono', monospace", marginTop: 2, textTransform: "uppercase", letterSpacing: 0.5 },

    filterStatusBar: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "10px 16px",
      background: "#E4EBE6",
      borderRadius: 8,
      marginBottom: 16,
      border: "1px solid #5C7A6B",
    },
    filterStatusLabel: {
      fontSize: 13,
      color: "#3C4A45",
      fontFamily: "'Inter', sans-serif",
    },
    filterClearBtn: {
      display: "flex",
      alignItems: "center",
      gap: 4,
      padding: "4px 12px",
      background: "transparent",
      border: "1px solid #3C4A45",
      borderRadius: 4,
      fontSize: 12,
      color: "#3C4A45",
      cursor: "pointer",
      transition: "all 0.2s ease",
      ':hover': {
        background: "#3C4A45",
        color: "#F4EFE4",
      },
    },

    body: {
      display: "flex", minHeight: "calc(100vh - 78px)", position: "relative",
      overflow: "hidden",
    },
    nav: {
      width: 220, minWidth: 220, padding: "18px 12px", borderRight: "1px solid #3C4A45", display: "flex", flexDirection: "column", gap: 3, position: 'fixed',
      left: 0,
      top: 78, bottom: 0,
      background: '#1E2320',
      zIndex: 100,
      overflowY: 'auto',
      transform: 'translateX(0)',
      opacity: 1,
      pointerEvents: 'auto',
      transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      boxShadow: "2px 0 20px rgba(0,0,0,0.3)",
    },
    navClosed: {
      transform: 'translateX(-100%)',
      opacity: 0,
      pointerEvents: 'none',
    },
    navOpen: {
      transform: 'translateX(0)',
      opacity: 1,
      pointerEvents: 'auto',
    },
    navLabel: { fontSize: 10, color: "#7C8A83", fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: 0.5, padding: "6px 10px 2px" },
    navDivider: { height: 1, background: "#3C4A45", margin: "10px 4px" },
    navBtn: {
      display: "flex", alignItems: "center", gap: 9, padding: "9px 10px", borderRadius: 6,
      background: "transparent", border: "none", color: "#B8C0BB", fontSize: 13, fontFamily: "'Inter', sans-serif",
      cursor: "pointer", textAlign: "left", transition: "background 0.15s", position: 'relative', width: '100%',
    },
    navBtnActive: { background: "#2C3630", color: "#F4EFE4", fontWeight: 600 },
    navIndicator: {
      position: 'absolute',
      right: 8,
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: '#5C7A6B',
    },
    dot: { width: 8, height: 8, borderRadius: "50%", border: "1.5px solid #9AA79C", display: "inline-block" },
    hamburgerBtn: {
      background: '#2C3630',
      border: '1px solid #3C4A45',
      color: '#F4EFE4',
      cursor: 'pointer',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 6,
      transition: 'all 0.2s',
      minWidth: '40px',
      minHeight: '40px',
      ':hover': {
        background: '#2C3630',
      },
    },
    navOpenBtn: {
      position: 'fixed',
      left: 16,
      top: 90,
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      padding: '10px 14px',
      background: '#1E2320',
      border: '1px solid #3C4A45',
      borderRadius: 8,
      color: '#F4EFE4',
      cursor: 'pointer',
      zIndex: 99,
      transition: 'all 0.2s',
      fontFamily: "'Inter', sans-serif",
      fontSize: 13,
      ':hover': {
        background: '#2C3630',
        borderColor: '#5C7A6B',
      },
    },
    navOpenLabel: {
      fontSize: 12,
      fontWeight: 500,
      color: '#FFFFFF'
    },
    navCloseBtn: {
      display: 'flex', // Hidden on desktop, shown on mobile
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
      padding: '8px 12px',
      marginTop: 'auto',
      background: '#2C3630',
      border: '1px solid #3C4A45',
      borderRadius: 6,
      color: '#F4EFE4',
      cursor: 'pointer',
      fontFamily: "'Inter', sans-serif",
      fontSize: 12,
      ':hover': {
        background: '#3C4A45',
      },
    },
    main: {
      flex: 1, padding: "22px 28px", paddingTop: "100px", background: "#F4EFE4", borderRadius: "16px 0 0 0", overflowY: "auto", minHeight: 'calc(100vh - 78px)',
      marginLeft: "220px", transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)', width: 'calc(100% - 220px)', position: "relative",
    },

    panelHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
    monthNavRow: { display: "flex", alignItems: "center", gap: 6 },
    monthTitle: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 24, color: "#1E2320", margin: 0 },
    monthYear: { color: "#9AA79C", fontWeight: 400 },
    iconBtn: { background: "#EAE3D3", border: "1px solid #DCD3BE", borderRadius: 6, width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1E2320" },
    todayBtn: { background: "transparent", border: "1px solid #5C7A6B", color: "#5C7A6B", borderRadius: 6, padding: "6px 14px", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", cursor: "pointer", fontWeight: 500 },

    weekRow: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 },
    weekDayLabel: { textAlign: "center", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: "#9AA79C", textTransform: "uppercase", letterSpacing: 0.5, padding: "4px 0" },
    grid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6 },
    emptyCell: { minHeight: 92 },
    dayCell: { minHeight: 92, background: "#FBF8F1", border: "1px solid #E4DCC8", borderRadius: 8, padding: 6, cursor: "pointer", display: "flex", flexDirection: "column", gap: 4 },
    dayCellToday: { borderColor: "#5C7A6B", borderWidth: 1.5, background: "#F1EEE0" },
    dayCellTop: { display: "flex", justifyContent: "space-between", alignItems: "center" },
    dayNum: { fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "#6B6459" },
    dayNumToday: { color: "#5C7A6B", fontWeight: 700 },
    addDayBtn: { background: "transparent", border: "none", color: "#B8AF9A", cursor: "pointer", padding: 2, display: "flex" },
    dayItems: { display: "flex", flexDirection: "column", gap: 3, overflow: "hidden" },
    pill: { display: "flex", alignItems: "center", gap: 4, background: "#F4EFE4", border: "1px solid", borderRadius: 4, padding: "2px 5px", fontSize: 10, cursor: "pointer" },
    pillText: { flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#3C4A45" },
    moreLabel: { fontSize: 9, color: "#9AA79C", fontFamily: "'IBM Plex Mono', monospace", paddingLeft: 3 },

    modalOverlay: { position: "fixed", inset: 0, background: "rgba(30,35,32,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20 },
    modalCard: { background: "#FBF8F1", borderRadius: 12, padding: 22, width: 440, maxWidth: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.35)" },
    modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
    modalFooter: { display: "flex", justifyContent: "space-between", marginTop: 16 },
    titleInput: { width: "100%", fontFamily: "'Fraunces', serif", fontSize: 19, fontWeight: 600, border: "none", borderBottom: "2px solid #E4DCC8", background: "transparent", padding: "4px 0 8px", marginBottom: 12, color: "#1E2320", outline: "none", boxSizing: "border-box" },
    editorRow: { display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" },
    selectInput: { width: "100%", padding: "8px 10px", borderRadius: 6, border: "1px solid #DCD3BE", background: "#F4EFE4", fontSize: 13, fontFamily: "'Inter', sans-serif", color: "#3C4A45", boxSizing: "border-box" },
    selectInputSmall: { padding: "6px 8px", borderRadius: 6, border: "1px solid #DCD3BE", background: "#F4EFE4", fontSize: 12, fontFamily: "'Inter', sans-serif", color: "#3C4A45" },
    statusBtn: { display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 6, border: "1px solid #DCD3BE", background: "#F4EFE4", fontSize: 12, cursor: "pointer", color: "#3C4A45" },
    fieldLabel: { fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: 0.5, color: "#9AA79C", marginBottom: 5, display: "block" },
    textarea: { width: "100%", padding: "10px 12px", borderRadius: 8, border: "1px solid #DCD3BE", background: "#F4EFE4", fontSize: 13, fontFamily: "'Inter', sans-serif", color: "#3C4A45", marginBottom: 12, resize: "vertical", boxSizing: "border-box", outline: "none" },
    dangerBtn: { display: "flex", alignItems: "center", gap: 6, background: "transparent", border: "1px solid #C97B5F", color: "#B5502F", padding: "8px 14px", borderRadius: 6, fontSize: 12, cursor: "pointer" },
    primaryBtn: { display: "flex", alignItems: "center", gap: 6, background: "#5C7A6B", border: "none", color: "#F4EFE4", padding: "9px 16px", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer" },

    eyebrow: { fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: 1, color: "#8A9B90", marginBottom: 4 },
    sectionTitle: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 26, color: "#1E2320", margin: "0 0 6px" },
    sectionTitleSmall: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 18, color: "#1E2320", margin: "0 0 4px" },
    sectionDesc: { fontSize: 13, color: "#7C7568", margin: 0, maxWidth: 560 },

    platformTabs: { display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" },
    platformTab: { display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 20, border: "1px solid #DCD3BE", background: "transparent", fontSize: 12, fontWeight: 500, color: "#6B6459", cursor: "pointer" },

    cardGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 18, marginBottom: 28 },
    ideaCard: { background: "#FBF8F1", border: "1px solid #E4DCC8", borderRadius: 4, padding: 16, boxShadow: "0 3px 10px rgba(30,35,32,0.08)", display: "flex", flexDirection: "column", gap: 8 },
    ideaFormatTag: { alignSelf: "flex-start", fontSize: 9, fontFamily: "'IBM Plex Mono', monospace", textTransform: "uppercase", letterSpacing: 0.5, color: "#5C7A6B", background: "#E4EBE6", padding: "3px 8px", borderRadius: 3 },
    ideaTitle: { fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: 16, color: "#1E2320", lineHeight: 1.25 },
    ideaHook: { fontSize: 12, color: "#8A8375", fontStyle: "italic", lineHeight: 1.4 },
    ideaAddBtn: { display: "flex", alignItems: "center", gap: 5, justifyContent: "center", marginTop: 4, background: "#1E2320", color: "#F4EFE4", border: "none", borderRadius: 5, padding: "7px 10px", fontSize: 11, cursor: "pointer", fontWeight: 500 },

    tagRow: { display: "flex", flexWrap: "wrap", gap: 8 },
    hashtagChip: { display: "flex", alignItems: "center", gap: 3, background: "#FBF8F1", border: "1px solid #E4DCC8", borderRadius: 14, padding: "5px 11px", fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "#5C7A6B" },

    inputRow: { display: "flex", gap: 10, marginBottom: 20 },
    bigInput: { flex: 1, padding: "12px 14px", borderRadius: 8, border: "1px solid #DCD3BE", background: "#FBF8F1", fontSize: 14, fontFamily: "'Inter', sans-serif", color: "#3C4A45", outline: "none" },

    scriptCard: { background: "#FBF8F1", border: "1px solid #E4DCC8", borderRadius: 10, padding: 22 },
    scriptHookLine: { fontFamily: "'Fraunces', serif", fontStyle: "italic", fontSize: 19, color: "#1E2320", marginBottom: 18, paddingBottom: 14, borderBottom: "1px dashed #DCD3BE" },
    scriptBeats: { display: "flex", flexDirection: "column", gap: 12, marginBottom: 18 },
    scriptBeatRow: { display: "grid", gridTemplateColumns: "130px 1fr", gap: 14, alignItems: "start" },
    scriptBeatLabel: { fontSize: 11, fontFamily: "'IBM Plex Mono', monospace", color: "#5C7A6B", fontWeight: 500, paddingTop: 2 },
    scriptBeatText: { fontSize: 13, color: "#4B4640", lineHeight: 1.5 },
    scriptCaptionBox: { background: "#F4EFE4", borderRadius: 8, padding: 14 },
    scriptCaptionText: { fontSize: 13, color: "#3C4A45", lineHeight: 1.5 },

    repurposeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14, marginTop: 22 },
    repurposeCard: { background: "#FBF8F1", border: "1px solid #E4DCC8", borderRadius: 10, padding: 16 },
    repurposeCardHead: { display: "flex", alignItems: "center", gap: 8, marginBottom: 10, fontSize: 13 },
    repurposeFormatTag: { marginLeft: "auto", fontSize: 10, fontFamily: "'IBM Plex Mono', monospace", color: "#9AA79C" },
    repurposeContent: { fontSize: 12.5, color: "#4B4640", lineHeight: 1.6, whiteSpace: "pre-line" },

    scheduleList: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 },
    scheduleRow: { display: "grid", gridTemplateColumns: "150px 1fr 1.4fr", alignItems: "center", background: "#FBF8F1", border: "1px solid #E4DCC8", borderRadius: 8, padding: "14px 18px", gap: 10 },
    scheduleRowLeft: { display: "flex", alignItems: "center", gap: 8 },
    scheduleRowMid: { display: "flex", flexDirection: "column", gap: 1 },
    scheduleDay: { fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: "#5C7A6B", fontWeight: 500 },
    scheduleTime: { fontSize: 13, color: "#1E2320", fontWeight: 600 },
    scheduleNote: { fontSize: 12, color: "#8A8375" },
    tipBox: { background: "#E4EBE6", borderRadius: 8, padding: 14, fontSize: 12.5, color: "#3C4A45", lineHeight: 1.5 },
  
};