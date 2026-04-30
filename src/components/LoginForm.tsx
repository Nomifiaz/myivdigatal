import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Chrome, Loader2, AlertCircle } from 'lucide-react';
import { authService } from '../services/api';

interface LoginFormProps {
  onForwardType: (type: 'register' | 'forgot' | 'onboarding' | 'dashboard') => void;
  onLoginSuccess: (token: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onForwardType, onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const data = await authService.login({ email, password });
      onLoginSuccess(data.token);
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
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Welcome back</h2>
        <p className="text-slate-500 mt-2">Enter your credentials to access your dashboard.</p>
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

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700" htmlFor="email">
            Email Address
          </label>
          <div className="relative group">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-600" />
            <input 
              id="email"
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700" htmlFor="password">
              Password
            </label>
            <button 
              type="button" 
              onClick={() => onForwardType('forgot')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
              disabled={isLoading}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors group-focus-within:text-blue-600" />
            <input 
              id="password"
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all disabled:opacity-50"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="remember" 
            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-600 disabled:opacity-50" 
            disabled={isLoading}
          />
          <label htmlFor="remember" className="text-sm text-slate-600">Keep me signed in for 30 days</label>
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
              Sign In
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
          <div className="w-4 h-4 bg-slate-100 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold">SSO</span>
          </div>
          SSO
        </button>
      </div>

      <p className="text-center text-sm text-slate-500">
        Don't have an account?{' '}
        <button 
          onClick={() => onForwardType('register')}
          className="text-blue-600 font-semibold hover:underline"
        >
          Register your business
        </button>
      </p>
    </motion.div>
  );
}

export default LoginForm;
