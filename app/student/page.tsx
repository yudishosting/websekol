'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Tab = 'ringkasan' | 'siswa' | 'jadwal' | 'pengumuman' | 'kegiatan' | 'galeri';

interface Student { id: number; name: string; nis: string; position: string; photo_url: string | null; }
interface Schedule { id: number; day: string; start_time: string; end_time: string; subject: string; }
interface Announcement { id: number; title: string; content: string; author: string; created_at: string; }
interface Activity { id: number; title: string; description: string; date: string; }
interface GalleryItem { id: number; title: string; description: string | null; photo_url: string; event_date: string | null; }

const positionColor: Record<string, string> = {
  Ketua: '#3b82f6', Sekretaris: '#8b5cf6', Bendahara: '#f59e0b', Anggota: '#10b981',
};
const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function StudentPage() {
  const [tab, setTab] = useState<Tab>('ringkasan');
  const [students, setStudents] = useState<Student[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [search, setSearch] = useState('');
  const [previewImg, setPreviewImg] = useState<GalleryItem | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/students').then(r => r.json()).then(d => Array.isArray(d) ? setStudents(d) : null);
    fetch('/api/schedules').then(r => r.json()).then(d => Array.isArray(d) ? setSchedules(d) : null);
    fetch('/api/announcements').then(r => r.json()).then(d => Array.isArray(d) ? setAnnouncements(d) : null);
    fetch('/api/activities').then(r => r.json()).then(d => Array.isArray(d) ? setActivities(d) : null);
    fetch('/api/gallery').then(r => r.json()).then(d => Array.isArray(d) ? setGallery(d) : null);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const filtered = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search)
  );
  const pengurus = students.filter(s => ['Ketua', 'Sekretaris', 'Bendahara'].includes(s.position));
  const allTimes = Array.from(new Set<string>(schedules.map(s => s.start_time))).sort();
  const now = new Date();
  const upcoming = activities.filter(a => new Date(a.date) >= now);
  const archived = activities.filter(a => new Date(a.date) < now);

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: 'ringkasan', label: 'Home', icon: '🏠' },
    { key: 'siswa', label: 'Siswa', icon: '👥' },
    { key: 'jadwal', label: 'Jadwal', icon: '📅' },
    { key: 'pengumuman', label: 'Info', icon: '📢' },
    { key: 'kegiatan', label: 'Acara', icon: '🎯' },
    { key: 'galeri', label: 'Galeri', icon: '📸' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', fontFamily: "'Plus Jakarta Sans',sans-serif" }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#1d4ed8 0%,#4338ca 100%)', padding: '14px 16px', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 12px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>🎓</div>
            <div>
              <div style={{ color: '#fff', fontSize: '15px', fontWeight: '800', fontFamily: "'Sora',sans-serif", lineHeight: 1.2 }}>XI TSM 2</div>
              <div style={{ color: '#93c5fd', fontSize: '10px' }}>SMKN 2 Jember · 2025/2026</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: '8px', padding: '6px 12px', color: '#fff', fontSize: '11px', cursor: 'pointer', fontFamily: 'inherit', fontWeight: '600' }}>Keluar</button>
        </div>
      </div>

      {/* Tab Bar */}
      <div style={{ background: '#fff', display: 'flex', borderBottom: '2px solid #f1f5f9', position: 'sticky', top: '66px', zIndex: 40, boxShadow: '0 2px 8px rgba(0,0,0,0.06)', overflowX: 'auto' }}>
        {tabs.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} style={{
            flex: 1, minWidth: '52px', padding: '8px 4px 6px', border: 'none',
            background: 'transparent',
            borderBottom: tab === t.key ? '2px solid #2563eb' : '2px solid transparent',
            color: tab === t.key ? '#2563eb' : '#94a3b8',
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
            marginBottom: '-2px', transition: 'all .15s',
          }}>
            <span style={{ fontSize: '17px' }}>{t.icon}</span>
            <span style={{ fontSize: '8px', fontWeight: '700', letterSpacing: '0.2px' }}>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ padding: '14px' }}>

        {/* HOME / RINGKASAN */}
        {tab === 'ringkasan' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '14px' }}>
              {[
                { n: students.length, l: 'Siswa', bg: '#eff6ff', c: '#2563eb', icon: '👥' },
                { n: upcoming.length, l: 'Acara', bg: '#ecfdf5', c: '#059669', icon: '🎯' },
                { n: gallery.length, l: 'Foto', bg: '#fdf4ff', c: '#9333ea', icon: '📸' },
              ].map(item => (
                <div key={item.l} style={{ background: item.bg, borderRadius: '14px', padding: '12px 8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', marginBottom: '2px' }}>{item.icon}</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: item.c, fontFamily: "'Sora',sans-serif", lineHeight: 1 }}>{item.n}</div>
                  <div style={{ fontSize: '9px', color: '#64748b', marginTop: '3px', fontWeight: '600' }}>{item.l}</div>
                </div>
              ))}
            </div>

            {/* Pengurus */}
            <div style={{ background: '#fff', borderRadius: '16px', padding: '16px', border: '1px solid #e8eef8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '12px' }}>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', fontFamily: "'Sora',sans-serif", marginBottom: '14px' }}>👑 Pengurus Kelas</div>
              {pengurus.length === 0
                ? <div style={{ color: '#94a3b8', fontSize: '13px', textAlign: 'center', padding: '12px 0' }}>Belum ada pengurus</div>
                : (
                  <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(pengurus.length, 3)},1fr)`, gap: '12px' }}>
                    {pengurus.map(p => (
                      <div key={p.id} style={{ textAlign: 'center' }}>
                        <div style={{ width: '54px', height: '54px', borderRadius: '16px', margin: '0 auto 8px', background: positionColor[p.position] + '20', border: `2px solid ${positionColor[p.position]}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '800', color: positionColor[p.position], overflow: 'hidden' }}>
                          {p.photo_url ? <img src={p.photo_url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : p.name[0]}
                        </div>
                        <div style={{ fontSize: '11px', fontWeight: '700', color: '#1e293b', lineHeight: 1.3 }}>{p.name}</div>
                        <div style={{ fontSize: '9px', fontWeight: '600', color: positionColor[p.position], marginTop: '2px' }}>{p.position}</div>
                      </div>
                    ))}
                  </div>
                )}
            </div>

            {/* Foto terbaru */}
            {gallery.length > 0 && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '16px', border: '1px solid #e8eef8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', fontFamily: "'Sora',sans-serif" }}>📸 Foto Terbaru</div>
                  <button onClick={() => setTab('galeri')} style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '11px', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit' }}>Lihat semua →</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '6px' }}>
                  {gallery.slice(0, 6).map(g => (
                    <div key={g.id} onClick={() => { setPreviewImg(g); setTab('galeri'); }} style={{ paddingTop: '100%', position: 'relative', borderRadius: '10px', overflow: 'hidden', cursor: 'pointer' }}>
                      <img src={g.photo_url} alt={g.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pengumuman terbaru */}
            {announcements.length > 0 && (
              <div style={{ background: '#fff', borderRadius: '16px', padding: '16px', border: '1px solid #e8eef8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '12px' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', fontFamily: "'Sora',sans-serif", marginBottom: '10px' }}>📢 Info Terbaru</div>
                <div style={{ borderLeft: '3px solid #2563eb', paddingLeft: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{announcements[0].title}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', lineHeight: 1.6 }}>{announcements[0].content.substring(0, 100)}{announcements[0].content.length > 100 ? '...' : ''}</div>
                  <button onClick={() => setTab('pengumuman')} style={{ marginTop: '6px', background: 'none', border: 'none', color: '#2563eb', fontSize: '11px', fontWeight: '700', cursor: 'pointer', padding: 0, fontFamily: 'inherit' }}>Baca selengkapnya →</button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SISWA */}
        {tab === 'siswa' && (
          <div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Cari nama atau NIS..."
              style={{ width: '100%', border: '1.5px solid #e2e8f0', borderRadius: '12px', padding: '12px 14px', fontSize: '13px', fontFamily: 'inherit', outline: 'none', marginBottom: '14px', boxSizing: 'border-box', background: '#fff' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
              {filtered.map(s => (
                <div key={s.id} style={{ background: '#fff', borderRadius: '16px', padding: '16px', textAlign: 'center', border: '1px solid #e8eef8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '16px', margin: '0 auto 10px', background: positionColor[s.position] + '15', border: `2px solid ${positionColor[s.position]}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '800', color: positionColor[s.position], overflow: 'hidden' }}>
                    {s.photo_url ? <img src={s.photo_url} alt={s.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : s.name[0]}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', lineHeight: 1.3 }}>{s.name}</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', margin: '3px 0', fontFamily: 'monospace' }}>{s.nis}</div>
                  <span style={{ display: 'inline-block', background: positionColor[s.position], color: '#fff', fontSize: '9px', fontWeight: '700', padding: '3px 10px', borderRadius: '99px' }}>{s.position}</span>
                </div>
              ))}
              {filtered.length === 0 && <div style={{ gridColumn: 'span 2', textAlign: 'center', color: '#94a3b8', padding: '40px', fontSize: '13px' }}>Tidak ditemukan</div>}
            </div>
          </div>
        )}

        {/* JADWAL */}
        {tab === 'jadwal' && (
          <div style={{ background: '#fff', borderRadius: '16px', padding: '16px', border: '1px solid #e8eef8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', fontFamily: "'Sora',sans-serif", marginBottom: '14px' }}>📅 Jadwal Pelajaran</div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '10px', minWidth: '320px' }}>
                <thead>
                  <tr style={{ background: 'linear-gradient(90deg,#1d4ed8,#4338ca)', color: '#fff' }}>
                    <th style={{ padding: '10px 8px', textAlign: 'left', fontWeight: '700', borderRadius: '10px 0 0 0' }}>Jam</th>
                    {days.map((d, i) => <th key={d} style={{ padding: '10px 4px', fontWeight: '700', borderRadius: i === 4 ? '0 10px 0 0' : 0 }}>{d.substring(0, 3)}</th>)}
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ background: '#fff7ed' }}>
                    <td style={{ padding: '8px', color: '#b45309', fontSize: '9px', fontFamily: 'monospace' }}>11:00</td>
                    <td colSpan={5} style={{ textAlign: 'center', color: '#b45309', fontWeight: '700', fontSize: '10px', padding: '8px' }}>☀️ ISTIRAHAT</td>
                  </tr>
                  {allTimes.map((time, i) => {
                    const slots = schedules.filter(sc => sc.start_time === time);
                    return (
                      <tr key={time} style={{ background: i % 2 === 0 ? '#fff' : '#f8faff', borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '8px', fontFamily: 'monospace', fontSize: '9px', color: '#94a3b8', whiteSpace: 'nowrap' }}>{time}</td>
                        {days.map(day => {
                          const found = slots.find(sc => sc.day === day);
                          return (
                            <td key={day} style={{ padding: '6px 3px', textAlign: 'center' }}>
                              {found
                                ? <span style={{ display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', borderRadius: '6px', padding: '3px 4px', fontSize: '9px', fontWeight: '600', lineHeight: 1.3 }}>{found.subject.split(' ')[0]}</span>
                                : <span style={{ color: '#e2e8f0' }}>—</span>}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                  {allTimes.length === 0 && <tr><td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Belum ada jadwal</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PENGUMUMAN */}
        {tab === 'pengumuman' && (
          <div>
            {announcements.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 0', fontSize: '13px' }}>📭 Belum ada pengumuman</div>}
            {announcements.map(a => (
              <div key={a.id} style={{ background: '#fff', borderRadius: '16px', padding: '16px', border: '1px solid #e8eef8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '12px', borderLeft: '4px solid #2563eb' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', fontFamily: "'Sora',sans-serif", marginBottom: '4px' }}>{a.title}</div>
                <div style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '10px' }}>📅 {new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div style={{ fontSize: '13px', color: '#475569', lineHeight: 1.8 }}>{a.content}</div>
              </div>
            ))}
          </div>
        )}

        {/* KEGIATAN */}
        {tab === 'kegiatan' && (
          <div>
            {upcoming.length > 0 && (
              <>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', marginBottom: '10px', padding: '0 2px' }}>🎯 Acara Mendatang</div>
                {upcoming.map(a => (
                  <div key={a.id} style={{ background: '#fff', borderRadius: '16px', padding: '16px', display: 'flex', gap: '14px', alignItems: 'flex-start', border: '1px solid #e8eef8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '10px' }}>
                    <div style={{ background: 'linear-gradient(135deg,#1d4ed8,#4338ca)', borderRadius: '14px', padding: '10px 12px', textAlign: 'center', flexShrink: 0, minWidth: '52px', boxShadow: '0 4px 12px rgba(29,78,216,0.3)' }}>
                      <div style={{ fontSize: '20px', fontWeight: '800', color: '#fff', fontFamily: "'Sora',sans-serif", lineHeight: 1 }}>{new Date(a.date).getDate()}</div>
                      <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.8)', marginTop: '2px', fontWeight: '600' }}>{new Date(a.date).toLocaleDateString('id-ID', { month: 'short' })}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', fontFamily: "'Sora',sans-serif" }}>{a.title}</div>
                      {a.description && <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', lineHeight: 1.7 }}>{a.description}</div>}
                    </div>
                  </div>
                ))}
              </>
            )}

            {archived.length > 0 && (
              <>
                <div style={{ fontSize: '13px', fontWeight: '700', color: '#94a3b8', margin: '16px 0 10px 2px' }}>🗂 Arsip Kegiatan</div>
                {archived.map(a => (
                  <div key={a.id} style={{ background: '#f8faff', borderRadius: '16px', padding: '14px', display: 'flex', gap: '12px', alignItems: 'flex-start', border: '1px solid #e8eef8', marginBottom: '8px', opacity: 0.75 }}>
                    <div style={{ background: '#e2e8f0', borderRadius: '12px', padding: '8px 10px', textAlign: 'center', flexShrink: 0, minWidth: '48px' }}>
                      <div style={{ fontSize: '18px', fontWeight: '800', color: '#64748b', fontFamily: "'Sora',sans-serif", lineHeight: 1 }}>{new Date(a.date).getDate()}</div>
                      <div style={{ fontSize: '9px', color: '#94a3b8', marginTop: '2px' }}>{new Date(a.date).toLocaleDateString('id-ID', { month: 'short', year: '2-digit' })}</div>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>{a.title}</div>
                      {a.description && <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '3px' }}>{a.description}</div>}
                    </div>
                  </div>
                ))}
              </>
            )}

            {upcoming.length === 0 && archived.length === 0 && (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 0', fontSize: '13px' }}>📭 Belum ada kegiatan</div>
            )}
          </div>
        )}

        {/* GALERI */}
        {tab === 'galeri' && (
          <div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', fontFamily: "'Sora',sans-serif", marginBottom: '14px' }}>📸 Galeri Kegiatan Kelas</div>
            {gallery.length === 0 && (
              <div style={{ textAlign: 'center', color: '#94a3b8', padding: '60px 0' }}>
                <div style={{ fontSize: '48px', marginBottom: '12px' }}>📷</div>
                <div style={{ fontSize: '13px' }}>Belum ada foto kegiatan</div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
              {gallery.map(g => (
                <div key={g.id} onClick={() => setPreviewImg(g)} style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', border: '1px solid #e8eef8', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', cursor: 'pointer' }}>
                  <div style={{ position: 'relative', paddingTop: '75%' }}>
                    <img src={g.photo_url} alt={g.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=📷'; }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 60%)' }} />
                    {g.event_date && (
                      <div style={{ position: 'absolute', bottom: '8px', left: '8px', background: 'rgba(0,0,0,0.6)', color: '#fff', fontSize: '9px', fontWeight: '700', padding: '3px 8px', borderRadius: '99px', backdropFilter: 'blur(4px)' }}>
                        {new Date(g.event_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: '10px 12px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '700', color: '#1e293b', lineHeight: 1.3 }}>{g.title}</div>
                    {g.description && <div style={{ fontSize: '10px', color: '#64748b', marginTop: '3px', lineHeight: 1.5, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const }}>{g.description}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* Image Preview Modal */}
      {previewImg && (
        <div onClick={() => setPreviewImg(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 200, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <button onClick={() => setPreviewImg(null)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: '#fff', fontSize: '18px', cursor: 'pointer' }}>✕</button>
          <img src={previewImg.photo_url} alt={previewImg.title} style={{ maxWidth: '100%', maxHeight: '72vh', borderRadius: '16px', objectFit: 'contain' }} />
          <div style={{ marginTop: '16px', textAlign: 'center', padding: '0 20px' }}>
            <div style={{ color: '#fff', fontSize: '16px', fontWeight: '700', fontFamily: "'Sora',sans-serif" }}>{previewImg.title}</div>
            {previewImg.description && <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px', marginTop: '6px', lineHeight: 1.6 }}>{previewImg.description}</div>}
            {previewImg.event_date && <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', marginTop: '6px' }}>📅 {new Date(previewImg.event_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>}
          </div>
        </div>
      )}
    </div>
  );
}
