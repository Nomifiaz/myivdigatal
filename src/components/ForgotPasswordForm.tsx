import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ArrowRight, ArrowLeft, RefreshCcw, Info, Loader2, AlertCircle, ShieldCheck, KeyRound } from 'lucide-react';
import { authService } from '../services/api';

interface ForgotPasswordFormProps {
  onForwardType: (type: 'login') => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({ onForwardType }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.forgotPassword(email);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.resetPassword({ email, otp, newPassword });
      alert('Password reset successful! You can now log in with your new password.');
      onForwardType('login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-[#f8fafc]">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8"
      >
        <div className="flex flex-col items-center text-center">
            <div className="bg-slate-900 w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl mb-6 transform rotate-3">
                {step === 1 ? <RefreshCcw className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8 text-emerald-400" />}
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
              {step === 1 ? 'Recover Account' : 'Verify Identity'}
            </h2>
            <p className="text-slate-500 mt-2 max-w-[320px]">
              {step === 1 
                ? "Enter your verified email address below and we'll send a 5-digit security code." 
                : `We've sent a 5-digit code to ${email}. Please enter it below to reset your password.`}
            </p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-3 text-sm font-medium"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 space-y-6"
            >
                <form onSubmit={handleRequestOtp} className="space-y-6">
                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700" htmlFor="reset-email">
                          Registered Email
                      </label>
                      <div className="relative group">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                          <input 
                              id="reset-email"
                              type="email" 
                              required
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              placeholder="e.g. james.smith@enterprise.com"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all disabled:opacity-50"
                              disabled={isLoading}
                          />
                      </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-slate-950 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-900 transition-all group active:scale-[0.98] shadow-lg shadow-slate-900/10 disabled:opacity-70"
                  >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          Send Reset Link
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                  </button>
                </form>

                <div className="h-px bg-slate-100 w-full" />

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex gap-3">
                    <Info className="w-5 h-5 text-blue-500 shrink-0" />
                    <p className="text-xs text-blue-700 leading-normal">
                        Security Notice: If you don't receive an email within 5 minutes, please check your spam folder.
                    </p>
                </div>
            </motion.div>
          ) : (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 space-y-6"
            >
                <form onSubmit={handleResetPassword} className="space-y-6">
                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700" htmlFor="otp">
                          5-Digit Code
                      </label>
                      <div className="relative group">
                          <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                          <input 
                              id="otp"
                              type="text" 
                              required
                              maxLength={5}
                              value={otp}
                              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                              placeholder="12345"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all text-center tracking-[0.5em] font-mono text-xl disabled:opacity-50"
                              disabled={isLoading}
                          />
                      </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-sm font-semibold text-slate-700" htmlFor="new-password">
                          New Password
                      </label>
                      <div className="relative group">
                          <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
                          <input 
                              id="new-password"
                              type="password" 
                              required
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              placeholder="••••••••"
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all disabled:opacity-50"
                              disabled={isLoading}
                          />
                      </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all group active:scale-[0.98] shadow-lg shadow-emerald-600/10 disabled:opacity-70"
                  >
                      {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                        <>
                          Reset Password
                          <ShieldCheck className="w-4 h-4 group-hover:scale-110 transition-transform" />
                        </>
                      )}
                  </button>

                  <button 
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-xs text-slate-400 hover:text-slate-600 transition-colors font-medium"
                    disabled={isLoading}
                  >
                    Didn't receive the code? Change email
                  </button>
                </form>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => onForwardType('login')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mx-auto text-sm font-medium"
          disabled={isLoading}
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Login
        </button>
      </motion.div>
    </div>
  );
}

export default ForgotPasswordForm;
