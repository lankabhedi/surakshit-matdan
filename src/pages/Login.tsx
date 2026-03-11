import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, 
  Loader2, 
  Fingerprint, 
  Eye, 
  EyeOff,
  Wallet,
  CheckCircle2,
  ArrowLeft,
  Smartphone
} from 'lucide-react';
import { useStore } from '../store/useStore';
import { authenticateWithAadhaar, verifyOTP, verifyBiometric } from '../utils/auth';
import { blockchainService } from '../utils/blockchain';
import type { AuthStep } from '../types';

const steps: { key: AuthStep; title: string; icon: React.ElementType }[] = [
  { key: 'aadhaar', title: 'Aadhaar', icon: Shield },
  { key: 'otp', title: 'OTP', icon: Smartphone },
  { key: 'biometric', title: 'Biometric', icon: Fingerprint },
  { key: 'wallet', title: 'Wallet', icon: Wallet },
];

export default function Login() {
  const navigate = useNavigate();
  const setUser = useStore(state => state.setUser);
  
  const [step, setStep] = useState<AuthStep>('aadhaar');
  const [aadhaar, setAadhaar] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userData, setUserData] = useState<{ aadhaarNumber: string; name: string } | null>(null);

  const currentStepIndex = steps.findIndex(s => s.key === step);

  const handleAadhaarSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await authenticateWithAadhaar(aadhaar);
    
    if (result.success && result.user) {
      setUserData({ aadhaarNumber: aadhaar, name: result.user.name });
      setStep('otp');
    } else {
      setError(result.error || 'Authentication failed');
    }
    
    setLoading(false);
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await verifyOTP(otp);
    
    if (result.success) {
      setStep('biometric');
    } else {
      setError(result.error || 'Invalid OTP');
    }
    
    setLoading(false);
  };

  const handleBiometricSubmit = async () => {
    setError('');
    setLoading(true);

    const result = await verifyBiometric();
    
    if (result.success) {
      setStep('wallet');
    } else {
      setError(result.error || 'Biometric verification failed');
    }
    
    setLoading(false);
  };

  const handleWalletConnect = async () => {
    setError('');
    setLoading(true);

    try {
      await blockchainService.connect();
      const result = await authenticateWithAadhaar(aadhaar);
      
      if (result.success && result.user) {
        setUser(result.user);
        navigate(result.user.role === 'admin' ? '/admin' : '/dashboard');
      } else {
        setError('Authentication failed');
      }
    } catch {
      setError('Failed to connect wallet');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen hero-gradient flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary-500/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-accent-500/20 rounded-full blur-[80px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        {/* Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3 justify-center mb-8"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">Surakshit Matdan</span>
        </Link>

        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {steps.map((s, index) => (
              <div key={s.key} className="flex items-center">
                <div 
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index < currentStepIndex 
                      ? 'bg-accent-500 text-white' 
                      : index === currentStepIndex 
                        ? 'bg-primary-500 text-white ring-4 ring-primary-500/30'
                        : 'bg-white/10 text-slate-400'
                  }`}
                >
                  {index < currentStepIndex ? (
                    <CheckCircle2 size={18} />
                  ) : (
                    <s.icon size={18} />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={`w-8 h-0.5 mx-1 transition-all duration-300 ${
                      index < currentStepIndex ? 'bg-accent-500' : 'bg-white/10'
                    }`} 
                  />
                )}
              </div>
            ))}
          </div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {step === 'aadhaar' && 'Enter Your Aadhaar'}
              {step === 'otp' && 'Verify with OTP'}
              {step === 'biometric' && 'Biometric Verification'}
              {step === 'wallet' && 'Connect Wallet'}
            </h2>
            <p className="text-slate-400 text-sm">
              {step === 'aadhaar' && 'Enter your 12-digit Aadhaar number'}
              {step === 'otp' && 'Enter the 6-digit code sent to your mobile'}
              {step === 'biometric' && 'Place your finger on scanner'}
              {step === 'wallet' && 'Connect your wallet to verify'}
            </p>
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step Forms */}
          <AnimatePresence mode="wait">
            {step === 'aadhaar' && (
              <motion.form
                key="aadhaar"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleAadhaarSubmit}
              >
                <div className="mb-6">
                  <input
                    type="text"
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, '').slice(0, 12))}
                    placeholder="Enter 12-digit Aadhaar Number"
                    className="input-field text-center text-lg tracking-widest"
                    required
                  />
                  <p className="text-center text-slate-500 text-xs mt-2">
                    Demo: Use 123456789012
                  </p>
                </div>
                <button 
                  type="submit" 
                  disabled={loading || aadhaar.length !== 12}
                  className="btn-primary w-full"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Continue'}
                </button>
              </motion.form>
            )}

            {step === 'otp' && userData && (
              <motion.form
                key="otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onSubmit={handleOTPSubmit}
              >
                <div className="mb-6 relative">
                  <input
                    type={showOtp ? 'text' : 'password'}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="Enter 6-digit OTP"
                    className="input-field text-center text-lg tracking-widest pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowOtp(!showOtp)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showOtp ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  <p className="text-center text-slate-500 text-xs mt-2">
                    Demo OTP: 123456
                  </p>
                </div>
                <button 
                  type="submit" 
                  disabled={loading || otp.length !== 6}
                  className="btn-primary w-full"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Verify OTP'}
                </button>
              </motion.form>
            )}

            {step === 'biometric' && (
              <motion.div
                key="biometric"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
                  <Fingerprint className="w-12 h-12 text-white" />
                </div>
                <p className="text-slate-300 mb-6">
                  Place your finger on the biometric scanner
                </p>
                <button 
                  onClick={handleBiometricSubmit}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Verify Biometric'}
                </button>
              </motion.div>
            )}

            {step === 'wallet' && (
              <motion.div
                key="wallet"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wallet className="w-12 h-12 text-white" />
                </div>
                <p className="text-slate-300 mb-6">
                  Connect your wallet to finalize authentication
                </p>
                <button 
                  onClick={handleWalletConnect}
                  disabled={loading}
                  className="btn-primary w-full"
                >
                  {loading ? <Loader2 className="animate-spin" /> : 'Connect Wallet'}
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Back Button */}
          {step !== 'aadhaar' && (
            <button
              onClick={() => {
                setError('');
                const prevIndex = currentStepIndex - 1;
                if (prevIndex >= 0) setStep(steps[prevIndex].key);
              }}
              className="w-full mt-4 btn-ghost text-slate-400 hover:text-white"
            >
              <ArrowLeft size={18} />
              Back
            </button>
          )}

          {/* Register Link */}
          <p className="mt-8 text-center text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
              Register here
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
