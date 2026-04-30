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
  RotateCw
} from 'lucide-react';
import { authService } from '../services/api';

interface DashboardProps {
  businessData: any;
  onLogout: () => void;
}

type Tab = 'dashboard' | 'business-setup' | 'products' | 'invoices';

const Dashboard: React.FC<DashboardProps> = ({ businessData, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'business-setup', label: 'Business Setup', icon: Building2 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'invoices', label: 'Invoices', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f172a] text-white flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-xl">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-none">BizManager Pro</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1">Enterprise Edition</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as Tab)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                activeTab === item.id 
                ? 'bg-slate-800 text-white shadow-lg' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-blue-400' : 'group-hover:text-blue-400'}`} />
              <span className="text-sm font-semibold">{item.label}</span>
              {activeTab === item.id && <motion.div layoutId="nav-indicator" className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />}
            </button>
          ))}
        </nav>

        <div className="p-6 mt-auto border-t border-slate-800">
          <button className="flex items-center gap-3 px-4 py-2 hover:text-white text-slate-400 transition-colors mb-4 w-full text-left">
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-2 hover:text-white text-slate-400 transition-colors w-full text-left">
            <HelpCircle className="w-5 h-5" />
            <span className="text-sm font-medium">Support</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 ml-64 flex flex-col">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-40">
          <div className="flex items-center gap-4 flex-1">
            <h2 className="text-xl font-bold text-slate-900 capitalize hidden sm:block">
              {activeTab.replace('-', ' ')}
            </h2>
            <div className="relative max-w-md w-full ml-8">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Quick Search..."
                className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-blue-600/5 focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-8 mr-4 hidden lg:flex">
              <a href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900">Overview</a>
              <a href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900">Reports</a>
              <a href="#" className="text-sm font-bold text-slate-500 hover:text-slate-900">Team</a>
            </div>
            
            <button className="relative p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            </button>

            <div className="h-8 w-px bg-slate-200" />

            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900 leading-none">{businessData?.name}</p>
                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">Enterprise Admin</p>
              </div>
              <button 
                onClick={onLogout}
                className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-900/20 overflow-hidden group relative"
                title="Logout"
              >
                {businessData?.logo ? (
                  <img src={authService.getLogoUrl(businessData.logo) || ''} alt="L" className="w-full h-full object-cover" />
                ) : (
                  (businessData?.name?.substring(0, 2) || 'MB')
                )}
                <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-10 max-w-[1600px] mx-auto w-full flex-1">
          <AnimatePresence mode="wait">
            {activeTab === 'dashboard' && <Overview businessData={businessData} />}
            {activeTab === 'business-setup' && <BusinessSetup businessData={businessData} />}
            {(activeTab === 'products' || activeTab === 'invoices') && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="h-[60vh] bg-white rounded-3xl border border-slate-200 border-dashed flex flex-col items-center justify-center text-slate-400"
              >
                <Package className="w-12 h-12 mb-4 opacity-20" />
                <p className="font-bold text-lg">{activeTab.toUpperCase()} Module</p>
                <p className="text-sm">Currently under enterprise synchronization.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

const Overview: React.FC<{ businessData: any }> = () => (
  <motion.div 
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    className="space-y-10"
  >
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Organization Overview</h1>
        <p className="text-slate-500 mt-2">Precision status for your high-stakes enterprise operations.</p>
      </div>
      <button className="bg-slate-950 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-900 transition-all active:scale-[0.98]">
        Save Changes
      </button>
    </div>

    <div className="grid grid-cols-4 gap-6">
      {[
        { label: 'Total Revenue', value: '$128,430', change: '+12.5%', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Active Clients', value: '1,240', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Market Sentiment', value: 'Optimistic', icon: Building2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Growth Vector', value: 'Aggressive', icon: ShieldCheck, color: 'text-slate-600', bg: 'bg-slate-50' },
      ].map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-3xl border border-slate-200 flex flex-col">
          <div className={`w-12 h-12 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center mb-6`}>
            <stat.icon className="w-6 h-6" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</h3>
        </div>
      ))}
    </div>
  </motion.div>
);

const BusinessSetup: React.FC<{ businessData: any }> = ({ businessData }) => (
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -20 }}
    className="space-y-8"
  >
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Business Setup</h1>
        <p className="text-slate-500 mt-2">Manage your enterprise identity and connectivity preferences.</p>
      </div>
      <button className="bg-slate-950 text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-slate-900/10 hover:bg-slate-900 transition-all active:scale-[0.98]">
        Save Changes
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-8">
        {/* General Info */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              General Information
            </h3>
            <Info className="w-4 h-4 text-slate-400" />
          </div>
          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-tight">Business Name</label>
              <input 
                readOnly
                value={businessData?.name}
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-0 focus:border-slate-200"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-tight">NTN Number</label>
                <input 
                  readOnly
                  value={businessData?.ntn}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-tight">Proprietor CNIC</label>
                <input 
                  readOnly
                  value={businessData?.cnic || 'Not provided'}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 font-mono text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Physical Location */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              Physical Location
            </h3>
            <MapPin className="w-4 h-4 text-slate-400" />
          </div>
          <div className="p-8 space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-tight">Street Address</label>
              <input 
                readOnly
                value={businessData?.address}
                className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-tight">City / Province</label>
                <input 
                  readOnly
                  value={businessData?.province}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-900 uppercase tracking-tight">Country</label>
                <div className="relative">
                  <input readOnly value="Pakistan" className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium" />
                  <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security & API */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
              Security & API
            </h3>
            <Lock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="p-8">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-tight">API / Security Token</label>
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <input 
                    type="password"
                    readOnly
                    value="••••••••••••••••••••••••••••••"
                    className="w-full pl-5 pr-12 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono text-sm"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                </div>
                <button className="px-6 bg-white border border-slate-200 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors">
                  <RotateCw className="w-4 h-4" />
                  Rotate
                </button>
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-3">
                Your secret API key should never be shared. Rotate your token if you suspect it has been compromised.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* Brand Logo */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Brand Logo</h3>
          </div>
          <div className="p-8">
            <div className="aspect-square rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
              {businessData?.logo ? (
                <img src={authService.getLogoUrl(businessData.logo) || ''} alt="Brand Logo" className="w-full h-full object-contain p-8" />
              ) : (
                <>
                  <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-bold text-slate-900 text-center px-4">Drag and drop logo</p>
                  <p className="text-[10px] text-slate-400 mt-2 uppercase tracking-widest">SVG, PNG, JPG (max 2MB)</p>
                </>
              )}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="text-white text-xs font-bold px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl hover:bg-white/30 transition-colors">
                  Update Logo
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Compliance</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-tight">Tax ID / VAT Number</label>
              <input readOnly value={businessData?.ntn} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-tight">Currency</label>
              <div className="relative">
                <input readOnly value="PKR (Rs) - Pakistan Rupee" className="w-full px-5 py-3.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium" />
                <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90" />
              </div>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <div className={`w-5 h-5 rounded border ${businessData.isFbrEnabled ? 'bg-blue-600 border-blue-600' : 'bg-slate-100 border-slate-200'}`}>
                {businessData.isFbrEnabled && <Plus className="w-4 h-4 text-white rotate-45" />}
              </div>
              <span className="text-sm font-bold text-slate-700">FBR Integration Enabled</span>
            </div>
          </div>
        </div>

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

export default Dashboard;

