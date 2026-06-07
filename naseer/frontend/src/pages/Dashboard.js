import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { PageLoader, AIBox, SectionTitle, StatBox, EmptyState, Btn, Pill } from '../components/UI';

const fmt = (n) => `PKR ${n>=1000?(n/1000).toFixed(1)+'K':n}`;

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [donations, setDonations] = useState([]);
  const [aiRec, setAiRec]         = useState('');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    Promise.all([api.get('/donations/my'), api.get('/ai/recommendations')])
      .then(([d, a]) => {
        setDonations(d.data.data);
        const rec = a.data.data[0];
        setAiRec(rec ? `We recommend <strong>${rec.title}</strong> — ${rec.isUrgent?'urgent, needs support now.':`${Math.round((rec.raisedAmount/rec.targetAmount)*100)}% funded.`}` : a.data.reason||'');
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <PageLoader />;

  const total = donations.reduce((s,d) => s+d.amount, 0);
  const cats  = [...new Set(donations.map(d=>d.donationType))];

  const downloadPDF = async (donationId) => {
    try {
      const res = await fetch(`/api/donations/pdf/${donationId}`, { headers:{ Authorization:`Bearer ${localStorage.getItem('naseer_token')}` } });
      const blob = await res.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a'); a.href=url; a.download='receipt.pdf'; a.click();
    } catch(e) { alert('PDF download failed.'); }
  };

  return (
    <div style={{ minHeight:'100vh', background:'var(--white)' }}>
      <div style={{ background:'var(--black)', color:'#fff', padding:'3rem 2rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-20, bottom:-20, fontFamily:'var(--font-impact)', fontSize:'8rem', opacity:.04, lineHeight:1 }}>DASHBOARD</div>
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative' }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:3, color:'var(--green-mid)', textTransform:'uppercase', marginBottom:10 }}>{t('dashboard.my_account')}</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'clamp(1.8rem,4vw,2.8rem)', fontWeight:900, marginBottom:6 }}>
            Welcome back, <em style={{ color:'var(--green-mid)', fontStyle:'italic' }}>{user.firstName}.</em>
          </h1>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:14 }}>{user.email} · {user.role==='admin'?'Administrator':'Donor'}</p>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:'0 auto', padding:'2.5rem 2rem' }}>
        {aiRec && (
          <AIBox title="AI Recommendation for You">
            <span dangerouslySetInnerHTML={{ __html:aiRec }}/>
            {' '}<span onClick={() => navigate('/campaigns')} style={{ color:'#7EDCA8', cursor:'pointer', fontWeight:600, textDecoration:'underline' }}>Browse campaigns →</span>
          </AIBox>
        )}

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:4, marginBottom:'2.5rem' }}>
          <StatBox label={t('dashboard.total_donated')} value={fmt(total)} accent="green"/>
          <StatBox label={t('dashboard.campaigns_count')} value={String(donations.length)} accent="black"/>
          <StatBox label={t('dashboard.types')} value={cats.join(', ')||'—'} accent="red"/>
        </div>

        <SectionTitle>{t('dashboard.history')}</SectionTitle>

        {donations.length===0 ? (
          <EmptyState  title={t('dashboard.no_donations')} sub="Browse active campaigns and support Palestine today."
            action={<Btn variant="primary" onClick={() => navigate('/campaigns')}>{t('dashboard.browse')}</Btn>}/>
        ) : (
          <div style={{ background:'#fff', border:'1px solid var(--border)' }}>
            <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
              <thead>
                <tr style={{ background:'var(--black)', color:'#fff' }}>
                  {[t('dashboard.date'),t('dashboard.campaign'),t('dashboard.type'),t('dashboard.payment_method'),t('dashboard.amount'),t('dashboard.status'),'PDF'].map(h => (
                    <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {donations.map((d,i) => (
                  <tr key={d._id} style={{ borderBottom:'1px solid var(--border)', background:i%2?'var(--sand)':'#fff' }}>
                    <td style={{ padding:'12px 16px', color:'var(--muted)' }}>{new Date(d.createdAt).toLocaleDateString('en-PK')}</td>
                    <td style={{ padding:'12px 16px', fontWeight:600 }}>{d.campaign?.emoji} {d.campaign?.title||'—'}</td>
                    <td style={{ padding:'12px 16px' }}><Pill color="green">{d.donationType}</Pill></td>
                    <td style={{ padding:'12px 16px', color:'var(--muted)' }}>{d.paymentMethod}</td>
                    <td style={{ padding:'12px 16px', fontFamily:'var(--font-impact)', fontSize:'1.05rem', letterSpacing:1 }}>PKR {d.amount.toLocaleString()}</td>
                    <td style={{ padding:'12px 16px' }}><Pill color="green">✓ Confirmed</Pill></td>
                    <td style={{ padding:'12px 16px' }}>
                      <button onClick={() => downloadPDF(d._id)} style={{ background:'var(--sand)', border:'1px solid var(--border)', padding:'4px 10px', fontSize:11, cursor:'pointer', fontWeight:600, fontFamily:'var(--font-body)' }}>
                        ↓ PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display:'flex', justifyContent:'flex-end', alignItems:'center', gap:16, padding:'14px 16px', borderTop:'2px solid var(--black)', background:'var(--sand)' }}>
              <span style={{ fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:1, color:'var(--muted)' }}>Total Contributed</span>
              <span style={{ fontFamily:'var(--font-impact)', fontSize:'1.5rem', letterSpacing:1, color:'var(--green-dark)' }}>PKR {total.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
