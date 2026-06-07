import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Spinner } from './UI';

const Chatbot = () => {
  const { t } = useTranslation();
  const [open, setOpen]       = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'As-salamu alaykum! I\'m NASEER, your humanitarian AI assistant. I can help you find campaigns, understand how donations work, and learn about the impact your giving creates. What would you like to know?' }
  ]);
  const [input, setInput]     = useState('');
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || streaming) return;
    const userMsg = { role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setStreaming(true);

    // Add empty assistant message to stream into
    setMessages(prev => [...prev, { role: 'assistant', content: '', streaming: true }]);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })) })
      });

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(l => l.startsWith('data: '));
        for (const line of lines) {
          const data = line.slice(6);
          if (data === '[DONE]') break;
          try {
            const parsed = JSON.parse(data);
            if (parsed.text) {
              accumulated += parsed.text;
              setMessages(prev => {
                const msgs = [...prev];
                msgs[msgs.length - 1] = { role: 'assistant', content: accumulated, streaming: true };
                return msgs;
              });
            }
          } catch {}
        }
      }

      setMessages(prev => {
        const msgs = [...prev];
        msgs[msgs.length - 1] = { role: 'assistant', content: accumulated };
        return msgs;
      });
    } catch {
      setMessages(prev => {
        const msgs = [...prev];
        msgs[msgs.length - 1] = { role: 'assistant', content: 'Sorry, I\'m having trouble connecting. Please try again.' };
        return msgs;
      });
    }
    setStreaming(false);
  };

  return (
    <>
      {/* Float button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 1500,
          width: 56, height: 56, borderRadius: '50%',
          background: open ? 'var(--black)' : 'var(--green)',
          color: '#fff', border: 'none', cursor: 'pointer',
          fontSize: '1.4rem', boxShadow: '0 4px 20px rgba(0,0,0,.25)',
          transition: 'all .2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}
        title={t('chatbot.open')}
      >
        {open ? '×' : '✦'}
      </button>

      {/* Chat window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: 92, right: 24, zIndex: 1500,
          width: 360, height: 500, background: '#fff',
          border: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
          boxShadow: '0 16px 48px rgba(0,0,0,.2)', animation: 'fadeUp .25s ease'
        }}>
          {/* Header */}
          <div style={{ background: 'var(--black)', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, background: 'var(--green)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem' }}>✦</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 14, letterSpacing: .3 }}>{t('chatbot.title')}</div>
              <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, letterSpacing: .5 }}>Powered by Claude AI</div>
            </div>
            <div style={{ marginLeft: 'auto', width: 8, height: 8, background: '#2EA868', borderRadius: '50%' }} />
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px', display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
              }}>
                <div style={{
                  padding: '10px 13px', fontSize: 13, lineHeight: 1.6,
                  background: m.role === 'user' ? 'var(--green)' : 'var(--sand)',
                  color: m.role === 'user' ? '#fff' : 'var(--black)',
                  borderRadius: m.role === 'user' ? '12px 12px 2px 12px' : '12px 12px 12px 2px',
                }}>
                  {m.content}
                  {m.streaming && <span style={{ display: 'inline-block', width: 6, height: 13, background: 'var(--green)', marginLeft: 3, animation: 'spin .8s linear infinite', borderRadius: 1 }} />}
                </div>
              </div>
            ))}
            {streaming && messages[messages.length-1]?.content === '' && (
              <div style={{ alignSelf: 'flex-start', padding: '10px 13px', background: 'var(--sand)', borderRadius: '12px 12px 12px 2px', fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Spinner size={12} /> {t('chatbot.typing')}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder={t('chatbot.placeholder')}
              style={{
                flex: 1, padding: '9px 12px', border: '1.5px solid var(--border)',
                borderRadius: 0, fontSize: 13, outline: 'none', fontFamily: 'var(--font-body)',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--green)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              disabled={streaming}
            />
            <button onClick={send} disabled={streaming || !input.trim()} style={{
              padding: '9px 16px', background: streaming ? 'var(--border)' : 'var(--green)',
              color: '#fff', border: 'none', cursor: streaming ? 'not-allowed' : 'pointer',
              fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-body)', letterSpacing: .5,
              transition: 'background .15s'
            }}>
              {streaming ? <Spinner size={13} color="#fff" /> : '→'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
