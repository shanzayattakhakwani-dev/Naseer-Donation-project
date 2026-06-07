import React from 'react';

const icons = {
  'Campaign Created': 'NEW',
  '50% Funded!': '50%',
  '75% Funded!': '75%',
  '100% Funded!': 'COMPLETE',
  'Aid Dispatched': 'SHIPPED',
  'Delivery Confirmed': 'DELIVERED',
  default: 'INFO',
};
const CampaignTimeline = ({ timeline = [] }) => {
  if (!timeline.length) return null;

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 2, color: 'var(--muted)', marginBottom: '1.5rem' }}>
        Campaign Timeline
      </div>
      <div style={{ position: 'relative', paddingLeft: 32 }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', left: 11, top: 0, bottom: 0, width: 2, background: 'var(--border)' }} />

        {timeline.map((event, i) => (
          <div key={i} style={{
            position: 'relative', marginBottom: '1.5rem',
            animation: `fadeUp .4s ease ${i * 0.1}s both`,
          }}>
            {/* Dot */}
            <div style={{
              position: 'absolute', left: -32, top: 3,
              width: 22, height: 22, borderRadius: '50%',
              background: event.auto ? 'var(--green)' : 'var(--red)',
              border: '3px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, zIndex: 1,
              boxShadow: '0 2px 8px rgba(0,0,0,.15)',
            }}>
              {(icons[event.title] || icons.default)}
            </div>

            <div style={{ background: 'var(--sand)', padding: '12px 14px', borderLeft: `3px solid ${event.auto ? 'var(--green)' : 'var(--red)'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <h4 style={{ fontSize: 14, fontWeight: 700, color: 'var(--black)', margin: 0 }}>{event.title}</h4>
                <span style={{ fontSize: 11, color: 'var(--muted)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  {new Date(event.date).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
              </div>
              {event.description && (
                <p style={{ fontSize: 13, color: 'var(--muted)', margin: '4px 0 0', lineHeight: 1.5 }}>{event.description}</p>
              )}
              {event.photoUrl && (
                <img src={event.photoUrl} alt={event.title} style={{ width: '100%', marginTop: 8, maxHeight: 200, objectFit: 'cover' }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignTimeline;
