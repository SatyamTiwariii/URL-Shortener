import { useState } from 'react';
import toast from 'react-hot-toast';
import {
  FiCopy,
  FiCheck,
  FiTrash2,
  FiExternalLink,
  FiBarChart2,
} from 'react-icons/fi';

export default function UrlCard({ url, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url.shortUrl);
      setCopied(true);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this short link permanently?')) return;
    setDeleting(true);
    await onDelete(url.id);
    setDeleting(false);
  };

  const truncated =
    url.originalUrl.length > 60
      ? url.originalUrl.slice(0, 60) + '…'
      : url.originalUrl;

  return (
    <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* URLs */}
        <div className="flex-1 min-w-0">
          <a
            href={url.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-500 hover:text-slate-700 truncate block"
            title={url.originalUrl}
          >
            {truncated}
          </a>
          <div className="flex items-center gap-2 mt-1.5">
            <a
              href={url.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 font-medium hover:underline text-sm flex items-center gap-1"
            >
              {url.shortUrl}
              <FiExternalLink className="text-xs opacity-60" />
            </a>
            {url.customCode && (
              <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-medium">
                Custom
              </span>
            )}
          </div>
        </div>

        {/* Stats + Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-1.5 text-sm text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">
            <FiBarChart2 className="text-slate-400" />
            <span className="font-medium text-slate-700">{url.clicks}</span>
            <span className="hidden sm:inline">clicks</span>
          </div>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              copied
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
            }`}
          >
            {copied ? <FiCheck /> : <FiCopy />}
            {copied ? 'Copied' : 'Copy'}
          </button>

          <button
            onClick={handleDelete}
            disabled={deleting}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50"
            title="Delete"
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    </div>
  );
}
