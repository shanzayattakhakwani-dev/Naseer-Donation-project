import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSocket } from '../context/SocketContext';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const NotificationBell = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { unread, markAllRead } = useSocket();
  const [open, setOpen]   = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleOpen = async () => {
    if (!open && user) {
      setLoading(true);
      try {
        const { data } = await api.get('/notifications');
        setNotifs(data.data);
      } catch {}
      setLoading(false);
    }
    setOpen(o => !o);
  };

  const handleMarkAll = async () => {
    await api.patch('/notifications/read-all');
    setNotifs(prev => prev.map(n => ({ ...n, read: true })));
    markAllRead();
  };

  if (!user) return null;

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={handleOpen} style={{
        position: 'relative', background: 'none', border: 'none',
        color: 'rgba(255,255,255,.8)', cursor: 'pointer', fontSize: '1.2rem',
        padding: '4px 8px', lineHeight: 1,
      }}>
        🔔
        {unread > 0 && (
          <span style={{
            position: 'absolute', top: -2, right: -2,
            background: 'var(--red)', color: '#fff',
            borderRadius: '50%', width: 16, height: 16,
            fontSize: 10, fontWeight: 700,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', right: 0, marginTop: 8,
          width: 320, background: '#fff', border: '1px solid var(--border)',
          boxShadow: '0 8px 32px rgba(0,0,0,.18)', zIndex: 2000,
          animation: 'fadeUp .2s ease',
        }}>
          <div style={{ padding: '12px 14px', borderBottom: '2px solid var(--black)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{t('notifications.title')}</span>
            <button onClick={handleMarkAll} style={{ fontSize: 11, color: 'var(--green)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
              {t('notifications.mark_all')}
            </button>
          </div>
          <div style={{ maxHeight: 320, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>Loading...</div>
            ) : notifs.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>{t('notifications.empty')}</div>
            ) : notifs.map((n, i) => (
              <div key={i} style={{
                padding: '12px 14px', borderBottom: '1px solid var(--border)',
                background: n.read ? '#fff' : 'var(--green-light)',
                borderLeft: n.read ? 'none' : '3px solid var(--green)',
              }}>
                <p style={{ fontSize: 13, color: 'var(--black)', lineHeight: 1.5, marginBottom: 3 }}>{n.message}</p>
                <span style={{ fontSize: 11, color: 'var(--muted)' }}>
                  {new Date(n.createdAt).toLocaleDateString('en-PK', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
