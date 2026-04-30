import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  LogOut, 
  LayoutDashboard, 
  Package, 
  FileText, 
  Settings, 
  Plus, 
  TrendingUp,
  Users,
  CreditCard,
  Search,
  Bell,
  HelpCircle,
  ShieldCheck,
  ChevronRight,
  Info,
  MapPin,
  Upload,
  Lock,
  RotateCw,
  TrendingDown
} from 'lucide-react';
import { Logo } from './Brand';
import Inventory from './Inventory';
import { authService } from '../services/api';

interface DashboardProps {
  businessData: any;
  onLogout: () => void;
}

type Tab = 'dashboard' | 'business-setup' | 'products' | 'invoices';

const Overview: React.FC<{ businessData: any }> = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Overview</h1>
          <p className="text-slate-500 mt-1">Status of your enterprise operations for {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
            <FileText className="w-4 h-4" />
            Export Report
          </button>
          <button className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '$128,430', change: '+12.5%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { label: 'Active Clients', value: '1,240', change: '+5.2%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Pending Payouts', value: '$12,400', change: '-2.1%', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-50' },
          { label: 'Inventory Level', value: '94%', change: 'Normal', icon: Package, color: 'text-slate-500', bg: 'bg-slate-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-500'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-lg font-bold text-slate-900">Revenue Distribution</h3>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-slate-900"></div>
                <div className="w-3 h-3 rounded-full bg-slate-200"></div>
              </div>
            </div>
            <div className="h-64 flex items-end gap-2 px-2">
              {[40, 60, 45, 90, 65, 80, 55, 70, 95, 60, 50, 85].map((val, i) => (
                <div key={i} className="flex-1 bg-slate-900 rounded-t-md opacity-20 hover:opacity-100 transition-opacity cursor-pointer relative group">
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    ${val}k
                  </div>
                  <div style={{ height: `${val}%` }} className="w-full bg-slate-900 rounded-t-md" />
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Recent Invoices</h3>
              <button className="text-sm font-bold text-[#0D47A1] hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Client</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                    <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { client: 'Acme Corp', amount: '$4,500', status: 'Paid' },
                    { client: 'Globex Ltd', amount: '$2,100', status: 'Pending' },
                    { client: 'Soylent Inc', amount: '$8,900', status: 'Overdue' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4 font-bold text-slate-900">{row.client}</td>
                      <td className="px-8 py-4 text-slate-500 text-sm">{row.amount}</td>
                      <td className="px-8 py-4">
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                          row.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                          row.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-[#0f172a] rounded-3xl p-8 text-white relative overflow-hidden">
            <HelpCircle className="absolute -right-6 -top-6 w-32 h-32 text-white/5 opacity-50" />
            <h4 className="text-lg font-bold mb-2">Need Assistance?</h4>
            <p className="text-slate-400 text-sm mb-6 leading-relaxed">Our account specialists are available 24/7 to help with your enterprise configuration.</p>
            <button className="w-full py-3.5 bg-white text-slate-900 rounded-xl font-bold text-sm tracking-tight hover:bg-slate-50 active:scale-95 transition-all">
              Chat with Support
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BusinessSetup: React.FC<{ businessData: any }> = ({ businessData }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Business Setup</h1>
          <p className="text-slate-500 mt-2">Manage your enterprise identity and connectivity preferences.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-tight">Business Name</label>
                <input readOnly value={businessData?.name} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-tight">NTN Number</label>
                <input readOnly value={businessData?.ntn} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-tight">Physical Address</label>
              <input readOnly value={businessData?.address} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium" />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col items-center">
            <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-4 border-2 border-dashed border-slate-200">
               {businessData?.logo ? (
                <img src={authService.getLogoUrl(businessData.logo) || ''} alt="Logo" className="w-full h-full object-contain p-4" />
              ) : (
                <Upload className="w-8 h-8" />
              )}
            </div>
            <p className="text-sm font-bold text-slate-900">Business Logo</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ businessData, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-200 z-50 px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Logo showText size="md" />
          <nav className="hidden md:flex items-center gap-6">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
              { id: 'products', label: 'Inventory', icon: Package },
              { id: 'invoices', label: 'Invoices', icon: FileText },
              { id: 'business-setup', label: 'Setup', icon: Settings },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`text-sm font-bold px-3 py-2 rounded-lg transition-all flex items-center gap-2 ${activeTab === tab.id ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10' : 'text-slate-500 hover:text-slate-900'}`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={onLogout}
            className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 hover:border-red-100 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </header>

      <main className="pt-28 pb-12 px-6 sm:px-10 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && <Overview key="overview" businessData={businessData} />}
          {activeTab === 'products' && <Inventory key="products" businessId={businessData.id} />}
          {activeTab === 'business-setup' && <BusinessSetup key="setup" businessData={businessData} />}
          {activeTab === 'invoices' && (
            <motion.div 
               key="invoices"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: -20 }}
               className="flex flex-col items-center justify-center py-24 bg-white rounded-[40px] border border-slate-200"
            >
              <FileText className="w-16 h-16 text-slate-200 mb-6" />
              <h3 className="text-xl font-bold text-slate-900">Invoices Module</h3>
              <p className="text-slate-500 mt-2">The invoicing system is currently under development.</p>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="mt-8 text-slate-900 font-bold hover:underline"
              >
                Back to Dashboard
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
