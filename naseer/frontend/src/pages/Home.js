import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CampaignCard from '../components/CampaignCard';
import { Btn, PageLoader, StatBox, SectionTitle } from '../components/UI';

const stories = [
  { name: 'Layla, 8', quote: '"I just want to go back to school. I miss my teacher."', from: 'Gaza City' },
  { name: 'Ahmad, 34', quote: '"We had nothing left. The food package saved my children."', from: 'Rafah' },
  { name: 'Fatima, 62', quote: '"I never imagined strangers across the world would care about us."', from: 'Khan Yunis' },
];

const Home = () => {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [storyIdx, setStoryIdx]   = useState(0);

  useEffect(() => {
    api.get('/campaigns').then(r => setCampaigns(r.data.data.slice(0, 3))).finally(() => setLoading(false));
    const t = setInterval(() => setStoryIdx(i => (i + 1) % stories.length), 4000);
    return () => clearInterval(t);
  }, []);

  return (
    <div>
      {/* ── HERO ─────────────────────────────────────────────── */}
      <section style={{ background: 'var(--black)', color: '#fff', minHeight: '92vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
        {/* Palestine flag vertical sidebar */}
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 8, display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, background: '#0D0D0D', border: '1px solid rgba(255,255,255,.15)' }} />
          <div style={{ flex: 1, background: '#fff' }} />
          <div style={{ flex: 1, background: '#1A7A4A' }} />
          <div style={{ flex: 1, background: '#C8102E' }} />
        </div>

        {/* Background texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 70% 50%, rgba(200,16,46,.08) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(26,122,74,.1) 0%, transparent 50%)' }} />

        {/* Big decorative text */}
        <div style={{ position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-impact)', fontSize: 'clamp(8rem,20vw,18rem)', color: 'rgba(255,255,255,.03)', letterSpacing: -10, lineHeight: 1, userSelect: 'none', pointerEvents: 'none' }}>
          NASEER
        </div>

        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 2rem 4rem 3rem', animation: 'fadeUp .8s ease both' }}>
          <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--red)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 32, height: 2, background: 'var(--red)' }} />
            Humanitarian Aid Platform
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem,7vw,5.5rem)', fontWeight: 900, lineHeight: 1.08, marginBottom: '1.75rem', maxWidth: 780 }}>
            Stand With<br />
            <em style={{ fontStyle: 'italic', color: 'var(--red)' }}>Palestine.</em><br />
            <span style={{ color: 'var(--green-mid)' }}>Give Today.</span>
          </h1>

          <p style={{ fontSize: 18, color: 'rgba(255,255,255,.65)', maxWidth: 520, lineHeight: 1.7, marginBottom: '2.5rem' }}>
            NASEER connects you to verified humanitarian campaigns. Every rupee reaches those who need it most — transparently, directly, urgently.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: '3.5rem' }}>
            <Btn variant="red" style={{ padding: '14px 36px', fontSize: 14 }} onClick={() => navigate('/campaigns')}>
              Browse Campaigns
            </Btn>
            <Btn variant="outlineWhite" style={{ padding: '14px 36px', fontSize: 14 }} onClick={() => navigate('/register')}>
              Create Account
            </Btn>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {[
              { v: 'PKR 48L+', l: 'Total Raised' },
              { v: '12', l: 'Active Campaigns' },
              { v: '3,200+', l: 'Donors' },
              { v: '100%', l: 'Transparent' },
            ].map(s => (
              <div key={s.l} style={{ padding: '16px 28px', background: 'rgba(255,255,255,.05)', borderTop: '2px solid rgba(255,255,255,.1)' }}>
                <div style={{ fontFamily: 'var(--font-impact)', fontSize: '1.9rem', letterSpacing: 1, color: '#fff', lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE STORY TICKER ───────────────────────────────── */}
      <section style={{ background: 'var(--red)', color: '#fff', padding: '1.5rem 2rem', overflow: 'hidden' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', whiteSpace: 'nowrap', opacity: .8 }}>Their Story</span>
          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,.3)' }} />
          <div key={storyIdx} style={{ animation: 'fadeIn .6s ease' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.05rem' }}>
              {stories[storyIdx].quote}
            </span>
            <span style={{ marginLeft: 16, fontSize: 12, opacity: .75 }}>— {stories[storyIdx].name}, {stories[storyIdx].from}</span>
          </div>
        </div>
      </section>

      {/* ── WHY IT MATTERS ──────────────────────────────────── */}
      <section style={{ background: 'var(--sand)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--green)', marginBottom: '1rem' }}>Why NASEER?</div>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, lineHeight: 1.15, marginBottom: '1.5rem' }}>
                Every family has a story.<br /><em>Every story deserves help.</em>
              </h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '1rem' }}>
                NASEER — meaning "helper" in Arabic — was built because Palestinians deserve a platform that treats their humanitarian needs with dignity, transparency, and urgency.
              </p>
              <p style={{ color: 'var(--muted)', lineHeight: 1.8, marginBottom: '2rem' }}>
                Every campaign is verified. Every donation is tracked. Every story is real.
              </p>
              <Btn variant="primary" onClick={() => navigate('/campaigns')}>See All Campaigns</Btn>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
              <StatBox label="Meals Provided" value="12K+" accent="green" />
              <StatBox label="Medical Kits" value="840" accent="black" />
              <StatBox label="Families Helped" value="3.2K" accent="black" />
              <StatBox label="Campaigns" value="12" accent="red" />
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED CAMPAIGNS ──────────────────────────────── */}
      <section style={{ padding: '5rem 2rem', background: '#fff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionTitle>Featured Campaigns</SectionTitle>
          {loading ? <PageLoader /> : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20, marginBottom: '2.5rem' }}>
              {campaigns.map(c => <CampaignCard key={c._id} campaign={c} />)}
            </div>
          )}
          <div style={{ textAlign: 'center' }}>
            <Btn variant="outline" onClick={() => navigate('/campaigns')}>View All Campaigns →</Btn>
          </div>
        </div>
      </section>

      {/* ── STORIES SECTION ─────────────────────────────────── */}
      <section style={{ background: 'var(--black)', color: '#fff', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <SectionTitle light>Real Voices from Gaza</SectionTitle>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 2 }}>
            {stories.map((s, i) => (
              <div key={i} style={{ background: i === 0 ? 'var(--red)' : i === 1 ? 'var(--green-dark)' : 'rgba(255,255,255,.06)', padding: '2rem', borderTop: `3px solid ${i===0?'#fff':i===1?'var(--green-mid)':'rgba(255,255,255,.2)'}` }}>
                <div style={{ fontSize: '2rem', marginBottom: '1rem', opacity: .4, fontFamily: 'Georgia', lineHeight: 1 }}>"</div>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.65, marginBottom: '1.25rem', color: '#fff' }}>
                  {s.quote.replace(/"/g, '')}
                </p>
                <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1, textTransform: 'uppercase', opacity: .75 }}>
                  {s.name} · {s.from}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ──────────────────────────────────────── */}
      <section style={{ background: 'var(--green)', padding: '4rem 2rem', textAlign: 'center', color: '#fff' }}>
        <div style={{ fontFamily: 'var(--font-impact)', fontSize: 'clamp(2rem,6vw,4rem)', letterSpacing: 3, marginBottom: '1rem' }}>
          THEY CANNOT WAIT.
        </div>
        <p style={{ fontSize: 16, opacity: .85, marginBottom: '2rem', maxWidth: 480, margin: '0 auto 2rem' }}>
          Every hour matters. Join thousands of donors making a real difference for Palestinian families.
        </p>
        <Btn variant="outlineWhite" style={{ padding: '14px 40px', fontSize: 14 }} onClick={() => navigate('/campaigns')}>
          Donate Now
        </Btn>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer style={{ background: '#0a0a0a', color: 'rgba(255,255,255,.4)', padding: '2rem', textAlign: 'center', fontSize: 12, letterSpacing: .5 }}>
        <div style={{ fontFamily: 'var(--font-impact)', fontSize: '1.2rem', letterSpacing: 2, color: 'rgba(255,255,255,.2)', marginBottom: 8 }}>NASEER · THE HELPER</div>
        <p>© {new Date().getFullYear()} NASEER Platform · Built with compassion for Palestine</p>
        <div style={{ marginTop: 8, display: 'flex', justifyContent: 'center', gap: 0, height: 3 }}>
          <div style={{ width: 40, background: '#0D0D0D', border: '1px solid rgba(255,255,255,.1)' }} />
          <div style={{ width: 40, background: '#fff' }} />
          <div style={{ width: 40, background: '#1A7A4A' }} />
          <div style={{ width: 40, background: '#C8102E' }} />
        </div>
      </footer>
    </div>
  );
};

export default Home;
