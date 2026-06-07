import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { Btn, StatBox, SectionTitle } from '../components/UI';

const team = [
  { name:'Maryam Fraz',   role:'Lead Developer', id:'BSE233031' },
  { name:'Shanzay Atta',  role:'Backend Developer', id:'BSE233043' },
  { name:'Ayesha Khalid', role:'UI/UX Developer',   id:'BSE233046' },
   { name:'Aliza Maryam', role:'Project Manager',   id:'BSE233020' },
];

const sections = [
  { phase:'Awareness',   color:'var(--red)',  text:'The crisis in Palestine is not just a news story — it is a humanitarian emergency affecting millions of real families, real children, real futures.' },
  { phase:'Empathy',     color:'var(--green)',  text:'We built NASEER because we believe distance should never be a barrier to compassion. People across Pakistan and the world care deeply — they just need the right channel.' },
  { phase:'Trust',       color:'var(--black)',  text:'Every campaign is verified. Every NGO goes through a multi-stage review. Every donation is tracked. Transparency is not a feature — it is our foundation.' },
  { phase:'Action',      color:'var(--red)',     text:'NASEER makes it easy to act. Browse campaigns, choose your cause, donate in seconds, and receive a certified receipt. No barriers. No confusion.' },
  { phase:'Impact',      color:'var(--green)',   text:'Your donations fund real aid — food packages, medical supplies, clean water, education, and shelter for displaced Palestinian families.' },
  { phase:'Hope',        color:'var(--black)',   text:'Palestine will be free. Until that day, NASEER stands as a bridge of hope — connecting the generosity of donors to the resilience of a people who refuse to give up.' },
];

const About = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/donations/stats').then(r => setStats(r.data.data)).catch(()=>{});
  }, []);

  return (
    <div style={{ minHeight:'100vh' }}>
      {/* Hero */}
      <section style={{ background:'var(--black)', color:'#fff', padding:'6rem 2rem 5rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(ellipse at 20% 80%,rgba(26,122,74,.12),transparent 60%),radial-gradient(ellipse at 80% 20%,rgba(200,16,46,.1),transparent 50%)' }}/>
        <div style={{ maxWidth:900, margin:'0 auto', position:'relative', textAlign:'center' }}>
          <div style={{ display:'flex', height:6, width:160, margin:'0 auto 2.5rem', justifyContent:'center' }}>
            {['#0D0D0D','#FAFAF8','#1A7A4A','#C8102E'].map((c,i) => <div key={i} style={{ flex:1, background:c, border:c==='#FAFAF8'?'1px solid rgba(255,255,255,.2)':'none' }}/>)}
          </div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.5rem,7vw,5rem)', fontWeight:900, lineHeight:1.1, marginBottom:'1.5rem' }}>
            Why We Built<br/><em style={{ color:'var(--green-mid)', fontStyle:'italic' }}>NASEER.</em>
          </h1>
          <p style={{ fontSize:18, color:'rgba(255,255,255,.65)', maxWidth:560, margin:'0 auto', lineHeight:1.8 }}>
            "NASEER" means "The Helper" in Arabic. We chose this name because helping is not just what this platform does — it is why it exists.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section style={{ background:'var(--sand)', padding:'5rem 2rem' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <SectionTitle>Our Mission</SectionTitle>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', alignItems:'start' }}>
            <div>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, lineHeight:1.2, marginBottom:'1.5rem' }}>
                Transparent aid.<br/><em style={{ color:'var(--red)', fontStyle:'italic' }}>Real impact.</em>
              </h2>
              <p style={{ color:'var(--muted)', lineHeight:1.9, marginBottom:'1rem' }}>
                NASEER was founded by software engineering students at the University of Education, Lahore — who believed that technology could be a force for humanitarian good.
              </p>
              <p style={{ color:'var(--muted)', lineHeight:1.9, marginBottom:'2rem' }}>
                We built a platform that combines verified NGO partnerships, AI-powered features, and radical transparency to ensure that every rupee donated reaches those who need it most — Palestinian families suffering under ongoing conflict.
              </p>
              <Btn variant="primary" onClick={() => navigate('/campaigns')}>Support Now</Btn>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:4 }}>
              <StatBox label="Total Raised"    value={stats ? `PKR ${(stats.overview.totalAmount/1000).toFixed(0)}K` : 'PKR 48K+'} accent="green"/>
              <StatBox label="Donations Made"  value={stats ? String(stats.overview.count) : '200+'} accent="black"/>
              <StatBox label="Active Campaigns" value="12" accent="black"/>
              <StatBox label="Avg Donation"    value={stats ? `PKR ${Math.round(stats.overview.avg||0)}` : 'PKR 2,400'} accent="red"/>
            </div>
          </div>
        </div>
      </section>

      {/* Story sections */}
      <section style={{ background:'#fff', padding:'5rem 2rem' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <SectionTitle>Our Story: From Awareness to Hope</SectionTitle>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:4 }}>
            {sections.map((s,i) => (
              <div key={i} style={{ background:i%2===0?'var(--sand)':'#fff', padding:'2rem', borderTop:`4px solid ${s.color}`, position:'relative', overflow:'hidden' }}>
                <div style={{ position:'absolute', right:12, top:12, fontSize:'4rem', opacity:.08 }}>{s.icon}</div>
                <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:2, color:s.color, marginBottom:8 }}>{s.phase}</div>
                <p style={{ fontSize:14, color:'var(--muted)', lineHeight:1.8 }}>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ background:'var(--black)', color:'#fff', padding:'5rem 2rem' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <SectionTitle light>The Team</SectionTitle>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:4 }}>
            {team.map((m,i) => (
              <div key={i} style={{ padding:'2rem', background:'rgba(255,255,255,.05)', borderTop:'3px solid var(--green)', textAlign:'center' }}>
                <div style={{ fontSize:'3.5rem', marginBottom:'1rem' }}>{m.avatar}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1.1rem', fontWeight:700, marginBottom:4 }}>{m.name}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:1, marginBottom:4 }}>{m.role}</div>
                <div style={{ fontSize:11, color:'var(--green-mid)' }}>{m.id}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency */}
      <section style={{ background:'var(--green)', color:'#fff', padding:'4rem 2rem', textAlign:'center' }}>
        <div style={{ fontFamily:'var(--font-impact)', fontSize:'clamp(1.5rem,4vw,2.5rem)', letterSpacing:3, marginBottom:'1rem' }}>OUR TRANSPARENCY COMMITMENT</div>
        <p style={{ maxWidth:600, margin:'0 auto 2rem', opacity:.85, lineHeight:1.8 }}>
          Every campaign shows real-time funding progress. Every NGO is verified before launch. Every donation generates a certified PDF receipt with a QR verification code. We believe donors deserve complete visibility.
        </p>
        <Btn variant="outlineWhite" style={{ padding:'12px 32px' }} onClick={() => navigate('/campaigns')}>Browse Verified Campaigns</Btn>
      </section>
    </div>
  );
};

export default About;
