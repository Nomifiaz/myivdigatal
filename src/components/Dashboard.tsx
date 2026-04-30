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
import Clients from './Clients';
import { authService } from '../services/api';

interface DashboardProps {
  businessData: any;
  onLogout: () => void;
}

type Tab = 'dashboard' | 'business-setup' | 'products' | 'invoices' | 'clients';

const Overview: React.FC<{ businessData: any; onTabChange: (tab: any) => void }> = ({ businessData, onTabChange }) => {
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
          { id: 'revenue', label: 'Total Revenue', value: '$128,430', change: '+12.5%', icon: TrendingUp, color: 'text-[#0D47A1]', bg: 'bg-blue-50' },
          { id: 'clients', label: 'Active Clients', value: '1,240', change: '+5.2%', icon: Users, color: 'text-[#00B8D4]', bg: 'bg-cyan-50' },
          { id: 'payments', label: 'Pending Payouts', value: '$12,400', change: '-2.1%', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-50' },
          { id: 'inventory', label: 'Inventory Level', value: '94%', change: 'Normal', icon: Package, color: 'text-slate-500', bg: 'bg-slate-50' },
        ].map((stat, idx) => (
          <div 
            key={idx} 
            onClick={() => stat.id === 'clients' && onTabChange('clients')}
            className={`bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow ${stat.id === 'clients' ? 'cursor-pointer group/stat' : ''}`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} ${stat.id === 'clients' ? 'group-hover/stat:bg-cyan-100 transition-colors' : ''}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.change.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                {stat.change}
              </span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1 flex items-center justify-between">
              {stat.value}
              {stat.id === 'clients' && <ChevronRight className="w-4 h-4 text-slate-300 group-hover/stat:text-[#00B8D4] transition-colors" />}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Revenue Analytics</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net growth comparison (Monthly)</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#0D47A1]"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-slate-100"></div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Previous</span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end gap-2 px-2">
              {[40, 60, 45, 90, 65, 80, 55, 70, 95, 60, 50, 85].map((val, i) => (
                <div key={i} className="flex-1 group relative flex flex-col items-center justify-end h-full">
                  <div className="absolute -top-8 bg-[#0D47A1] text-white text-[10px] font-black py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-lg">
                    PKR {val}k
                  </div>
                  <div className="w-full bg-slate-50 rounded-t-xl h-full absolute inset-0 pointer-events-none" />
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ delay: i * 0.05, duration: 0.8, ease: "easeOut" }}
                    className="w-full bg-gradient-to-t from-[#0D47A1] to-[#00B8D4] rounded-t-xl z-[1] cursor-pointer"
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-6 px-1">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                <span key={m} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m}</span>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Recent Invoices</h3>
              <button className="text-xs font-black text-[#0D47A1] hover:text-[#00B8D4] uppercase tracking-widest transition-colors">View All Archive</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Client / Partner</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Net Amount</th>
                    <th className="px-8 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Clearance Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { client: 'Acme Corp Solutions', amount: '$4,500', status: 'Paid', icon: 'AC' },
                    { client: 'Globex Digital Ltd', amount: '$2,100', status: 'Pending', icon: 'GD' },
                    { client: 'Soylent Energy Inc', amount: '$8,900', status: 'Overdue', icon: 'SE' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400">
                            {row.icon}
                          </div>
                          <span className="font-bold text-slate-900 text-sm">{row.client}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-slate-600 text-sm font-black">{row.amount}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] ${
                          row.status === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 
                          row.status === 'Pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-red-50 text-red-600 border border-red-100'
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
          <div className="bg-gradient-to-br from-[#0D47A1] to-[#00B8D4] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-blue-900/20 group">
            <HelpCircle className="absolute -right-6 -top-6 w-40 h-40 text-white/10 group-hover:scale-110 transition-transform duration-700" />
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-md">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Priority Support</span>
            </div>
            <h4 className="text-xl font-black mb-2 uppercase tracking-tight leading-tight">Need Operations Assistance?</h4>
            <p className="text-blue-50/70 text-xs mb-8 font-medium leading-relaxed">Our Invoizeo account specialists are available 24/7 to help with your enterprise financial workflows.</p>
            <button className="w-full py-4 bg-white text-[#0D47A1] rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-2xl active:scale-95 transition-all shadow-lg">
              Open Support Case
            </button>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6">Financial Growth</h4>
            <div className="space-y-6">
              {[
                { label: 'EBITDA Margin', value: '32%', color: 'bg-[#0D47A1]' },
                { label: 'OPEX Efficiency', value: '84%', color: 'bg-[#00B8D4]' },
                { label: 'Cash Liquidity', value: '61%', color: 'bg-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-2 text-[10px] font-bold uppercase tracking-widest">
                  <div className="flex justify-between items-center text-slate-400">
                    <span>{item.label}</span>
                    <span className="text-slate-900">{item.value}</span>
                  </div>
                  <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: item.value }}
                      transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                      className={`h-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-slate-50 text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-colors">
              Full Financial Audit
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
              { id: 'clients', label: 'Clients', icon: Users },
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
          {activeTab === 'dashboard' && <Overview key="overview" businessData={businessData} onTabChange={setActiveTab} />}
          {activeTab === 'products' && <Inventory key="products" businessId={businessData.id} />}
          {activeTab === 'clients' && <Clients key="clients" />}
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
