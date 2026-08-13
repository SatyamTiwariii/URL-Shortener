import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import ShortenerForm from '../components/ShortenerForm';
import UrlCard from '../components/UrlCard';
import Navbar from '../components/Navbar';
import { FiLink, FiBarChart2 } from 'react-icons/fi';

export default function Dashboard() {
  const { authFetch, user } = useAuth();
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, totalClicks: 0 });

  const fetchUrls = useCallback(async () => {
    try {
      const res = await authFetch('/api/urls');
      const data = await res.json();

      if (res.ok) {
        setUrls(data.data);
        const totalClicks = data.data.reduce((sum, u) => sum + u.clicks, 0);
        setStats({ total: data.count, totalClicks });
      } else {
        toast.error(data.message || 'Failed to load links');
      }
    } catch {
      toast.error('Unable to reach server');
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchUrls();
  }, [fetchUrls]);

  const handleNewLink = (newLink) => {
    setUrls((prev) => [newLink, ...prev]);
    setStats((prev) => ({
      total: prev.total + 1,
      totalClicks: prev.totalClicks,
    }));
  };

  const handleDelete = async (id) => {
    try {
      const res = await authFetch(`/api/urls/${id}`, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok) {
        const deleted = urls.find((u) => u.id === id);
        setUrls((prev) => prev.filter((u) => u.id !== id));
        setStats((prev) => ({
          total: prev.total - 1,
          totalClicks: prev.totalClicks - (deleted?.clicks || 0),
        }));
        toast.success('Link deleted');
      } else {
        toast.error(data.message || 'Failed to delete');
      }
    } catch {
      toast.error('Server error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Welcome + Stats */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
            Hello, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 mt-1">Manage and track your short links</p>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
                  <FiLink className="text-indigo-600 text-lg" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Links</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border border-slate-100 p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <FiBarChart2 className="text-emerald-600 text-lg" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">Total Clicks</p>
                  <p className="text-2xl font-bold text-slate-800">{stats.totalClicks}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shortener Form */}
        <ShortenerForm onSuccess={handleNewLink} />

        {/* Links List */}
        <section className="mt-10">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Your Links</h2>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-100 p-5 animate-pulse h-24"
                />
              ))}
            </div>
          ) : urls.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-slate-200 p-12 text-center">
              <FiLink className="mx-auto text-4xl text-slate-300 mb-3" />
              <p className="text-slate-500">No short links yet</p>
              <p className="text-sm text-slate-400 mt-1">
                Paste a long URL above to get started
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {urls.map((url) => (
                <UrlCard key={url.id} url={url} onDelete={handleDelete} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
