import { useState } from "react";

const COLORS = {
  bg: "#0F1117", surface: "#1A1D27", surfaceHover: "#222536", border: "#2A2D3E",
  amber: "#F5A623", amberDim: "#3D2E0A",
  green: "#3DD68C", greenDim: "#0D3322",
  red: "#FF6B6B", redDim: "#3D1010",
  indigo: "#7C8CF8", indigoDim: "#1A1D3D",
  text: "#E8EAF0", muted: "#8891A8", faint: "#4A5068",
};

const mono = { fontFamily: "'JetBrains Mono', 'Fira Code', monospace" };

// ── Resource URL map ────────────────────────────────────────────────────────
const URLS = {
  // YouGlish — search links
  "YouGlish US filter":         "https://youglish.com/pronounce/water/english/us",
  "YouGlish HVPT":              "https://youglish.com/pronounce/ship/english/us",
  "YouGlish: man vs map (US)":  "https://youglish.com/pronounce/man/english/us",
  "YouGlish US":                "https://youglish.com/pronounce/Mary/english/us",
  "YouGlish":                   "https://youglish.com",
  // Rachel's English
  "Rachel's English /p/ video": "https://www.youtube.com/watch?v=kMiHuNdEjMM",
  "Rachel's English /v/ video": "https://www.youtube.com/watch?v=I3kQqxRBmPw",
  "Rachel's English /r/ playlist": "https://www.youtube.com/playlist?list=PL0Mkv4GiFGFJETlD4qv02JcBbqY3Mn3Yw",
  "Rachel's English Flap T; BoldVoice": "https://www.youtube.com/watch?v=mOSFSJBY5EM",
  "Rachel's English Flap T":    "https://www.youtube.com/watch?v=mOSFSJBY5EM",
  "Rachel's English yod video": "https://www.youtube.com/watch?v=I_0YQQW4LYU",
  "Rachel's English dark L":    "https://www.youtube.com/watch?v=Bj1dIi0hhho",
  "Rachel's English T sounds playlist": "https://www.youtube.com/playlist?list=PL0Mkv4GiFGFI1pVQWLGnwXJAEKlAy5r3R",
  "Rachel's English -ing":      "https://www.youtube.com/watch?v=xoJxcXDTQkQ",
  "Rachel's English":           "https://rachelsenglish.com",
  // Hadar Shemesh / Accent's Way
  "Hadar Shemesh cot–caught":   "https://www.youtube.com/watch?v=Zx0o4EqQM9Y",
  "Hadar Shemesh AmE vs BrE":   "https://www.youtube.com/watch?v=YJMlwUf5T7Q",
  "Accent's Way schwa video":   "https://www.youtube.com/watch?v=J1vaHEzQMOA",
  "Accent's Way":               "https://www.youtube.com/@AccentsWay",
  // Tarle Speech
  "Tarle Speech; YouGlish US":  "https://www.youtube.com/@TarleSpeechAndLanguage",
  "Tarle Speech":               "https://www.youtube.com/@TarleSpeechAndLanguage",
  // Tools
  "BoldVoice":                  "https://www.boldvoice.com",
  "ELSA Speak":                 "https://elsaspeak.com",
  "ChatGPT Voice":              "https://chat.openai.com",
  "Gliglish":                   "https://gliglish.com",
  "Pronounce":                  "https://getpronounce.com",
  "Speechling":                 "https://speechling.com",
  "Speechling cluster drills":  "https://speechling.com",
  "Forvo":                      "https://forvo.com",
};

// ── Resource link renderer ──────────────────────────────────────────────────
// Splits a resource string on ";" and renders each part as a link if URL known
function ResLinks({ text, color }) {
  if (!text) return null;
  const parts = text.split(";").map(s => s.trim());
  return (
    <span>
      {parts.map((part, i) => {
        const url = URLS[part];
        return (
          <span key={part}>
            {i > 0 && <span style={{ color: color + "66" }}> · </span>}
            {url
              ? <a href={url} target="_blank" rel="noopener noreferrer"
                  style={{ color, textDecoration: "underline", textDecorationColor: color + "55",
                    textUnderlineOffset: 2, fontSize: "inherit" }}>{part}</a>
              : <span style={{ color }}>{part}</span>
            }
          </span>
        );
      })}
    </span>
  );
}

// ── data ────────────────────────────────────────────────────────────────────

const TIER1 = [
  { symbol: "/p/ vs /b/", label: "P vs B", error: "people → beople",
    fix: "Paper-puff test; aspiration burst",
    resource: "Rachel's English /p/ video" },
  { symbol: "/ɪ/ vs /iː/", label: "Short vs Long I", error: "ship → sheep",
    fix: "Vowel chart; high-variability listening (5–6 speakers per word)",
    resource: "YouGlish HVPT" },
  { symbol: "/v/ vs /f/", label: "V vs F", error: "very → fery",
    fix: "Top teeth on lower lip + voicing for /v/",
    resource: "Rachel's English /v/ video" },
  { symbol: "Clusters", label: "Consonant Clusters", error: "street → istreet",
    fix: "Break → blend → speed up; never insert vowel before /s/",
    resource: "Speechling cluster drills" },
  { symbol: "/æ/ vs /ɛ/", label: "Æ vs E", error: "bad → bed",
    fix: "Jaw drops more for /æ/; high-variability listening",
    resource: "YouGlish HVPT" },
  { symbol: "æ-nasal", label: "Æ-tensing (AmE)", error: "man ≠ map tension",
    fix: "Raised tenser vowel before nasals — man/can/ham vs map/cat",
    resource: "YouGlish: man vs map (US)", isNew: true },
  { symbol: "cot=caught", label: "Cot–Caught Merger", error: "Two distinct vowels",
    fix: "Use merged /ɑː/ as the default American vowel",
    resource: "Hadar Shemesh cot–caught", isNew: true },
];

const TIER2 = [
  { symbol: "/r/", label: "American R", error: "Trill/tap → approximant",
    fix: "Bunch/curl tongue — no trill. Defining American vs British feature.",
    resource: "Rachel's English /r/ playlist" },
  { symbol: "/ɾ/", label: "Flap / Tap T", error: "water ≠ American 'wader'",
    fix: "Intervocalic T/D → quick D-like tap: water, better, city, get it",
    resource: "Rachel's English Flap T; BoldVoice", isNew: true },
  { symbol: "yod", label: "Yod-Dropping", error: "new = /njuː/ (British)",
    fix: "GA drops /j/ after alveolars: new=/nuː/, duke=/duːk/, Tuesday=/tuːzdeɪ/",
    resource: "Rachel's English yod video", isNew: true },
  { symbol: "/ɫ/", label: "Dark L", error: "Clear L at syllable end",
    fix: "Velarize final L — back of tongue raises: feel, cold, milk",
    resource: "Rachel's English dark L", isNew: true },
  { symbol: "M≈M≈M", label: "Mary–Marry–Merry", error: "Three distinct vowels",
    fix: "57% of Americans merge all three → /mɛri/; learn the merged form",
    resource: "Tarle Speech; YouGlish US", isNew: true },
  { symbol: "/ŋ/", label: "Word-final NG", error: "running → runningk",
    fix: "No /k/ or /g/ appended to -ing endings: running, deploying",
    resource: "Rachel's English -ing" },
  { symbol: "/ə/", label: "Schwa", error: "Full vowels in unstressed syllables",
    fix: "Unstressed syllables collapse to /ə/ in AmE rhythm",
    resource: "Accent's Way schwa video" },
];

const TIER3 = [
  { symbol: "STRESS", label: "Word & Sentence Stress",
    fix: "Big dot over stressed syllable; exaggerate in shadowing (louder + longer)",
    resource: "Rachel's English" },
  { symbol: "LINK", label: "Connected Speech",
    fix: "Draw linking arcs: turn it on → tur-ni-ton; want to → wanna",
    resource: "Rachel's English" },
  { symbol: "ʔT", label: "T-Glottalization",
    fix: "button/mountain/kitten → glottal stop; unreleased final T in that, what",
    resource: "Rachel's English T sounds playlist", isNew: true },
  { symbol: "↗↘", label: "Intonation",
    fix: "Falling at statement end; rising for yes/no questions",
    resource: "Accent's Way" },
  { symbol: "AmE/BrE", label: "AmE vs BrE Vowels",
    fix: "GA flat /æ/ where British uses /ɑː/ — bath, dance, can't",
    resource: "Hadar Shemesh AmE vs BrE", isNew: true },
];

const DAYS = [
  { day: "Mon", focus: "/p/ vs /b/", color: COLORS.red, icon: "🔴",
    drills: { text: "Minimal pairs: pet/bet, pin/bin, cap/cab. Paper-puff test.", links: [] },
    shadow: { text: "Shadow a tech talk at 0.75×. Focus on /p/ words.", links: [] },
    read:   { text: "Mark every /p/ and /b/ in different colors in this week's passage.", links: [] },
    record: { text: "Record the passage, play back, note every /p/→/b/ slip.", links: [] } },
  { day: "Tue", focus: "/ɪ/ vs /iː/", color: COLORS.amber, icon: "🟡",
    drills: { text: "ship/sheep, bit/beat, fill/feel — 5–6 speakers each. Use vowel-chart visual.", link: { label: "Open YouGlish: ship", url: "https://youglish.com/pronounce/ship/english/us" } },
    shadow: { text: "Shadow at 0.75×; focus on vowel length and tension.", links: [] },
    read:   { text: "Color-code /ɪ/ yellow, /iː/ blue in passage.", links: [] },
    record: { text: "Record + compare your vowel length to a native speaker.", link: { label: "YouGlish model", url: "https://youglish.com/pronounce/sheep/english/us" } } },
  { day: "Wed", focus: "Clusters", color: COLORS.indigo, icon: "🔵",
    drills: { text: "Drill: spring, street, screen, split. NEVER insert vowel before /s/. Break → blend → speed.", links: [] },
    shadow: { text: "Shadow a cluster-rich clip at 0.75× first.", links: [] },
    read:   { text: "Underline every consonant cluster in the passage.", links: [] },
    record: { text: "Listen specifically for inserted vowels in playback.", links: [] } },
  { day: "Thu", focus: "/v/ vs /f/ + Stress", color: COLORS.green, icon: "🟢",
    drills: { text: "Pairs: van/fan, vine/fine, leave/leaf. Feel voicing for /v/ (hand on throat). Mark stress: deVELoper, rePOSitory, dePLOYment.", links: [] },
    shadow: { text: "Shadow with exaggerated stressed syllables (louder + longer).", links: [] },
    read:   { text: "Read the standup script (below) with stress marks.", links: [] },
    record: { text: "Record + playback. Did the stress land clearly?", links: [] } },
  { day: "Fri", focus: "/r/ + Flap T + Linking", color: "#A78BFA", icon: "🟣",
    drills: { text: "Flap T: water, better, city, get it → geddit. -ing words: no final /k/.", link: { label: "Rachel's English Flap T", url: "https://www.youtube.com/watch?v=mOSFSJBY5EM" } },
    shadow: { text: "Focus on linking. Draw arcs: turn it on → tur-ni-ton.", links: [] },
    read:   { text: "Mark all linking arcs and reductions in passage.", links: [] },
    record: { text: "Record + playback. Note flap T and linking.", links: [] } },
  { day: "Sat", focus: "4/3/2 Fluency", color: "#F472B6", icon: "🩷",
    drills: { text: "10 min warm-up on the week's hardest sound.", links: [] },
    shadow: { text: "4/3/2 Technique: speak 4 min on one topic → 3 min → 2 min. Record all three.", links: [] },
    read:   { text: "Final polished read-aloud of full accumulated passage.", links: [] },
    record: { text: "Save Day 6 recording as your weekly progress artifact.", links: [] } },
  { day: "Sun", focus: "📚 Library Session", color: COLORS.amber, icon: "📚",
    drills: { text: "Bring: polished passage + 3 target sounds + 2–3 uncertain recordings + one roleplay scenario.", links: [] },
    shadow: { text: "10 min warm-up → 20 min passage live feedback (tutor pauses every few sentences).", links: [] },
    read:   { text: "20 min roleplay (standup / errand / social). Rotate weekly.", links: [] },
    record: { text: "Leave with exactly 3 corrections for next week's focus.", links: [] } },
];

const TOOLS = [
  { name: "BoldVoice", url: "https://www.boldvoice.com", tag: "⭐ Accent Specialist",
    cost: "7-day trial → ~$12.50/mo annual", color: COLORS.amber,
    desc: "Only true American-accent specialist. Hollywood coaches + AI phoneme scoring. IPA, mouth diagrams, Arabic-L1 personalization. Explicitly teaches flap T, American R, schwa, stress, linking.",
    when: "Daily 10–15 min pronunciation drill block (all 12 weeks)" },
  { name: "ELSA Speak", url: "https://elsaspeak.com", tag: "⭐ Phoneme Feedback",
    cost: "Free / Pro ~$12/mo / Premium ~$16.59/mo", color: COLORS.green,
    desc: "Best-in-class phoneme-level scoring. 8,000+ lessons. American English default. AI conversation on Premium. Keep as longitudinal benchmark.",
    when: "Daily pronunciation drills + monthly progress check" },
  { name: "ChatGPT Voice", url: "https://chat.openai.com", tag: "⭐ Conversation Engine",
    cost: "Free tier / Plus $20/mo", color: COLORS.indigo,
    desc: "Best conversational realism. Infinitely flexible: tech standup, code review, errands, small talk. Prompt it to correct grammar and stay in role. Natural American voices.",
    when: "Daily 10–15 min spontaneous conversation (Weeks 1–12)" },
  { name: "Gliglish", url: "https://gliglish.com", tag: "Free Conversation",
    cost: "Free 10 min/day (no signup)", color: "#A78BFA",
    desc: "AI tutor with adjustable speed + US-English-only pronunciation feedback (Beta). Slow-speed feature supports shadowing practice.",
    when: "Free alternative to ChatGPT Voice" },
  { name: "Pronounce", url: "https://getpronounce.com", tag: "Workplace Tool",
    cost: "Free plan / ~$19.99/mo premium", color: "#F472B6",
    desc: "Chrome extension that analyzes your real Zoom/Meet/Teams calls. Pronunciation + grammar + fluency feedback on actual work speech — not scripted drills.",
    when: "Add in Weeks 9–12 for real meeting analysis" },
  { name: "Rachel's English", url: "https://rachelsenglish.com", tag: "Free Visual Reference",
    cost: "Free (YouTube)", color: COLORS.amber,
    desc: "Gold-standard GA resource. ~800 videos. Close-up mouth mechanics, IPA, schwa, stress, flap T, dark L, linking, connected speech. Treats accent as physical/muscle training.",
    when: "Every drill day — your primary visual reference" },
  { name: "Accent's Way", url: "https://www.youtube.com/@AccentsWay", tag: "Free AmE Coach",
    cost: "Free (YouTube)", color: COLORS.green,
    desc: "Hadar Shemesh: non-native (Israeli) who mastered GA. Cot–caught merger, AmE vs BrE contrasts, mindset, fluency. Explains the 'how' from a learner's perspective.",
    when: "Connected speech + American vs British contrast days" },
  { name: "Tarle Speech", url: "https://www.youtube.com/@TarleSpeechAndLanguage", tag: "Free Visual Drills",
    cost: "Free (YouTube)", color: COLORS.indigo,
    desc: "Speech-language pathologist. Short, clear AmE videos per sound. Yod-dropping, Mary–marry–merry merger, /r/, /ŋ/ — quick sound-specific reference.",
    when: "Quick reference for any specific sound" },
  { name: "YouGlish", url: "https://youglish.com/pronounce/hello/english/us", tag: "HVPT Engine",
    cost: "Free — always set US filter!", color: "#A78BFA",
    desc: "Hear any word from dozens of real American speakers in authentic YouTube clips. Slow to 0.5× for detail. 100M+ clips. Built-in high-variability phonetic training.",
    when: "Every perception drill — flap T, cot–caught, vowel contrasts" },
  { name: "Speechling", url: "https://speechling.com", tag: "Human Coaching",
    cost: "Free ~35 sessions/mo", color: "#F472B6",
    desc: "Record yourself imitating sentences. Human coach corrects pronunciation, intonation, and rhythm within 24h. American English curriculum. 501(c)(3) nonprofit.",
    when: "Self-recording days + complement to library session" },
  { name: "Forvo", url: "https://forvo.com", tag: "Word Reference",
    cost: "Free (prefer US speakers)", color: COLORS.green,
    desc: "Isolated word pronunciations by native speakers. Filter to US English. Best for quickly checking a single new or technical word you're unsure about.",
    when: "Instant check for any new technical word" },
];

const WEEKS = [
  { phase: "Foundation", weeks: "1–2", color: COLORS.red,
    focus: "Tier 1: /p/, /ɪ/–/iː/, clusters, /v/, /æ/–/ɛ/, æ-tensing, cot–caught merger. Shadowing 0.75×. Start BoldVoice trial. Establish daily recording habit.",
    milestone: "Can hear AND produce each Tier 1 contrast in isolated minimal pairs" },
  { phase: "Tier 2 + American Features", weeks: "3–5", color: COLORS.amber,
    focus: "Add /r/ (AmE bunched approximant), flap T /ɾ/, yod-dropping, dark L /ɫ/, Mary–marry–merry merger, /ŋ/, schwa. Shadow at normal speed. BoldVoice daily.",
    milestone: "Tier 1 clean in read-aloud; flap T audible in connected speech" },
  { phase: "Suprasegmentals + Fluency", weeks: "6–8", color: COLORS.indigo,
    focus: "Word/sentence stress, connected speech, T-glottalization, AmE vowel inventory, intonation. 4/3/2 daily. ChatGPT Voice roleplay.",
    milestone: "Fewer pauses/fillers in recordings; ELSA fluency score rising" },
  { phase: "Spontaneous Transfer", weeks: "9–12", color: COLORS.green,
    focus: "Controlled → spontaneous: daily AI conversation (ChatGPT/Gliglish), more roleplay, real work scenarios. Add Pronounce for actual meeting analysis.",
    milestone: "Target sounds — flap T, dark L, yod-dropping — hold in unscripted speech" },
];

const PAIRS = {
  "/p/ vs /b/": ["pet/bet", "pin/bin", "pack/back", "cap/cab", "rope/robe", "pull/bull"],
  "/v/ vs /f/": ["van/fan", "vine/fine", "vat/fat", "leave/leaf", "save/safe", "vile/file"],
  "/ɪ/ vs /iː/": ["ship/sheep", "bit/beat", "fill/feel", "sit/seat", "live/leave", "slip/sleep"],
  "/æ/ vs /ɛ/": ["bad/bed", "sat/set", "man/men", "bat/bet", "had/head", "sad/said"],
  "Clusters": ["spring", "street", "screen", "split", "strong", "script", "sprint"],
};

const PAIR_YOUGLISH = {
  "/p/ vs /b/": "https://youglish.com/pronounce/pet/english/us",
  "/v/ vs /f/": "https://youglish.com/pronounce/van/english/us",
  "/ɪ/ vs /iː/": "https://youglish.com/pronounce/ship/english/us",
  "/æ/ vs /ɛ/": "https://youglish.com/pronounce/bad/english/us",
  "Clusters": "https://youglish.com/pronounce/spring/english/us",
};

// ── components ───────────────────────────────────────────────────────────────

function Badge({ children, color = COLORS.amber, small }) {
  return (
    <span style={{
      ...mono, display: "inline-block", background: color + "22", color,
      border: `1px solid ${color}44`, borderRadius: 6,
      padding: small ? "1px 7px" : "3px 10px", fontSize: small ? 11 : 13, fontWeight: 700,
    }}>{children}</span>
  );
}

function Anchor({ href, children, color = COLORS.amber }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      style={{ color, textDecoration: "underline", textDecorationColor: color + "55",
        textUnderlineOffset: 3, fontWeight: 600, fontSize: "inherit" }}>
      {children}
    </a>
  );
}

function Card({ children, style: s }) {
  return (
    <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`,
      borderRadius: 12, padding: "20px 24px", ...s }}>
      {children}
    </div>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <h2 style={{ ...mono, fontSize: 22, fontWeight: 700, color: COLORS.text,
        margin: 0, letterSpacing: "-0.02em" }}>{title}</h2>
      {sub && <p style={{ color: COLORS.muted, marginTop: 6, fontSize: 14, marginBottom: 0 }}>{sub}</p>}
    </div>
  );
}

function TierSound({ item }) {
  const col = item.col || COLORS.red;
  return (
    <Card style={{ position: "relative", overflow: "hidden" }}>
      {item.isNew && (
        <span style={{ position: "absolute", top: 10, right: 10, background: COLORS.amber + "22",
          color: COLORS.amber, border: `1px solid ${COLORS.amber}44`, borderRadius: 4,
          fontSize: 10, fontWeight: 700, padding: "1px 6px", letterSpacing: "0.08em" }}>
          🇺🇸 NEW
        </span>
      )}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ ...mono, fontSize: 22, fontWeight: 800, color: col,
          minWidth: 68, lineHeight: 1.1 }}>{item.symbol}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{item.label}</div>
          {item.error && (
            <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 6 }}>⚠ {item.error}</div>
          )}
          <div style={{ color: COLORS.text, fontSize: 13, marginBottom: item.resource ? 8 : 0,
            lineHeight: 1.5 }}>{item.fix}</div>
          {item.resource && (
            <div style={{ fontSize: 12 }}>
              <ResLinks text={item.resource} color={col} />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function DayDetail({ d }) {
  const slots = [
    { key: "drills", slot: "A · Drills", col: COLORS.red, min: "10–15 min" },
    { key: "shadow", slot: "B · Shadow", col: COLORS.amber, min: "15–20 min" },
    { key: "read",   slot: "C · Read",   col: COLORS.indigo, min: "10–15 min" },
    { key: "record", slot: "D · Record", col: COLORS.green,  min: "5–10 min" },
  ];
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <span style={{ fontSize: 24 }}>{d.icon}</span>
        <div>
          <div style={{ ...mono, fontSize: 12, color: COLORS.muted }}>{d.day}</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: d.color }}>{d.focus}</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {slots.map(({ key, slot, col, min }) => {
          const entry = d[key];
          return (
            <div key={key} style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div style={{ minWidth: 90 }}>
                <div style={{ ...mono, fontSize: 11, fontWeight: 700, color: col }}>{slot}</div>
                <div style={{ ...mono, fontSize: 10, color: COLORS.faint }}>{min}</div>
              </div>
              <div style={{ flex: 1, background: col + "10", borderLeft: `3px solid ${col}`,
                padding: "8px 12px", borderRadius: "0 8px 8px 0", fontSize: 13,
                color: COLORS.text, lineHeight: 1.5 }}>
                {entry.text}
                {entry.link && (
                  <span> → <Anchor href={entry.link.url} color={col}>{entry.link.label}</Anchor></span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

function ToolCard({ t }) {
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between",
        alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
        <div>
          <a href={t.url} target="_blank" rel="noopener noreferrer"
            style={{ fontWeight: 700, fontSize: 15, color: COLORS.text, textDecoration: "none",
              borderBottom: `2px solid ${t.color}55`, paddingBottom: 1 }}>
            {t.name} ↗
          </a>
          <div style={{ marginTop: 5 }}><Badge color={t.color} small>{t.tag}</Badge></div>
        </div>
        <span style={{ ...mono, fontSize: 11, color: COLORS.muted, textAlign: "right" }}>{t.cost}</span>
      </div>
      <p style={{ color: COLORS.muted, fontSize: 13, margin: "0 0 10px", lineHeight: 1.6 }}>{t.desc}</p>
      <div style={{ background: t.color + "15", borderLeft: `3px solid ${t.color}`,
        padding: "6px 10px", borderRadius: "0 6px 6px 0", fontSize: 12, color: t.color }}>
        When: {t.when}
      </div>
    </Card>
  );
}

// ── main ─────────────────────────────────────────────────────────────────────

const TABS = ["Overview", "Sounds", "Weekly Plan", "Tools", "Progress"];

export default function ESLPlanDashboard() {
  const [tab, setTab] = useState("Overview");
  const [activeDay, setActiveDay] = useState(0);
  const [activePair, setActivePair] = useState("/p/ vs /b/");

  // Assign tier colors to sound data
  const t1 = TIER1.map(x => ({ ...x, col: COLORS.red }));
  const t2 = TIER2.map(x => ({ ...x, col: COLORS.indigo }));
  const t3 = TIER3.map(x => ({ ...x, col: COLORS.green }));

  const IPA = ["/p/", "/ɾ/", "/æ/", "/iː/", "/v/", "/ɫ/"];
  const IPA_COL = [COLORS.amber, COLORS.green, COLORS.red, COLORS.indigo, COLORS.amber, COLORS.green];
  const IPA_DIM = [COLORS.amberDim, COLORS.greenDim, COLORS.redDim, COLORS.indigoDim, COLORS.amberDim, COLORS.greenDim];

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh",
      fontFamily: "'Inter', system-ui, sans-serif", color: COLORS.text }}>

      {/* ── Hero ── */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, padding: "48px 24px 36px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {IPA.map((sym, i) => (
              <span key={sym} style={{ ...mono, fontSize: 13, fontWeight: 700,
                color: IPA_COL[i], background: IPA_DIM[i],
                border: `1px solid ${IPA_COL[i]}33`, borderRadius: 6, padding: "4px 10px" }}>
                {sym}
              </span>
            ))}
          </div>
          <h1 style={{ fontSize: "clamp(24px, 5vw, 40px)", fontWeight: 800, margin: "0 0 10px",
            letterSpacing: "-0.03em", lineHeight: 1.15 }}>
            American English{" "}
            <span style={{ color: COLORS.amber }}>Pronunciation Plan</span>
          </h1>
          <p style={{ color: COLORS.muted, fontSize: 15, maxWidth: 560,
            margin: "0 0 24px", lineHeight: 1.6 }}>
            Yemeni Arabic → General American English · Software Engineer · 45–60 min/day · 12 weeks
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {[
              { label: "Target variety", val: "General American", color: COLORS.amber },
              { label: "Daily budget", val: "≤ 60 min", color: COLORS.green },
              { label: "Tier 1 sounds", val: "7 contrasts", color: COLORS.red },
              { label: "New AmE features", val: "9 added", color: COLORS.indigo },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ background: COLORS.surface,
                border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: "8px 16px" }}>
                <div style={{ fontSize: 11, color: COLORS.muted, marginBottom: 2 }}>{label}</div>
                <div style={{ ...mono, fontSize: 14, fontWeight: 700, color }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Nav ── */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, position: "sticky",
        top: 0, background: COLORS.bg, zIndex: 50, overflowX: "auto" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", padding: "0 24px" }}>
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: "none", border: "none",
              borderBottom: `2px solid ${tab === t ? COLORS.amber : "transparent"}`,
              color: tab === t ? COLORS.amber : COLORS.muted,
              fontWeight: tab === t ? 700 : 400, fontSize: 14,
              padding: "14px 16px", cursor: "pointer", whiteSpace: "nowrap",
              fontFamily: "inherit", transition: "all 0.15s",
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* OVERVIEW */}
        {tab === "Overview" && (
          <div>
            <SectionHeader title="Plan Overview"
              sub="Validated against General American phonology research · June 2026" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: 16, marginBottom: 28 }}>
              {[
                { title: "Core goal", icon: "🎯", color: COLORS.amber,
                  body: "Comprehensibility over native-accent perfection. Munro & Derwing (1995): speech can be heavily accented and still perfectly understood. Chase clarity, not perfection." },
                { title: "Biggest gap fixed", icon: "🇺🇸", color: COLORS.red,
                  body: "The Flap/Tap T /ɾ/ was the most important missing feature. Water, better, city, get it — intervocalic T/D becomes a quick D-like tap in American English." },
                { title: "AI tool stack", icon: "🤖", color: COLORS.indigo,
                  body: "BoldVoice (accent specialist) + ChatGPT Voice (conversation) + ELSA Speak (phoneme feedback) + Speechling (human coaching). Total: $0–$32/mo." },
                { title: "Evidence base", icon: "🔬", color: COLORS.green,
                  body: "HVPT for sound discrimination. Shadowing for rhythm/fluency (Whitworth & Rose 2025, 44 studies). 4/3/2 for automaticity (Nation 1989). Record every day." },
              ].map(({ title, icon, color, body }) => (
                <Card key={title}>
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{icon}</div>
                  <div style={{ fontWeight: 700, color, marginBottom: 8, fontSize: 15 }}>{title}</div>
                  <p style={{ color: COLORS.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>{body}</p>
                </Card>
              ))}
            </div>

            <Card style={{ marginBottom: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, color: COLORS.green }}>
                ✅ Positive Transfer — Yemeni Arabic Advantage
              </div>
              <p style={{ color: COLORS.muted, fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                Yemeni Arabic natively retains <span style={{ ...mono, color: COLORS.text }}>/θ/</span> (think) and{" "}
                <span style={{ ...mono, color: COLORS.text }}>/ð/</span> (this). Unlike most Arabic learners — for
                whom "th" is a notorious failure point — these sounds should be relatively easy. A genuine advantage.
              </p>
            </Card>

            <Card>
              <div style={{ fontWeight: 700, marginBottom: 14 }}>Daily Time Budget (never exceed 60 min)</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { slot: "A · 10–15 min", label: "Pronunciation drills", color: COLORS.red, w: "55%" },
                  { slot: "B · 15–20 min", label: "Shadowing / listening + repeating", color: COLORS.amber, w: "72%" },
                  { slot: "C · 10–15 min", label: "Reading aloud (library-session prep)", color: COLORS.indigo, w: "55%" },
                  { slot: "D · 5–10 min",  label: "Self-recording + playback review", color: COLORS.green, w: "35%" },
                ].map(({ slot, label, color, w }) => (
                  <div key={slot} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ ...mono, fontSize: 12, color, minWidth: 100 }}>{slot}</span>
                    <div style={{ flex: 1, height: 6, background: COLORS.border, borderRadius: 3, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: w, background: color, borderRadius: 3 }} />
                    </div>
                    <span style={{ color: COLORS.muted, fontSize: 13, minWidth: 200 }}>{label}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* SOUNDS */}
        {tab === "Sounds" && (
          <div>
            <SectionHeader title="Target Sounds"
              sub="🇺🇸 = American-specific features added after plan validation" />

            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ ...mono, fontSize: 13, fontWeight: 700, color: COLORS.red }}>TIER 1</span>
                <span style={{ color: COLORS.muted, fontSize: 13 }}>High functional load — fix first (Weeks 1–5)</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {t1.map(item => <TierSound key={item.symbol} item={item} />)}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ ...mono, fontSize: 13, fontWeight: 700, color: COLORS.indigo }}>TIER 2</span>
                <span style={{ color: COLORS.muted, fontSize: 13 }}>Noticeable — fix next (Weeks 3–7)</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {t2.map(item => <TierSound key={item.symbol} item={item} />)}
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <span style={{ ...mono, fontSize: 13, fontWeight: 700, color: COLORS.green }}>TIER 3</span>
                <span style={{ color: COLORS.muted, fontSize: 13 }}>Suprasegmentals — work throughout all 12 weeks</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
                {t3.map(item => <TierSound key={item.symbol} item={item} />)}
              </div>
            </div>

            {/* Minimal pairs */}
            <Card>
              <div style={{ fontWeight: 700, marginBottom: 14 }}>Minimal Pair Drill Bank</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                {Object.keys(PAIRS).map(k => (
                  <button key={k} onClick={() => setActivePair(k)} style={{
                    ...mono, background: activePair === k ? COLORS.amber + "22" : COLORS.bg,
                    border: `1px solid ${activePair === k ? COLORS.amber : COLORS.border}`,
                    borderRadius: 6, color: activePair === k ? COLORS.amber : COLORS.muted,
                    fontSize: 12, fontWeight: 600, padding: "5px 12px", cursor: "pointer",
                  }}>{k}</button>
                ))}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
                {PAIRS[activePair].map(pair => (
                  <span key={pair} style={{ ...mono, background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`, borderRadius: 6,
                    padding: "6px 14px", fontSize: 14, color: COLORS.text }}>{pair}</span>
                ))}
              </div>
              {PAIR_YOUGLISH[activePair] && (
                <div style={{ fontSize: 13 }}>
                  Practice on{" "}
                  <Anchor href={PAIR_YOUGLISH[activePair]} color={COLORS.amber}>
                    YouGlish (US filter) →
                  </Anchor>
                  {" "}<span style={{ color: COLORS.muted, fontSize: 12 }}>
                    — hear these words from dozens of real American speakers
                  </span>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* WEEKLY PLAN */}
        {tab === "Weekly Plan" && (
          <div>
            <SectionHeader title="7-Day Weekly Routine"
              sub="Reading-aloud material accumulates all week → performed live with tutor on Sunday" />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
              gap: 8, marginBottom: 20 }}>
              {DAYS.map((d, i) => (
                <button key={d.day} onClick={() => setActiveDay(i)} style={{
                  background: activeDay === i ? d.color + "22" : COLORS.surface,
                  border: `1.5px solid ${activeDay === i ? d.color : COLORS.border}`,
                  borderRadius: 10, padding: "12px 14px", cursor: "pointer",
                  textAlign: "left", color: COLORS.text, fontFamily: "inherit",
                }}>
                  <div style={{ ...mono, fontSize: 11, color: COLORS.muted, marginBottom: 3 }}>{d.day}</div>
                  <div style={{ fontSize: 13, fontWeight: 600,
                    color: activeDay === i ? d.color : COLORS.text }}>{d.icon} {d.focus}</div>
                </button>
              ))}
            </div>
            <DayDetail d={DAYS[activeDay]} />

            <Card style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 10, color: COLORS.amber }}>
                📋 Sample Standup Script (Read Aloud Thu/Sat)
              </div>
              <div style={{ ...mono, background: COLORS.bg, border: `1px solid ${COLORS.border}`,
                borderRadius: 8, padding: "14px 16px", fontSize: 13, color: COLORS.text, lineHeight: 1.8 }}>
                "Good morning, everyone. Yesterday I finished implementing the{" "}
                <span style={{ color: COLORS.amber }}>authen·ti·CA·tion</span> API and merged the{" "}
                <span style={{ color: COLORS.indigo }}>pull re·QUEST</span>. Today I'm focusing on writing unit
                tests for the <span style={{ color: COLORS.amber }}>PAY·ment</span> module and reviewing Sarah's
                code. I have one blocker: I'm waiting on access to the{" "}
                <span style={{ color: COLORS.indigo }}>STA·ging</span> database — if anyone can help unblock that,
                it would be great. That's all from me."
              </div>
              <div style={{ marginTop: 10, fontSize: 12, color: COLORS.muted }}>
                Capitalized syllables = stressed. Practice stress marks before reading aloud.
                Search any word on{" "}
                <Anchor href="https://youglish.com/pronounce/authentication/english/us" color={COLORS.amber}>
                  YouGlish
                </Anchor>{" "}to hear it in context first.
              </div>
            </Card>
          </div>
        )}

        {/* TOOLS */}
        {tab === "Tools" && (
          <div>
            <SectionHeader title="Tools & AI Apps (2026)"
              sub="Validated for American English — all British resources removed. Tool names link to their homepage." />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
              {TOOLS.map(t => <ToolCard key={t.name} t={t} />)}
            </div>
            <Card style={{ marginTop: 20 }}>
              <div style={{ fontWeight: 700, marginBottom: 12, color: COLORS.amber }}>
                💰 Budget-Tiered AI Stack
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { tier: "Free-only (~$0/mo)", color: COLORS.green,
                    parts: [
                      { label: "ELSA free", url: "https://elsaspeak.com" },
                      { label: "Gliglish", url: "https://gliglish.com" },
                      { label: "ChatGPT Standard Voice", url: "https://chat.openai.com" },
                      { label: "Speechling", url: "https://speechling.com" },
                      { label: "Rachel's English", url: "https://rachelsenglish.com" },
                      { label: "Tarle Speech on YouTube", url: "https://www.youtube.com/@TarleSpeechAndLanguage" },
                    ]},
                  { tier: "Best-value paid (~$12–32/mo) ⭐ Recommended", color: COLORS.amber,
                    parts: [
                      { label: "BoldVoice annual (~$12.50/mo)", url: "https://www.boldvoice.com" },
                      { label: "ChatGPT Plus or free Voice", url: "https://chat.openai.com" },
                      { label: "Speechling free", url: "https://speechling.com" },
                    ]},
                  { tier: "Professional-max", color: COLORS.indigo,
                    parts: [
                      { label: "Above stack +", url: null },
                      { label: "Pronounce (~$19.99/mo)", url: "https://getpronounce.com" },
                      { label: "for real Zoom/Teams meeting analysis", url: null },
                    ]},
                ].map(({ tier, color, parts }) => (
                  <div key={tier} style={{ background: COLORS.bg, border: `1px solid ${color}44`,
                    borderRadius: 8, padding: "10px 14px" }}>
                    <div style={{ fontWeight: 600, color, fontSize: 13, marginBottom: 6 }}>{tier}</div>
                    <div style={{ color: COLORS.muted, fontSize: 12, display: "flex", flexWrap: "wrap", gap: 4 }}>
                      {parts.map((p, i) => (
                        <span key={i}>
                          {i > 0 && <span style={{ color: COLORS.faint }}> + </span>}
                          {p.url
                            ? <Anchor href={p.url} color={color}>{p.label}</Anchor>
                            : <span>{p.label}</span>
                          }
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* PROGRESS */}
        {tab === "Progress" && (
          <div>
            <SectionHeader title="Progression & Self-Assessment"
              sub="8–12 week arc from controlled drills to spontaneous speech" />

            <div style={{ position: "relative", marginBottom: 28 }}>
              {WEEKS.map((w, i) => (
                <div key={w.phase} style={{ display: "flex", gap: 16, marginBottom: 16, alignItems: "stretch" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 36 }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: w.color + "22",
                      border: `2px solid ${w.color}`, display: "flex", alignItems: "center",
                      justifyContent: "center", ...mono, fontSize: 12, fontWeight: 700,
                      color: w.color, flexShrink: 0 }}>{i + 1}</div>
                    {i < WEEKS.length - 1 && (
                      <div style={{ flex: 1, width: 2,
                        background: `linear-gradient(${w.color}, ${WEEKS[i + 1].color})`,
                        margin: "4px 0", minHeight: 16 }} />
                    )}
                  </div>
                  <Card style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between",
                      alignItems: "flex-start", flexWrap: "wrap", gap: 8, marginBottom: 8 }}>
                      <div style={{ fontWeight: 700, color: w.color, fontSize: 15 }}>{w.phase}</div>
                      <Badge color={w.color} small>Weeks {w.weeks}</Badge>
                    </div>
                    <p style={{ color: COLORS.muted, fontSize: 13, margin: "0 0 10px", lineHeight: 1.6 }}>
                      {w.focus}
                    </p>
                    <div style={{ background: w.color + "15", borderLeft: `3px solid ${w.color}`,
                      padding: "6px 10px", borderRadius: "0 6px 6px 0", fontSize: 12, color: w.color }}>
                      ✓ Milestone: {w.milestone}
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            <Card style={{ marginBottom: 16 }}>
              <div style={{ fontWeight: 700, marginBottom: 12 }}>📊 Self-Assessment System</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  { label: "Weekly recording archive", desc: "Keep every Day 6 recording. Compare Week 1 → 4 → 8.", color: COLORS.amber },
                  { label: "Fluency metrics", desc: "Count filled pauses (um/uh) and silent pauses per minute; estimate words/min.", color: COLORS.green },
                  { label: "Comprehensibility check", desc: "Ask tutor/colleagues: 'How easy was that to understand?' — not 'Did I sound native?'", color: COLORS.indigo },
                  { label: "Perception tests", desc: "Minimal-pair identification. Perception gains typically precede production gains.", color: COLORS.red },
                  { label: "ELSA scores", desc: "Rough longitudinal benchmark — not gospel. Re-run monthly on same passage.", color: COLORS.amber },
                ].map(({ label, desc, color }) => (
                  <div key={label} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: color, marginTop: 5, flexShrink: 0 }} />
                    <div>
                      <span style={{ fontWeight: 600, fontSize: 13, color: COLORS.text }}>{label}: </span>
                      <span style={{ color: COLORS.muted, fontSize: 13 }}>{desc}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div style={{ fontWeight: 700, marginBottom: 12, color: COLORS.red }}>
                ⚠️ When to Adjust the Plan
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {[
                  { text: "Still can't hear a contrast after 3 weeks → more perception time on ", link: { label: "YouGlish (US filter)", url: "https://youglish.com/pronounce/ship/english/us" }, after: " before production" },
                  { text: "Read-aloud clean but spontaneous speech error-heavy at Week 8 → shift to more AI conversation on ", link: { label: "ChatGPT Voice", url: "https://chat.openai.com" }, after: " or Gliglish" },
                  { text: "Fillers/pauses not dropping → increase 4/3/2 to twice a week", link: null },
                  { text: "San'ani speaker with clean [dʒ] → drop /dʒ/ from Tier 2; reallocate to /r/ and flap T on ", link: { label: "Rachel's English", url: "https://rachelsenglish.com" }, after: "" },
                  { text: "BoldVoice trial feels too advanced → switch to ", link: { label: "ELSA Speak", url: "https://elsaspeak.com" }, after: " + Tarle/Rachel as pronunciation engine" },
                ].map((item, i) => (
                  <div key={i} style={{ ...mono, fontSize: 12, color: COLORS.muted, background: COLORS.bg,
                    border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "8px 12px", lineHeight: 1.6 }}>
                    → {item.text}
                    {item.link && <Anchor href={item.link.url} color={COLORS.amber}>{item.link.label}</Anchor>}
                    {item.after}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; }
        button { font-family: inherit; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: #0F1117; }
        ::-webkit-scrollbar-thumb { background: #2A2D3E; border-radius: 3px; }
        a { transition: opacity 0.12s; }
        a:hover { opacity: 0.75; }
      `}</style>
    </div>
  );
}
