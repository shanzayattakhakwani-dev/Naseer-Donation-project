import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { Btn, Alert, Input, Select, SectionTitle } from '../components/UI';

const SKILLS = ['medical','logistics','translation','fundraising','tech','education','other'];

const Volunteer = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [form, setForm] = useState({ name:user?`${user.firstName} ${user.lastName}`:'', email:user?.email||'', skills:[], availability:'both', city:'' });
  const [success, setSuccess] = useState('');
  const [error, setError]     = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSkill = (skill) => {
    setForm(f => ({
      ...f,
      skills: f.skills.includes(skill) ? f.skills.filter(s=>s!==skill) : [...f.skills, skill]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSuccess('');
    if (!form.name||!form.email||!form.city) return setError('Name, email and city are required.');
    if (form.skills.length===0) return setError('Please select at least one skill.');
    setLoading(true);
    try {
      await api.post('/volunteers', form);
      setSuccess('Application submitted! Our team will review it and contact you soon. JazakAllah Khair.');
    } catch(err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh' }}>
      {/* Header */}
      <div style={{ background:'var(--green)', color:'#fff', padding:'5rem 2rem 4rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-20, bottom:-20, fontFamily:'var(--font-impact)', fontSize:'12rem', opacity:.07, lineHeight:1 }}>VOLUNTEER</div>
        <div style={{ maxWidth:900, margin:'0 auto', position:'relative' }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:3, color:'rgba(255,255,255,.6)', textTransform:'uppercase', marginBottom:12 }}>Join the Movement</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(2.5rem,6vw,4rem)', fontWeight:900, lineHeight:1.1, marginBottom:'1rem' }}>
            Volunteer<br/><em style={{ fontStyle:'italic' }}>for Palestine.</em>
          </h1>
          <p style={{ fontSize:16, opacity:.8, maxWidth:500, lineHeight:1.8 }}>
            Beyond donations, we need people. Medical professionals, translators, logistics experts, fundraisers, and tech volunteers — every skill makes a difference.
          </p>
        </div>
      </div>

      <div style={{ maxWidth:900, margin:'0 auto', padding:'3rem 2rem', display:'grid', gridTemplateColumns:'1fr 1.2fr', gap:'3rem', alignItems:'start' }}>
        {/* Left info */}
        <div>
          <SectionTitle>What Volunteers Do</SectionTitle>
          {[
            { skill:'Medical', desc:'Support field hospital coordination and medical supply logistics.' },
            { skill:'Logistics',  desc:'Help coordinate aid delivery, warehousing, and transportation.' },
            { skill:'Translation',  desc:'Arabic, Urdu, English translation for communications and documents.' },
            { skill:'Fundraising', desc:'Organize campaigns, reach donors, and grow awareness.' },
            { skill:'Tech', desc:'Contribute to platform development and digital infrastructure.' },
            { skill:'Education',  desc:'Support educational materials and programs for displaced children.' },
          ].map((s,i) => (
            <div key={i} style={{ display:'flex', gap:14, marginBottom:'1.25rem', padding:'1rem', background:i%2===0?'var(--sand)':'#fff', borderLeft:'3px solid var(--green)' }}>
              <span style={{ fontSize:'1.5rem', flexShrink:0 }}>{s.icon}</span>
              <div>
                <div style={{ fontWeight:700, fontSize:14, marginBottom:3 }}>{s.skill}</div>
                <p style={{ fontSize:13, color:'var(--muted)', lineHeight:1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div style={{ background:'#fff', border:'1px solid var(--border)', padding:'2rem', boxShadow:'0 4px 24px rgba(0,0,0,.06)' }}>
          <div style={{ borderBottom:'3px solid var(--black)', paddingBottom:'1rem', marginBottom:'1.5rem' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:900 }}>Apply to Volunteer</h2>
            <p style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>Applications reviewed within 48 hours</p>
          </div>

          <Alert type="success" msg={success}/>
          <Alert type="error"   msg={error}/>

          {!success && (
            <form onSubmit={handleSubmit}>
              <Input label="Full Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="Your full name"/>
              <Input label="Email" type="email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="your@email.com"/>
              <Input label="City" value={form.city} onChange={e=>setForm(f=>({...f,city:e.target.value}))} placeholder="Lahore, Karachi, etc."/>
              <Select label="Availability" value={form.availability} onChange={e=>setForm(f=>({...f,availability:e.target.value}))}>
                <option value="weekdays">Weekdays</option>
                <option value="weekends">Weekends</option>
                <option value="both">Both</option>
              </Select>

              <div style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:.8, marginBottom:10, color:'var(--black)' }}>Skills (select all that apply)</label>
                <div style={{ display:'flex', flexWrap:'wrap', gap:8 }}>
                  {SKILLS.map(s => (
                    <button key={s} type="button" onClick={() => toggleSkill(s)} style={{
                      padding:'7px 16px', fontSize:12, fontWeight:600, textTransform:'capitalize',
                      border:`2px solid ${form.skills.includes(s)?'var(--green)':'var(--border)'}`,
                      background:form.skills.includes(s)?'var(--green-light)':'#fff',
                      color:form.skills.includes(s)?'var(--green-dark)':'var(--muted)',
                      cursor:'pointer', transition:'all .15s', letterSpacing:.3,
                    }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <Btn variant="primary" full loading={loading} type="submit" style={{ padding:'13px', fontSize:14 }}>
                Submit Application
              </Btn>
            </form>
          )}

          {success && (
            <div style={{ textAlign:'center', padding:'1rem 0' }}>
              <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🤝</div>
              <Btn variant="outline" onClick={() => navigate('/')}>Return Home</Btn>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
