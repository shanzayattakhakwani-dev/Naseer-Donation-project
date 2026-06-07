import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageLoader, Btn } from '../components/UI';

const Verify = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData]     = useState(null);
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/verify/${id}`)
      .then(r => r.json())
      .then(r => {
        if (r.success) setData(r.data);
        else setError('Donation not found or invalid transaction ID.');
      })
      .catch(() => setError('Failed to verify donation.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;

  return (
    <div style={{ minHeight:'100vh', background:'var(--black)', display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
      <div style={{ maxWidth:460, width:'100%' }}>
        <div style={{ display:'flex', height:6 }}>
          {['#0D0D0D','#FAFAF8','#1A7A4A','#C8102E'].map((c,i) => <div key={i} style={{ flex:1, background:c, border:c==='#FAFAF8'?'1px solid rgba(255,255,255,.2)':'none' }}/>)}
        </div>
        <div style={{ background:'#fff', padding:'2.5rem' }}>
          {error ? (
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>❌</div>
              <h2 style={{ fontFamily:'var(--font-display)', marginBottom:'0.5rem' }}>Verification Failed</h2>
              <p style={{ color:'var(--muted)', fontSize:14, marginBottom:'1.5rem' }}>{error}</p>
              <Btn variant="outline" onClick={() => navigate('/')}>Go Home</Btn>
            </div>
          ) : (
            <div>
              <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
                <div style={{ fontSize:'3rem', marginBottom:'0.75rem' }}>✅</div>
                <h2 style={{ fontFamily:'var(--font-display)', fontSize:'1.5rem', fontWeight:900, color:'var(--green-dark)' }}>Donation Verified</h2>
                <p style={{ fontSize:13, color:'var(--muted)', marginTop:4 }}>This is an authentic NASEER donation</p>
              </div>
              {[
                ['Donor',     data.donorName],
                ['Campaign',  data.campaign],
                ['Amount',    `PKR ${Number(data.amount).toLocaleString()}`],
                ['Receipt',   data.receiptId],
                ['Date',      new Date(data.date).toLocaleDateString('en-PK',{day:'numeric',month:'long',year:'numeric'})],
                ['Status',    data.status],
              ].map(([l,v],i) => (
                <div key={i} style={{ display:'flex', justifyContent:'space-between', padding:'10px 0', borderBottom:'1px solid var(--border)', fontSize:13 }}>
                  <span style={{ color:'var(--muted)', fontWeight:600, textTransform:'uppercase', letterSpacing:.8, fontSize:11 }}>{l}</span>
                  <span style={{ fontWeight: l==='Amount'?800:600, color:'var(--black)', fontFamily:l==='Amount'?'var(--font-impact)':'inherit', fontSize:l==='Amount'?'1.2rem':13, letterSpacing:l==='Amount'?1:0 }}>{v}</span>
                </div>
              ))}
              <div style={{ display:'flex', gap:8, marginTop:'1.5rem' }}>
                <Btn variant="outline" full onClick={() => navigate('/campaigns')}>Browse Campaigns</Btn>
                <Btn variant="primary" full onClick={() => navigate('/')}>Home</Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Verify;
