import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import CampaignCard from '../components/CampaignCard';
import { PageLoader, AIBox, SectionTitle, EmptyState, Btn } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const CATS = ['All', 'Zakat', 'Sadaqah', 'Lillah', 'Emergency'];

const Campaigns = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [filter, setFilter]       = useState('All');
  const [loading, setLoading]     = useState(true);
  const [aiRec, setAiRec]         = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    loadAI();
  }, []);

  const fetchCampaigns = (cat) => {
    setLoading(true);
    const params = cat && cat !== 'All' && cat !== 'Emergency' ? { category: cat } : cat === 'Emergency' ? { urgent: true } : {};
    api.get('/campaigns', { params }).then(r => setCampaigns(r.data.data)).finally(() => setLoading(false));
  };

  const loadAI = () => {
    setAiLoading(true);
    api.get('/ai/recommendations')
      .then(r => setAiRec(r.data.reason || 'Here are our most urgent campaigns.'))
      .catch(() => setAiRec('Browse our verified campaigns and choose where your support matters most.'))
      .finally(() => setAiLoading(false));
  };

  const handleFilter = (cat) => {
    setFilter(cat);
    fetchCampaigns(cat);
  };

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Page Header */}
      <div style={{ background: 'var(--black)', color: '#fff', padding: '4rem 2rem 3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse at 80% 50%, rgba(200,16,46,.1), transparent 60%)' }} />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--red)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 24, height: 2, background: 'var(--red)' }} />
            Active Campaigns
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem,5vw,3.5rem)', fontWeight: 900, marginBottom: 12 }}>
            Choose Where<br /><em style={{ color: 'var(--green-mid)', fontStyle: 'italic' }}>You Make a Difference</em>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 16, maxWidth: 500 }}>
            Every campaign is verified and transparent. See exactly how your donation is used.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2.5rem 2rem' }}>
        {/* AI Recommendation */}
        <AIBox title="AI Recommendation" loading={aiLoading}>
          {aiRec || 'Loading personalised recommendations...'}
          {user && <span style={{ color: '#7EDCA8', fontWeight: 600 }}> Logged in as {user.firstName}.</span>}
        </AIBox>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: '2rem' }}>
          {CATS.map(cat => (
            <button key={cat} onClick={() => handleFilter(cat)} style={{
              padding: '8px 20px', fontSize: 12, fontWeight: 700, letterSpacing: 1,
              textTransform: 'uppercase', border: '2px solid',
              borderColor: filter === cat ? (cat === 'Emergency' ? 'var(--red)' : 'var(--green)') : 'var(--border)',
              background: filter === cat ? (cat === 'Emergency' ? 'var(--red)' : 'var(--green)') : '#fff',
              color: filter === cat ? '#fff' : 'var(--muted)',
              cursor: 'pointer', transition: 'all .15s',
            }}>
              {cat === 'Emergency' ? '🔴 ' : ''}{cat}
            </button>
          ))}
        </div>

        <SectionTitle>
          {filter === 'All' ? `All Campaigns (${campaigns.length})` : `${filter} Campaigns (${campaigns.length})`}
        </SectionTitle>

        {loading ? <PageLoader /> : campaigns.length === 0
          ? <EmptyState  title="No campaigns found" sub="Try a different filter category." action={<Btn variant="outline" onClick={() => handleFilter('All')}>Show All</Btn>} />
          : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
              {campaigns.map(c => <CampaignCard key={c._id} campaign={c} />)}
            </div>
          )}
      </div>
    </div>
  );
};

export default Campaigns;
