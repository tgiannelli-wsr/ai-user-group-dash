// ─────────────────────────────────────────────
//  ProjectBrief.jsx
//  Presentational — all content comes from the `brief` prop (editable + shared).
//  Seed content lives in ./briefDefault (DEFAULT_BRIEF), imported by App too.
// ─────────────────────────────────────────────
import { DEFAULT_BRIEF } from './briefDefault';

const C = {
  fern:        '#186E3B',
  fernDark:    '#0F3D21',
  fernMed:     '#92B070',
  fernLight:   '#A8C08D',
  driftwood:   '#FBF7D0',
  driftwoodMid:'#F0EAB8',
  white:       '#FFFFFF',
  textDark:    '#1A2E1F',
  textMid:     '#3B5245',
  textLight:   '#5A7265',
};

// ── Sub-components ──────────────────────────────────────────────────────────

function Eyebrow({ children }) {
  return (
    <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.fernMed, marginBottom: 8 }}>
      {children}
    </p>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontFamily: 'Georgia, serif', fontSize: 26, fontWeight: 700, color: C.fern, marginBottom: 18, lineHeight: 1.2 }}>
      {children}
    </h2>
  );
}

function Body({ children, style = {} }) {
  return (
    <p style={{ fontSize: 15, color: C.textMid, lineHeight: 1.75, marginBottom: 14, ...style }}>
      {children}
    </p>
  );
}

function Divider() {
  return <hr style={{ border: 'none', borderTop: `1px solid ${C.driftwoodMid}`, margin: '48px 0' }} />;
}

function Section({ eyebrow, title, children }) {
  return (
    <section style={{ marginBottom: 0 }}>
      <Eyebrow>{eyebrow}</Eyebrow>
      <SectionTitle>{title}</SectionTitle>
      {children}
    </section>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function ProjectBrief({ brief = DEFAULT_BRIEF }) {
  const b = brief || DEFAULT_BRIEF;
  const overview  = b.overview  || DEFAULT_BRIEF.overview;
  const whyNow    = b.whyNow    || DEFAULT_BRIEF.whyNow;
  const tools     = b.tools     || DEFAULT_BRIEF.tools;
  const measuring = b.measuring || DEFAULT_BRIEF.measuring;
  const role      = b.role      || DEFAULT_BRIEF.role;
  const benefits  = b.benefits  || DEFAULT_BRIEF.benefits;
  const decide    = b.decide    || DEFAULT_BRIEF.decide;
  const footer    = b.footer    || DEFAULT_BRIEF.footer;
  const cohort    = b.cohort    || DEFAULT_BRIEF.cohort;

  return (
    <div style={{ background: C.driftwood, minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', color: C.textDark }}>

      {/* ── HEADER ── */}
      <div style={{ background: C.fern, padding: '36px 48px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ borderLeft: `2px solid ${C.fernMed}`, paddingLeft: 28 }}>
          <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.fernLight, marginBottom: 6 }}>
            {b.eyebrow}
          </p>
          <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 36, fontWeight: 700, color: C.white, lineHeight: 1.1, marginBottom: 8 }}>
            {b.title}
          </h1>
          <p style={{ fontSize: 14, color: C.fernLight, fontWeight: 300 }}>
            {b.subtitle}
          </p>
        </div>
      </div>

      {/* ── COHORT BAND ── */}
      <div style={{ background: C.fernDark, padding: '14px 48px', display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
        <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', color: C.fernMed, flexShrink: 0 }}>
          {b.cohortLabel}
        </span>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {cohort.map((name, i) => (
            <span key={i} style={{
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid rgba(146,176,112,0.3)`,
              borderRadius: 20,
              padding: '4px 14px',
              fontSize: 12,
              color: C.fernLight,
              fontWeight: 500,
            }}>
              {name}
            </span>
          ))}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '56px 40px 80px' }}>

        {/* WHAT THIS IS */}
        <Section eyebrow={overview.eyebrow} title={overview.title}>
          <div style={{ background: C.white, borderLeft: `4px solid ${C.fern}`, borderRadius: '0 8px 8px 0', padding: '24px 28px', marginBottom: 20 }}>
            {(overview.paras || []).map((p, i) => (
              <Body key={i} style={i === overview.paras.length - 1 ? { marginBottom: 0 } : {}}>{p}</Body>
            ))}
          </div>
          <div style={{ background: C.fern, borderRadius: 8, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: 22 }}>🤝</span>
            <p style={{ color: C.white, fontSize: 15, fontWeight: 500, margin: 0 }}>
              {overview.callout}
            </p>
          </div>
        </Section>

        <Divider />

        {/* WHY NOW */}
        <Section eyebrow={whyNow.eyebrow} title={whyNow.title}>
          {(whyNow.paras || []).map((p, i) => (
            <Body key={i} style={i === whyNow.paras.length - 1 ? { marginBottom: 0 } : {}}>{p}</Body>
          ))}
        </Section>

        <Divider />

        {/* THE TOOLS */}
        <Section eyebrow={tools.eyebrow} title={tools.title}>
          <Body>{tools.intro}</Body>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
            {(tools.items || []).map((tool, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 10, padding: '24px 22px', borderTop: `3px solid ${C.fern}` }}>
                <p style={{ fontFamily: 'Georgia, serif', fontSize: 20, fontWeight: 700, color: C.fern, marginBottom: 4 }}>{tool.name}</p>
                <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.fernMed, marginBottom: 12 }}>{tool.by}</p>
                <p style={{ fontSize: 14, color: C.textMid, lineHeight: 1.7, margin: 0 }}>{tool.body}</p>
              </div>
            ))}
          </div>
          <div style={{ background: C.driftwoodMid, borderRadius: 8, padding: '16px 20px' }}>
            <p style={{ fontSize: 14, color: C.textMid, margin: 0 }}>{tools.note}</p>
          </div>
        </Section>

        <Divider />

        {/* WHAT WE'RE MEASURING */}
        <Section eyebrow={measuring.eyebrow} title={measuring.title}>
          <Body>{measuring.intro}</Body>
          <div style={{ borderRadius: 10, overflow: 'hidden', boxShadow: `0 1px 4px rgba(24,110,59,0.1)`, marginBottom: 16 }}>
            <div style={{ background: C.fern, display: 'grid', gridTemplateColumns: '1.4fr 1.4fr 2.2fr', padding: '12px 18px' }}>
              {['KPI', 'Target', 'What It Means'].map(h => (
                <span key={h} style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.fernLight }}>{h}</span>
              ))}
            </div>
            {(measuring.kpis || []).map((k, i) => (
              <div key={i} style={{ background: i % 2 === 0 ? C.white : '#F7FAF8', display: 'grid', gridTemplateColumns: '1.4fr 1.4fr 2.2fr', padding: '14px 18px', borderBottom: i < measuring.kpis.length - 1 ? `1px solid ${C.driftwood}` : 'none' }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: C.fern }}>{k.name}</span>
                <span style={{ fontFamily: 'Georgia, serif', fontSize: 15, fontWeight: 600, color: C.fernDark }}>{k.target}</span>
                <span style={{ fontSize: 13.5, color: C.textMid }}>{k.meaning}</span>
              </div>
            ))}
          </div>
          <Body style={{ fontSize: 13.5, color: C.textLight, marginBottom: 0 }}>{measuring.note}</Body>
        </Section>

        <Divider />

        {/* YOUR ROLE */}
        <Section eyebrow={role.eyebrow} title={role.title}>
          <Body>{role.intro}</Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
            {(role.items || []).map((r, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 8, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: C.fernMed, flexShrink: 0, marginTop: 6 }} />
                <div>
                  <p style={{ fontWeight: 600, color: C.fern, fontSize: 14.5, marginBottom: 4 }}>{r.title}</p>
                  <p style={{ fontSize: 14, color: C.textMid, margin: 0, lineHeight: 1.65 }}>{r.body}</p>
                </div>
              </div>
            ))}
          </div>
          <Body style={{ marginBottom: 0 }}>{role.note}</Body>
        </Section>

        <Divider />

        {/* WHAT'S IN IT FOR YOU */}
        <Section eyebrow={benefits.eyebrow} title={benefits.title}>
          <Body>{benefits.intro}</Body>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            {(benefits.items || []).map((bn, i) => (
              <div key={i} style={{ background: C.white, borderRadius: 8, padding: '18px 20px', borderLeft: `3px solid ${C.fernLight}` }}>
                <p style={{ fontWeight: 600, color: C.fern, fontSize: 14, marginBottom: 6 }}>{bn.title}</p>
                <p style={{ fontSize: 13.5, color: C.textLight, margin: 0, lineHeight: 1.65 }}>{bn.body}</p>
              </div>
            ))}
          </div>
        </Section>

        <Divider />

        {/* HOW TO DECIDE */}
        <Section eyebrow={decide.eyebrow} title={decide.title}>
          <Body>{decide.intro}</Body>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 28 }}>
            {(decide.steps || []).map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.fern, color: C.white, fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                  {i + 1}
                </div>
                <p style={{ fontSize: 15, color: C.textMid, margin: 0, paddingTop: 4, lineHeight: 1.65 }}>
                  <strong style={{ color: C.textDark }}>{s.label}</strong> {s.body}
                </p>
              </div>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ background: C.fern, borderRadius: 10, padding: '22px 24px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.fernLight, marginBottom: 8 }}>{decide.inTitle}</p>
              <p style={{ color: C.white, fontSize: 15, margin: 0, lineHeight: 1.65 }}>{decide.inBody}</p>
            </div>
            <div style={{ background: C.white, border: `1px solid ${C.driftwoodMid}`, borderRadius: 10, padding: '22px 24px' }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: C.fernMed, marginBottom: 8 }}>{decide.outTitle}</p>
              <p style={{ color: C.textMid, fontSize: 15, margin: 0, lineHeight: 1.65 }}>{decide.outBody}</p>
            </div>
          </div>
        </Section>

      </div>

      {/* ── FOOTER ── */}
      <div style={{ background: C.fernDark, padding: '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.fernMed, marginBottom: 4 }}>{footer.contactLabel}</p>
          <p style={{ fontSize: 15, fontWeight: 600, color: C.white, marginBottom: 2 }}>{footer.name}</p>
          <p style={{ fontSize: 13, color: C.fernLight, margin: 0 }}>{footer.email}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <p style={{ fontSize: 12, color: C.fernLight, margin: 0 }}>{footer.copyright}</p>
        </div>
      </div>

    </div>
  );
}
