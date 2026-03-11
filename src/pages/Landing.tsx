import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Users, 
  ArrowRight, 
  ChevronRight,
  Fingerprint,
  Blocks
} from 'lucide-react';

const features = [
  {
    icon: Fingerprint,
    title: 'Biometric Security',
    description: 'Fingerprint and facial recognition for voter verification',
    color: 'from-rose-500 to-rose-600',
  },
  {
    icon: Blocks,
    title: 'Blockchain Powered',
    description: 'Immutable, transparent vote records on Ethereum',
    color: 'from-violet-500 to-violet-600',
  },
  {
    icon: Lock,
    title: 'Aadhaar Auth',
    description: 'Secure authentication using India\'s UID system',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Users,
    title: 'Universal Access',
    description: 'Vote from anywhere in the world securely',
    color: 'from-emerald-500 to-emerald-600',
  },
];

const stats = [
  { value: '1.4B+', label: 'Eligible Voters' },
  { value: '28', label: 'States Covered' },
  { value: '99.9%', label: 'Uptime' },
  { value: '0', label: 'Security Breaches' },
];

export default function Landing() {
  return (
    <div className="min-h-screen hero-gradient overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-30" />
      
      {/* Animated Orbs */}
      <div className="absolute top-20 left-0 w-[600px] h-[600px] bg-primary-500/20 rounded-full blur-[120px] animate-pulse-slow" />
      <div className="absolute bottom-20 right-0 w-[500px] h-[500px] bg-accent-500/20 rounded-full blur-[100px] animate-pulse-slow" style={{ animationDelay: '1s' }} />

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Surakshit Matdan</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-4"
          >
            <Link 
              to="/login" 
              className="text-slate-300 hover:text-white transition-colors font-medium"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="btn-primary rounded-xl"
            >
              Get Started
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur rounded-full border border-white/20 mb-8">
              <span className="w-2 h-2 bg-accent-400 rounded-full animate-pulse" />
              <span className="text-sm text-slate-300">Blockchain-Powered Secure Voting</span>
            </div>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            The Future of
            <span className="block gradient-text">Democratic Voting</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto"
          >
            Secure, transparent, and immutable. Vote from anywhere with 
            military-grade security powered by blockchain technology.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register" className="btn-primary text-lg px-8 py-4">
              Start Voting Now
              <ArrowRight size={20} />
            </Link>
            <Link to="/results" className="btn-secondary text-lg px-8 py-4 bg-white/5 border-white/20 text-white hover:bg-white/10">
              View Live Results
            </Link>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
        >
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-slate-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Why Choose Surakshit Matdan?
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Built with cutting-edge technology to ensure every vote counts and every vote is secure.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 h-full hover:bg-white/10 transition-all duration-300">
                <div className={`w-14 h-14 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-slate-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* How It Works */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Simple, secure, and completely transparent voting process
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {[
            { step: '01', title: 'Verify Identity', desc: 'Login with your Aadhaar number and complete OTP verification' },
            { step: '02', title: 'Biometric Auth', desc: 'Confirm your identity with fingerprint or facial recognition' },
            { step: '03', title: 'Connect Wallet', desc: 'Connect your crypto wallet for blockchain verification' },
            { step: '04', title: 'Cast Your Vote', desc: 'Select your candidate and submit your vote securely' },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-6 py-6"
            >
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-primary-500/30">
                  {item.step}
                </div>
              </div>
              <div className="pt-2">
                <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-12 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-10" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
              Join millions of citizens using the most secure voting platform in India.
            </p>
            <Link 
              to="/register" 
              className="inline-flex items-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-primary-50 transition-colors"
            >
              Get Started Free
              <ChevronRight size={20} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 py-8">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Shield className="w-5 h-5" />
              <span>Surakshit Matdan - Secure Voting Platform</span>
            </div>
            <div className="text-slate-500 text-sm">
              &copy; 2024 Surakshit Matdan. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
