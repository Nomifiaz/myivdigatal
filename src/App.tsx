/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import AuthLayout from './components/AuthLayout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { authService } from './services/api';
import { Loader2 } from 'lucide-react';

type AuthScreen = 'login' | 'register' | 'forgot' | 'onboarding' | 'dashboard';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');
  const [businessData, setBusinessData] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const checkAuthAndBusiness = async () => {
    const token = authService.getToken();
    if (!token) {
      setIsInitializing(false);
      return;
    }

    try {
      const response = await authService.getBusiness();
      if (response.success && response.data) {
        setBusinessData(response.data);
        setCurrentScreen('dashboard');
      } else {
        setCurrentScreen('onboarding');
      }
    } catch (err) {
      // If unauthorized, logout
      authService.logout();
      setCurrentScreen('login');
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    checkAuthAndBusiness();
  }, []);

  const handleLoginSuccess = async (token: string) => {
    authService.setToken(token);
    setIsInitializing(true);
    await checkAuthAndBusiness();
  };

  const handleLogout = () => {
    authService.logout();
    setBusinessData(null);
    setCurrentScreen('login');
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
          <p className="text-slate-500 font-medium animate-pulse text-sm uppercase tracking-widest">Initializing BizManager...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <AnimatePresence mode="wait">
        {currentScreen === 'login' && (
          <AuthLayout 
            key="login"
            title="Enterprise-Grade Business Intelligence."
            subtitle="Streamline your operations with our professional-grade suite for products, invoices, and automated financial reporting."
          >
            <LoginForm 
              onForwardType={setCurrentScreen} 
              onLoginSuccess={handleLoginSuccess}
            />
          </AuthLayout>
        )}

        {currentScreen === 'register' && (
          <AuthLayout 
            key="register"
            title="Scale your vision with BizManager Pro."
            subtitle="Join over 10,000+ businesses using our platform to optimize their workflows and drive sustainable growth."
          >
            <RegisterForm onForwardType={setCurrentScreen} />
          </AuthLayout>
        )}

        {currentScreen === 'forgot' && (
          <ForgotPasswordForm 
            key="forgot"
            onForwardType={setCurrentScreen} 
          />
        )}

        {currentScreen === 'onboarding' && (
          <motion.div
            key="onboarding"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Onboarding onComplete={checkAuthAndBusiness} />
          </motion.div>
        )}

        {currentScreen === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Dashboard businessData={businessData} onLogout={handleLogout} />
          </motion.div>
        )}
      </AnimatePresence>

      {(currentScreen === 'login' || currentScreen === 'register') && (
        <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors z-50">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-help"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
        </button>
      )}
    </main>
  );
}

