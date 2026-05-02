import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Zap } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);
  const [formData, setFormData] = useState({ email: '', password: '', tenantSlug: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials or Business ID');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#4338ca] flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-[#4338ca]" />
          </div>
          <span className="text-white font-semibold text-lg">SupportAI</span>
        </div>
        <div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            AI-powered support<br />for your business
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed">
            Automate customer support with AI. Handle chat, voice calls, and tickets — all from one dashboard.
          </p>
        </div>
        <div className="flex gap-6">
          <div className="text-center">
            <div className="text-white text-2xl font-bold">87%</div>
            <div className="text-indigo-200 text-sm">AI Resolution Rate</div>
          </div>
          <div className="text-center">
            <div className="text-white text-2xl font-bold">24/7</div>
            <div className="text-indigo-200 text-sm">Availability</div>
          </div>
          <div className="text-center">
            <div className="text-white text-2xl font-bold">2min</div>
            <div className="text-indigo-200 text-sm">Setup Time</div>
          </div>
        </div>
      </div>

      {/* Right Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-[#4338ca] rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-[#191c1d] font-semibold text-lg">SupportAI</span>
          </div>

          <h2 className="text-2xl font-semibold text-[#191c1d] mb-1">Welcome back</h2>
          <p className="text-sm text-[#777586] mb-8">Sign in to your AI support dashboard</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-md text-sm text-[#93000a]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#464554] mb-1.5" htmlFor="tenantSlug">
                Business ID
              </label>
              <input
                id="tenantSlug"
                name="tenantSlug"
                type="text"
                required
                placeholder="e.g. acme-corp"
                value={formData.tenantSlug}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#464554] mb-1.5" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="admin@acmecorp.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#464554] mb-1.5" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-[#f3f4f5] border border-[#e1e3e4] rounded-md text-sm text-[#191c1d] placeholder:text-[#777586] focus:outline-none focus:border-[#4338ca] transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#4338ca] hover:bg-[#3730a3] text-white text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                'Log In'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#777586]">
            Don't have a business account?{' '}
            <Link to="/signup" className="text-[#4338ca] font-medium hover:underline">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
