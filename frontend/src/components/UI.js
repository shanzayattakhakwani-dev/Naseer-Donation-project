import React from 'react';

export const Spinner = ({ size = 20, color = '#1A7A4A' }) => (
  <span style={{
    display:'inline-block', width:size, height:size,
    border:`2.5px solid rgba(42,168,104,.25)`, borderTopColor:color,
    borderRadius:'50%', animation:'spin .7s linear infinite', flexShrink:0
  }}/>
);

export const Btn = ({ children, variant='primary', size='md', full=false, loading=false, style={}, ...props }) => {
  const base = {
    display:'inline-flex', alignItems:'center', justifyContent:'center', gap:7,
    fontFamily:'var(--font-body)', fontWeight:600, cursor:'pointer',
    border:'2px solid transparent', transition:'all .18s',
    fontSize: size==='sm'?12:14, letterSpacing:.3,
    padding: size==='sm'?'5px 14px':'11px 26px',
    width: full?'100%':'auto',
    opacity: (props.disabled||loading)?.55 : 1,
    textTransform:'uppercase',
  };
  const v = {
    primary:{ background:'var(--green)', color:'#fff', borderColor:'var(--green)', borderRadius:0 },
    red:    { background:'var(--red)',   color:'#fff', borderColor:'var(--red)',   borderRadius:0 },
    outline:{ background:'transparent',  color:'var(--green)', borderColor:'var(--green)', borderRadius:0 },
    outlineWhite:{ background:'transparent', color:'#fff', borderColor:'#fff', borderRadius:0 },
    ghost:  { background:'transparent',  color:'var(--muted)', borderColor:'transparent', borderRadius:0, textTransform:'none' },
  };
  return (
    <button style={{...base,...v[variant],...style}} {...props}>
      {loading && <Spinner size={14} color={variant==='primary'||variant==='red'?'#fff':'#1A7A4A'}/>}
      {children}
    </button>
  );
};

export const Alert = ({ type='success', msg }) => {
  if (!msg) return null;
  const s = { success:{bg:'#D6EFE1',color:'#0F5233',border:'#2EA868'}, error:{bg:'#FDEAEA',color:'#8B0D1F',border:'#C8102E'}, info:{bg:'#EFF6FF',color:'#1e40af',border:'#93c5fd'} }[type];
  return <div style={{background:s.bg,color:s.color,border:`1px solid ${s.border}`,borderRadius:4,padding:'10px 14px',fontSize:13,fontWeight:500,marginBottom:14}}>{msg}</div>;
};

export const Input = ({ label, error, ...props }) => (
  <div style={{marginBottom:16}}>
    {label && <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:5,color:'var(--black)',textTransform:'uppercase',letterSpacing:.8}}>{label}</label>}
    <input style={{
      width:'100%', padding:'11px 14px',
      border:`1.5px solid ${error?'var(--red)':'var(--border)'}`,
      borderRadius:0, fontSize:14, color:'var(--black)', background:'#fff', outline:'none',
      transition:'border .15s',
    }}
      onFocus={e=>e.target.style.borderColor='var(--green)'}
      onBlur={e=>e.target.style.borderColor=error?'var(--red)':'var(--border)'}
      {...props}
    />
    {error && <p style={{color:'var(--red)',fontSize:12,marginTop:4}}>{error}</p>}
  </div>
);

export const Select = ({ label, children, ...props }) => (
  <div style={{marginBottom:16}}>
    {label && <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:5,color:'var(--black)',textTransform:'uppercase',letterSpacing:.8}}>{label}</label>}
    <select style={{width:'100%',padding:'11px 14px',border:'1.5px solid var(--border)',borderRadius:0,fontSize:14,color:'var(--black)',background:'#fff',outline:'none',cursor:'pointer'}} {...props}>
      {children}
    </select>
  </div>
);

export const Card = ({ children, style={} }) => (
  <div style={{background:'#fff',border:'1px solid var(--border)',padding:'1.75rem',boxShadow:'0 2px 12px rgba(0,0,0,.06)',...style}}>
    {children}
  </div>
);

export const SectionTitle = ({ children, light=false }) => (
  <div style={{display:'flex',alignItems:'center',gap:14,marginBottom:'1.5rem'}}>
    <h2 style={{fontSize:'0.75rem',fontWeight:600,color:light?'rgba(255,255,255,.6)':'var(--muted)',whiteSpace:'nowrap',textTransform:'uppercase',letterSpacing:2}}>{children}</h2>
    <div style={{flex:1,height:1,background:light?'rgba(255,255,255,.2)':'var(--border)'}}/>
  </div>
);

export const ProgressBar = ({ pct, color='var(--green)' }) => (
  <div style={{height:4,background:'#e0e0d8',overflow:'hidden'}}>
    <div style={{height:'100%',width:`${Math.min(pct,100)}%`,background:color,transition:'width .5s'}}/>
  </div>
);

export const Pill = ({ children, color='green' }) => {
  const c = {green:{bg:'#D6EFE1',text:'#0F5233'},red:{bg:'#FDEAEA',text:'#8B0D1F'},amber:{bg:'#FEF9E7',text:'#7D5900'}}[color]||{bg:'#D6EFE1',text:'#0F5233'};
  return <span style={{display:'inline-block',padding:'3px 11px',fontSize:11,fontWeight:700,background:c.bg,color:c.text,textTransform:'uppercase',letterSpacing:.8}}>{children}</span>;
};

export const AIBox = ({ title, children, loading=false }) => (
  <div style={{background:'linear-gradient(135deg,#0F5233,#1A7A4A)',color:'#fff',padding:'1.1rem 1.25rem',marginBottom:'1.5rem',position:'relative',overflow:'hidden'}}>
    <div style={{position:'absolute',right:-10,top:-10,fontSize:'5rem',opacity:.08}}>✦</div>
    <div style={{fontSize:11,fontWeight:700,textTransform:'uppercase',letterSpacing:1.5,color:'#7EDCA8',marginBottom:6,display:'flex',alignItems:'center',gap:7}}>
      AI Insight {loading && <Spinner size={12} color='#7EDCA8'/>}
    </div>
    <div style={{fontSize:13,lineHeight:1.65,color:'rgba(255,255,255,.85)'}}>{children}</div>
  </div>
);

export const PageLoader = () => (
  <div style={{display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column',gap:16,minHeight:'60vh',color:'var(--muted)',fontSize:14,fontWeight:600}}>
    <Spinner size={40}/>
    <span style={{letterSpacing:2,textTransform:'uppercase',fontSize:11}}>Loading...</span>
  </div>
);

export const EmptyState = ({ icon='📭', title, sub, action }) => (
  <div style={{textAlign:'center',padding:'4rem 1rem',color:'var(--muted)'}}>
    <div style={{fontSize:'3rem',marginBottom:'1rem'}}>{icon}</div>
    <p style={{fontWeight:700,marginBottom:6,color:'var(--black)',fontFamily:'var(--font-display)',fontSize:'1.2rem'}}>{title}</p>
    {sub && <p style={{fontSize:13,marginBottom:'1.5rem'}}>{sub}</p>}
    {action}
  </div>
);

export const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{position:'fixed',inset:0,background:'rgba(0,0,0,.65)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:2000,padding:'1rem'}}>
      <div onClick={e=>e.stopPropagation()} style={{background:'#fff',padding:'2rem',width:'100%',maxWidth:500,maxHeight:'90vh',overflowY:'auto',boxShadow:'0 20px 60px rgba(0,0,0,.35)'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1.5rem',borderBottom:'2px solid var(--black)',paddingBottom:'1rem'}}>
          <h2 style={{fontFamily:'var(--font-display)',fontSize:'1.3rem'}}>{title}</h2>
          <button onClick={onClose} style={{background:'none',border:'none',fontSize:24,cursor:'pointer',lineHeight:1,color:'var(--muted)'}}>×</button>
        </div>
        {children}
      </div>
    </div>
  );
};

export const StatBox = ({ label, value, sub, accent='green' }) => (
  <div style={{background:accent==='red'?'var(--red)':accent==='black'?'var(--black)':'var(--green)',color:'#fff',padding:'1.5rem',position:'relative',overflow:'hidden'}}>
    <div style={{position:'absolute',right:-8,bottom:-12,fontFamily:'var(--font-impact)',fontSize:'5rem',opacity:.12,lineHeight:1}}>{value}</div>
    <div style={{fontSize:11,fontWeight:600,textTransform:'uppercase',letterSpacing:1.5,opacity:.7,marginBottom:6}}>{label}</div>
    <div style={{fontFamily:'var(--font-impact)',fontSize:'2.5rem',lineHeight:1,letterSpacing:.5}}>{value}</div>
    {sub && <div style={{fontSize:12,opacity:.75,marginTop:4}}>{sub}</div>}
  </div>
);
