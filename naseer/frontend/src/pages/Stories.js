import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Btn } from '../components/UI';

const stories = [
  {
    name: 'Layla, 8 years old',
    from: 'Gaza City',
    role: 'Student',
    color: 'var(--red)',
    emoji: '📚',
    story: 'Before everything changed, Layla walked to school every morning with her best friend Nour. She loved maths and wanted to be an engineer like her father. Today, her school is rubble. She studies from torn textbooks in a tent, dreaming of the day she can sit at a proper desk again.',
    quote: '"I just want to go back to school. I miss my teacher, Miss Hana, who always said I was the best in class."',
    impact: 'PKR 5,000 sponsors one month of education for a displaced child.',
  },
  {
    name: 'Ahmad, 34 years old',
    from: 'Rafah',
    role: 'Father of four',
    color: 'var(--green)',
    emoji: '🍞',
    story: 'Ahmad was a baker. He fed his neighborhood for ten years. When his bakery was destroyed, he thought he had failed his children. When NASEER\'s food package arrived at the shelter, his youngest daughter cried — not from hunger, but from relief. He has not forgotten that moment.',
    quote: '"We had nothing left. The food package saved my children. I will spend the rest of my life being grateful to strangers I\'ll never meet."',
    impact: 'PKR 2,000 provides an emergency food package for a family of five for one week.',
  },
  {
    name: 'Fatima, 62 years old',
    from: 'Khan Yunis',
    role: 'Grandmother',
    color: 'var(--black)',
    emoji: '🏠',
    story: 'Fatima raised seven children in her home. She knew every crack in its walls, every memory stored in its rooms. The house is gone now. She sits in a displacement camp holding a photograph of her garden. What keeps her going is her grandchildren — and the knowledge that people across the world still care.',
    quote: '"I never imagined strangers across the world would care about us. When I heard people in Pakistan donated for us, I prayed for them all night."',
    impact: 'PKR 10,000 provides materials to begin rebuilding a family\'s home.',
  },
  {
    name: 'Dr. Yusuf, 41 years old',
    from: 'Gaza Strip',
    role: 'Field Doctor',
    color: 'var(--red)',
    emoji: '🏥',
    story: 'Dr. Yusuf has not slept more than four hours in weeks. He operates with whatever supplies are available — sometimes improvising. When a shipment of medicines arrived funded by NASEER donors, he stood in the corridor and wept. Not from sadness, but because people he had never met trusted him to save lives.',
    quote: '"Every medicine that arrives is a life saved. Please do not stop. We are still here. We are still fighting."',
    impact: 'PKR 2,000 provides one month of critical medicines for a field hospital patient.',
  },
];

const Stories = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--black)', color: '#fff', padding: '5rem 2rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -10, top: '50%', transform: 'translateY(-50%)', fontFamily: 'var(--font-impact)', fontSize: '18rem', opacity: .04, letterSpacing: -20, lineHeight: 1 }}>STORIES</div>
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 3, color: 'var(--red)', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ display: 'inline-block', width: 32, height: 2, background: 'var(--red)' }} />
            Real Voices from Palestine
          </div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, lineHeight: 1.1, maxWidth: 700 }}>
            Behind every<br />donation is a<br /><em style={{ color: 'var(--green-mid)', fontStyle: 'italic' }}>human story.</em>
          </h1>
        </div>
      </div>

      {/* Palestine flag divider */}
      <div style={{ display: 'flex', height: 8 }}>
        <div style={{ flex: 1, background: '#0D0D0D' }} />
        <div style={{ flex: 1, background: '#FAFAF8' }} />
        <div style={{ flex: 1, background: '#1A7A4A' }} />
        <div style={{ flex: 1, background: '#C8102E' }} />
      </div>

      {/* Stories */}
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '4rem 2rem' }}>
        {stories.map((s, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: i % 2 === 0 ? '1fr 1.5fr' : '1.5fr 1fr',
            gap: '3rem', marginBottom: '5rem', alignItems: 'start',
          }}>
            {/* Accent panel */}
            {i % 2 !== 0 && (
              <div style={{ background: 'var(--sand)', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: 16, bottom: 8, fontFamily: 'var(--font-impact)', fontSize: '8rem', opacity: .07, lineHeight: 1 }}>{s.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1.5rem' }}>Impact</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.7, marginBottom: '1.5rem', color: 'var(--black)' }}>
                  {s.impact}
                </div>
                <Btn variant="primary" onClick={() => navigate('/campaigns')}>Help Now</Btn>
              </div>
            )}

            {/* Story content */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: '1.5rem' }}>
                <div style={{ width: 48, height: 48, background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  {s.emoji}
                </div>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem' }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{s.role} · {s.from}</div>
                </div>
              </div>

              <div style={{ borderLeft: `4px solid ${s.color}`, paddingLeft: '1.25rem', marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '1.05rem', lineHeight: 1.75, color: 'var(--black)' }}>
                  {s.quote}
                </p>
              </div>

              <p style={{ color: 'var(--muted)', lineHeight: 1.85, fontSize: 15 }}>{s.story}</p>
            </div>

            {i % 2 === 0 && (
              <div style={{ background: 'var(--sand)', padding: '3rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', right: 16, bottom: 8, fontFamily: 'var(--font-impact)', fontSize: '8rem', opacity: .07, lineHeight: 1 }}>{s.emoji}</div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 2, textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1.5rem' }}>Impact</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontStyle: 'italic', lineHeight: 1.7, marginBottom: '1.5rem', color: 'var(--black)' }}>
                  {s.impact}
                </div>
                <Btn variant="primary" onClick={() => navigate('/campaigns')}>Help Now</Btn>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{ background: 'var(--red)', color: '#fff', padding: '5rem 2rem', textAlign: 'center' }}>
        <div style={{ fontFamily: 'var(--font-impact)', fontSize: 'clamp(2.5rem,6vw,4rem)', letterSpacing: 3, marginBottom: '1rem' }}>
          THEIR STORY ISN'T OVER.
        </div>
        <p style={{ fontSize: 16, opacity: .85, maxWidth: 480, margin: '0 auto 2rem', lineHeight: 1.8 }}>
          These are real people. Real families. Every campaign on NASEER is fighting for them. Your donation writes the next chapter.
        </p>
        <Btn variant="outlineWhite" style={{ padding: '14px 40px', fontSize: 14 }} onClick={() => navigate('/campaigns')}>
          See All Campaigns
        </Btn>
      </div>
    </div>
  );
};

export default Stories;
