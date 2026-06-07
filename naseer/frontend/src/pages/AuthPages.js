import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { Alert, Input, Select, Btn } from '../components/UI';

// ── Receipt ───────────────────────────────────────────────
export const Receipt = () => {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const { t }      = useTranslation();
  if (!state?.donation) { navigate('/campaigns'); return null; }
  const { donation, campaign } = state;
  const rows = [
    [t('receipt.receipt_id'), donation.receiptId],
    [t('receipt.campaign'),   campaign?.title || donation.campaign?.title],
    [t('receipt.type'),       donation.donationType],
    [t('receipt.payment'),    donation.paymentMethod],
    [t('receipt.date'),       new Date(donation.createdAt || Date.now()).toLocaleDateString('en-PK', { day:'numeric', month:'long', year:'numeric' })],
    [t('receipt.status'),     t('receipt.confirmed')],
    [t('receipt.amount'),     `PKR ${Number(donation.amount).toLocaleString()}`],
  ];
  return (
    <div style={{ minHeight:'100vh', background:'var(--black)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ maxWidth:480, width:'100%' }}>
        <div style={{ display:'flex', height:6 }}>
          {['#0D0D0D','#FAFAF8','#1A7A4A','#C8102E'].map((c,i) => (
            <div key={i} style={{ flex:1, background:c, border:c==='#FAFAF8'?'1px solid rgba(255,255,255,.2)':undefined }} />
          ))}
        </div>
        <div style={{ background:'#fff', padding:'2.5rem' }}>
          <div style={{ textAlign:'center', marginBottom:'2rem' }}>
            <div style={{ fontSize:'4rem', marginBottom:'1rem' }}>🕊️</div>
            <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2rem', fontWeight:900, marginBottom:8 }}>{t('receipt.title')}</h1>
            <p style={{ color:'var(--muted)', fontSize:14 }}>{t('receipt.subtitle')}</p>
          </div>
          {rows.map(([label, value], i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom: i < rows.length-1 ? '1px solid var(--border)' : 'none', fontSize: i === rows.length-1 ? 16 : 13 }}>
              <span style={{ color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:.8, fontSize:11 }}>{label}</span>
              <span style={{ fontWeight: i === rows.length-1 ? 800 : 600, fontFamily: i === rows.length-1 ? 'var(--font-impact)' : 'inherit', fontSize: i === rows.length-1 ? '1.4rem' : 13, letterSpacing: i === rows.length-1 ? 1 : 0 }}>{value}</span>
            </div>
          ))}
          <div style={{ display:'flex', gap:8, marginTop:'2rem' }}>
            <Btn variant="outline" full onClick={() => navigate('/campaigns')}>{t('receipt.donate_again')}</Btn>
            <Btn variant="primary" full onClick={() => navigate('/dashboard')}>{t('receipt.dashboard')}</Btn>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Login ─────────────────────────────────────────────────
export const Login = () => {
  const navigate    = useNavigate();
  const { login }   = useAuth();
  const { t }       = useTranslation();
  const [form, setForm]     = useState({ email:'', password:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setError('');
    if (!form.email || !form.password) return setError(t('errors.required'));
    setLoading(true);
    try {
      const u = await login(form.email, form.password);
      navigate(u.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t('errors.login_failed'));
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr' }}>
      <div style={{ background:'var(--black)', color:'#fff', display:'flex', flexDirection:'column', justifyContent:'center', padding:'4rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(ellipse at 30% 70%, rgba(200,16,46,.15), transparent 60%)' }} />
        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', height:5, marginBottom:'3rem', width:120 }}>
            {['#0D0D0D','#FAFAF8','#1A7A4A','#C8102E'].map((c,i)=><div key={i} style={{ flex:1, background:c }}/>)}
          </div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2.5rem', fontWeight:900, lineHeight:1.15, marginBottom:'1rem' }}>
            Welcome<br /><em style={{ color:'var(--green-mid)', fontStyle:'italic' }}>Back.</em>
          </h2>
          <p style={{ color:'rgba(255,255,255,.55)', lineHeight:1.8 }}>Log in to track donations, view receipts, and see your impact.</p>
          <div style={{ marginTop:'2.5rem', padding:'1.25rem', background:'rgba(255,255,255,.05)', borderLeft:'3px solid var(--red)' }}>
            <div style={{ fontSize:11, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase', color:'var(--red)', marginBottom:6 }}>{t('auth.demo')}</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.7)' }}>Admin: admin@naseer.pk / admin123</div>
            <div style={{ fontSize:13, color:'rgba(255,255,255,.7)' }}>Donor: maryam@naseer.pk / donor123</div>
          </div>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'3rem', background:'var(--sand)' }}>
        <div style={{ width:'100%', maxWidth:420, background:'#fff', padding:'2.5rem', boxShadow:'0 8px 40px rgba(0,0,0,.1)' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.75rem', fontWeight:900, marginBottom:4 }}>{t('auth.signin')}</h2>
          <p style={{ fontSize:13, color:'var(--muted)', marginBottom:'1.5rem' }}>Access your NASEER account</p>
          <Alert type="error" msg={error} />
          <form onSubmit={handle}>
            <Input label={t('auth.email')} type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
            <Input label={t('auth.password')} type="password" placeholder="••••••••" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
            <Btn variant="primary" full loading={loading} type="submit" style={{ marginBottom:12, padding:'13px' }}>{t('auth.signin')}</Btn>
          </form>
          <p style={{ fontSize:13, textAlign:'center', color:'var(--muted)' }}>
            {t('auth.no_account')} <span style={{ color:'var(--green)', fontWeight:600, cursor:'pointer' }} onClick={()=>navigate('/register')}>{t('auth.create_link')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// ── Register ──────────────────────────────────────────────
export const Register = () => {
  const navigate       = useNavigate();
  const { register }   = useAuth();
  const { t }          = useTranslation();
  const [form, setForm]     = useState({ firstName:'', lastName:'', email:'', password:'', confirm:'' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault(); setError('');
    if (!form.firstName||!form.lastName||!form.email||!form.password) return setError(t('errors.required'));
    if (form.password.length < 8) return setError(t('errors.password_short'));
    if (form.password !== form.confirm) return setError(t('errors.password_mismatch'));
    setLoading(true);
    try {
      await register(form.firstName, form.lastName, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || t('errors.register_failed'));
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:'100vh', display:'grid', gridTemplateColumns:'1fr 1fr' }}>
      <div style={{ background:'var(--green)', color:'#fff', display:'flex', flexDirection:'column', justifyContent:'center', padding:'4rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-20, top:'30%', fontFamily:'var(--font-impact)', fontSize:'12rem', opacity:.07, lineHeight:1, letterSpacing:-10 }}>JOIN</div>
        <div style={{ position:'relative' }}>
          <div style={{ display:'flex', height:5, marginBottom:'3rem', width:120 }}>
            {['#0D0D0D','#FAFAF8','#0F5233','#C8102E'].map((c,i)=><div key={i} style={{ flex:1, background:c }}/>)}
          </div>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2.5rem', fontWeight:900, lineHeight:1.15, marginBottom:'1rem' }}>
            Join the<br /><em style={{ fontStyle:'italic' }}>Movement.</em>
          </h2>
          <p style={{ color:'rgba(255,255,255,.75)', lineHeight:1.8 }}>Thousands of donors are standing with Palestine. Track every donation, see real impact.</p>
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'3rem', background:'var(--sand)' }}>
        <div style={{ width:'100%', maxWidth:420, background:'#fff', padding:'2.5rem', boxShadow:'0 8px 40px rgba(0,0,0,.1)' }}>
          <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.75rem', fontWeight:900, marginBottom:4 }}>{t('auth.register')}</h2>
          <p style={{ fontSize:13, color:'var(--muted)', marginBottom:'1.5rem' }}>Join NASEER — it's free</p>
          <Alert type="error" msg={error} />
          <form onSubmit={handle}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Input label={t('auth.first_name')} placeholder="Maryam" value={form.firstName} onChange={e=>setForm(f=>({...f,firstName:e.target.value}))} />
              <Input label={t('auth.last_name')} placeholder="Fraz" value={form.lastName} onChange={e=>setForm(f=>({...f,lastName:e.target.value}))} />
            </div>
            <Input label={t('auth.email')} type="email" placeholder="your@email.com" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} />
            <Input label={t('auth.password')} type="password" placeholder="Min 8 characters" value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} />
            <Input label={t('auth.confirm_pass')} type="password" placeholder="••••••••" value={form.confirm} onChange={e=>setForm(f=>({...f,confirm:e.target.value}))} />
            <Btn variant="primary" full loading={loading} type="submit" style={{ marginBottom:12, padding:'13px' }}>{t('auth.register')}</Btn>
          </form>
          <p style={{ fontSize:13, textAlign:'center', color:'var(--muted)' }}>
            {t('auth.have_account')} <span style={{ color:'var(--green)', fontWeight:600, cursor:'pointer' }} onClick={()=>navigate('/login')}>{t('auth.signin_link')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
