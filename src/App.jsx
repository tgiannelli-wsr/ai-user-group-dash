import { useState, useMemo, useEffect, useRef } from 'react';

// ── DEFAULT DATA ────────────────────────────────────────
const DEFAULT_DEPTS_FULL = [
  { id:"ops",  icon:"ti-tool",           name:"Operations",        uc:[
    {r:1,n:"Daily ops briefings & shift summaries",   m:"chat", p:"Copilot in Teams",            e:"low",  h:"no"},
    {r:2,n:"Guest complaint response drafts",          m:"chat", p:"Copilot in Outlook",          e:"low",  h:"yes"},
    {r:3,n:"Incident report generation",               m:"chat", p:"Copilot in Word",             e:"low",  h:"yes"},
    {r:4,n:"Inventory anomaly alerts & escalation",    m:"agent",p:"Power Automate + AI Builder", e:"med",  h:"partial"},
    {r:5,n:"Ops KPI narrative reports",                m:"tool", p:"Power BI Smart Narratives",   e:"low",  h:"no"},
  ]},
  { id:"fin",  icon:"ti-currency-dollar",name:"Finance",           uc:[
    {r:1,n:"Month-end variance commentary drafts",    m:"chat", p:"Copilot in Excel / Word",      e:"low",  h:"yes"},
    {r:2,n:"Budget narrative & board deck drafts",    m:"chat", p:"Copilot in PowerPoint",        e:"low",  h:"yes"},
    {r:3,n:"Expense anomaly detection & alerts",      m:"agent",p:"Power Automate + AI Builder",  e:"med",  h:"partial"},
    {r:4,n:"Invoice processing & AP routing",         m:"agent",p:"AI Builder",                  e:"high", h:"partial", nn:true},
    {r:5,n:"Vendor contract summarization",           m:"chat", p:"Copilot in Word",              e:"low",  h:"yes"},
  ]},
  { id:"mkt",  icon:"ti-speakerphone",  name:"Marketing",          uc:[
    {r:1,n:"Campaign copy & social content drafts",   m:"chat", p:"Copilot / Claude",             e:"low",  h:"yes"},
    {r:2,n:"Menu & promo visual asset creation",      m:"tool", p:"Canva AI",                     e:"low",  h:"yes", nn:true},
    {r:3,n:"Content calendar generation",             m:"chat", p:"Copilot in Teams",             e:"low",  h:"yes"},
    {r:4,n:"Email campaign drafting & optimization",  m:"chat", p:"Copilot in Outlook",           e:"low",  h:"yes"},
    {r:5,n:"Brand sentiment monitoring & summary",    m:"agent",p:"Power Automate + Copilot",     e:"med",  h:"partial"},
  ]},
  { id:"hr",   icon:"ti-users",         name:"HR & People",        uc:[
    {r:1,n:"Job description & offer letter drafts",   m:"chat", p:"Copilot in Word",              e:"low",  h:"yes"},
    {r:2,n:"Performance review & SMART goal writing", m:"chat", p:"Copilot in Word",              e:"low",  h:"yes"},
    {r:3,n:"Onboarding document packages",            m:"chat", p:"Copilot in Word / Teams",      e:"low",  h:"yes"},
    {r:4,n:"HR policy Q&A bot for all staff",         m:"agent",p:"Copilot Studio",               e:"high", h:"no"},
    {r:5,n:"Training content generation (L&D)",       m:"tool", p:"Copilot in PowerPoint",        e:"low",  h:"yes"},
  ]},
  { id:"it",   icon:"ti-server",        name:"IT",                 uc:[
    {r:1,n:"SQL, DAX, M query & script generation",   m:"chat", p:"Claude / Copilot",             e:"low",  h:"yes"},
    {r:2,n:"IT ticket triage & auto-routing",         m:"agent",p:"Power Automate + AI Builder",  e:"med",  h:"partial"},
    {r:3,n:"Runbook & technical doc drafting",        m:"chat", p:"Copilot in Word",              e:"low",  h:"yes"},
    {r:4,n:"Security alert triage & summarization",   m:"chat", p:"Copilot for Security",         e:"med",  h:"yes", nn:true},
    {r:5,n:"Change request & impact assessment",      m:"chat", p:"Copilot in Word",              e:"low",  h:"yes"},
  ]},
  { id:"leg",  icon:"ti-scale",         name:"Legal & Compliance", uc:[
    {r:1,n:"Contract & agreement summarization",      m:"chat", p:"Copilot in Word",              e:"low",  h:"yes"},
    {r:2,n:"Compliance checklist gen (S-211 etc.)",   m:"chat", p:"Copilot in Word",              e:"low",  h:"yes"},
    {r:3,n:"Policy gap analysis & redline drafts",    m:"chat", p:"Copilot in Word",              e:"med",  h:"yes"},
    {r:4,n:"Franchise agreement clause comparison",   m:"chat", p:"Copilot in Word",              e:"med",  h:"yes"},
    {r:5,n:"Regulatory update monitoring",            m:"agent",p:"Power Automate + Copilot",     e:"med",  h:"partial"},
  ]},
  { id:"fran", icon:"ti-building-store",name:"Franchise Dev",      uc:[
    {r:1,n:"Franchisee performance report narratives",m:"tool", p:"Power BI Smart Narratives",    e:"low",  h:"no"},
    {r:2,n:"Franchise prospect research briefs",      m:"chat", p:"Copilot / Claude",             e:"low",  h:"yes"},
    {r:3,n:"Franchisee comms & newsletters",          m:"chat", p:"Copilot in Outlook",           e:"low",  h:"yes"},
    {r:4,n:"FDD & franchise doc summarization",       m:"chat", p:"Copilot in Word",              e:"low",  h:"yes"},
    {r:5,n:"Site selection data analysis",            m:"chat", p:"Copilot in Excel",             e:"med",  h:"yes"},
  ]},
  { id:"exec", icon:"ti-chart-line",    name:"Executive",          uc:[
    {r:1,n:"Board deck & exec presentation drafts",   m:"chat", p:"Copilot in PowerPoint",        e:"low",  h:"yes"},
    {r:2,n:"Meeting prep briefs & action capture",    m:"agent",p:"Teams Premium + Copilot",      e:"med",  h:"yes", nn:true},
    {r:3,n:"Strategic document summarization",        m:"chat", p:"Copilot in Word",              e:"low",  h:"yes"},
    {r:4,n:"KPI commentary & narrative automation",   m:"tool", p:"Power BI + Copilot",           e:"med",  h:"no"},
  ]},
];

const DEFAULT_WAVES = [
  { num:1, title:"Quick wins",          period:"Months 1–3",  color:"#186E3B", focus:"M365 Copilot & existing stack",
    items:["M365 Copilot rollout: document drafting across all departments","Claude for IT: SQL, DAX, M query, and script generation","Power BI Smart Narratives: Ops, Finance, Franchise Dev","Copilot in Outlook: email drafting — Marketing, HR, Franchise","Copilot in PowerPoint: deck drafts — Finance, Marketing, Exec","Wave 1 AI MasterClass: onboarding all staff to Chat tools"]},
  { num:2, title:"Core enablement",     period:"Months 3–6",  color:"#37657C", focus:"Power Platform & Copilot Studio",
    items:["Power Automate: IT ticket triage & auto-routing flows","Power Automate: expense anomaly detection & alerts","Copilot Studio: HR policy Q&A bot for all staff","Teams Premium: exec meeting intelligence & action items","Franchise Power BI: automated performance narratives","Legal: contract review & compliance checklist workflows"]},
  { num:3, title:"Advanced automation", period:"Months 6–12", color:"#9E3C18", focus:"AI Builder & custom agents",
    items:["AI Builder: invoice processing & AP routing automation","Brand sentiment monitoring agent (Power Automate)","Regulatory update monitoring & briefing agent","Azure / Claude: custom cross-system workflow agents","CoE maturity measurement & continuous iteration cycle","Franchise self-serve AI reporting portal"]},
];

const DEFAULT_KPIS = [
  { l:"AI adoption rate",   v:"≥70%",     sub:"by month 6",        d:"Staff actively using ≥1 AI tool monthly — primary CoE health signal" },
  { l:"Time reclaimed",     v:"2+ hrs",    sub:"per user / week",   d:"Average weekly hours saved per person across AI-assisted tasks" },
  { l:"Use case velocity",  v:"On track",  sub:"monthly reporting", d:"Cumulative use cases live vs. roadmap, tracked by CoE every month" },
  { l:"Cycle time delta",   v:"30–40%",    sub:"faster",            d:"Reduction in time for repeatable tasks: reports, JDs, summaries" },
  { l:"Staff satisfaction", v:"4 / 5",     sub:"quarterly pulse",   d:"Usefulness and confidence score across departments each quarter" },
];

// White Spot brand palette (from the official colour values sheet).
const BRAND = {
  red:"#8E192C", green:"#165F33", gold:"#DDB428",
  fern:"#186E3B", tidepool:"#37657C", arbutus:"#9E3C18", sunrise:"#EDA934",
  cream:"#FBF7D0", goldDark:"#B5831C",
};

const DEFAULT_MC = { chat:{label:"Chat",bg:"#EAF1F3",color:"#37657C"}, tool:{label:"Tool",bg:"#EAF3EC",color:"#186E3B"}, agent:{label:"Agent",bg:"#FBEDE7",color:"#9E3C18"} };
const DEFAULT_EC = { low:{label:"Low",bg:"#EAF3EC",color:"#186E3B"}, med:{label:"Medium",bg:"#FBF1DD",color:"#B5831C"}, high:{label:"High",bg:"#F7E8EB",color:"#8E192C"} };
const DEFAULT_HC = { yes:{label:"Human req.",bg:"#FBF1DD",color:"#B5831C"}, partial:{label:"Partial",bg:"#EAF1F3",color:"#37657C"}, no:{label:"Automated",bg:"#EAF3EC",color:"#186E3B"} };

// Chart segment colors per category key (used by the donuts / bars).
const MODE_COLORS = { chat:"#37657C", tool:"#186E3B", agent:"#9E3C18" };
const EFF_COLORS  = { low:"#186E3B", med:"#EDA934", high:"#8E192C" };
const HITL_COLORS = { yes:"#EDA934", partial:"#37657C", no:"#186E3B" };

const DEFAULT_STATE = {
  version: 4,
  title: "AI Adoption Roadmap",
  depts: DEFAULT_DEPTS_FULL.map(({id,icon,name}) => ({id,icon,name,sponsor:""})),
  ucs:   DEFAULT_DEPTS_FULL.flatMap(d => d.uc.map(u => ({...u, deptId:d.id, uid:`${d.id}-${u.r}`}))),
  waves: DEFAULT_WAVES,
  kpis:  DEFAULT_KPIS,
  mc:    DEFAULT_MC,
  ec:    DEFAULT_EC,
  hc:    DEFAULT_HC,
};

const STORAGE_KEY = 'ai_roadmap_state_v4';
const PREV_KEY    = 'ai_roadmap_state_v3';  // pre-branding state
const OLD_KEY     = 'ai_roadmap_v2';        // legacy custom-only use-case array

const clone = (o) => JSON.parse(JSON.stringify(o));
const cacheLocal = (next) => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* quota */ } };
// Unique id generator kept at module scope (so the impure Date.now() isn't called during render).
let _uidSeq = 0;
const newUid = () => `${Date.now().toString(36)}${(_uidSeq++).toString(36)}`;

// Keep the user's category labels but force the new brand colors.
const rebrandLegend = (prev, def) => Object.fromEntries(
  Object.keys(def).map(k => [k, {label: prev?.[k]?.label ?? def[k].label, bg: def[k].bg, color: def[k].color}])
);

function loadInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return {...clone(DEFAULT_STATE), ...JSON.parse(saved)};
    // Migrate pre-branding data: keep all content, apply White Spot colors.
    const prevRaw = localStorage.getItem(PREV_KEY);
    if (prevRaw) {
      const prev = JSON.parse(prevRaw);
      return {
        ...clone(DEFAULT_STATE), ...prev,
        version: 4,
        mc: rebrandLegend(prev.mc, DEFAULT_MC),
        ec: rebrandLegend(prev.ec, DEFAULT_EC),
        hc: rebrandLegend(prev.hc, DEFAULT_HC),
        waves: (prev.waves || DEFAULT_WAVES).map((w,i) => ({...w, color: (DEFAULT_WAVES[i] || w).color})),
      };
    }
    const old = localStorage.getItem(OLD_KEY);
    if (old) {
      const custom = JSON.parse(old);
      if (Array.isArray(custom) && custom.length) {
        const base = clone(DEFAULT_STATE);
        base.ucs = [...base.ucs, ...custom];
        return base;
      }
    }
  } catch { /* ignore corrupt storage */ }
  return clone(DEFAULT_STATE);
}

// ── HELPERS / SHARED COMPONENTS ─────────────────────────
function Donut({ data, size=92 }) {
  const tot = data.reduce((s,d) => s+d.v, 0);
  if (!tot) return <svg width={size} height={size} />;
  const cx=size/2, cy=size/2, R=size*.4, ri=size*.27;
  const starts = [];
  data.reduce((a,d) => { starts.push(a); return a + (d.v/tot)*2*Math.PI; }, -Math.PI/2);
  const segs = data.map((d,i) => {
    const sa=starts[i], sw=Math.min((d.v/tot)*2*Math.PI, 2*Math.PI-.001);
    const ea=sa + (d.v/tot)*2*Math.PI, big=sw>Math.PI?1:0;
    const p=`M${(cx+R*Math.cos(sa)).toFixed(1)},${(cy+R*Math.sin(sa)).toFixed(1)} A${R},${R} 0 ${big},1 ${(cx+R*Math.cos(ea)).toFixed(1)},${(cy+R*Math.sin(ea)).toFixed(1)} L${(cx+ri*Math.cos(ea)).toFixed(1)},${(cy+ri*Math.sin(ea)).toFixed(1)} A${ri},${ri} 0 ${big},0 ${(cx+ri*Math.cos(sa)).toFixed(1)},${(cy+ri*Math.sin(sa)).toFixed(1)} Z`;
    return { p, color:d.color };
  });
  return (
    <svg width={size} height={size} style={{display:"block",flexShrink:0}}>
      {segs.map((s,i) => <path key={i} d={s.p} fill={s.color}/>)}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize={Math.round(size*.19)} fontWeight="700" fill="#111827">{tot}</text>
    </svg>
  );
}

function Pill({ cfg }) {
  return <span style={{display:"inline-flex",alignItems:"center",fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:4,background:cfg.bg,color:cfg.color,whiteSpace:"nowrap"}}>{cfg.label}</span>;
}

function FPill({ lbl, val, cur, onChange }) {
  const on = cur===val;
  return <button onClick={()=>onChange(on?"all":val)} style={{fontSize:11,padding:"3px 10px",borderRadius:12,cursor:"pointer",fontWeight:on?600:400,border:on?"none":"1px solid #D1D5DB",background:on?BRAND.green:"#fff",color:on?"#fff":"#6B7280"}}>{lbl}</button>;
}

function TBtn({ lbl, val, cur, onChange }) {
  const on = cur===val;
  return <button onClick={()=>onChange(val)} style={{fontSize:12,padding:"8px 14px",border:"none",background:"transparent",cursor:"pointer",fontWeight:on?700:400,color:on?BRAND.green:"#6B7280",borderBottom:on?`2px solid ${BRAND.green}`:"2px solid transparent"}}>{lbl}</button>;
}

function MiniBtn({ icon, onClick, title, danger, disabled }) {
  return <button onClick={onClick} title={title} disabled={disabled} style={{width:24,height:24,borderRadius:4,border:`1px solid ${danger?"#ECD2D8":"#E4E7EC"}`,background:danger?"#F7E8EB":"#fff",cursor:disabled?"default":"pointer",opacity:disabled?0.4:1,display:"flex",alignItems:"center",justifyContent:"center",padding:0,flexShrink:0}}>
    <i className={`ti ${icon}`} style={{fontSize:12,color:danger?"#8E192C":"#6B7280"}} aria-hidden="true"/></button>;
}

function SaveStatus({ status }) {
  const cfg = {
    loading:  { c:"#9CA3AF", t:"Loading…" },
    saving:   { c:"#B5831C", t:"Saving…" },
    saved:    { c:"#186E3B", t:"Saved" },
    offline:  { c:"#9CA3AF", t:"Offline · local only" },
    conflict: { c:"#37657C", t:"Reloaded latest" },
  }[status] || { c:"#9CA3AF", t:"" };
  return <span title="Shared dashboard sync status" style={{display:"inline-flex",alignItems:"center",gap:5,fontSize:10,fontWeight:600,color:cfg.c}}>
    <span style={{width:7,height:7,borderRadius:"50%",background:cfg.c,flexShrink:0}}/>{cfg.t}</span>;
}

const EMPTY_FORM = { deptId:DEFAULT_STATE.depts[0].id, n:"", m:"chat", p:"", e:"low", h:"yes", nn:false, champ:"" };

export default function App() {
  const [data,     setData]     = useState(loadInitial);
  const [deptId,   setDeptId]   = useState("all");
  const [modeF,    setModeF]    = useState("all");
  const [effortF,  setEffortF]  = useState("all");
  const [hitlF,    setHitlF]    = useState("all");
  const [tab,      setTab]      = useState("uc");
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({...EMPTY_FORM});
  const [editId,   setEditId]   = useState(null);
  const [status,   setStatus]   = useState("loading"); // loading | saving | saved | offline | conflict
  const fileRef   = useRef(null);
  const dataRef   = useRef(data);   // latest data for the debounced flush / polling
  const verRef    = useRef(0);      // server version this client is based on
  const saveTimer = useRef(null);
  const inFlight  = useRef(false);
  const dirty     = useRef(false);
  const statusRef = useRef(status);

  useEffect(() => { dataRef.current = data; }, [data]);
  useEffect(() => { statusRef.current = status; }, [status]);

  // Keep the browser tab title in sync with the dashboard title.
  useEffect(() => { document.title = data.title || "AI Adoption Dashboard"; }, [data.title]);

  // Push current data to the shared server (optimistic concurrency on verRef).
  const flush = async () => {
    if (inFlight.current) { dirty.current = true; return; }
    inFlight.current = true;
    try {
      const res = await fetch("/api/state", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ state: dataRef.current, baseVersion: verRef.current }),
      });
      if (res.status === 409) {
        const latest = await res.json();
        if (latest.state) { verRef.current = latest.version; setData(latest.state); cacheLocal(latest.state); }
        setStatus("conflict");
        setTimeout(() => setStatus("saved"), 2500);
      } else if (res.ok) {
        const out = await res.json();
        verRef.current = out.version;
        setStatus("saved");
      } else { setStatus("offline"); }
    } catch { setStatus("offline"); }
    finally {
      inFlight.current = false;
      if (dirty.current) { dirty.current = false; flush(); }
    }
  };

  const persist = (next) => {
    setData(next);
    dataRef.current = next;
    cacheLocal(next);
    setStatus("saving");
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flush, 500);
  };

  // Initial load from the server; fall back to the local cache when the API is unreachable.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/state");
        if (!res.ok) throw new Error("bad");
        const { state, version } = await res.json();
        if (cancelled) return;
        if (state) {
          verRef.current = version || 0;
          setData(state); cacheLocal(state); setStatus("saved");
        } else {
          // Empty server → seed it with this browser's curated data (or the defaults).
          const seed = loadInitial();
          verRef.current = 0; setData(seed); dataRef.current = seed;
          const put = await fetch("/api/state", {
            method: "PUT", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ state: seed, baseVersion: 0 }),
          });
          if (cancelled) return;
          if (put.ok) { verRef.current = (await put.json()).version; setStatus("saved"); }
          else setStatus("offline");
        }
      } catch { if (!cancelled) setStatus("offline"); }
    })();
    return () => { cancelled = true; };
  }, []);

  // Light polling so co-editors converge (skip while a save is pending/in flight).
  useEffect(() => {
    const id = setInterval(async () => {
      if (inFlight.current || dirty.current || statusRef.current === "saving") return;
      try {
        const res = await fetch("/api/state");
        if (!res.ok) throw new Error("bad");
        const { state, version } = await res.json();
        if (state && version !== verRef.current) { verRef.current = version; setData(state); cacheLocal(state); }
        if (statusRef.current === "offline") setStatus("saved");
      } catch { setStatus("offline"); }
    }, 15000);
    return () => clearInterval(id);
  }, []);
  const update     = (patch) => persist({...data, ...patch});
  const updateArr  = (key, idx, val) => persist({...data, [key]: data[key].map((x,i)=>i===idx?val:x)});
  const moveArr    = (key, idx, dir) => {
    const a=[...data[key]], j=idx+dir;
    if (j<0 || j>=a.length) return;
    [a[idx],a[j]]=[a[j],a[idx]];
    update({[key]:a});
  };
  const removeArr  = (key, idx) => update({[key]: data[key].filter((_,i)=>i!==idx)});

  const { mc, ec, hc } = data;
  const deptMap = useMemo(() => Object.fromEntries(data.depts.map(d=>[d.id,d.name])), [data.depts]);
  const sponsorMap = useMemo(() => Object.fromEntries(data.depts.map(d=>[d.id,d.sponsor||""])), [data.depts]);
  const allUCs  = useMemo(() => data.ucs.map(u => ({...u, deptName: deptMap[u.deptId] || u.deptId})), [data.ucs, deptMap]);
  const selDept = deptId==="all" ? null : data.depts.find(d=>d.id===deptId);
  const customCount = allUCs.filter(u=>u.custom).length;

  const filtered = useMemo(() => {
    let list = deptId==="all" ? allUCs : allUCs.filter(u => u.deptId===deptId);
    if (modeF   !== "all") list = list.filter(u => u.m===modeF);
    if (effortF !== "all") list = list.filter(u => u.e===effortF);
    if (hitlF   !== "all") list = list.filter(u => u.h===hitlF);
    return list;
  }, [allUCs, deptId, modeF, effortF, hitlF]);

  const isAll   = deptId === "all";
  const totAll  = allUCs.length;
  const lowN    = allUCs.filter(u=>u.e==="low").length;

  const cMode   = Object.keys(mc).map(k => ({label:mc[k].label, v:allUCs.filter(u=>u.m===k).length, color:MODE_COLORS[k]}));
  const cEff    = Object.keys(ec).map(k => ({label:ec[k].label, v:allUCs.filter(u=>u.e===k).length, color:EFF_COLORS[k]}));
  const cHITL   = Object.keys(hc).map(k => ({label:hc[k].label, v:allUCs.filter(u=>u.h===k).length, color:HITL_COLORS[k]}));

  const openAdd  = () => { setFormData({...EMPTY_FORM, deptId: deptId!=="all"?deptId:data.depts[0].id}); setEditId(null); setFormOpen(true); };
  const openEdit = (u) => { setFormData({deptId:u.deptId,n:u.n,m:u.m,p:u.p,e:u.e,h:u.h,nn:!!u.nn,champ:u.champ||""}); setEditId(u.uid); setFormOpen(true); };
  const setF     = (k) => (e) => setFormData(prev => ({...prev,[k]:e.target.type==="checkbox"?e.target.checked:e.target.value}));

  const saveForm = () => {
    if (!formData.n.trim() || !formData.p.trim()) return;
    const base = editId ? data.ucs.find(u=>u.uid===editId) : {r:"—", custom:true, uid:newUid()};
    const uc   = {...base, ...formData, n:formData.n.trim(), p:formData.p.trim(), champ:(formData.champ||"").trim()};
    persist({...data, ucs: editId ? data.ucs.map(u => u.uid===editId?uc:u) : [...data.ucs, uc]});
    setFormOpen(false);
  };

  const deleteUC = (uid) => { if (window.confirm("Remove this use case?")) update({ucs: data.ucs.filter(u=>u.uid!==uid)}); };

  // ── department management ──
  const addDept = () => update({depts:[...data.depts, {id:`d${newUid()}`, icon:"ti-folder", name:"New department", sponsor:""}]});
  const deleteDept = (idx) => {
    const d = data.depts[idx];
    const n = data.ucs.filter(u=>u.deptId===d.id).length;
    if (!window.confirm(`Delete "${d.name}"${n?` and its ${n} use case(s)`:""}?`)) return;
    if (deptId===d.id) setDeptId("all");
    persist({...data, depts:data.depts.filter((_,i)=>i!==idx), ucs:data.ucs.filter(u=>u.deptId!==d.id)});
  };

  // ── wave items ──
  const setWaveItems = (wi, fn) => update({waves: data.waves.map((w,i)=>i!==wi?w:{...w, items: fn(w.items)})});

  // ── legends ──
  const updateLegend = (group, k, field, val) => update({[group]: {...data[group], [k]: {...data[group][k], [field]: val}}});

  // ── data import / export / reset ──
  const exportCSV = () => {
    const hdr = "Department,Exec Sponsor,Use Case,Champion,Mode,Platform,Effort,Human Loop,Net-New,Custom\n";
    const rows = allUCs.map(u => [u.deptName,sponsorMap[u.deptId]||"",u.n,u.champ||"",mc[u.m].label,u.p,ec[u.e].label,hc[u.h].label,u.nn?"Yes":"No",u.custom?"Yes":"No"].map(v=>`"${v}"`).join(",")).join("\n");
    Object.assign(document.createElement("a"),{href:"data:text/csv;charset=utf-8,"+encodeURIComponent(hdr+rows),download:"ai_roadmap.csv"}).click();
  };
  const exportJSON = () => {
    Object.assign(document.createElement("a"),{href:"data:application/json;charset=utf-8,"+encodeURIComponent(JSON.stringify(data,null,2)),download:"ai_roadmap.json"}).click();
  };
  const importJSON = (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const obj = JSON.parse(reader.result);
        if (!obj || !Array.isArray(obj.ucs) || !Array.isArray(obj.depts)) throw new Error("shape");
        persist({...clone(DEFAULT_STATE), ...obj});
        window.alert("Dashboard imported.");
      } catch { window.alert("Invalid dashboard JSON file."); }
    };
    reader.readAsText(f);
  };
  const resetDefaults = () => { if (window.confirm("Reset everything to the built-in defaults? This discards all your edits.")) { setDeptId("all"); persist(clone(DEFAULT_STATE)); } };

  const sideItems = [{id:"all",icon:"ti-layout-grid",name:"All departments",cnt:totAll},...data.depts.map(d=>({...d,cnt:allUCs.filter(u=>u.deptId===d.id).length}))];
  const inp = {fontSize:11,padding:"5px 8px",border:"1px solid #D1D5DB",borderRadius:5,background:"#fff",width:"100%"};
  const card = {background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"14px",marginBottom:12};
  const secLbl = {fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:10};
  const addBtn = {fontSize:11,padding:"5px 12px",borderRadius:6,border:"1px dashed #CBD5E1",background:"#fff",color:"#475569",cursor:"pointer",marginTop:4};

  return (
    <div style={{display:"flex",fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:"#F4F2EC",borderRadius:12,overflow:"hidden",fontSize:13,color:"#111827"}}>

      <div style={{width:172,background:BRAND.green,flexShrink:0,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"14px 14px 12px",borderBottom:"1px solid rgba(255,255,255,0.1)"}}>
          <div style={{background:"#fff",borderRadius:8,padding:"8px 10px",marginBottom:10,display:"flex",justifyContent:"center"}}>
            <img src="/whitespot-logo.png" alt="White Spot" style={{width:"100%",maxWidth:120,height:"auto",display:"block"}} onError={e=>{ if (e.currentTarget.parentElement) e.currentTarget.parentElement.style.display="none"; }}/>
          </div>
          <div style={{fontSize:12,fontWeight:700,color:BRAND.cream}}>{data.title}</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.45)",marginTop:2}}>White Spot · Triple O's</div>
        </div>
        <div style={{padding:"10px 14px 4px",fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.4)",textTransform:"uppercase",letterSpacing:"0.09em"}}>Departments</div>
        {sideItems.map(d => {
          const on=deptId===d.id;
          return <div key={d.id} onClick={()=>{setDeptId(d.id);setModeF("all");setEffortF("all");setHitlF("all");setFormOpen(false);}} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 14px",cursor:"pointer",background:on?"rgba(221,180,40,0.16)":"transparent",borderLeft:on?`2px solid ${BRAND.gold}`:"2px solid transparent"}}>
            <i className={`ti ${d.icon}`} style={{fontSize:13,color:on?BRAND.gold:"rgba(255,255,255,0.5)"}} aria-hidden="true"/>
            <span style={{flex:1,fontSize:11,fontWeight:on?600:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:on?BRAND.cream:"rgba(255,255,255,0.62)"}}>{d.name}</span>
            <span style={{fontSize:10,fontWeight:600,color:on?BRAND.gold:"rgba(255,255,255,0.4)"}}>{d.cnt}</span>
          </div>;
        })}
        <div style={{padding:"12px 14px",borderTop:"1px solid rgba(255,255,255,0.06)",marginTop:8}}>
          <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.18)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Mode key</div>
          {Object.entries(mc).map(([k,v]) => <div key={k} style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}><div style={{width:7,height:7,borderRadius:2,background:v.color}}/><span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{v.label}</span></div>)}
        </div>
      </div>

      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <div style={{padding:"16px 18px 0",background:"#F4F2EC"}}>
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {[{v:totAll,l:"Use cases",s:"total including custom",c:BRAND.red},{v:lowN,l:"Quick wins",s:"low effort · immediate",c:"#186E3B"},{v:customCount,l:"Custom added",s:"user-defined use cases",c:"#37657C"},{v:allUCs.filter(u=>u.nn).length,l:"Net-new items",s:"outside current stack",c:"#8E192C"}].map((s,i)=>(
              <div key={i} style={{flex:1,background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:24,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:11,fontWeight:600,color:"#111827",marginTop:3}}>{s.l}</div>
                <div style={{fontSize:10,color:"#9CA3AF"}}>{s.s}</div>
              </div>
            ))}
          </div>
          <div style={{background:"#fff",border:"1px solid #E4E7EC",borderRadius:7,padding:"8px 12px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <span style={{fontSize:9,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.07em"}}>Effort distribution — {totAll} total use cases</span>
              <div style={{display:"flex",gap:12}}>{cEff.map(c=><span key={c.label} style={{fontSize:10,color:c.color,fontWeight:600}}>{c.v} {c.label.split(" ")[0]}</span>)}</div>
            </div>
            <div style={{height:6,borderRadius:3,background:"#F3F4F6",display:"flex",overflow:"hidden"}}>
              {cEff.map(c=><div key={c.label} style={{width:`${totAll?(c.v/totAll)*100:0}%`,background:c.color}}/>)}
            </div>
          </div>
          <div style={{display:"flex",alignItems:"center",borderBottom:"1px solid #E4E7EC"}}>
            {[["Use cases","uc"],["Charts","charts"],["Wave plan","waves"],["KPI targets","kpis"],["Manage","manage"]].map(([lbl,val])=><TBtn key={val} lbl={lbl} val={val} cur={tab} onChange={setTab}/>)}
            <div style={{marginLeft:"auto",paddingRight:4}}><SaveStatus status={status}/></div>
          </div>
        </div>

        <div style={{padding:"14px 18px 22px",background:"#F4F2EC"}}>

          {tab==="uc" && <>
            {selDept && (
              <div style={{background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"10px 14px",marginBottom:12,display:"flex",alignItems:"center",gap:10}}>
                <i className={`ti ${selDept.icon}`} style={{fontSize:18,color:"#6B7280",flexShrink:0}} aria-hidden="true"/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:700,color:"#111827"}}>{selDept.name}</div>
                  <div style={{fontSize:11,color:"#6B7280"}}>Exec sponsor: {selDept.sponsor
                    ? <strong style={{color:"#111827",fontWeight:600}}>{selDept.sponsor}</strong>
                    : <span style={{color:"#9CA3AF",fontStyle:"italic"}}>unassigned — set in Manage</span>}</div>
                </div>
              </div>
            )}
            {formOpen && (
              <div style={{background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"14px",marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:700,color:"#111827",marginBottom:10}}>{editId?"Edit":"Add"} use case</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:8,marginBottom:8}}>
                  <div><div style={{fontSize:10,color:"#6B7280",marginBottom:3}}>Department</div>
                    <select value={formData.deptId} onChange={setF("deptId")} style={{...inp,cursor:"pointer"}}>{data.depts.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}</select></div>
                  <div><div style={{fontSize:10,color:"#6B7280",marginBottom:3}}>Use case name *</div>
                    <input value={formData.n} onChange={setF("n")} placeholder="Describe the use case..." style={inp}/></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:8}}>
                  {[{k:"m",l:"Mode",opts:Object.keys(mc).map(k=>[k,mc[k].label])},{k:"e",l:"Effort",opts:Object.keys(ec).map(k=>[k,ec[k].label])},{k:"h",l:"Human loop",opts:Object.keys(hc).map(k=>[k,hc[k].label])}].map(({k,l,opts})=>(
                    <div key={k}><div style={{fontSize:10,color:"#6B7280",marginBottom:3}}>{l}</div>
                      <select value={formData[k]} onChange={setF(k)} style={{...inp,cursor:"pointer"}}>{opts.map(([v,lb])=><option key={v} value={v}>{lb}</option>)}</select></div>
                  ))}
                  <div><div style={{fontSize:10,color:"#6B7280",marginBottom:3}}>Net-new budget?</div>
                    <label style={{display:"flex",alignItems:"center",gap:6,marginTop:7,cursor:"pointer"}}>
                      <input type="checkbox" checked={formData.nn} onChange={setF("nn")}/><span style={{fontSize:11}}>Requires new budget</span></label></div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:8,marginBottom:10}}>
                  <div><div style={{fontSize:10,color:"#6B7280",marginBottom:3}}>Platform / tool *</div>
                    <input value={formData.p} onChange={setF("p")} placeholder="e.g. Copilot in Word, Power Automate..." style={inp}/></div>
                  <div><div style={{fontSize:10,color:"#6B7280",marginBottom:3}}>Champion(s)</div>
                    <input value={formData.champ} onChange={setF("champ")} placeholder="e.g. Jane Doe, J. Smith" style={inp}/></div>
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                  <button onClick={()=>setFormOpen(false)} style={{fontSize:11,padding:"6px 14px",borderRadius:6,border:"1px solid #D1D5DB",background:"#fff",color:"#6B7280",cursor:"pointer"}}>Cancel</button>
                  <button onClick={saveForm} style={{fontSize:11,padding:"6px 14px",borderRadius:6,border:"none",background:BRAND.red,color:"#fff",cursor:"pointer",fontWeight:600}}>{editId?"Save changes":"Add use case"}</button>
                </div>
              </div>
            )}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:11,color:"#9CA3AF",fontWeight:500}}>{filtered.length} results</span>
              <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                <button onClick={exportCSV} style={{fontSize:11,padding:"5px 12px",borderRadius:6,border:"1px solid #D1D5DB",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <i className="ti ti-download" style={{fontSize:12}} aria-hidden="true"/> Export CSV</button>
                <button onClick={openAdd} style={{fontSize:11,padding:"5px 12px",borderRadius:6,border:"none",background:BRAND.red,color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <i className="ti ti-plus" style={{fontSize:12}} aria-hidden="true"/> Add use case</button>
              </div>
            </div>
            <div style={{display:"flex",gap:10,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:"#9CA3AF",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginRight:2}}>Mode</span>
                {Object.keys(mc).map(k=><FPill key={k} lbl={mc[k].label} val={k} cur={modeF} onChange={setModeF}/>)}
              </div>
              <div style={{width:1,height:16,background:"#D1D5DB"}}/>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:"#9CA3AF",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginRight:2}}>Effort</span>
                {Object.keys(ec).map(k=><FPill key={k} lbl={ec[k].label} val={k} cur={effortF} onChange={setEffortF}/>)}
              </div>
              <div style={{width:1,height:16,background:"#D1D5DB"}}/>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:"#9CA3AF",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginRight:2}}>Loop</span>
                {Object.keys(hc).map(k=><FPill key={k} lbl={hc[k].label} val={k} cur={hitlF} onChange={setHitlF}/>)}
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"minmax(0,2fr) 68px minmax(0,1.1fr) 58px 82px 64px",gap:6,padding:"5px 10px",fontSize:9,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>
              <span>Use case{isAll?" · department":""}</span><span>Mode</span><span>Platform</span><span>Effort</span><span>Human loop</span><span></span>
            </div>
            {filtered.length===0
              ? <div style={{textAlign:"center",padding:"32px 0",color:"#9CA3AF",fontSize:12}}>No results match the active filters.</div>
              : filtered.map((u,i) => (
              <div key={u.uid||i} style={{display:"grid",gridTemplateColumns:"minmax(0,2fr) 68px minmax(0,1.1fr) 58px 82px 64px",gap:6,padding:"8px 10px",alignItems:"center",marginBottom:3,background:i%2===0?"#fff":"#F8F9FB",border:"1px solid #E9EBF0",borderRadius:6}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
                    <span style={{fontSize:9,color:"#CBD5E1",fontWeight:700,minWidth:10}}>{u.r}</span>
                    <span style={{fontSize:12,fontWeight:500,color:"#111827"}}>{u.n}</span>
                    {u.nn     && <span style={{fontSize:8,background:"#F7E8EB",color:"#8E192C",padding:"1px 5px",borderRadius:3,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>net-new</span>}
                    {u.custom && <span style={{fontSize:8,background:"#EAF1F3",color:"#37657C",padding:"1px 5px",borderRadius:3,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>custom</span>}
                    {u.champ  && <span title={`Champion: ${u.champ}`} style={{fontSize:8,background:"#EAF3EC",color:"#186E3B",padding:"1px 5px",borderRadius:3,fontWeight:700,whiteSpace:"nowrap",flexShrink:0,display:"inline-flex",alignItems:"center",gap:2}}><i className="ti ti-user" style={{fontSize:9}} aria-hidden="true"/>{u.champ}</span>}
                  </div>
                  {isAll && <div style={{fontSize:9,color:"#94A3B8",marginTop:1,paddingLeft:14}}>{u.deptName}</div>}
                </div>
                <Pill cfg={mc[u.m]}/>
                <div style={{fontSize:10,color:"#6B7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={u.p}>{u.p}</div>
                <Pill cfg={ec[u.e]}/>
                <Pill cfg={hc[u.h]}/>
                <div style={{display:"flex",gap:3}}>
                  <button onClick={()=>openEdit(u)} title="Edit" style={{width:20,height:20,borderRadius:4,border:"1px solid #E4E7EC",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
                    <i className="ti ti-edit" style={{fontSize:11,color:"#6B7280"}} aria-hidden="true"/></button>
                  <button onClick={()=>deleteUC(u.uid)} title="Delete" style={{width:20,height:20,borderRadius:4,border:"1px solid #ECD2D8",background:"#F7E8EB",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
                    <i className="ti ti-trash" style={{fontSize:11,color:"#8E192C"}} aria-hidden="true"/></button>
                </div>
              </div>
            ))}
          </>}

          {tab==="charts" && <>
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              {[{title:"By mode",data:cMode},{title:"By effort",data:cEff},{title:"Human-in-the-loop",data:cHITL}].map(({title,data})=>(
                <div key={title} style={{flex:1,background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"14px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>{title}</div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <Donut data={data} size={88}/>
                    <div style={{flex:1}}>
                      {data.map(d=>{const tot=data.reduce((s,x)=>s+x.v,0);return<div key={d.label} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                        <div style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0}}/><span style={{fontSize:11,color:"#6B7280",flex:1}}>{d.label}</span>
                        <span style={{fontSize:12,fontWeight:700,color:"#111827"}}>{d.v}</span>
                        <span style={{fontSize:10,color:"#9CA3AF",minWidth:28,textAlign:"right"}}>{tot?Math.round((d.v/tot)*100):0}%</span>
                      </div>;})}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"14px"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Effort breakdown by department</div>
              {data.depts.map(d => {
                const ucs=allUCs.filter(u=>u.deptId===d.id),tot=ucs.length;
                const low=ucs.filter(u=>u.e==="low").length,med=ucs.filter(u=>u.e==="med").length,high=ucs.filter(u=>u.e==="high").length;
                return <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{fontSize:11,color:"#6B7280",width:104,flexShrink:0,textAlign:"right"}}>{d.name}</span>
                  <div style={{flex:1,height:16,borderRadius:4,background:"#F3F4F6",display:"flex",overflow:"hidden"}}>
                    <div style={{width:`${tot?(low/tot)*100:0}%`,background:"#186E3B"}}/>
                    <div style={{width:`${tot?(med/tot)*100:0}%`,background:"#EDA934"}}/>
                    <div style={{width:`${tot?(high/tot)*100:0}%`,background:"#8E192C"}}/>
                  </div>
                  <div style={{fontSize:10,width:60,flexShrink:0,display:"flex",gap:4}}>
                    <span style={{color:"#186E3B",fontWeight:600}}>{low}L</span>
                    {med>0&&<span style={{color:"#B45309",fontWeight:600}}>{med}M</span>}
                    {high>0&&<span style={{color:"#8E192C",fontWeight:600}}>{high}H</span>}
                  </div>
                </div>;
              })}
              <div style={{display:"flex",gap:14,marginTop:8,paddingTop:8,borderTop:"1px solid #F3F4F6"}}>
                {[{c:"#186E3B",l:"Low"},{c:"#EDA934",l:"Medium"},{c:"#8E192C",l:"High"}].map(x=><div key={x.l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:2,background:x.c}}/><span style={{fontSize:10,color:"#9CA3AF"}}>{x.l} effort</span></div>)}
              </div>
            </div>
          </>}

          {tab==="waves" && <>
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {data.waves.map(w=>{
                const em={1:"low",2:"med",3:"high"},wUCs=allUCs.filter(u=>u.e===em[w.num]),nnC=wUCs.filter(u=>u.nn).length;
                return<div key={w.num} style={{flex:1,background:"#fff",border:"1px solid #E4E7EC",borderTop:`3px solid ${w.color}`,borderRadius:8,padding:"10px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:w.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:9,fontWeight:800,color:"#fff"}}>{w.num}</span></div>
                    <span style={{fontSize:12,fontWeight:700,color:"#111827"}}>{w.title}</span>
                  </div>
                  <div style={{fontSize:10,color:"#6B7280",marginBottom:6}}>{w.period}</div>
                  <div style={{display:"flex",gap:14}}>
                    <div><div style={{fontSize:20,fontWeight:700,color:w.color}}>{wUCs.length}</div><div style={{fontSize:9,color:"#9CA3AF"}}>use cases</div></div>
                    <div><div style={{fontSize:20,fontWeight:700,color:nnC>0?"#8E192C":"#9CA3AF"}}>{nnC}</div><div style={{fontSize:9,color:"#9CA3AF"}}>net-new</div></div>
                  </div>
                </div>;
              })}
            </div>
            <div style={{display:"flex",background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,overflow:"hidden",marginBottom:12}}>
              {data.waves.map((w,i)=><div key={w.num} style={{flex:1,padding:"10px 14px",borderRight:i<data.waves.length-1?"1px solid #E4E7EC":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:w.color,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,fontWeight:800,color:"#fff"}}>{w.num}</span></div>
                  <span style={{fontSize:12,fontWeight:700,color:"#111827"}}>{w.title}</span>
                </div>
                <div style={{fontSize:10,color:"#6B7280"}}>{w.period}</div>
                <div style={{fontSize:10,color:w.color,fontWeight:600,marginTop:1}}>{w.focus}</div>
              </div>)}
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {data.waves.map(w=><div key={w.num} style={{background:"#fff",border:"1px solid #E4E7EC",borderTop:`3px solid ${w.color}`,borderRadius:8,padding:"14px"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#111827",marginBottom:1}}>Wave {w.num} — {w.title}</div>
                <div style={{fontSize:10,color:"#9CA3AF",marginBottom:12}}>{w.period} · {w.focus}</div>
                {w.items.map((item,i)=><div key={i} style={{display:"flex",gap:6,paddingBottom:5,marginBottom:5,alignItems:"flex-start",borderBottom:i<w.items.length-1?"1px solid #F3F4F6":"none"}}>
                  <div style={{width:15,height:15,borderRadius:"50%",flexShrink:0,marginTop:1,background:w.color+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:8,fontWeight:800,color:w.color}}>{i+1}</span></div>
                  <span style={{fontSize:11,color:"#374151",lineHeight:1.4}}>{item}</span>
                </div>)}
              </div>)}
            </div>
          </>}

          {tab==="kpis" && <>
            <div style={{background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"12px 16px",marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:3}}>Measuring AI adoption success</div>
              <div style={{fontSize:12,color:"#6B7280"}}>Track these KPIs quarterly through your AI Centre of Excellence. Report to leadership at each wave gate review.</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {data.kpis.map((k,i)=><div key={i} style={{background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"16px",gridColumn:(i===data.kpis.length-1&&data.kpis.length%2===1)?"span 2":"auto"}}>
                <div style={{fontSize:9,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>{k.l}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:6}}>
                  <span style={{fontSize:22,fontWeight:700,color:"#111827"}}>{k.v}</span>
                  <span style={{fontSize:11,color:"#6B7280"}}>{k.sub}</span>
                </div>
                <div style={{fontSize:12,color:"#6B7280",lineHeight:1.5}}>{k.d}</div>
              </div>)}
            </div>
          </>}

          {tab==="manage" && <>
            {/* General */}
            <div style={card}>
              <div style={secLbl}>General</div>
              <div style={{fontSize:10,color:"#6B7280",marginBottom:3}}>Dashboard title</div>
              <input value={data.title} onChange={e=>update({title:e.target.value})} style={inp} placeholder="Dashboard title"/>
              <div style={{fontSize:10,color:"#9CA3AF",marginTop:8}}>Shown in the sidebar and the browser tab. The logo lives at <code>public/whitespot-logo.png</code>.</div>
            </div>

            {/* Departments */}
            <div style={card}>
              <div style={secLbl}>Departments</div>
              {data.depts.map((d,i)=>(
                <div key={d.id} style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
                  <input value={d.icon} onChange={e=>updateArr("depts",i,{...d,icon:e.target.value})} style={{...inp,width:118}} placeholder="ti-icon"/>
                  <i className={`ti ${d.icon}`} style={{fontSize:15,color:"#6B7280",width:18,textAlign:"center",flexShrink:0}} aria-hidden="true"/>
                  <input value={d.name} onChange={e=>updateArr("depts",i,{...d,name:e.target.value})} style={{...inp,flex:1}} placeholder="Department name"/>
                  <input value={d.sponsor||""} onChange={e=>updateArr("depts",i,{...d,sponsor:e.target.value})} style={{...inp,flex:1}} placeholder="Exec sponsor"/>
                  <span style={{fontSize:10,color:"#9CA3AF",width:54,flexShrink:0,textAlign:"right"}}>{allUCs.filter(u=>u.deptId===d.id).length} cases</span>
                  <MiniBtn icon="ti-chevron-up" onClick={()=>moveArr("depts",i,-1)} title="Move up" disabled={i===0}/>
                  <MiniBtn icon="ti-chevron-down" onClick={()=>moveArr("depts",i,1)} title="Move down" disabled={i===data.depts.length-1}/>
                  <MiniBtn icon="ti-trash" danger onClick={()=>deleteDept(i)} title="Delete department"/>
                </div>
              ))}
              <button onClick={addDept} style={addBtn}>+ Add department</button>
              <div style={{fontSize:10,color:"#9CA3AF",marginTop:8}}>Icons use <a href="https://tabler.io/icons" target="_blank" rel="noreferrer" style={{color:"#6B7280"}}>Tabler</a> names, e.g. <code>ti-tool</code>, <code>ti-users</code>.</div>
            </div>

            {/* Waves */}
            <div style={card}>
              <div style={secLbl}>Wave plan</div>
              {data.waves.map((w,wi)=>(
                <div key={wi} style={{border:"1px solid #E9EBF0",borderRadius:6,padding:"10px",marginBottom:8}}>
                  <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
                    <span style={{fontSize:11,fontWeight:700,color:w.color,width:54,flexShrink:0}}>Wave {w.num}</span>
                    <input value={w.title} onChange={e=>update({waves:data.waves.map((x,i)=>i===wi?{...x,title:e.target.value}:x)})} style={{...inp,flex:1}} placeholder="Title"/>
                    <input value={w.period} onChange={e=>update({waves:data.waves.map((x,i)=>i===wi?{...x,period:e.target.value}:x)})} style={{...inp,width:120}} placeholder="Period"/>
                    <input type="color" value={w.color} onChange={e=>update({waves:data.waves.map((x,i)=>i===wi?{...x,color:e.target.value}:x)})} title="Color" style={{width:30,height:28,padding:0,border:"1px solid #D1D5DB",borderRadius:5,background:"#fff",cursor:"pointer",flexShrink:0}}/>
                  </div>
                  <input value={w.focus} onChange={e=>update({waves:data.waves.map((x,i)=>i===wi?{...x,focus:e.target.value}:x)})} style={{...inp,marginBottom:8}} placeholder="Focus"/>
                  <div style={{fontSize:9,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:5}}>Items</div>
                  {w.items.map((it,ii)=>(
                    <div key={ii} style={{display:"flex",gap:6,alignItems:"center",marginBottom:4}}>
                      <input value={it} onChange={e=>setWaveItems(wi,items=>items.map((x,j)=>j===ii?e.target.value:x))} style={{...inp,flex:1}}/>
                      <MiniBtn icon="ti-chevron-up" onClick={()=>setWaveItems(wi,items=>{const a=[...items];if(ii<=0)return a;[a[ii],a[ii-1]]=[a[ii-1],a[ii]];return a;})} title="Move up" disabled={ii===0}/>
                      <MiniBtn icon="ti-chevron-down" onClick={()=>setWaveItems(wi,items=>{const a=[...items];if(ii>=a.length-1)return a;[a[ii],a[ii+1]]=[a[ii+1],a[ii]];return a;})} title="Move down" disabled={ii===w.items.length-1}/>
                      <MiniBtn icon="ti-trash" danger onClick={()=>setWaveItems(wi,items=>items.filter((_,j)=>j!==ii))} title="Remove item"/>
                    </div>
                  ))}
                  <button onClick={()=>setWaveItems(wi,items=>[...items,"New item"])} style={addBtn}>+ Add item</button>
                </div>
              ))}
              <div style={{fontSize:10,color:"#9CA3AF",marginTop:4}}>Wave count is fixed at 3 — waves 1/2/3 map to Low/Medium/High effort in the summary counts.</div>
            </div>

            {/* KPIs */}
            <div style={card}>
              <div style={secLbl}>KPI targets</div>
              {data.kpis.map((k,i)=>(
                <div key={i} style={{border:"1px solid #E9EBF0",borderRadius:6,padding:"8px 10px",marginBottom:6}}>
                  <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:6}}>
                    <input value={k.l} onChange={e=>updateArr("kpis",i,{...k,l:e.target.value})} style={{...inp,flex:1}} placeholder="Label"/>
                    <input value={k.v} onChange={e=>updateArr("kpis",i,{...k,v:e.target.value})} style={{...inp,width:90}} placeholder="Value"/>
                    <input value={k.sub} onChange={e=>updateArr("kpis",i,{...k,sub:e.target.value})} style={{...inp,width:130}} placeholder="Sub-label"/>
                    <MiniBtn icon="ti-chevron-up" onClick={()=>moveArr("kpis",i,-1)} title="Move up" disabled={i===0}/>
                    <MiniBtn icon="ti-chevron-down" onClick={()=>moveArr("kpis",i,1)} title="Move down" disabled={i===data.kpis.length-1}/>
                    <MiniBtn icon="ti-trash" danger onClick={()=>removeArr("kpis",i)} title="Remove KPI"/>
                  </div>
                  <input value={k.d} onChange={e=>updateArr("kpis",i,{...k,d:e.target.value})} style={inp} placeholder="Description"/>
                </div>
              ))}
              <button onClick={()=>update({kpis:[...data.kpis,{l:"New KPI",v:"—",sub:"",d:""}]})} style={addBtn}>+ Add KPI</button>
            </div>

            {/* Legends */}
            <div style={card}>
              <div style={secLbl}>Legend labels &amp; colors</div>
              {[["Mode","mc"],["Effort","ec"],["Human loop","hc"]].map(([title,group])=>(
                <div key={group} style={{marginBottom:10}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#374151",marginBottom:5}}>{title}</div>
                  {Object.entries(data[group]).map(([k,cfg])=>(
                    <div key={k} style={{display:"flex",gap:8,alignItems:"center",marginBottom:5}}>
                      <code style={{fontSize:10,color:"#9CA3AF",width:60,flexShrink:0}}>{k}</code>
                      <input value={cfg.label} onChange={e=>updateLegend(group,k,"label",e.target.value)} style={{...inp,flex:1,maxWidth:200}} placeholder="Label"/>
                      <Pill cfg={cfg}/>
                      <label style={{fontSize:10,color:"#9CA3AF",display:"flex",alignItems:"center",gap:4}}>text
                        <input type="color" value={cfg.color} onChange={e=>updateLegend(group,k,"color",e.target.value)} style={{width:28,height:26,padding:0,border:"1px solid #D1D5DB",borderRadius:5,background:"#fff",cursor:"pointer"}}/></label>
                      <label style={{fontSize:10,color:"#9CA3AF",display:"flex",alignItems:"center",gap:4}}>bg
                        <input type="color" value={cfg.bg} onChange={e=>updateLegend(group,k,"bg",e.target.value)} style={{width:28,height:26,padding:0,border:"1px solid #D1D5DB",borderRadius:5,background:"#fff",cursor:"pointer"}}/></label>
                    </div>
                  ))}
                </div>
              ))}
              <div style={{fontSize:10,color:"#9CA3AF"}}>Categories themselves are fixed (they drive the filters and charts); only their labels and colors are editable here.</div>
            </div>

            {/* Data */}
            <div style={card}>
              <div style={secLbl}>Data</div>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                <button onClick={exportJSON} style={{fontSize:11,padding:"6px 12px",borderRadius:6,border:"1px solid #D1D5DB",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <i className="ti ti-download" style={{fontSize:12}} aria-hidden="true"/> Export JSON</button>
                <button onClick={()=>fileRef.current?.click()} style={{fontSize:11,padding:"6px 12px",borderRadius:6,border:"1px solid #D1D5DB",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <i className="ti ti-upload" style={{fontSize:12}} aria-hidden="true"/> Import JSON</button>
                <input ref={fileRef} type="file" accept="application/json,.json" onChange={importJSON} style={{display:"none"}}/>
                <button onClick={resetDefaults} style={{fontSize:11,padding:"6px 12px",borderRadius:6,border:"1px solid #ECD2D8",background:"#F7E8EB",color:"#8E192C",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <i className="ti ti-refresh" style={{fontSize:12}} aria-hidden="true"/> Reset to defaults</button>
              </div>
              <div style={{fontSize:10,color:"#9CA3AF",marginTop:8}}>All changes save automatically to this browser. Export the JSON to back up or move your dashboard to another device.</div>
            </div>
          </>}

        </div>
      </div>
    </div>
  );
}
