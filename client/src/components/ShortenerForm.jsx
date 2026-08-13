import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiLink2, FiEdit3 } from 'react-icons/fi';
import PulseLoader from 'react-spinners/PulseLoader';

export default function ShortenerForm({ onSuccess }) {
  const { authFetch } = useAuth();
  const [url, setUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);
    try {
      const body = { url: url.trim() };
      if (customCode.trim()) {
        body.customCode = customCode.trim();
      }

      const res = await authFetch('/api/urls', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || 'Failed to shorten URL');
        return;
      }

      toast.success(data.message || 'Short link created!');
      onSuccess(data.data);
      setUrl('');
      setCustomCode('');
      setShowCustom(false);
    } catch {
      toast.error('Unable to reach server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Long URL
          </label>
          <div className="relative">
            <FiLink2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/very/long/url"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
            />
          </div>
        </div>

        {showCustom && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Custom short code (optional)
            </label>
            <div className="relative">
              <FiEdit3 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="my-brand (3-20 chars)"
                maxLength={20}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition text-sm"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Letters, numbers, hyphens and underscores only
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading ? (
              <PulseLoader color="white" size={10} />
            ) : (
              'Shorten URL'
            )}
          </button>

          <button
            type="button"
            onClick={() => setShowCustom(!showCustom)}
            className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium transition text-sm"
          >
            {showCustom ? 'Hide custom code' : 'Add custom code'}
          </button>
        </div>
      </form>
    </div>
  );
}
