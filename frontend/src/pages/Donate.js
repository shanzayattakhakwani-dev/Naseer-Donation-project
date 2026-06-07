import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { Btn, Alert, Input, Select, AIBox, ProgressBar, PageLoader } from '../components/UI';
import ShareButtons from '../components/ShareButtons';
import CampaignTimeline from '../components/CampaignTimeline';

const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n);

const Donate = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { milestones } = useSocket();
  const navigate  = useNavigate();
  const { t } = useTranslation();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [tiers, setTiers]       = useState([500,1000,2000,5000,10000]);
  const [tierReason, setTierReason] = useState('');
  const [impact, setImpact]     = useState('');
  const [form, setForm] = useState({ amount:'', donorName:'', donorEmail:'', donationType:'Sadaqah', paymentMethod:'EasyPaisa', isAnonymous:false });
  const [selectedTier, setSelectedTier] = useState(null);
  const [error, setError]   = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([
      api.get(`/campaigns/${id}`),
      api.get(`/ai/suggestions/${id}`),
      api.get(`/ai/impact/${id}`),
    ]).then(([c,s,i]) => {
      setCampaign(c.data.data);
      setTiers(s.data.data.tiers);
      setTierReason(s.data.data.reasoning);
      setImpact(i.data.data.statement);
    }).catch(() => navigate('/campaigns'))
      .finally(() => setLoading(false));
    if (user) setForm(f => ({ ...f, donorName:`${user.firstName} ${user.lastName}`, donorEmail:user.email }));
  }, [id, user]);

  const selectTier = (amt) => { setSelectedTier(amt); setForm(f => ({ ...f, amount:amt })); };

  const handleSubmit = async (e) => {
    e.preventDefault(); setError('');
    if (!form.amount||Number(form.amount)<=0) return setError('Please enter a valid donation amount.');
    if (!form.donorName.trim()) return setError('Please enter your full name.');
    if (!form.donorEmail.includes('@')) return setError('Please enter a valid email address.');
    setSubmitting(true);
    try {
      const { data } = await api.post('/donations', { campaignId:id, ...form, amount:Number(form.amount) });
      navigate('/receipt', { state:{ donation:data.data, campaign } });
    } catch(err) {
      setError(err.response?.data?.message || 'Donation failed. Please try again.');
    } finally { setSubmitting(false); }
  };

  if (loading) return <PageLoader />;
  const pct = Math.min(Math.round((campaign.raisedAmount/campaign.targetAmount)*100),100);

  return (
    <div style={{ minHeight:'100vh', background:'var(--white)' }}>
      {/* Milestone toast */}
      {milestones.length>0 && (
        <div style={{ position:'fixed', top:80, right:16, zIndex:1600, display:'flex', flexDirection:'column', gap:8 }}>
          {milestones.map(m => (
            <div key={m.id} style={{ background:'var(--green)', color:'#fff', padding:'12px 16px', fontSize:13, fontWeight:700, animation:'fadeUp .4s ease', maxWidth:260 }}>
              🎯 {m.campaignName} reached {m.milestone}%!
            </div>
          ))}
        </div>
      )}

      {/* Campaign header */}
      <div style={{ background:campaign.isUrgent?'#1a0005':'var(--black)', color:'#fff', padding:'3rem 2rem' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <button onClick={() => navigate('/campaigns')} style={{ background:'none', border:'none', color:'rgba(255,255,255,.6)', cursor:'pointer', fontSize:13, marginBottom:'1rem', display:'flex', alignItems:'center', gap:6, fontFamily:'var(--font-body)', letterSpacing:1, textTransform:'uppercase' }}>
            {t('donate.back')}
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:16, flexWrap:'wrap' }}>
            <span style={{ fontSize:'3rem' }}>{campaign.emoji}</span>
            <div>
              <div style={{ fontSize:10, fontWeight:700, letterSpacing:2, textTransform:'uppercase', color:campaign.isUrgent?'#ff9999':'var(--green-mid)', marginBottom:6 }}>
                {campaign.category} {campaign.isUrgent&&'· 🔴 URGENT'}
              </div>
              <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.6rem,4vw,2.5rem)', fontWeight:900, lineHeight:1.15 }}>{campaign.title}</h1>
              {campaign.ngo && <div style={{ fontSize:11, marginTop:4, color:'var(--green-mid)' }}>✓ Verified NGO</div>}
            </div>
          </div>
          <div style={{ marginTop:'1.5rem', maxWidth:640 }}>
            <ProgressBar pct={pct} color={campaign.isUrgent?'#ff6b6b':'var(--green-mid)'}/>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:8, fontSize:13, color:'rgba(255,255,255,.6)' }}>
              <span><strong style={{ color:'#fff' }}>PKR {fmt(campaign.raisedAmount)}</strong> raised</span>
              <span>{pct}% of PKR {fmt(campaign.targetAmount)}</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'2.5rem 2rem', display:'grid', gridTemplateColumns:'1fr 1.1fr', gap:'2.5rem', alignItems:'start' }}>
        {/* Left */}
        <div>
          <p style={{ color:'var(--muted)', lineHeight:1.8, marginBottom:'1.5rem' }}>{campaign.description}</p>
          {impact && <AIBox title="AI Impact Statement"><span style={{ fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:'1.1rem', color:'#fff' }}>"{impact}"</span></AIBox>}
          {tierReason && (
            <div style={{ background:'var(--sand)', borderLeft:'3px solid var(--green)', padding:'1rem 1.25rem', marginBottom:'1rem' }}>
              <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:1.5, color:'var(--green)', marginBottom:5 }}>AI Suggestion</div>
              <p style={{ fontSize:13, color:'var(--muted)' }}>{tierReason}</p>
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:2, marginTop:'1rem' }}>
            {[['Target',`PKR ${fmt(campaign.targetAmount)}`],['Raised',`PKR ${fmt(campaign.raisedAmount)}`],['Progress',`${pct}%`],['Category',campaign.category]].map(([l,v]) => (
              <div key={l} style={{ background:'#fff', border:'1px solid var(--border)', padding:'1rem' }}>
                <div style={{ fontSize:10, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'var(--muted)', marginBottom:4 }}>{l}</div>
                <div style={{ fontFamily:'var(--font-display)', fontSize:'1.05rem', fontWeight:700 }}>{v}</div>
              </div>
            ))}
          </div>
          <ShareButtons campaign={campaign} />
          <CampaignTimeline timeline={campaign.timeline} />
        </div>

        {/* Right: Donation form */}
        <div style={{ background:'#fff', border:'1px solid var(--border)', padding:'2rem', boxShadow:'0 4px 24px rgba(0,0,0,.06)' }}>
          <div style={{ borderBottom:'3px solid var(--black)', paddingBottom:'1rem', marginBottom:'1.5rem' }}>
            <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:900 }}>{t('donate.make_donation')}</h2>
            <p style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>Your contribution goes directly to verified aid</p>
          </div>
          <Alert type="error" msg={error}/>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:1, marginBottom:8, color:'var(--black)' }}>{t('donate.suggested')}</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:6, marginBottom:8 }}>
                {tiers.map(tier => (
                  <button key={tier} type="button" onClick={() => selectTier(tier)} style={{
                    padding:'10px 4px', border:`2px solid ${selectedTier===tier?'var(--green)':'var(--border)'}`,
                    background:selectedTier===tier?'var(--green-light)':'#fff', cursor:'pointer', transition:'all .15s', textAlign:'center',
                  }}>
                    <div style={{ fontFamily:'var(--font-impact)', fontSize:'1.15rem', letterSpacing:1, color:selectedTier===tier?'var(--green-dark)':'var(--black)' }}>
                      PKR {tier>=1000?`${tier/1000}K`:tier}
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <Input label={t('donate.make_donation')+' Amount (PKR)'} type="number" placeholder="Or enter custom amount" value={form.amount} min={1} onChange={e => { setForm(f=>({...f,amount:e.target.value})); setSelectedTier(null); }}/>
            <Select label={t('donate.type')} value={form.donationType} onChange={e => setForm(f=>({...f,donationType:e.target.value}))}>
              <option>Sadaqah</option><option>Zakat</option><option>Lillah</option>
            </Select>
            <Input label={t('donate.name')} placeholder="Your full name" value={form.donorName} onChange={e => setForm(f=>({...f,donorName:e.target.value}))}/>
            <Input label={t('donate.email')} type="email" placeholder="your@email.com" value={form.donorEmail} onChange={e => setForm(f=>({...f,donorEmail:e.target.value}))}/>
            <Select label={t('donate.payment')} value={form.paymentMethod} onChange={e => setForm(f=>({...f,paymentMethod:e.target.value}))}>
              <option>EasyPaisa</option><option>JazzCash</option><option>Bank Transfer</option><option>Credit / Debit Card</option>
            </Select>
            <label style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, cursor:'pointer', fontSize:13 }}>
              <input type="checkbox" checked={form.isAnonymous} onChange={e => setForm(f=>({...f,isAnonymous:e.target.checked}))}/>
              {t('donate.anonymous')}
            </label>
            <Btn variant={campaign.isUrgent?'red':'primary'} full loading={submitting} type="submit" style={{ padding:'14px', fontSize:14 }}>
              {submitting ? t('donate.processing') : `${t('donate.confirm')}${form.amount?` · PKR ${Number(form.amount).toLocaleString()}`:''}` }
            </Btn>
            <p style={{ fontSize:11, color:'var(--muted)', textAlign:'center', marginTop:12 }}>{t('donate.secure')}</p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Donate;
