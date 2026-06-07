import React from 'react';
import { useSocket } from '../context/SocketContext';

const LiveFeed = () => {
  const { liveFeed } = useSocket();
  if (liveFeed.length === 0) return null;

  return (
    <div style={{
      position: 'fixed', bottom: 90, left: 16, zIndex: 1400,
      display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none',
    }}>
      {liveFeed.slice(0, 3).map((d, i) => (
        <div key={d.id} style={{
          background: '#0D0D0D', color: '#fff', padding: '10px 14px',
          fontSize: 12, maxWidth: 260, animation: 'slideIn .4s ease',
          borderLeft: '3px solid var(--green)',
          opacity: i === 0 ? 1 : i === 1 ? 0.7 : 0.4,
          transition: 'opacity .3s',
        }}>
          <div style={{ fontWeight: 700, marginBottom: 2 }}>
            {d.campaignEmoji} {d.donorName} donated
          </div>
          <div style={{ color: 'var(--green-mid)', fontFamily: 'var(--font-impact)', fontSize: 15, letterSpacing: 1 }}>
            PKR {Number(d.amount).toLocaleString()}
          </div>
          <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, marginTop: 2 }}>
            {d.campaignName} · just now
          </div>
        </div>
      ))}
    </div>
  );
};

export default LiveFeed;
