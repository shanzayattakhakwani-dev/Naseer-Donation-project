import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProgressBar, Btn } from './UI';

const fmt = (n) => n >= 1000 ? `${(n/1000).toFixed(0)}K` : String(n);

const CampaignCard = ({ campaign }) => {
  const navigate = useNavigate();
  const pct = Math.min(Math.round((campaign.raisedAmount / campaign.targetAmount) * 100), 100);

  return (
    <div
      onClick={() => navigate(`/donate/${campaign._id}`)}
      style={{ background:'#fff', cursor:'pointer', border:'1px solid var(--border)', transition:'all .22s', position:'relative', overflow:'hidden' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow='0 12px 40px rgba(0,0,0,.12)'; e.currentTarget.style.transform='translateY(-4px)'; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; }}
    >
      {/* Urgent ribbon */}
      {campaign.isUrgent && (
        <div style={{position:'absolute',top:14,right:-22,background:'var(--red)',color:'#fff',fontSize:10,fontWeight:700,letterSpacing:1.5,padding:'3px 34px',transform:'rotate(45deg)',textTransform:'uppercase',zIndex:2}}>
          URGENT
        </div>
      )}

      {/* Top color bar — Palestine flag stripe */}
      <div style={{height:4,background:`linear-gradient(90deg,#0D0D0D 25%,#fff 25%,#fff 50%,#1A7A4A 50%,#1A7A4A 75%,#C8102E 75%)`}}/>

      {/* Emoji panel */}
      <div style={{
        height:130, display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'3.5rem', background: campaign.isUrgent ? '#1A0005' : '#0D0D0D',
        position:'relative',
      }}>
        <div style={{position:'absolute',inset:0,background:'radial-gradient(circle at 30% 50%, rgba(200,16,46,.15), transparent 70%)'}}/>
        {campaign.emoji || '🤲'}
      </div>

      <div style={{padding:'1.1rem 1.2rem 1.3rem'}}>
        <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:8}}>
          <span style={{fontSize:10,fontWeight:700,textTransform:'uppercase',letterSpacing:1.5,
            color: campaign.isUrgent ? 'var(--red)' : 'var(--green)',
            borderLeft: `3px solid ${campaign.isUrgent?'var(--red)':'var(--green)'}`,
            paddingLeft:7
          }}>
            {campaign.category}
          </span>
        </div>

        <h3 style={{fontFamily:'var(--font-display)',fontSize:'1.05rem',fontWeight:700,marginBottom:8,lineHeight:1.35}}>{campaign.title}</h3>
        <p style={{fontSize:13,color:'var(--muted)',marginBottom:14,lineHeight:1.6,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>
          {campaign.description}
        </p>

        <ProgressBar pct={pct} color={campaign.isUrgent?'var(--red)':'var(--green)'}/>

        <div style={{display:'flex',justifyContent:'space-between',fontSize:12,marginTop:8,marginBottom:16}}>
          <span style={{color:'var(--muted)'}}>
            <strong style={{color:'var(--black)',fontWeight:700}}>PKR {fmt(campaign.raisedAmount)}</strong> raised
          </span>
          <span style={{color:'var(--muted)'}}>{pct}% of PKR {fmt(campaign.targetAmount)}</span>
        </div>

        <Btn variant={campaign.isUrgent?'red':'primary'} full onClick={e=>{e.stopPropagation();navigate(`/donate/${campaign._id}`);}}>
          {campaign.isUrgent ? '🚨 Donate Urgently' : 'Donate Now'}
        </Btn>
      </div>
    </div>
  );
};

export default CampaignCard;
