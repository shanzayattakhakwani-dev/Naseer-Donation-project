import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import NotificationBell from './NotificationBell';

const LANGS = [{ code:'en', label:'EN' }, { code:'ur', label:'اردو' }, { code:'ar', label:'عربي' }];

const Navbar = () => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === '/';
  const isRTL  = i18n.language === 'ar';

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('naseer_lang', code);
  };

  const linkStyle = (path) => ({
    padding: '6px 14px', fontSize: 12, fontWeight: 600,
    color: 'rgba(255,255,255,.8)', textDecoration: 'none',
    letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer',
    borderBottom: pathname === path ? '2px solid var(--red)' : '2px solid transparent',
    transition: 'all .15s', fontFamily: 'var(--font-body)',
  });

  return (
    <>
      <div style={{ display:'flex', height:5 }}>
        {['#0D0D0D','#FAFAF8','#1A7A4A','#C8102E'].map((c,i) => (
          <div key={i} style={{ flex:1, background:c, borderTop: c==='#FAFAF8'?'none':'none' }}/>
        ))}
      </div>
      <nav style={{
        background: scrolled||!isHome ? '#0D0D0D' : 'transparent',
        padding: '0 2rem', height:64, display:'flex',
        alignItems:'center', justifyContent:'space-between',
        position: 'sticky', top:0, zIndex:1000,
        transition:'background .3s',
        borderBottom: scrolled||!isHome ? '1px solid rgba(255,255,255,.08)' : 'none',
      }}>
        <Link to="/" style={{ textDecoration:'none' }}>
          <div style={{ fontFamily:'var(--font-impact)', fontSize:'1.6rem', letterSpacing:2, color:'#fff', lineHeight:1 }}>NASEER</div>
          <div style={{ fontSize:9, fontWeight:600, color:'rgba(255,255,255,.4)', letterSpacing:3, textTransform:'uppercase' }}>The Helper · Palestine</div>
        </Link>

        <div style={{ display:'flex', alignItems:'center', gap:6, flexWrap:'wrap' }}>
          <Link to="/campaigns" style={linkStyle('/campaigns')}>{t('nav.campaigns')}</Link>
          <Link to="/stories"   style={linkStyle('/stories')}>{t('nav.stories')}</Link>
          <Link to="/about"     style={linkStyle('/about')}>About</Link>
          <Link to="/volunteer" style={linkStyle('/volunteer')}>Volunteer</Link>

          {/* Language switcher */}
          <div style={{ display:'flex', gap:2, marginLeft:4 }}>
            {LANGS.map(l => (
              <button key={l.code} onClick={() => changeLang(l.code)} style={{
                padding:'4px 8px', fontSize:11, fontWeight:600,
                background: i18n.language===l.code ? 'var(--green)' : 'rgba(255,255,255,.1)',
                color:'#fff', border:'none', cursor:'pointer',
                fontFamily:'var(--font-body)', transition:'background .15s',
              }}>
                {l.label}
              </button>
            ))}
          </div>

          {!user ? (
            <>
              <Link to="/login"    style={linkStyle('/login')}>{t('nav.login')}</Link>
              <Link to="/register" style={{ padding:'8px 20px', fontSize:12, fontWeight:700, background:'var(--red)', color:'#fff', textDecoration:'none', letterSpacing:1, textTransform:'uppercase', border:'2px solid var(--red)', transition:'all .15s' }}>
                {t('nav.join')}
              </Link>
            </>
          ) : (
            <>
              {user.role==='admin' && <Link to="/admin" style={linkStyle('/admin')}>{t('nav.admin')}</Link>}
              <Link to="/dashboard" style={linkStyle('/dashboard')}>{t('nav.dashboard')}</Link>
              <NotificationBell />
              <span style={{ background:'var(--green)', color:'#fff', padding:'5px 14px', fontSize:12, fontWeight:700, letterSpacing:.5 }}>{user.firstName}</span>
              <button onClick={() => { logout(); navigate('/'); }} style={{ padding:'7px 14px', fontSize:12, fontWeight:600, color:'rgba(255,255,255,.6)', background:'transparent', border:'1px solid rgba(255,255,255,.2)', cursor:'pointer', letterSpacing:1, textTransform:'uppercase', fontFamily:'var(--font-body)' }}>
                {t('nav.logout')}
              </button>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
