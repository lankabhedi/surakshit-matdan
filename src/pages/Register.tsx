import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { registerVoter } from '../utils/auth';

export default function Register() {
  const navigate = useNavigate();
  const setUser = useStore(state => state.setUser);
  
  const [formData, setFormData] = useState({
    aadhaarNumber: '',
    name: '',
    email: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await registerVoter(formData);
    
    if (result.success && result.user) {
      setSuccess(true);
      setTimeout(() => {
        setUser(result.user!);
        navigate('/dashboard');
      }, 1500);
    } else {
      setError(result.error || 'Registration failed');
    }
    
    setLoading(false);
  };

  const inputClasses = "w-full px-4 py-3.5 bg-white/5 border-2 border-white/10 rounded-xl text-white placeholder:text-slate-500 focus:border-primary-500 focus:ring-4 focus:ring-primary-500/10 outline-none transition-all duration-200";

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-accent-500/20 rounded-full blur-[100px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Back Button */}
        <Link 
          to="/" 
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Surakshit Matdan</span>
        </div>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          {!success ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Create Your Account</h2>
                <p className="text-slate-400 text-sm">Register to vote securely</p>
              </div>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                >
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Aadhaar Number *</label>
                  <input
                    type="text"
                    value={formData.aadhaarNumber}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      aadhaarNumber: e.target.value.replace(/\D/g, '').slice(0, 12) 
                    })}
                    placeholder="12-digit Aadhaar"
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="As per Aadhaar"
                    className={inputClasses}
                    required
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Mobile Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      phone: e.target.value.replace(/\D/g, '').slice(0, 10) 
                    })}
                    placeholder="10-digit mobile"
                    className={inputClasses}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || formData.aadhaarNumber.length !== 12 || formData.name.length < 2}
                  className="btn-primary w-full mt-6"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Create Account'}
                </button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
              <p className="text-slate-400">Redirecting to dashboard...</p>
            </motion.div>
          )}

          <p className="mt-8 text-center text-slate-400">
            Already registered?{' '}
            <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
