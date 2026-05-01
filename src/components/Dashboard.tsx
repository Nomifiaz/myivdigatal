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
  TrendingDown,
  User,
  ExternalLink,
  CheckCircle2
} from 'lucide-react';
import { Logo } from './Brand';
import Inventory from './Inventory';
import Clients from './Clients';
import Invoices from './Invoices';
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
  const [isFbrEnabled, setIsFbrEnabled] = useState(businessData?.isFbrEnabled || false);
  const [loading, setLoading] = useState(false);

  const handleToggleFbr = async () => {
    try {
      setLoading(true);
      await authService.updateFbrStatus(businessData.id, !isFbrEnabled);
      setIsFbrEnabled(!isFbrEnabled);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Enterprise Configuration</h1>
          <p className="text-slate-500 mt-2">Manage your business identity, tax compliance, and FBR connectivity.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-[#0D47A1] text-white text-sm font-bold rounded-xl hover:bg-[#1565C0] transition-all shadow-lg shadow-blue-900/10 flex items-center gap-2">
            <RotateCw className="w-4 h-4" />
            Update Settings
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Business Identity */}
          <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
              <div className="p-2 bg-blue-50 text-[#0D47A1] rounded-xl">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Business Identity</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Primary registration information</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Business Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <input 
                    readOnly 
                    value={businessData?.name} 
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:bg-white transition-all ring-0 border-transparent focus:border-slate-900/10" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">NTN / Tax ID</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <input 
                    readOnly 
                    value={businessData?.ntn} 
                    className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold transition-all" 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">CNIC / Registration</label>
                <input readOnly value={businessData?.cnic} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Province</label>
                <input readOnly value={businessData?.province} className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Physical Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300">
                  <MapPin className="w-4 h-4" />
                </div>
                <input 
                  readOnly 
                  value={businessData?.address} 
                  className="w-full pl-12 pr-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold" 
                />
              </div>
            </div>
          </section>

          {/* FBR Settings */}
          <section className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">FBR Configuration</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Secure connectivity tokens for POS integration</p>
              </div>
            </div>

            <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${isFbrEnabled ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">FBR Integration Status</h4>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                    {isFbrEnabled ? 'Real-time tax reporting enabled' : 'Reporting is currently offline'}
                  </p>
                </div>
              </div>
              <button 
                onClick={handleToggleFbr}
                disabled={loading}
                className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0D47A1] focus:ring-offset-2 ${isFbrEnabled ? 'bg-emerald-500' : 'bg-slate-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span className="sr-only">Toggle FBR</span>
                <span
                  className={`${
                    isFbrEnabled ? 'translate-x-7' : 'translate-x-1'
                  } inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm`}
                />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Sandbox Token</label>
                  <span className="text-[8px] font-black bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase tracking-widest">Test Mode</span>
                </div>
                <div className="relative">
                  <input 
                    readOnly 
                    type="password"
                    value={businessData?.fbrSandboxToken || '••••••••••••••••'} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-mono text-sm" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Production Token</label>
                  <span className="text-[8px] font-black bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full uppercase tracking-widest">Active</span>
                </div>
                <div className="relative">
                  <input 
                    readOnly 
                    type="password"
                    value={businessData?.fbrProductionToken || '••••••••••••••••'} 
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-mono text-sm" 
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Lock className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-start gap-4">
              <div className="p-2 bg-white rounded-lg shadow-sm">
                <Info className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900 mb-1">FBR Online Verification</p>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">Your tokens are securely encrypted. Any modification requires re-authentication with your FBR credentials.</p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm p-8 flex flex-col items-center">
            <div className="w-40 h-40 bg-slate-50 rounded-[32px] flex items-center justify-center text-slate-300 mb-6 border-2 border-dashed border-slate-200 relative group overflow-hidden">
               {businessData?.logo ? (
                <img 
                  src={authService.getLogoUrl(businessData.logo) || ''} 
                  alt="Logo" 
                  className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform" 
                  referrerPolicy="no-referrer"
                />
              ) : (
                <Upload className="w-10 h-10 group-hover:scale-110 transition-transform" />
              )}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <Upload className="w-8 h-8 text-white" />
              </div>
            </div>
            <div className="text-center">
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Brand Mark</h4>
              <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-wider">Visible on all tax invoices</p>
            </div>
          </div>

          <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-2xl shadow-slate-900/20">
            <ShieldCheck className="absolute -right-6 -top-6 w-40 h-40 text-white/5 group-hover:scale-110 transition-transform duration-700" />
            <h4 className="text-lg font-black mb-2 uppercase tracking-tight">Security Check</h4>
            <p className="text-slate-400 text-xs mb-6 font-medium">Your business profile is fully compliant with current FBR regulations.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Identity Verified</span>
              </div>
              <div className="flex items-center gap-3 text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Tokens Validated</span>
              </div>
            </div>
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
          <div className="hidden lg:flex flex-col items-end">
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{businessData?.name || 'Administrator'}</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">Enterprise User</p>
          </div>
          <button 
            onClick={() => setActiveTab('business')}
            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all relative overflow-hidden group ${activeTab === 'business' ? 'bg-[#0D47A1] text-white shadow-lg shadow-blue-900/20' : 'bg-slate-100 border border-slate-200 text-slate-400 hover:bg-slate-200'}`}
          >
            {businessData?.logo ? (
              <img 
                src={authService.getLogoUrl(businessData.logo) || ''} 
                alt="Profile" 
                className={`w-full h-full object-contain p-1.5 transition-transform group-hover:scale-110 ${activeTab === 'business' ? 'brightness-0 invert' : ''}`} 
                referrerPolicy="no-referrer"
              />
            ) : (
              <User className="w-5 h-5 transition-transform group-hover:scale-110" />
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
          
          <button 
            onClick={() => setActiveTab('business')}
            className={`p-2.5 rounded-xl transition-all ${activeTab === 'business' ? 'bg-[#0D47A1] text-white' : 'text-slate-400 hover:bg-slate-100'}`}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>

          <div className="h-8 w-[1px] bg-slate-100 mx-1"></div>
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
          {activeTab === 'invoices' && <Invoices key="invoices" businessData={businessData} />}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
