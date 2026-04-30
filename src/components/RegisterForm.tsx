import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, Github, Chrome, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';

interface RegisterFormProps {
  onForwardType: (type: 'login') => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onForwardType }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await authService.register({ name, email, password });
      alert('Registration successful! You can now log in.');
      onForwardType('login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="w-full max-w-sm space-y-8"
    >
      <div className="text-center md:text-left">
        <div className="flex items-center gap-2 mb-2 md:justify-start justify-center">
            <div className="bg-slate-900 p-1.5 rounded-lg text-white">
                <User className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Create Account</h3>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Join Invoizeo</h2>
        <p className="text-slate-500 mt-2 font-medium">Smart billing, clear business. Start your journey.</p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium"
        >
          <AlertCircle className="w-5 h-5 shrink-0" />
          {error}
        </motion.div>
      )}

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700" htmlFor="fullname">
            Full Name
          </label>
          <div className="relative group">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0D47A1] transition-colors" />
            <input 
              id="fullname"
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-all disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700" htmlFor="reg-email">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#0D47A1] transition-colors" />
            <input 
              id="reg-email"
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john.doe@enterprise.com"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] transition-all disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700" htmlFor="reg-password">
              Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0D47A1] transition-colors" />
              <input 
                id="reg-password"
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] text-sm transition-all disabled:opacity-50"
                disabled={isLoading}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-700" htmlFor="confirm-password">
              Confirm
            </label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0D47A1] transition-colors" />
              <input 
                id="confirm-password"
                type="password" 
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#0D47A1]/20 focus:border-[#0D47A1] text-sm transition-all disabled:opacity-50"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <input 
            type="checkbox" 
            id="terms" 
            required
            className="mt-1 w-4 h-4 rounded border-slate-300 text-[#0D47A1] focus:ring-[#0D47A1] disabled:opacity-50" 
            disabled={isLoading}
          />
          <label htmlFor="terms" className="text-xs text-slate-500 leading-tight font-medium">
            I agree to the <span className="text-[#0D47A1] cursor-pointer hover:underline font-bold">Terms</span> and <span className="text-[#0D47A1] cursor-pointer hover:underline font-bold">Privacy Policy</span>.
          </label>
        </div>

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full bg-slate-950 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all group active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Create Account
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-4 text-slate-400 font-medium">Or continue with</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700">
          <Chrome className="w-4 h-4" />
          Google
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors text-sm font-semibold text-slate-700">
          <Github className="w-4 h-4" />
          GitHub
        </button>
      </div>

      <p className="text-center text-sm text-slate-500 font-medium">
        Already have an account?{' '}
        <button 
          onClick={() => onForwardType('login')}
          className="text-[#0D47A1] font-bold hover:underline"
        >
          Sign In
        </button>
      </p>
    </motion.div>
  );
}

export default RegisterForm;
