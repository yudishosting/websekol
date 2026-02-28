'use client';

import { useEffect, useState } from 'react';

interface Schedule {
  id: number;
  day: string;
  start_time: string;
  end_time: string;
  subject: string;
}

interface Subject {
  id: number;
  name: string;
}

const days = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

export default function AdminSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ subject_id: '', day: 'Senin', start_time: '08:00', end_time: '09:00' });
  const [loading, setLoading] = useState(false);

  const fetchData = () => {
    fetch('/api/schedules').then(r => r.json()).then(setSchedules);
    fetch('/api/subjects').then(r => r.json()).then(setSubjects);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setShowModal(false);
    fetchData();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus jadwal ini?')) return;
    await fetch('/api/schedules', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchData();
  };

  // Group by time slots
  const timeSlots = ['08:00', '09:00', '10:00', '11:00', '13:00'];

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 font-display">Jadwal Pelajaran</h1>
          <p className="text-slate-500 mt-1">Kelola jadwal mata pelajaran</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 shadow-lg shadow-blue-200"
        >
          <span>+</span> Tambah Jadwal
        </button>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="text-left px-6 py-4 text-slate-500 font-semibold">Jam</th>
              {days.map(d => (
                <th key={d} className="text-left px-6 py-4 text-slate-500 font-semibold">{d}</th>
              ))}
              <th className="text-left px-6 py-4 text-slate-500 font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-orange-50 bg-orange-50/50">
              <td className="px-6 py-3 font-medium text-orange-600">11:00 - 13:00</td>
              {days.map(d => (
                <td key={d} className="px-6 py-3 text-orange-400 font-medium">ISTIRAHAT</td>
              ))}
              <td className="px-6 py-3"></td>
            </tr>
            {schedules.map((s) => (
              <tr key={s.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                <td className="px-6 py-3 font-mono text-xs text-slate-500">{s.start_time} - {s.end_time}</td>
                <td className={`px-6 py-3 font-medium ${s.day === 'Senin' ? 'text-slate-800' : 'text-transparent'}`}>
                  {s.day === 'Senin' ? s.subject : ''}
                </td>
                {days.filter(d => d !== 'Senin').map(d => (
                  <td key={d} className="px-6 py-3">
                    {s.day === d ? <span className="text-slate-800 font-medium">{s.subject}</span> : <span className="text-slate-300">—</span>}
                  </td>
                ))}
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="bg-red-100 hover:bg-red-200 text-red-600 px-2 py-1 rounded-lg text-xs font-semibold transition"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-lg font-bold text-slate-800 font-display mb-5">Tambah Jadwal</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
                <select
                  value={form.subject_id}
                  onChange={e => setForm({ ...form, subject_id: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  <option value="">Pilih mata pelajaran...</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Hari</label>
                <select
                  value={form.day}
                  onChange={e => setForm({ ...form, day: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {days.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jam Mulai</label>
                  <input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jam Selesai</label>
                  <input type="time" value={form.end_time} onChange={e => setForm({ ...form, end_time: e.target.value })} required
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"/>
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 font-medium text-sm hover:bg-slate-50 transition">
                  Batal
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-2.5 font-medium text-sm transition disabled:opacity-60">
                  {loading ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
