'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Tab = 'ringkasan' | 'siswa' | 'jadwal' | 'pengumuman' | 'kegiatan';

interface Student {
  id: number;
  name: string;
  nis: string;
  position: string;
  photo_url: string | null;
}

interface Schedule {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  subject: string;
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  author: string;
  created_at: string;
}

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
}

const positionColor: Record<string, string> = {
  Ketua: '#3b82f6',
  Sekretaris: '#8b5cf6',
  Bendahara: '#f59e0b',
  Anggota: '#10b981',
};

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function StudentPage() {
  const [tab, setTab] = useState<Tab>('ringkasan');
  const [students, setStudents] = useState<Student[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [search, setSearch] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/students').then(r => r.json()).then(d => Array.isArray(d) ? setStudents(d) : null);
    fetch('/api/schedules').then(r => r.json()).then(d => Array.isArray(d) ? setSchedules(d) : null);
    fetch('/api/announcements').then(r => r.json()).then(d => Array.isArray(d) ? setAnnouncements(d) : null);
    fetch('/api/activities').then(r => r.json()).then(d => Array.isArray(d) ? setActivities(d) : null);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.nis.includes(search)
  );

  const pengurus = students.filter(s => ['Ketua','Sekretaris','Bendahara'].includes(s.position));
  const allTimes = Array.from(new Set<string>(schedules.map(s => s.start_time))).sort();

  const tabs: { key: Tab; label: string }[] = [
    { key: 'ringkasan', label: 'Ringkasan' },
    { key: 'siswa', label: 'Siswa' },
    { key: 'jadwal', label: 'Jadwal' },
    { key: 'pengumuman', label: 'Pengumuman' },
    { key: 'kegiatan', label: 'Kegiatan' },
  ];

  return (
    <div style={{minHeight:'100vh',background:'linear-gradient(160deg,#0f172a 0%,#1e3a8a 60%,#312e81 100%)',fontFamily:"'Plus Jakarta Sans',sans-serif"}}>
      {/* Header */}
      <div style={{background:'linear-gradient(90deg,#1d4ed8,#4338ca)',padding:'20px 20px 50px'}}>
        <div style={{maxWidth:'600px',margin:'0 auto',display:'flex',alignItems:'center',justifyContent:'space-between'}}>
          <div style={{display:'flex',alignItems:'center',gap:'12px'}}>
            <div style={{width:'46px',height:'46px',background:'rgba(255,255,255,0.15)',borderRadius:'14px',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'22px',flexShrink:0}}>🎓</div>
            <div>
              <div style={{color:'#fff',fontSize:'18px',fontWeight:'800',fontFamily:"'Sora',sans-serif",lineHeight:1.2}}>XI TSM 2</div>
              <div style={{color:'#93c5fd',fontSize:'11px',marginTop:'2px'}}>SMKN 2 Jember · 2025/2026</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{background:'rgba(255,255,255,0.1)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'10px',padding:'6px 14px',color:'#93c5fd',fontSize:'12px',cursor:'pointer',fontFamily:'inherit'}}>
            Keluar
          </button>
        </div>
      </div>

      {/* Main card */}
      <div style={{maxWidth:'600px',margin:'-28px auto 0',padding:'0 16px 32px'}}>
        <div style={{background:'#fff',borderRadius:'24px',boxShadow:'0 20px 60px rgba(0,0,0,0.3)',overflow:'hidden'}}>
          {/* Tabs */}
          <div style={{display:'flex',borderBottom:'1px solid #f1f5f9',overflowX:'auto'}}>
            {tabs.map(t => (
              <button key={t.key} onClick={() => setTab(t.key)} style={{
                flexShrink:0,padding:'14px 18px',fontSize:'12px',fontWeight:'600',border:'none',
                background: tab === t.key ? '#eff6ff' : 'transparent',
                color: tab === t.key ? '#2563eb' : '#94a3b8',
                borderBottom: tab === t.key ? '2px solid #2563eb' : '2px solid transparent',
                cursor:'pointer',fontFamily:'inherit',transition:'all .2s',
              }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div style={{padding:'20px'}}>

            {/* RINGKASAN */}
            {tab === 'ringkasan' && (
              <div>
                <div style={{fontSize:'14px',fontWeight:'700',color:'#1e293b',marginBottom:'16px',fontFamily:"'Sora',sans-serif"}}>Pengurus Kelas</div>
                {pengurus.length === 0 ? (
                  <div style={{textAlign:'center',color:'#94a3b8',fontSize:'13px',padding:'20px 0'}}>Belum ada pengurus kelas</div>
                ) : (
                  <div style={{display:'grid',gridTemplateColumns:`repeat(${Math.min(pengurus.length,3)},1fr)`,gap:'12px',marginBottom:'20px'}}>
                    {pengurus.map(s => (
                      <div key={s.id} style={{textAlign:'center'}}>
                        <div style={{
                          width:'56px',height:'56px',borderRadius:'16px',margin:'0 auto 8px',
                          background: positionColor[s.position] + '20',
                          border: `2px solid ${positionColor[s.position]}`,
                          display:'flex',alignItems:'center',justifyContent:'center',
                          fontSize:'22px',fontWeight:'800',color: positionColor[s.position],
                          overflow:'hidden',
                        }}>
                          {s.photo_url ? <img src={s.photo_url} alt={s.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : s.name[0]}
                        </div>
                        <div style={{fontSize:'12px',fontWeight:'700',color:'#1e293b',lineHeight:1.3}}>{s.name}</div>
                        <div style={{fontSize:'10px',fontWeight:'600',color: positionColor[s.position],marginTop:'2px'}}>{s.position}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                  {[
                    {n: students.length, l: 'Total Siswa', bg:'#eff6ff', c:'#2563eb'},
                    {n: announcements.length, l: 'Pengumuman', bg:'#f5f3ff', c:'#6d28d9'},
                    {n: schedules.length, l: 'Jadwal Aktif', bg:'#ecfdf5', c:'#059669'},
                    {n: activities.length, l: 'Kegiatan', bg:'#fffbeb', c:'#b45309'},
                  ].map(item => (
                    <div key={item.l} style={{background:item.bg,borderRadius:'16px',padding:'16px',textAlign:'center'}}>
                      <div style={{fontSize:'28px',fontWeight:'800',color:item.c,fontFamily:"'Sora',sans-serif"}}>{item.n}</div>
                      <div style={{fontSize:'11px',color:'#64748b',marginTop:'4px'}}>{item.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SISWA */}
            {tab === 'siswa' && (
              <div>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍  Cari nama atau NIS..."
                  style={{width:'100%',border:'1.5px solid #e2e8f0',borderRadius:'12px',padding:'10px 14px',fontSize:'13px',fontFamily:'inherit',outline:'none',marginBottom:'14px',boxSizing:'border-box'}}/>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'10px'}}>
                  {filteredStudents.map(s => (
                    <div key={s.id} style={{background:'linear-gradient(135deg,#eff6ff,#eef2ff)',borderRadius:'16px',padding:'14px',textAlign:'center',border:'1px solid #c7d2fe'}}>
                      <div style={{width:'48px',height:'48px',borderRadius:'14px',margin:'0 auto 8px',background: positionColor[s.position]+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'20px',fontWeight:'800',color:positionColor[s.position],overflow:'hidden'}}>
                        {s.photo_url ? <img src={s.photo_url} alt={s.name} style={{width:'100%',height:'100%',objectFit:'cover'}}/> : s.name[0]}
                      </div>
                      <div style={{fontSize:'12px',fontWeight:'700',color:'#1e293b',lineHeight:1.3}}>{s.name}</div>
                      <div style={{fontSize:'10px',color:'#94a3b8',margin:'2px 0'}}>NIS: {s.nis}</div>
                      <span style={{display:'inline-block',background:positionColor[s.position],color:'#fff',fontSize:'9px',fontWeight:'700',padding:'2px 8px',borderRadius:'99px',marginTop:'4px'}}>{s.position}</span>
                    </div>
                  ))}
                  {filteredStudents.length === 0 && <div style={{gridColumn:'span 2',textAlign:'center',color:'#94a3b8',padding:'20px',fontSize:'13px'}}>Tidak ada siswa ditemukan</div>}
                </div>
              </div>
            )}

            {/* JADWAL */}
            {tab === 'jadwal' && (
              <div>
                <div style={{fontSize:'14px',fontWeight:'700',color:'#1e293b',marginBottom:'14px',fontFamily:"'Sora',sans-serif"}}>Jadwal Pelajaran</div>
                <div style={{overflowX:'auto',borderRadius:'14px',border:'1px solid #e2e8f0'}}>
                  <table style={{width:'100%',borderCollapse:'collapse',fontSize:'10px',minWidth:'360px'}}>
                    <thead>
                      <tr style={{background:'linear-gradient(90deg,#1d4ed8,#4338ca)',color:'#fff'}}>
                        <th style={{padding:'10px 8px',textAlign:'left',fontWeight:'700',whiteSpace:'nowrap'}}>Jam</th>
                        {days.map(d => <th key={d} style={{padding:'10px 6px',fontWeight:'700'}}>{d}</th>)}
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{background:'#fff7ed',borderBottom:'1px solid #fed7aa'}}>
                        <td style={{padding:'8px',color:'#b45309',fontFamily:'monospace',fontSize:'9px',whiteSpace:'nowrap'}}>11:00-13:00</td>
                        <td colSpan={5} style={{padding:'8px',textAlign:'center',color:'#b45309',fontWeight:'700',fontSize:'10px'}}>☀️ ISTIRAHAT</td>
                      </tr>
                      {allTimes.map(time => {
                        const slots = schedules.filter(s => s.start_time === time);
                        return (
                          <tr key={time} style={{borderBottom:'1px solid #f1f5f9'}}>
                            <td style={{padding:'8px',fontFamily:'monospace',fontSize:'9px',color:'#94a3b8',whiteSpace:'nowrap'}}>{time}-{slots[0]?.end_time}</td>
                            {days.map(day => {
                              const s = slots.find(sc => sc.day === day);
                              return <td key={day} style={{padding:'8px 6px',color: s ? '#1e293b' : '#cbd5e1',fontSize:'10px',textAlign:'center'}}>{s ? s.subject : '—'}</td>;
                            })}
                          </tr>
                        );
                      })}
                      {allTimes.length === 0 && <tr><td colSpan={6} style={{padding:'20px',textAlign:'center',color:'#94a3b8'}}>Belum ada jadwal</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* PENGUMUMAN */}
            {tab === 'pengumuman' && (
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                {announcements.length === 0 && <div style={{textAlign:'center',color:'#94a3b8',padding:'40px 0',fontSize:'13px'}}>Belum ada pengumuman</div>}
                {announcements.map(a => (
                  <div key={a.id} style={{border:'1px solid #e2e8f0',borderRadius:'16px',padding:'16px'}}>
                    <div style={{fontSize:'14px',fontWeight:'700',color:'#1e293b',fontFamily:"'Sora',sans-serif"}}>{a.title}</div>
                    <div style={{fontSize:'10px',color:'#94a3b8',margin:'4px 0 10px'}}>
                      {new Date(a.created_at).toLocaleDateString('id-ID',{day:'numeric',month:'long',year:'numeric'})}
                    </div>
                    <div style={{fontSize:'13px',color:'#64748b',lineHeight:1.7}}>{a.content}</div>
                  </div>
                ))}
              </div>
            )}

            {/* KEGIATAN */}
            {tab === 'kegiatan' && (
              <div style={{display:'flex',flexDirection:'column',gap:'12px'}}>
                {activities.length === 0 && <div style={{textAlign:'center',color:'#94a3b8',padding:'40px 0',fontSize:'13px'}}>Belum ada kegiatan</div>}
                {activities.map(a => (
                  <div key={a.id} style={{display:'flex',gap:'14px',border:'1px solid #e2e8f0',borderRadius:'16px',padding:'16px',alignItems:'flex-start'}}>
                    <div style={{background:'#eff6ff',borderRadius:'14px',padding:'10px 14px',textAlign:'center',flexShrink:0,minWidth:'52px'}}>
                      <div style={{fontSize:'22px',fontWeight:'800',color:'#2563eb',fontFamily:"'Sora',sans-serif",lineHeight:1}}>{new Date(a.date).getDate()}</div>
                      <div style={{fontSize:'9px',color:'#64748b',marginTop:'2px'}}>{new Date(a.date).toLocaleDateString('id-ID',{month:'short'})}</div>
                    </div>
                    <div>
                      <div style={{fontSize:'13px',fontWeight:'700',color:'#1e293b',fontFamily:"'Sora',sans-serif"}}>{a.title}</div>
                      {a.description && <div style={{fontSize:'12px',color:'#64748b',marginTop:'4px',lineHeight:1.6}}>{a.description}</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
