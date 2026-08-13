import { Link } from 'react-router-dom';
import { FiLink, FiZap, FiBarChart2, FiShield } from 'react-icons/fi';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Nav */}
      <header className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-lg">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <FiLink className="text-white text-sm" />
          </div>
          Shortly
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition"
          >
            Sign in
          </Link>
          <Link
            to="/register"
            className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-4 pt-16 pb-20 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
          Short links that
          <span className="text-indigo-600"> work harder</span>
        </h1>
        <p className="mt-5 text-lg text-slate-500 max-w-2xl mx-auto">
          Create branded short URLs, track every click, and manage everything
          from a clean dashboard. Free and simple.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/register"
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-3 rounded-xl transition text-base"
          >
            Start for free
          </Link>
          <Link
            to="/login"
            className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-8 py-3 rounded-xl transition text-base"
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<FiZap className="text-indigo-600 text-xl" />}
            title="Lightning fast"
            desc="Shorten any URL in under a second. Custom codes supported."
          />
          <FeatureCard
            icon={<FiBarChart2 className="text-emerald-600 text-xl" />}
            title="Click analytics"
            desc="See exactly how many times each link was clicked."
          />
          <FeatureCard
            icon={<FiShield className="text-violet-600 text-xl" />}
            title="Your links, your control"
            desc="Secure accounts. Only you can manage and delete your links."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8 text-center text-sm text-slate-400">
        Built as an intermediate full-stack project · Shortly
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
      <div className="w-11 h-11 rounded-xl bg-slate-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
    </div>
  );
}
