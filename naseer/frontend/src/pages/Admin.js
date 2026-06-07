import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { PageLoader, SectionTitle, Btn, Pill, Modal, Input, Select, Alert, StatBox } from '../components/UI';

const Admin = () => {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [tab, setTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState([]);
  const [donations, setDonations] = useState([]);
  const [users,     setUsers]     = useState([]);
  const [ngos,      setNGOs]      = useState([]);
  const [volunteers,setVols]      = useState([]);
  const [stats,     setStats]     = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [campForm,  setCampForm]  = useState({ title:'', description:'', category:'Sadaqah', emoji:'🤲', targetAmount:'', isUrgent:false, impactStatement:'' });
  const [saving,    setSaving]    = useState(false);
  const [formErr,   setFormErr]   = useState('');
  const [aiTopic,   setAiTopic]   = useState('');
  const [aiAmt,     setAiAmt]     = useState('1000');
  const [aiResult,  setAiResult]  = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (!user||user.role!=='admin') { navigate('/'); return; }
    loadAll();
  }, [user]);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [c,d,u,s,n,v] = await Promise.all([
        api.get('/campaigns'), api.get('/donations'), api.get('/users'),
        api.get('/donations/stats'), api.get('/ngos'), api.get('/volunteers'),
      ]);
      setCampaigns(c.data.data); setDonations(d.data.data); setUsers(u.data.data);
      setStats(s.data.data); setNGOs(n.data.data); setVols(v.data.data);
    } finally { setLoading(false); }
  };

  const deleteCampaign = async (id) => {
    if (!window.confirm('Deactivate this campaign?')) return;
    await api.delete(`/campaigns/${id}`);
    setCampaigns(p => p.filter(c=>c._id!==id));
  };

  const saveCampaign = async () => {
    setFormErr('');
    if (!campForm.title||!campForm.description||!campForm.targetAmount) return setFormErr('Title, description and target are required.');
    setSaving(true);
    try {
      const { data } = await api.post('/campaigns', { ...campForm, targetAmount:Number(campForm.targetAmount) });
      setCampaigns(p=>[data.data,...p]);
      setShowModal(false);
      setCampForm({ title:'',description:'',category:'Sadaqah',emoji:'🤲',targetAmount:'',isUrgent:false,impactStatement:'' });
    } catch(e) { setFormErr(e.response?.data?.message||'Failed.'); }
    finally { setSaving(false); }
  };

  const verifyNGO = async (id, action) => {
    await api.patch(`/ngos/${id}/verify`, { action });
    setNGOs(p => p.map(n => n._id===id ? { ...n, status:action==='approve'?'approved':action==='reject'?'rejected':'documents-reviewed' } : n));
  };

  const approveVol = async (id) => {
    await api.patch(`/volunteers/${id}/approve`);
    setVols(p => p.map(v => v._id===id ? { ...v, status:'active' } : v));
  };

  const generateAI = async () => {
    if (!aiTopic) return;
    setAiLoading(true); setAiResult(null);
    try {
      const { data } = await api.post('/ai/generate-content', { topic:aiTopic, amount:aiAmt });
      setAiResult(data.data);
    } finally { setAiLoading(false); }
  };

  if (loading) return <PageLoader/>;
  const total = stats?.overview?.totalAmount||0;

  const TABS = [
    { id:'campaigns',    label:'Campaigns' },
    { id:'transactions', label:'Transactions' },
    { id:'users',        label:'Users' },
    { id:'ngos',         label:'NGOs' },
    { id:'volunteers',   label:'Volunteers' },
    { id:'ai-content',   label:'AI Content' },
  ];

  const thStyle = { padding:'12px 14px', textAlign:'left', fontSize:10, fontWeight:700, letterSpacing:1.5, textTransform:'uppercase' };
  const tdStyle = { padding:'11px 14px', borderBottom:'1px solid var(--border)' };

  return (
    <div style={{ minHeight:'100vh', background:'var(--white)' }}>
      <div style={{ background:'var(--black)', color:'#fff', padding:'3rem 2rem', borderBottom:'3px solid var(--red)' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <div style={{ fontSize:10, fontWeight:700, letterSpacing:3, color:'var(--red)', textTransform:'uppercase', marginBottom:10 }}>Admin Panel</div>
          <h1 style={{ fontFamily:'var(--font-display)', fontSize:'2.5rem', fontWeight:900 }}>NASEER Control Centre</h1>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:2, maxWidth:1200, margin:'0 auto', padding:'0 2rem' }}>
        <StatBox label="Total Raised"    value={`PKR ${(total/1000).toFixed(0)}K`} accent="green"/>
        <StatBox label="Donations"       value={String(donations.length)} accent="black"/>
        <StatBox label="Campaigns"       value={String(campaigns.length)} accent="red"/>
        <StatBox label="Users"           value={String(users.length)} accent="black"/>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'2rem' }}>
        {/* Tabs */}
        <div style={{ display:'flex', gap:0, marginBottom:'2rem', borderBottom:'2px solid var(--border)', overflowX:'auto' }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:'10px 20px', border:'none', background:'transparent', cursor:'pointer',
              fontSize:12, fontWeight:700, letterSpacing:1, textTransform:'uppercase',
              color:tab===t.id?'var(--black)':'var(--muted)',
              borderBottom:`3px solid ${tab===t.id?'var(--red)':'transparent'}`,
              marginBottom:-2, fontFamily:'var(--font-body)', whiteSpace:'nowrap',
            }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* CAMPAIGNS */}
        {tab==='campaigns' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
              <SectionTitle>All Campaigns ({campaigns.length})</SectionTitle>
              <Btn variant="primary" onClick={() => setShowModal(true)}>+ Add Campaign</Btn>
            </div>
            <div style={{ background:'#fff', border:'1px solid var(--border)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead><tr style={{ background:'var(--black)', color:'#fff' }}>
                  {['Campaign','Category','Target','Raised','%','Status','Actions'].map(h=><th key={h} style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {campaigns.map((c,i) => {
                    const pct=Math.round((c.raisedAmount/c.targetAmount)*100);
                    return (
                      <tr key={c._id} style={{ borderBottom:'1px solid var(--border)', background:i%2?'var(--sand)':'#fff' }}>
                        <td style={tdStyle}><strong>{c.emoji} {c.title}</strong></td>
                        <td style={tdStyle}><Pill color="green">{c.category}</Pill></td>
                        <td style={tdStyle}>PKR {(c.targetAmount/1000).toFixed(0)}K</td>
                        <td style={{ ...tdStyle, fontWeight:700, color:'var(--green-dark)' }}>PKR {(c.raisedAmount/1000).toFixed(0)}K</td>
                        <td style={tdStyle}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                            <div style={{ width:60, height:4, background:'#e0ede8' }}>
                              <div style={{ height:'100%', width:`${pct}%`, background:pct>80?'var(--green)':'var(--red)' }}/>
                            </div>
                            <span style={{ fontSize:12 }}>{pct}%</span>
                          </div>
                        </td>
                        <td style={tdStyle}>{c.isUrgent?<Pill color="red">Urgent</Pill>:<Pill color="green">Active</Pill>}</td>
                        <td style={tdStyle}><Btn variant="danger" size="sm" onClick={() => deleteCampaign(c._id)}>Delete</Btn></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TRANSACTIONS */}
        {tab==='transactions' && (
          <div>
            <SectionTitle>All Transactions ({donations.length})</SectionTitle>
            <div style={{ background:'#fff', border:'1px solid var(--border)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead><tr style={{ background:'var(--black)', color:'#fff' }}>
                  {['Receipt','Donor','Campaign','Type','Method','Amount','Date'].map(h=><th key={h} style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {donations.map((d,i) => (
                    <tr key={d._id} style={{ borderBottom:'1px solid var(--border)', background:i%2?'var(--sand)':'#fff' }}>
                      <td style={{ ...tdStyle, fontFamily:'monospace', fontSize:11, color:'var(--muted)' }}>{d.receiptId}</td>
                      <td style={{ ...tdStyle, fontWeight:600 }}>{d.donorName}</td>
                      <td style={tdStyle}>{d.campaign?.title||'—'}</td>
                      <td style={tdStyle}><Pill color="green">{d.donationType}</Pill></td>
                      <td style={{ ...tdStyle, color:'var(--muted)' }}>{d.paymentMethod}</td>
                      <td style={{ ...tdStyle, fontFamily:'var(--font-impact)', fontSize:'1rem', letterSpacing:1 }}>PKR {d.amount.toLocaleString()}</td>
                      <td style={{ ...tdStyle, color:'var(--muted)' }}>{new Date(d.createdAt).toLocaleDateString('en-PK')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS */}
        {tab==='users' && (
          <div>
            <SectionTitle>Users ({users.length})</SectionTitle>
            <div style={{ background:'#fff', border:'1px solid var(--border)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead><tr style={{ background:'var(--black)', color:'#fff' }}>
                  {['Name','Email','Role','Total Donated','Status','Joined'].map(h=><th key={h} style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {users.map((u,i) => (
                    <tr key={u._id} style={{ borderBottom:'1px solid var(--border)', background:i%2?'var(--sand)':'#fff' }}>
                      <td style={{ ...tdStyle, fontWeight:700 }}>{u.firstName} {u.lastName}</td>
                      <td style={{ ...tdStyle, color:'var(--muted)' }}>{u.email}</td>
                      <td style={tdStyle}><Pill color={u.role==='admin'?'red':'green'}>{u.role}</Pill></td>
                      <td style={{ ...tdStyle, fontFamily:'var(--font-impact)', letterSpacing:.5 }}>PKR {u.totalDonated.toLocaleString()}</td>
                      <td style={tdStyle}><Pill color={u.isActive?'green':'red'}>{u.isActive?'Active':'Inactive'}</Pill></td>
                      <td style={{ ...tdStyle, color:'var(--muted)' }}>{new Date(u.createdAt).toLocaleDateString('en-PK')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* NGOs */}
        {tab==='ngos' && (
          <div>
            <SectionTitle>NGO Verification ({ngos.length})</SectionTitle>
            <div style={{ background:'#fff', border:'1px solid var(--border)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead><tr style={{ background:'var(--black)', color:'#fff' }}>
                  {['Name','Reg. No.','Contact','Status','Actions'].map(h=><th key={h} style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {ngos.length===0 && <tr><td colSpan={5} style={{ padding:'2rem', textAlign:'center', color:'var(--muted)' }}>No NGO registrations yet.</td></tr>}
                  {ngos.map((n,i) => (
                    <tr key={n._id} style={{ borderBottom:'1px solid var(--border)', background:i%2?'var(--sand)':'#fff' }}>
                      <td style={{ ...tdStyle, fontWeight:700 }}>{n.name}</td>
                      <td style={{ ...tdStyle, fontFamily:'monospace', fontSize:11 }}>{n.registrationNumber}</td>
                      <td style={{ ...tdStyle, color:'var(--muted)' }}>{n.contactEmail}</td>
                      <td style={tdStyle}>
                        <Pill color={n.status==='approved'?'green':n.status==='rejected'?'red':'amber'}>
                          {n.status}
                        </Pill>
                      </td>
                      <td style={{ ...tdStyle, display:'flex', gap:6 }}>
                        {n.status==='pending'&&<><Btn size="sm" variant="primary" onClick={()=>verifyNGO(n._id,'approve')}>Approve</Btn><Btn size="sm" variant="danger" onClick={()=>verifyNGO(n._id,'reject')}>Reject</Btn></>}
                        {n.status==='pending'&&<Btn size="sm" variant="outline" onClick={()=>verifyNGO(n._id,'review')}>Review</Btn>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* VOLUNTEERS */}
        {tab==='volunteers' && (
          <div>
            <SectionTitle>Volunteers ({volunteers.length})</SectionTitle>
            <div style={{ background:'#fff', border:'1px solid var(--border)' }}>
              <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13 }}>
                <thead><tr style={{ background:'var(--black)', color:'#fff' }}>
                  {['Name','Email','Skills','City','Availability','Status','Actions'].map(h=><th key={h} style={thStyle}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {volunteers.length===0 && <tr><td colSpan={7} style={{ padding:'2rem', textAlign:'center', color:'var(--muted)' }}>No volunteer applications yet.</td></tr>}
                  {volunteers.map((v,i) => (
                    <tr key={v._id} style={{ borderBottom:'1px solid var(--border)', background:i%2?'var(--sand)':'#fff' }}>
                      <td style={{ ...tdStyle, fontWeight:700 }}>{v.name}</td>
                      <td style={{ ...tdStyle, color:'var(--muted)' }}>{v.email}</td>
                      <td style={tdStyle}>{v.skills.join(', ')}</td>
                      <td style={tdStyle}>{v.city}</td>
                      <td style={tdStyle}>{v.availability}</td>
                      <td style={tdStyle}><Pill color={v.status==='active'?'green':v.status==='inactive'?'red':'amber'}>{v.status}</Pill></td>
                      <td style={tdStyle}>{v.status==='pending'&&<Btn size="sm" variant="primary" onClick={()=>approveVol(v._id)}>Approve</Btn>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* AI CONTENT */}
        {tab==='ai-content' && (
          <div style={{ maxWidth:640 }}>
            <SectionTitle>AI Content Generator</SectionTitle>
            <div style={{ background:'#fff', border:'1px solid var(--border)', padding:'2rem' }}>
              <Input label="Campaign Topic" placeholder="e.g. Clean water for Gaza families" value={aiTopic} onChange={e=>setAiTopic(e.target.value)}/>
              <Input label="Donation Amount (PKR)" type="number" value={aiAmt} onChange={e=>setAiAmt(e.target.value)}/>
              <Btn variant="primary" loading={aiLoading} onClick={generateAI} style={{ marginBottom:'1.5rem' }}>✦ Generate with AI</Btn>
              {aiResult && (
                <div>
                  {[['Campaign Title',aiResult.title],['Description',aiResult.description],['Impact Statement',aiResult.impact],['Urdu Tagline',aiResult.urduTagline],['Call to Action',aiResult.callToAction]].map(([l,v]) => (
                    <div key={l} style={{ marginBottom:'1rem', padding:'1rem', background:'var(--sand)', borderLeft:'3px solid var(--green)' }}>
                      <div style={{ fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:1.5, color:'var(--green)', marginBottom:4 }}>{l}</div>
                      <div style={{ fontSize:14, color:'var(--black)', lineHeight:1.6 }}>{v}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add Campaign Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Add New Campaign">
        <Alert type="error" msg={formErr}/>
        <Input label="Title" placeholder="Campaign title" value={campForm.title} onChange={e=>setCampForm(f=>({...f,title:e.target.value}))}/>
        <div style={{ marginBottom:16 }}>
          <label style={{ display:'block', fontSize:12, fontWeight:600, textTransform:'uppercase', letterSpacing:.8, marginBottom:5 }}>Description</label>
          <textarea rows={3} style={{ width:'100%', padding:'11px 14px', border:'1.5px solid var(--border)', fontSize:14, fontFamily:'var(--font-body)', outline:'none', resize:'vertical' }} value={campForm.description} onChange={e=>setCampForm(f=>({...f,description:e.target.value}))}/>
        </div>
        <Select label="Category" value={campForm.category} onChange={e=>setCampForm(f=>({...f,category:e.target.value}))}>
          <option>Sadaqah</option><option>Zakat</option><option>Lillah</option><option>Emergency</option>
        </Select>
        <Input label="Emoji" placeholder="🍞" value={campForm.emoji} onChange={e=>setCampForm(f=>({...f,emoji:e.target.value}))}/>
        <Input label="Target Amount (PKR)" type="number" placeholder="500000" value={campForm.targetAmount} onChange={e=>setCampForm(f=>({...f,targetAmount:e.target.value}))}/>
        <Input label="Impact Statement" placeholder="PKR 500 feeds one family." value={campForm.impactStatement} onChange={e=>setCampForm(f=>({...f,impactStatement:e.target.value}))}/>
        <label style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20, cursor:'pointer', fontSize:13 }}>
          <input type="checkbox" checked={campForm.isUrgent} onChange={e=>setCampForm(f=>({...f,isUrgent:e.target.checked}))}/>
          Mark as Urgent
        </label>
        <div style={{ display:'flex', gap:8 }}>
          <Btn variant="primary" full loading={saving} onClick={saveCampaign}>Save Campaign</Btn>
          <Btn variant="outline" full onClick={() => setShowModal(false)}>Cancel</Btn>
        </div>
      </Modal>
    </div>
  );
};

export default Admin;
