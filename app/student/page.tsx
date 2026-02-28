'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
  const [className] = useState('Kelas 9A');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/students').then(r => r.json()).then(setStudents);
    fetch('/api/schedules').then(r => r.json()).then(setSchedules);
    fetch('/api/announcements').then(r => r.json()).then(setAnnouncements);
    fetch('/api/activities').then(r => r.json()).then(setActivities);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.nis.includes(search)
  );

  const ketua = students.find(s => s.position === 'Ketua');
  const sekretaris = students.find(s => s.position === 'Sekretaris');
  const bendahara = students.find(s => s.position === 'Bendahara');

  const getScheduleForDay = (day: string) => {
    return schedules.filter(s => s.day === day);
  };

  const allTimes = [...new Set(schedules.map(s => s.start_time))].sort();

  const tabs: { key: Tab; label: string }[] = [
    { key: 'ringkasan', label: 'Ringkasan' },
    { key: 'siswa', label: 'Siswa' },
    { key: 'jadwal', label: 'Jadwal' },
    { key: 'pengumuman', label: 'Pengumuman' },
    { key: 'kegiatan', label: 'Kegiatan' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 pb-20">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
              🎓
            </div>
            <div>
              <h1 className="text-xl font-bold font-display">{className}</h1>
              <p className="text-blue-200 text-sm">SMPN 1 · Tahun Ajaran 2025/2026</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-blue-200 hover:text-white text-sm transition"
          >
            Keluar →
          </button>
        </div>
      </div>

      {/* Card container */}
      <div className="max-w-2xl mx-auto px-4 -mt-12 pb-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-slate-100 overflow-x-auto">
            {tabs.map(t => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex-shrink-0 px-5 py-4 text-sm font-semibold transition
                  ${tab === t.key
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                    : 'text-slate-500 hover:text-slate-700'}`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {tab === 'ringkasan' && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 font-display mb-4">Pengurus Kelas</h2>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[ketua, sekretaris, bendahara].filter(Boolean).map((s) => s && (
                    <div key={s.id} className="text-center">
                      <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden mb-2"
                        style={{ background: positionColor[s.position] + '20', border: `2px solid ${positionColor[s.position]}` }}>
                        {s.photo_url ? (
                          <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold"
                            style={{ color: positionColor[s.position] }}>
                            {s.name[0]}
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-slate-800 text-sm">{s.name}</p>
                      <p className="text-xs" style={{ color: positionColor[s.position] }}>{s.position}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 rounded-2xl p-4">
                    <p className="text-2xl font-bold text-blue-600 font-display">{students.length}</p>
                    <p className="text-sm text-slate-600 mt-1">Total Siswa</p>
                  </div>
                  <div className="bg-purple-50 rounded-2xl p-4">
                    <p className="text-2xl font-bold text-purple-600 font-display">{announcements.length}</p>
                    <p className="text-sm text-slate-600 mt-1">Pengumuman</p>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-4">
                    <p className="text-2xl font-bold text-emerald-600 font-display">{schedules.length}</p>
                    <p className="text-sm text-slate-600 mt-1">Jadwal Aktif</p>
                  </div>
                  <div className="bg-orange-50 rounded-2xl p-4">
                    <p className="text-2xl font-bold text-orange-600 font-display">{activities.length}</p>
                    <p className="text-sm text-slate-600 mt-1">Kegiatan</p>
                  </div>
                </div>
              </div>
            )}

            {tab === 'siswa' && (
              <div>
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cari siswa..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filteredStudents.map(s => (
                    <div key={s.id} className="student-card bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 text-center border border-blue-100 cursor-pointer">
                      <div className="w-16 h-16 mx-auto rounded-2xl overflow-hidden mb-3"
                        style={{ background: positionColor[s.position] + '20' }}>
                        {s.photo_url ? (
                          <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl font-bold"
                            style={{ color: positionColor[s.position] }}>
                            {s.name[0]}
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-slate-800 text-sm leading-tight">{s.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">NIS: {s.nis}</p>
                      <span className="inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
                        style={{ background: positionColor[s.position] }}>
                        {s.position}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === 'jadwal' && (
              <div>
                <h2 className="text-lg font-bold text-slate-800 font-display mb-4">Jadwal Pelajaran</h2>
                <div className="overflow-auto rounded-xl border border-slate-100">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                        <th className="text-left px-4 py-3 rounded-tl-xl font-semibold">Jam</th>
                        {days.map(d => (
                          <th key={d} className="text-left px-4 py-3 font-semibold">{d}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="bg-orange-50 border-b border-orange-100">
                        <td className="px-4 py-3 font-mono text-xs text-orange-600">11:00 - 13:00</td>
                        {days.map(d => (
                          <td key={d} className="px-4 py-3 text-orange-400 font-semibold text-xs">ISTIRAHAT</td>
                        ))}
                      </tr>
                      {allTimes.map(time => {
                        const slots = schedules.filter(s => s.start_time === time);
                        return (
                          <tr key={time} className="border-b border-slate-50">
                            <td className="px-4 py-3 font-mono text-xs text-slate-500 whitespace-nowrap">
                              {time} - {slots[0]?.end_time || ''}
                            </td>
                            {days.map(day => {
                              const s = slots.find(sc => sc.day === day);
                              return (
                                <td key={day} className="px-4 py-3 text-slate-700 text-xs">
                                  {s ? s.subject : <span className="text-slate-300">—</span>}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {tab === 'pengumuman' && (
              <div className="space-y-4">
                {announcements.length === 0 && (
                  <div className="text-center py-12 text-slate-400">Belum ada pengumuman.</div>
                )}
                {announcements.map(a => (
                  <div key={a.id} className="border border-slate-100 rounded-2xl p-5">
                    <h3 className="font-semibold text-slate-800 font-display">{a.title}</h3>
                    <p className="text-xs text-slate-400 mt-1 mb-3">
                      {new Date(a.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <p className="text-slate-600 text-sm leading-relaxed">{a.content}</p>
                  </div>
                ))}
              </div>
            )}

            {tab === 'kegiatan' && (
              <div className="space-y-4">
                {activities.length === 0 && (
                  <div className="text-center py-12 text-slate-400">Belum ada kegiatan.</div>
                )}
                {activities.map(a => (
                  <div key={a.id} className="border border-slate-100 rounded-2xl p-5 flex gap-4">
                    <div className="flex-shrink-0 bg-blue-50 rounded-xl p-3 text-center min-w-[60px]">
                      <div className="text-2xl font-bold text-blue-600 font-display">
                        {new Date(a.date).getDate()}
                      </div>
                      <div className="text-xs text-slate-500">
                        {new Date(a.date).toLocaleDateString('id-ID', { month: 'short' })}
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-800 font-display">{a.title}</h3>
                      {a.description && (
                        <p className="text-slate-500 text-sm mt-1">{a.description}</p>
                      )}
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
