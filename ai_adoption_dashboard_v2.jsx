import { useState, useMemo, useEffect } from 'react';

// ── DATA ────────────────────────────────────────────────
const DEPTS = [
  { id:"ops",  icon:"ti-tool",           name:"Operations",        uc:[
    {r:1,n:"Daily ops briefings & shift summaries",   m:"chat", p:"Copilot in Teams",              e:"low",  h:"no"},
    {r:2,n:"Guest complaint response drafts",          m:"chat", p:"Copilot in Outlook",            e:"low",  h:"yes"},
    {r:3,n:"Incident report generation",               m:"chat", p:"Copilot in Word",               e:"low",  h:"yes"},
    {r:4,n:"Inventory anomaly alerts & escalation",    m:"agent",p:"Power Automate + AI Builder",   e:"med",  h:"partial"},
    {r:5,n:"Ops KPI narrative reports",                m:"tool", p:"Power BI Smart Narratives",     e:"low",  h:"no"},
  ]},
  { id:"fin",  icon:"ti-currency-dollar",name:"Finance",           uc:[
    {r:1,n:"Month-end variance commentary drafts",    m:"chat", p:"Copilot in Excel / Word",        e:"low",  h:"yes"},
    {r:2,n:"Budget narrative & board deck drafts",    m:"chat", p:"Copilot in PowerPoint",          e:"low",  h:"yes"},
    {r:3,n:"Expense anomaly detection & alerts",      m:"agent",p:"Power Automate + AI Builder",   e:"med",  h:"partial"},
    {r:4,n:"Invoice processing & AP routing",         m:"agent",p:"AI Builder",                    e:"high", h:"partial", nn:true},
    {r:5,n:"Vendor contract summarization",           m:"chat", p:"Copilot in Word",               e:"low",  h:"yes"},
  ]},
  { id:"mkt",  icon:"ti-speakerphone",  name:"Marketing",          uc:[
    {r:1,n:"Campaign copy & social content drafts",   m:"chat", p:"Copilot / Claude",              e:"low",  h:"yes"},
    {r:2,n:"Menu & promo visual asset creation",      m:"tool", p:"Canva AI",                      e:"low",  h:"yes", nn:true},
    {r:3,n:"Content calendar generation",             m:"chat", p:"Copilot in Teams",              e:"low",  h:"yes"},
    {r:4,n:"Email campaign drafting & optimization",  m:"chat", p:"Copilot in Outlook",            e:"low",  h:"yes"},
    {r:5,n:"Brand sentiment monitoring & summary",    m:"agent",p:"Power Automate + Copilot",      e:"med",  h:"partial"},
  ]},
  { id:"hr",   icon:"ti-users",         name:"HR & People",        uc:[
    {r:1,n:"Job description & offer letter drafts",   m:"chat", p:"Copilot in Word",               e:"low",  h:"yes"},
    {r:2,n:"Performance review & SMART goal writing", m:"chat", p:"Copilot in Word",               e:"low",  h:"yes"},
    {r:3,n:"Onboarding document packages",            m:"chat", p:"Copilot in Word / Teams",       e:"low",  h:"yes"},
    {r:4,n:"HR policy Q&A bot for all staff",         m:"agent",p:"Copilot Studio",                e:"high", h:"no"},
    {r:5,n:"Training content generation (L&D)",       m:"tool", p:"Copilot in PowerPoint",         e:"low",  h:"yes"},
  ]},
  { id:"it",   icon:"ti-server",        name:"IT",                 uc:[
    {r:1,n:"SQL, DAX, M query & script generation",   m:"chat", p:"Claude / Copilot",              e:"low",  h:"yes"},
    {r:2,n:"IT ticket triage & auto-routing",         m:"agent",p:"Power Automate + AI Builder",   e:"med",  h:"partial"},
    {r:3,n:"Runbook & technical doc drafting",        m:"chat", p:"Copilot in Word",               e:"low",  h:"yes"},
    {r:4,n:"Security alert triage & summarization",   m:"chat", p:"Copilot for Security",          e:"med",  h:"yes", nn:true},
    {r:5,n:"Change request & impact assessment",      m:"chat", p:"Copilot in Word",               e:"low",  h:"yes"},
  ]},
  { id:"leg",  icon:"ti-scale",         name:"Legal & Compliance", uc:[
    {r:1,n:"Contract & agreement summarization",      m:"chat", p:"Copilot in Word",               e:"low",  h:"yes"},
    {r:2,n:"Compliance checklist gen (S-211 etc.)",   m:"chat", p:"Copilot in Word",               e:"low",  h:"yes"},
    {r:3,n:"Policy gap analysis & redline drafts",    m:"chat", p:"Copilot in Word",               e:"med",  h:"yes"},
    {r:4,n:"Franchise agreement clause comparison",   m:"chat", p:"Copilot in Word",               e:"med",  h:"yes"},
    {r:5,n:"Regulatory update monitoring",            m:"agent",p:"Power Automate + Copilot",      e:"med",  h:"partial"},
  ]},
  { id:"fran", icon:"ti-building-store",name:"Franchise Dev",      uc:[
    {r:1,n:"Franchisee performance report narratives",m:"tool", p:"Power BI Smart Narratives",     e:"low",  h:"no"},
    {r:2,n:"Franchise prospect research briefs",      m:"chat", p:"Copilot / Claude",              e:"low",  h:"yes"},
    {r:3,n:"Franchisee comms & newsletters",          m:"chat", p:"Copilot in Outlook",            e:"low",  h:"yes"},
    {r:4,n:"FDD & franchise doc summarization",       m:"chat", p:"Copilot in Word",               e:"low",  h:"yes"},
    {r:5,n:"Site selection data analysis",            m:"chat", p:"Copilot in Excel",              e:"med",  h:"yes"},
  ]},
  { id:"exec", icon:"ti-chart-line",    name:"Executive",          uc:[
    {r:1,n:"Board deck & exec presentation drafts",   m:"chat", p:"Copilot in PowerPoint",         e:"low",  h:"yes"},
    {r:2,n:"Meeting prep briefs & action capture",    m:"agent",p:"Teams Premium + Copilot",       e:"med",  h:"yes", nn:true},
    {r:3,n:"Strategic document summarization",        m:"chat", p:"Copilot in Word",               e:"low",  h:"yes"},
    {r:4,n:"KPI commentary & narrative automation",   m:"tool", p:"Power BI + Copilot",            e:"med",  h:"no"},
  ]},
];

const WAVES = [
  { num:1, title:"Quick wins",          period:"Months 1–3",  color:"#16A34A", focus:"M365 Copilot & existing stack",
    items:["M365 Copilot rollout: document drafting across all departments","Claude for IT: SQL, DAX, M query, and script generation","Power BI Smart Narratives: Ops, Finance, Franchise Dev","Copilot in Outlook: email drafting — Marketing, HR, Franchise","Copilot in PowerPoint: deck drafts — Finance, Marketing, Exec","Wave 1 AI MasterClass: onboarding all staff to Chat tools"]},
  { num:2, title:"Core enablement",     period:"Months 3–6",  color:"#1D4ED8", focus:"Power Platform & Copilot Studio",
    items:["Power Automate: IT ticket triage & auto-routing flows","Power Automate: expense anomaly detection & alerts","Copilot Studio: HR policy Q&A bot for all staff","Teams Premium: exec meeting intelligence & action items","Franchise Power BI: automated performance narratives","Legal: contract review & compliance checklist workflows"]},
  { num:3, title:"Advanced automation", period:"Months 6–12", color:"#7C3AED", focus:"AI Builder & custom agents",
    items:["AI Builder: invoice processing & AP routing automation","Brand sentiment monitoring agent (Power Automate)","Regulatory update monitoring & briefing agent","Azure / Claude: custom cross-system workflow agents","CoE maturity measurement & continuous iteration cycle","Franchise self-serve AI reporting portal"]},
];

const KPIS = [
  { l:"AI adoption rate",   v:"≥70%",     sub:"by month 6",        d:"Staff actively using ≥1 AI tool monthly — primary CoE health signal" },
  { l:"Time reclaimed",     v:"2+ hrs",    sub:"per user / week",   d:"Average weekly hours saved per person across AI-assisted tasks" },
  { l:"Use case velocity",  v:"On track",  sub:"monthly reporting", d:"Cumulative use cases live vs. roadmap, tracked by CoE every month" },
  { l:"Cycle time delta",   v:"30–40%",    sub:"faster",            d:"Reduction in time for repeatable tasks: reports, JDs, summaries" },
  { l:"Staff satisfaction", v:"4 / 5",     sub:"quarterly pulse",   d:"Usefulness and confidence score across departments each quarter" },
];

const MC = { chat:{label:"Chat",bg:"#EFF6FF",color:"#1E40AF"}, tool:{label:"Tool",bg:"#F0FDF4",color:"#15803D"}, agent:{label:"Agent",bg:"#F5F3FF",color:"#6D28D9"} };
const EC = { low:{label:"Low",bg:"#F0FDF4",color:"#15803D"}, med:{label:"Medium",bg:"#FFFBEB",color:"#B45309"}, high:{label:"High",bg:"#FEF2F2",color:"#B91C1C"} };
const HC = { yes:{label:"Human req.",bg:"#FFFBEB",color:"#B45309"}, partial:{label:"Partial",bg:"#EFF6FF",color:"#1E40AF"}, no:{label:"Automated",bg:"#F0FDF4",color:"#15803D"} };

const BASE_UCS = DEPTS.flatMap(d => d.uc.map(u => ({ ...u, deptName:d.name, deptId:d.id, builtin:true })));

const STORAGE_KEY = 'ai_roadmap_custom_v2';

// ── HELPERS ────────────────────────────────────────────
function Donut({ data, size=92 }) {
  const tot = data.reduce((s,d) => s+d.v, 0);
  if (!tot) return <svg width={size} height={size} />;
  let ang = -Math.PI/2;
  const cx=size/2, cy=size/2, R=size*.4, ri=size*.27;
  const segs = data.map(d => {
    const sa=ang, sw=Math.min((d.v/tot)*2*Math.PI, 2*Math.PI-.001);
    ang += (d.v/tot)*2*Math.PI;
    const ea=ang, big=sw>Math.PI?1:0;
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
  return <button onClick={()=>onChange(on?"all":val)} style={{fontSize:11,padding:"3px 10px",borderRadius:12,cursor:"pointer",fontWeight:on?600:400,border:on?"none":"1px solid #D1D5DB",background:on?"#0F172A":"#fff",color:on?"#fff":"#6B7280"}}>{lbl}</button>;
}

function TBtn({ lbl, val, cur, onChange }) {
  const on = cur===val;
  return <button onClick={()=>onChange(val)} style={{fontSize:12,padding:"8px 14px",border:"none",background:"transparent",cursor:"pointer",fontWeight:on?700:400,color:on?"#111827":"#6B7280",borderBottom:on?"2px solid #111827":"2px solid transparent"}}>{lbl}</button>;
}

const EMPTY_FORM = { deptId:"ops", n:"", m:"chat", p:"", e:"low", h:"yes", nn:false };

// ── APP ────────────────────────────────────────────────
export default function App() {
  const [deptId,   setDeptId]   = useState("all");
  const [modeF,    setModeF]    = useState("all");
  const [effortF,  setEffortF]  = useState("all");
  const [hitlF,    setHitlF]    = useState("all");
  const [tab,      setTab]      = useState("uc");
  const [customUCs,setCustomUCs]= useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [formData, setFormData] = useState({...EMPTY_FORM});
  const [editId,   setEditId]   = useState(null);

  // Load persisted custom UCs
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setCustomUCs(JSON.parse(saved));
    } catch(e) {}
  }, []);

  const persist = (ucs) => {
    setCustomUCs(ucs);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(ucs)); } catch(e) {}
  };

  const allUCs = useMemo(() => [...BASE_UCS, ...customUCs], [customUCs]);

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
  const medN    = allUCs.filter(u=>u.e==="med").length;
  const highN   = allUCs.filter(u=>u.e==="high").length;

  const chartMode   = [{label:"Chat",v:allUCs.filter(u=>u.m==="chat").length,color:"#1E40AF"},{label:"Tool",v:allUCs.filter(u=>u.m==="tool").length,color:"#15803D"},{label:"Agent",v:allUCs.filter(u=>u.m==="agent").length,color:"#6D28D9"}];
  const chartEffort = [{label:"Low",v:lowN,color:"#22C55E"},{label:"Medium",v:medN,color:"#F59E0B"},{label:"High",v:highN,color:"#EF4444"}];
  const chartHITL   = [{label:"Human req.",v:allUCs.filter(u=>u.h==="yes").length,color:"#F59E0B"},{label:"Partial",v:allUCs.filter(u=>u.h==="partial").length,color:"#1E40AF"},{label:"Automated",v:allUCs.filter(u=>u.h==="no").length,color:"#22C55E"}];

  const openAdd  = () => { setFormData({...EMPTY_FORM}); setEditId(null); setFormOpen(true); };
  const openEdit = (u) => { setFormData({deptId:u.deptId,n:u.n,m:u.m,p:u.p,e:u.e,h:u.h,nn:!!u.nn}); setEditId(u.uid); setFormOpen(true); };
  const setF     = (k) => (e) => setFormData(prev => ({...prev,[k]:e.target.type==="checkbox"?e.target.checked:e.target.value}));

  const saveForm = () => {
    if (!formData.n.trim() || !formData.p.trim()) return;
    const dept = DEPTS.find(d => d.id===formData.deptId);
    const uid  = editId || Date.now();
    const uc   = {...formData, n:formData.n.trim(), p:formData.p.trim(), deptName:dept.name, r:"—", custom:true, uid};
    persist(editId ? customUCs.map(u => u.uid===editId?uc:u) : [...customUCs,uc]);
    setFormOpen(false);
  };

  const deleteUC = (uid) => { if (window.confirm("Remove this use case?")) persist(customUCs.filter(u=>u.uid!==uid)); };

  const exportCSV = () => {
    const hdr = "Department,Use Case,Mode,Platform,Effort,Human Loop,Net-New,Custom\n";
    const rows = allUCs.map(u => [u.deptName,u.n,MC[u.m].label,u.p,EC[u.e].label,HC[u.h].label,u.nn?"Yes":"No",u.custom?"Yes":"No"].map(v=>`"${v}"`).join(",")).join("\n");
    const a = Object.assign(document.createElement("a"),{href:"data:text/csv;charset=utf-8,"+encodeURIComponent(hdr+rows),download:"ai_roadmap.csv"});
    a.click();
  };

  const sideItems = [{id:"all",icon:"ti-layout-grid",name:"All departments",cnt:totAll},...DEPTS.map(d=>({...d,cnt:allUCs.filter(u=>u.deptId===d.id).length}))];
  const inpStyle  = {fontSize:11,padding:"5px 8px",border:"1px solid #D1D5DB",borderRadius:5,background:"#fff",width:"100%"};
  const selStyle  = {...inpStyle,cursor:"pointer"};

  return (
    <div style={{display:"flex",fontFamily:'-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif',background:"#F0F2F5",borderRadius:12,overflow:"hidden",fontSize:13,color:"#111827"}}>

      {/* ── SIDEBAR ── */}
      <div style={{width:172,background:"#0F172A",flexShrink:0,display:"flex",flexDirection:"column"}}>
        <div style={{padding:"16px 14px 12px",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
          <div style={{fontSize:12,fontWeight:700,color:"#F8FAFC"}}>AI Adoption Roadmap</div>
          <div style={{fontSize:10,color:"rgba(255,255,255,0.3)",marginTop:2}}>White Spot · Triple O's</div>
        </div>
        <div style={{padding:"10px 14px 4px",fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.2)",textTransform:"uppercase",letterSpacing:"0.09em"}}>Departments</div>
        {sideItems.map(d => {
          const on=deptId===d.id;
          return <div key={d.id} onClick={()=>{setDeptId(d.id);setModeF("all");setEffortF("all");setHitlF("all");setFormOpen(false);}} style={{display:"flex",alignItems:"center",gap:7,padding:"7px 14px",cursor:"pointer",background:on?"rgba(59,130,246,0.12)":"transparent",borderLeft:on?"2px solid #3B82F6":"2px solid transparent"}}>
            <i className={`ti ${d.icon}`} style={{fontSize:13,color:on?"#93C5FD":"rgba(255,255,255,0.28)"}} aria-hidden="true"/>
            <span style={{flex:1,fontSize:11,fontWeight:on?600:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",color:on?"#EFF6FF":"rgba(255,255,255,0.42)"}}>{d.name}</span>
            <span style={{fontSize:10,fontWeight:600,color:on?"#93C5FD":"rgba(255,255,255,0.2)"}}>{d.cnt}</span>
          </div>;
        })}
        <div style={{padding:"12px 14px",borderTop:"1px solid rgba(255,255,255,0.06)",marginTop:8}}>
          <div style={{fontSize:9,fontWeight:700,color:"rgba(255,255,255,0.18)",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>Mode key</div>
          {Object.entries(MC).map(([k,v]) => <div key={k} style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}><div style={{width:7,height:7,borderRadius:2,background:v.color}}/><span style={{fontSize:10,color:"rgba(255,255,255,0.3)"}}>{v.label}</span></div>)}
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{flex:1,display:"flex",flexDirection:"column",minWidth:0}}>
        <div style={{padding:"16px 18px 0",background:"#F0F2F5"}}>
          {/* Stats row */}
          <div style={{display:"flex",gap:8,marginBottom:10}}>
            {[{v:totAll,l:"Use cases",s:"total including custom",c:"#111827"},{v:lowN,l:"Quick wins",s:"low effort · immediate",c:"#15803D"},{v:customUCs.length,l:"Custom added",s:"user-defined use cases",c:"#6D28D9"},{v:allUCs.filter(u=>u.nn).length,l:"Net-new items",s:"outside current stack",c:"#B91C1C"}].map((s,i)=>(
              <div key={i} style={{flex:1,background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"10px 12px"}}>
                <div style={{fontSize:24,fontWeight:700,color:s.c,lineHeight:1}}>{s.v}</div>
                <div style={{fontSize:11,fontWeight:600,color:"#111827",marginTop:3}}>{s.l}</div>
                <div style={{fontSize:10,color:"#9CA3AF"}}>{s.s}</div>
              </div>
            ))}
          </div>
          {/* Effort bar */}
          <div style={{background:"#fff",border:"1px solid #E4E7EC",borderRadius:7,padding:"8px 12px",marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
              <span style={{fontSize:9,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.07em"}}>Effort distribution — {totAll} total use cases</span>
              <div style={{display:"flex",gap:12}}>
                {chartEffort.map(c=><span key={c.label} style={{fontSize:10,color:c.color,fontWeight:600}}>{c.v} {c.label.split(" ")[0]}</span>)}
              </div>
            </div>
            <div style={{height:6,borderRadius:3,background:"#F3F4F6",display:"flex",overflow:"hidden"}}>
              {chartEffort.map(c=><div key={c.label} style={{width:`${(c.v/totAll)*100}%`,background:c.color}}/>)}
            </div>
          </div>
          {/* Tabs */}
          <div style={{display:"flex",borderBottom:"1px solid #E4E7EC"}}>
            {[["Use cases","uc"],["Charts","charts"],["Wave plan","waves"],["KPI targets","kpis"]].map(([lbl,val])=><TBtn key={val} lbl={lbl} val={val} cur={tab} onChange={setTab}/>)}
          </div>
        </div>

        <div style={{padding:"14px 18px 22px",background:"#F0F2F5"}}>

          {/* ── USE CASES ── */}
          {tab==="uc" && <>
            {formOpen && (
              <div style={{background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"14px",marginBottom:12}}>
                <div style={{fontSize:12,fontWeight:700,color:"#111827",marginBottom:10}}>{editId?"Edit":"Add"} use case</div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:8,marginBottom:8}}>
                  <div>
                    <div style={{fontSize:10,color:"#6B7280",marginBottom:3}}>Department</div>
                    <select value={formData.deptId} onChange={setF("deptId")} style={selStyle}>
                      {DEPTS.map(d=><option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <div style={{fontSize:10,color:"#6B7280",marginBottom:3}}>Use case name *</div>
                    <input value={formData.n} onChange={setF("n")} placeholder="Describe the use case..." style={inpStyle}/>
                  </div>
                </div>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:8}}>
                  {[{k:"m",l:"Mode",opts:[["chat","Chat"],["tool","Tool"],["agent","Agent"]]},{k:"e",l:"Effort",opts:[["low","Low"],["med","Medium"],["high","High"]]},{k:"h",l:"Human loop",opts:[["yes","Human req."],["partial","Partial"],["no","Automated"]]}].map(({k,l,opts})=>(
                    <div key={k}>
                      <div style={{fontSize:10,color:"#6B7280",marginBottom:3}}>{l}</div>
                      <select value={formData[k]} onChange={setF(k)} style={selStyle}>{opts.map(([v,lb])=><option key={v} value={v}>{lb}</option>)}</select>
                    </div>
                  ))}
                  <div>
                    <div style={{fontSize:10,color:"#6B7280",marginBottom:3}}>Net-new budget?</div>
                    <label style={{display:"flex",alignItems:"center",gap:6,marginTop:7,cursor:"pointer"}}>
                      <input type="checkbox" checked={formData.nn} onChange={setF("nn")}/>
                      <span style={{fontSize:11,color:"#374151"}}>Requires new budget</span>
                    </label>
                  </div>
                </div>
                <div style={{marginBottom:10}}>
                  <div style={{fontSize:10,color:"#6B7280",marginBottom:3}}>Platform / tool *</div>
                  <input value={formData.p} onChange={setF("p")} placeholder="e.g. Copilot in Word, Power Automate..." style={inpStyle}/>
                </div>
                <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
                  <button onClick={()=>setFormOpen(false)} style={{fontSize:11,padding:"6px 14px",borderRadius:6,border:"1px solid #D1D5DB",background:"#fff",color:"#6B7280",cursor:"pointer"}}>Cancel</button>
                  <button onClick={saveForm} style={{fontSize:11,padding:"6px 14px",borderRadius:6,border:"none",background:"#0F172A",color:"#fff",cursor:"pointer",fontWeight:600}}>{editId?"Save changes":"Add use case"}</button>
                </div>
              </div>
            )}
            {/* Toolbar */}
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
              <span style={{fontSize:11,color:"#9CA3AF",fontWeight:500}}>{filtered.length} results</span>
              <div style={{marginLeft:"auto",display:"flex",gap:6}}>
                <button onClick={exportCSV} style={{fontSize:11,padding:"5px 12px",borderRadius:6,border:"1px solid #D1D5DB",background:"#fff",color:"#374151",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <i className="ti ti-download" style={{fontSize:12}} aria-hidden="true"/> Export CSV
                </button>
                <button onClick={openAdd} style={{fontSize:11,padding:"5px 12px",borderRadius:6,border:"none",background:"#0F172A",color:"#fff",cursor:"pointer",display:"flex",alignItems:"center",gap:4}}>
                  <i className="ti ti-plus" style={{fontSize:12}} aria-hidden="true"/> Add use case
                </button>
              </div>
            </div>
            {/* Filters */}
            <div style={{display:"flex",gap:10,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:"#9CA3AF",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginRight:2}}>Mode</span>
                <FPill lbl="Chat" val="chat" cur={modeF} onChange={setModeF}/>
                <FPill lbl="Tool" val="tool" cur={modeF} onChange={setModeF}/>
                <FPill lbl="Agent" val="agent" cur={modeF} onChange={setModeF}/>
              </div>
              <div style={{width:1,height:16,background:"#D1D5DB"}}/>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:"#9CA3AF",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginRight:2}}>Effort</span>
                <FPill lbl="Low" val="low" cur={effortF} onChange={setEffortF}/>
                <FPill lbl="Medium" val="med" cur={effortF} onChange={setEffortF}/>
                <FPill lbl="High" val="high" cur={effortF} onChange={setEffortF}/>
              </div>
              <div style={{width:1,height:16,background:"#D1D5DB"}}/>
              <div style={{display:"flex",gap:4,alignItems:"center"}}>
                <span style={{fontSize:9,color:"#9CA3AF",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.07em",marginRight:2}}>Loop</span>
                <FPill lbl="Human req." val="yes" cur={hitlF} onChange={setHitlF}/>
                <FPill lbl="Partial" val="partial" cur={hitlF} onChange={setHitlF}/>
                <FPill lbl="Automated" val="no" cur={hitlF} onChange={setHitlF}/>
              </div>
            </div>
            {/* Table */}
            <div style={{display:"grid",gridTemplateColumns:"minmax(0,2fr) 68px minmax(0,1.1fr) 58px 82px 44px",gap:6,padding:"5px 10px",fontSize:9,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:2}}>
              <span>Use case{isAll?" · department":""}</span><span>Mode</span><span>Platform</span><span>Effort</span><span>Human loop</span><span></span>
            </div>
            {filtered.length===0
              ? <div style={{textAlign:"center",padding:"32px 0",color:"#9CA3AF",fontSize:12}}>No results match the active filters.</div>
              : filtered.map((u,i) => (
              <div key={u.uid||i} style={{display:"grid",gridTemplateColumns:"minmax(0,2fr) 68px minmax(0,1.1fr) 58px 82px 44px",gap:6,padding:"8px 10px",alignItems:"center",marginBottom:3,background:i%2===0?"#fff":"#F8F9FB",border:"1px solid #E9EBF0",borderRadius:6}}>
                <div>
                  <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap"}}>
                    <span style={{fontSize:9,color:"#CBD5E1",fontWeight:700,minWidth:10}}>{u.r}</span>
                    <span style={{fontSize:12,fontWeight:500,color:"#111827"}}>{u.n}</span>
                    {u.nn     && <span style={{fontSize:8,background:"#FEF2F2",color:"#B91C1C",padding:"1px 5px",borderRadius:3,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>net-new</span>}
                    {u.custom && <span style={{fontSize:8,background:"#F5F3FF",color:"#6D28D9",padding:"1px 5px",borderRadius:3,fontWeight:700,whiteSpace:"nowrap",flexShrink:0}}>custom</span>}
                  </div>
                  {isAll && <div style={{fontSize:9,color:"#94A3B8",marginTop:1,paddingLeft:14}}>{u.deptName}</div>}
                </div>
                <Pill cfg={MC[u.m]}/>
                <div style={{fontSize:10,color:"#6B7280",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={u.p}>{u.p}</div>
                <Pill cfg={EC[u.e]}/>
                <Pill cfg={HC[u.h]}/>
                <div style={{display:"flex",gap:3}}>
                  {u.custom && <>
                    <button onClick={()=>openEdit(u)} title="Edit" style={{width:20,height:20,borderRadius:4,border:"1px solid #E4E7EC",background:"#fff",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
                      <i className="ti ti-edit" style={{fontSize:11,color:"#6B7280"}} aria-hidden="true"/>
                    </button>
                    <button onClick={()=>deleteUC(u.uid)} title="Delete" style={{width:20,height:20,borderRadius:4,border:"1px solid #FEE2E2",background:"#FEF2F2",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",padding:0}}>
                      <i className="ti ti-trash" style={{fontSize:11,color:"#B91C1C"}} aria-hidden="true"/>
                    </button>
                  </>}
                </div>
              </div>
            ))}
          </>}

          {/* ── CHARTS ── */}
          {tab==="charts" && <>
            <div style={{display:"flex",gap:10,marginBottom:12}}>
              {[{title:"By mode",data:chartMode},{title:"By effort",data:chartEffort},{title:"Human-in-the-loop",data:chartHITL}].map(({title,data})=>(
                <div key={title} style={{flex:1,background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"14px"}}>
                  <div style={{fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>{title}</div>
                  <div style={{display:"flex",alignItems:"center",gap:12}}>
                    <Donut data={data} size={88}/>
                    <div style={{flex:1}}>
                      {data.map(d=>{const tot=data.reduce((s,x)=>s+x.v,0);return<div key={d.label} style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                        <div style={{width:8,height:8,borderRadius:2,background:d.color,flexShrink:0}}/>
                        <span style={{fontSize:11,color:"#6B7280",flex:1}}>{d.label}</span>
                        <span style={{fontSize:12,fontWeight:700,color:"#111827"}}>{d.v}</span>
                        <span style={{fontSize:10,color:"#9CA3AF",minWidth:28,textAlign:"right"}}>{Math.round((d.v/tot)*100)}%</span>
                      </div>;})}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"14px"}}>
              <div style={{fontSize:10,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:12}}>Effort breakdown by department</div>
              {DEPTS.map(d => {
                const ucs=allUCs.filter(u=>u.deptId===d.id), tot=ucs.length;
                const low=ucs.filter(u=>u.e==="low").length, med=ucs.filter(u=>u.e==="med").length, high=ucs.filter(u=>u.e==="high").length;
                return <div key={d.id} style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
                  <span style={{fontSize:11,color:"#6B7280",width:104,flexShrink:0,textAlign:"right"}}>{d.name}</span>
                  <div style={{flex:1,height:16,borderRadius:4,background:"#F3F4F6",display:"flex",overflow:"hidden"}}>
                    <div style={{width:`${(low/tot)*100}%`,background:"#22C55E"}} title={`${low} Low`}/>
                    <div style={{width:`${(med/tot)*100}%`,background:"#F59E0B"}} title={`${med} Med`}/>
                    <div style={{width:`${(high/tot)*100}%`,background:"#EF4444"}} title={`${high} High`}/>
                  </div>
                  <div style={{fontSize:10,width:60,flexShrink:0,display:"flex",gap:4}}>
                    <span style={{color:"#15803D",fontWeight:600}}>{low}L</span>
                    {med>0&&<span style={{color:"#B45309",fontWeight:600}}>{med}M</span>}
                    {high>0&&<span style={{color:"#B91C1C",fontWeight:600}}>{high}H</span>}
                  </div>
                </div>;
              })}
              <div style={{display:"flex",gap:14,marginTop:8,paddingTop:8,borderTop:"1px solid #F3F4F6"}}>
                {[{c:"#22C55E",l:"Low"},{c:"#F59E0B",l:"Medium"},{c:"#EF4444",l:"High"}].map(x=><div key={x.l} style={{display:"flex",alignItems:"center",gap:5}}><div style={{width:8,height:8,borderRadius:2,background:x.c}}/><span style={{fontSize:10,color:"#9CA3AF"}}>{x.l} effort</span></div>)}
              </div>
            </div>
          </>}

          {/* ── WAVES ── */}
          {tab==="waves" && <>
            {/* Budget summary cards */}
            <div style={{display:"flex",gap:8,marginBottom:12}}>
              {WAVES.map(w => {
                const effortMap={1:"low",2:"med",3:"high"};
                const wUCs=allUCs.filter(u=>u.e===effortMap[w.num]);
                const nnC=wUCs.filter(u=>u.nn).length;
                return <div key={w.num} style={{flex:1,background:"#fff",border:"1px solid #E4E7EC",borderTop:`3px solid ${w.color}`,borderRadius:8,padding:"10px 14px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                    <div style={{width:18,height:18,borderRadius:"50%",background:w.color,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><span style={{fontSize:9,fontWeight:800,color:"#fff"}}>{w.num}</span></div>
                    <span style={{fontSize:12,fontWeight:700,color:"#111827"}}>{w.title}</span>
                  </div>
                  <div style={{fontSize:10,color:"#6B7280",marginBottom:6}}>{w.period}</div>
                  <div style={{display:"flex",gap:14}}>
                    <div><div style={{fontSize:20,fontWeight:700,color:w.color}}>{wUCs.length}</div><div style={{fontSize:9,color:"#9CA3AF"}}>use cases</div></div>
                    <div><div style={{fontSize:20,fontWeight:700,color:nnC>0?"#B91C1C":"#9CA3AF"}}>{nnC}</div><div style={{fontSize:9,color:"#9CA3AF"}}>net-new budget</div></div>
                  </div>
                </div>;
              })}
            </div>
            {/* Timeline strip */}
            <div style={{display:"flex",background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,overflow:"hidden",marginBottom:12}}>
              {WAVES.map((w,i)=><div key={w.num} style={{flex:1,padding:"10px 14px",borderRight:i<2?"1px solid #E4E7EC":"none"}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                  <div style={{width:20,height:20,borderRadius:"50%",background:w.color,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,fontWeight:800,color:"#fff"}}>{w.num}</span></div>
                  <span style={{fontSize:12,fontWeight:700,color:"#111827"}}>{w.title}</span>
                </div>
                <div style={{fontSize:10,color:"#6B7280"}}>{w.period}</div>
                <div style={{fontSize:10,color:w.color,fontWeight:600,marginTop:1}}>{w.focus}</div>
              </div>)}
            </div>
            {/* Wave detail cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
              {WAVES.map(w=><div key={w.num} style={{background:"#fff",border:"1px solid #E4E7EC",borderTop:`3px solid ${w.color}`,borderRadius:8,padding:"14px"}}>
                <div style={{fontSize:12,fontWeight:700,color:"#111827",marginBottom:1}}>Wave {w.num} — {w.title}</div>
                <div style={{fontSize:10,color:"#9CA3AF",marginBottom:12}}>{w.period} · {w.focus}</div>
                {w.items.map((item,i)=><div key={i} style={{display:"flex",gap:6,paddingBottom:5,marginBottom:5,alignItems:"flex-start",borderBottom:i<w.items.length-1?"1px solid #F3F4F6":"none"}}>
                  <div style={{width:15,height:15,borderRadius:"50%",flexShrink:0,marginTop:1,background:w.color+"22",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:8,fontWeight:800,color:w.color}}>{i+1}</span></div>
                  <span style={{fontSize:11,color:"#374151",lineHeight:1.4}}>{item}</span>
                </div>)}
              </div>)}
            </div>
          </>}

          {/* ── KPIS ── */}
          {tab==="kpis" && <>
            <div style={{background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"12px 16px",marginBottom:12}}>
              <div style={{fontSize:13,fontWeight:700,color:"#111827",marginBottom:3}}>Measuring AI adoption success</div>
              <div style={{fontSize:12,color:"#6B7280"}}>Track these five KPIs quarterly through your AI Centre of Excellence. Report to leadership at each wave gate review.</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
              {KPIS.map((k,i)=><div key={i} style={{background:"#fff",border:"1px solid #E4E7EC",borderRadius:8,padding:"16px",gridColumn:i===4?"span 2":"auto"}}>
                <div style={{fontSize:9,fontWeight:700,color:"#9CA3AF",textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:6}}>{k.l}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:6}}>
                  <span style={{fontSize:22,fontWeight:700,color:"#111827"}}>{k.v}</span>
                  <span style={{fontSize:11,color:"#6B7280"}}>{k.sub}</span>
                </div>
                <div style={{fontSize:12,color:"#6B7280",lineHeight:1.5}}>{k.d}</div>
              </div>)}
            </div>
          </>}

        </div>
      </div>
    </div>
  );
}
