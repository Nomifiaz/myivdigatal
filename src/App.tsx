/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import AuthLayout from './components/AuthLayout';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import ForgotPasswordForm from './components/ForgotPasswordForm';

type AuthScreen = 'login' | 'register' | 'forgot';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<AuthScreen>('login');

  return (
    <main className="min-h-screen bg-[#f8fafc]">
      <AnimatePresence mode="wait">
        {currentScreen === 'login' && (
          <AuthLayout 
            key="login"
            title="Enterprise-Grade Business Intelligence."
            subtitle="Streamline your operations with our professional-grade suite for products, invoices, and automated financial reporting."
          >
            <LoginForm onForwardType={setCurrentScreen} />
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
      </AnimatePresence>

      {/* Floating Support Button (as seen in the design) */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors z-50">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle-help"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
      </button>
    </main>
  );
}

