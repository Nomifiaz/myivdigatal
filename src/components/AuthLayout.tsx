import React from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, ShieldCheck, Activity } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  imageAlt?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 md:p-6 lg:p-8">
      <div className="w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        {/* Left Sidebar - Visual/Dashboard Preview */}
        <div className="relative hidden md:flex md:w-1/2 bg-slate-950 p-12 flex-col justify-between overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
              alt="Enterprise Building"
              className="w-full h-full object-cover opacity-30 scale-110"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/90 to-transparent" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-2 text-white mb-12">
              <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md border border-white/20">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold tracking-tight">BizManager Pro</span>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-4xl lg:text-5xl font-semibold text-white leading-tight mb-6">
                {title}
              </h1>
              <p className="text-slate-400 text-lg max-w-md leading-relaxed">
                {subtitle}
              </p>
            </motion.div>
          </div>

          {/* Floating Feature Cards */}
          <div className="relative z-10 space-y-4">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 max-w-sm"
            >
              <div className="bg-blue-500/20 p-2 rounded-xl text-blue-400">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Real-time Analytics</p>
                <div className="w-32 h-1.5 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '70%' }}
                    transition={{ delay: 0.8, duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-blue-500"
                  />
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 p-4 rounded-2xl flex items-center gap-4 max-w-sm"
            >
              <div className="bg-emerald-500/20 p-2 rounded-xl text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Enterprise Security</p>
                <p className="text-slate-400 text-xs">Active Protection Enabled</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Pane - Auth Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col items-center justify-center bg-white relative">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
