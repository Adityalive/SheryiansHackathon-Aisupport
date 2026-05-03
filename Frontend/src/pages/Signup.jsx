import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Loader2, Zap } from 'lucide-react';

const Signup = () => {
  const navigate = useNavigate();
  const signup = useAuthStore((s) => s.signup);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signup(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during signup');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex">
      {/* Left Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#4338ca] flex-col justify-between p-12">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-[#4338ca]" />
          </div>
          <span className="text-white font-semibold text-lg">SupportAI</span>
        </div>
        <div>
          <h1 className="text-white text-4xl font-bold leading-tight mb-4">
            Get started in<br />minutes
          </h1>
          <p className="text-indigo-200 text-base leading-relaxed">
            Register your business and deploy AI-powered customer support. No credit card required.
          </p>
        </div>
        <div className="space-y-3">
          {['Connect your knowledge base', 'Embed the chat widget', 'Let AI handle support 24/7'].map((step, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-semibold">{i + 1}</div>
              <span className="text-indigo-100 text-sm">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right Form */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-[#4338ca] rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white" />
            </div>
            <span className="text-[#191c1d] font-semibold text-lg">SupportAI</span>
          </div>

          <h2 className="text-2xl font-semibold text-[#191c1d] mb-1">Create an account</h2>
          <p className="text-sm text-[#777586] mb-8">Set up your AI support platform</p>

          {error && (
            <div className="mb-5 px-4 py-3 bg-[#ffdad6] border border-[#ba1a1a]/20 rounded-md text-sm text-[#93000a]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
<div>
              <label className="block text-sm font-medium text-[#464554] mb-1.5" htmlFor="name">
                Your Name (Admin)
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
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
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#777586]">
            Already have an account?{' '}
            <Link to="/login" className="text-[#4338ca] font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
