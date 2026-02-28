'use client';

import { useEffect, useState, useRef } from 'react';

interface Activity {
  id: number;
  title: string;
  description: string;
  date: string;
  photo_url: string | null;
  author: string;
}

export default function WaliKelasPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', date: '' });
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const fetchActivities = () => {
    fetch('/api/activities').then(r => r.json()).then(setActivities);
  };

  useEffect(() => { fetchActivities(); }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/activities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, photo_url: photoPreview }),
    });
    setLoading(false);
    setShowModal(false);
    setForm({ title: '', description: '', date: '' });
    setPhotoPreview(null);
    fetchActivities();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Hapus kegiatan ini?')) return;
    await fetch('/api/activities', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchActivities();
  };

  const resetModal = () => {
    setShowModal(false);
    setForm({ title: '', description: '', date: '' });
    setPhotoPreview(null);
  };

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Kegiatan Kelas</h2>
            <p className="text-slate-500 mt-1">Kelola dan dokumentasikan kegiatan kelas</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 shadow-lg shadow-emerald-200"
          >
            <span>+</span> Tambah Kegiatan
          </button>
        </div>
        <div className="mt-4 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-emerald-700 flex items-center gap-2">
          <span>📋</span>
          <span>Sebagai wali kelas, Anda hanya dapat mengelola <strong>Kegiatan Kelas</strong>.</span>
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid gap-5 sm:grid-cols-2">
        {activities.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 flex flex-col">
            {/* Photo */}
            {item.photo_url ? (
              <div className="h-44 w-full overflow-hidden bg-slate-100">
                <img
                  src={item.photo_url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="h-32 w-full bg-gradient-to-br from-emerald-50 to-teal-100 flex items-center justify-center text-4xl">
                📅
              </div>
            )}

            {/* Content */}
            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block mb-2">
                    {new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </div>
                  <h3 className="font-bold text-slate-800">{item.title}</h3>
                  {item.description && (
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">{item.description}</p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="ml-1 flex-shrink-0 bg-red-50 hover:bg-red-100 text-red-500 p-2 rounded-lg transition text-xs"
                  title="Hapus kegiatan"
                >
                  🗑️
                </button>
              </div>
              <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-50">
                Dibuat oleh: {item.author}
              </p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="col-span-2 bg-white rounded-2xl p-16 text-center border border-slate-100">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-slate-400 font-medium">Belum ada kegiatan kelas.</p>
            <p className="text-slate-300 text-sm mt-1">Klik "Tambah Kegiatan" untuk memulai.</p>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold text-slate-800 mb-5">Tambah Kegiatan Kelas</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kegiatan <span className="text-red-400">*</span></label>
                <input
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="Contoh: Kerja Bakti Kelas, Rapat OSIS..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal <span className="text-red-400">*</span></label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Deskripsi</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  rows={3}
                  placeholder="Ceritakan kegiatan ini..."
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 resize-none"
                />
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Foto Dokumentasi</label>
                <div
                  className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center cursor-pointer hover:border-emerald-300 hover:bg-emerald-50/50 transition"
                  onClick={() => fileRef.current?.click()}
                >
                  {photoPreview ? (
                    <div className="relative">
                      <img src={photoPreview} alt="Preview" className="w-full h-40 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={(ev) => { ev.stopPropagation(); setPhotoPreview(null); if (fileRef.current) fileRef.current.value = ''; }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="text-3xl mb-2">{uploading ? '⏳' : '📷'}</div>
                      <p className="text-sm text-slate-500">{uploading ? 'Memproses...' : 'Klik untuk pilih foto'}</p>
                      <p className="text-xs text-slate-400 mt-1">JPG, PNG, WebP (max ~5MB)</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={resetModal}
                  className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-2.5 font-medium text-sm hover:bg-slate-50 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl py-2.5 font-medium text-sm transition disabled:opacity-60"
                >
                  {loading ? 'Menyimpan...' : 'Simpan Kegiatan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
