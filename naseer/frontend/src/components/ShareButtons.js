import React, { useState } from 'react';

const ShareButtons = ({ campaign }) => {
  const [copied, setCopied] = useState(false);
  const url  = `${window.location.origin}/campaigns/${campaign.slug || campaign._id}`;
  const text = `Support "${campaign.title}" on NASEER – ${Math.round((campaign.raisedAmount/campaign.targetAmount)*100)}% funded. Help Palestine: `;

  const shares = [
    {
      label: 'WhatsApp',
      color: '#25D366',
      icon: '💬',
      href: `https://wa.me/?text=${encodeURIComponent(text + url)}`,
    },
    {
      label: 'X / Twitter',
      color: '#000',
      icon: '𝕏',
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
    },
    {
      label: 'Facebook',
      color: '#1877F2',
      icon: 'f',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    },
    {
      label: 'LinkedIn',
      color: '#0A66C2',
      icon: 'in',
      href: `https://www.linkedin.com/shareArticle?url=${encodeURIComponent(url)}&title=${encodeURIComponent(campaign.title)}`,
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: 'var(--muted)', marginBottom: 10 }}>
        Share This Campaign
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {shares.map(s => (
          <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '7px 14px', background: s.color, color: '#fff',
            fontSize: 12, fontWeight: 700, textDecoration: 'none',
            transition: 'opacity .15s', letterSpacing: .3,
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '.8'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            <span style={{ fontSize: 13 }}>{s.icon}</span> {s.label}
          </a>
        ))}
        <button onClick={copyLink} style={{
          padding: '7px 14px', background: copied ? 'var(--green)' : 'var(--border)',
          color: copied ? '#fff' : 'var(--black)',
          border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700,
          transition: 'all .2s', letterSpacing: .3,
        }}>
          {copied ? '✓ Copied!' : '🔗 Copy Link'}
        </button>
      </div>
    </div>
  );
};

export default ShareButtons;
