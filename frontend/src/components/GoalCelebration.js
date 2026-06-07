import React, { useEffect } from 'react';
import { useSocket } from '../context/SocketContext';

let confettiLib = null;
const loadConfetti = () => {
  if (confettiLib) return Promise.resolve(confettiLib);
  return import('canvas-confetti').then(m => { confettiLib = m.default; return confettiLib; });
};

const GoalCelebration = () => {
  const { goalReached, clearGoal } = useSocket();

  useEffect(() => {
    if (!goalReached) return;
    loadConfetti().then(confetti => {
      const colors = ['#1A7A4A', '#C8102E', '#FFFFFF', '#2EA868', '#FF4444'];
      const end = Date.now() + 4000;
      const frame = () => {
        confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors });
        confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors });
        if (Date.now() < end) requestAnimationFrame(frame);
      };
      frame();
    });
  }, [goalReached]);

  if (!goalReached) return null;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 3000,
      background: 'rgba(0,0,0,.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      animation: 'fadeIn .4s ease',
    }} onClick={clearGoal}>
      <div style={{
        background: '#fff', padding: '3rem 4rem', textAlign: 'center',
        maxWidth: 480, animation: 'fadeUp .5s ease',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Palestine flag top */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, display: 'flex', height: 6 }}>
          <div style={{ flex: 1, background: '#0D0D0D' }} />
          <div style={{ flex: 1, background: '#fff', borderBottom: '1px solid #eee' }} />
          <div style={{ flex: 1, background: '#1A7A4A' }} />
          <div style={{ flex: 1, background: '#C8102E' }} />
        </div>

        <div style={{ fontSize: '4rem', marginBottom: '1rem', marginTop: '1rem' }}>🎉</div>
        <h2 style={{
          fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 900,
          color: 'var(--green-dark)', marginBottom: '0.5rem'
        }}>
          Campaign Fully Funded!
        </h2>
        <div style={{ fontSize: '3rem', margin: '0.5rem 0' }}>{goalReached.emoji}</div>
        <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.2rem', color: 'var(--black)', marginBottom: '0.5rem' }}>
          "{goalReached.campaignName}"
        </p>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: '1.5rem' }}>
          PKR {Number(goalReached.targetAmount).toLocaleString()} raised. Thank you to every donor who made this possible.
        </p>
        <p style={{ fontSize: 12, color: 'var(--muted)', fontStyle: 'italic' }}>الحمد لله · Alhamdulillah</p>
        <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: '1rem' }}>Click anywhere to close</p>
      </div>
    </div>
  );
};

export default GoalCelebration;
