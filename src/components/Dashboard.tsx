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
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-white border-b border-slate-200 z-50 px-6 sm:px-10 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="bg-slate-900 p-2 rounded-lg text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
              BizManager
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-semibold text-slate-900 px-3 py-2 bg-slate-50 rounded-lg">Dashboard</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Inventory</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Invoices</a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Reports</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Quick search..."
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 w-48 transition-all"
            />
          </div>
          <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <div className="h-8 w-px bg-slate-200 mx-2"></div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold text-slate-900 leading-none">{businessData?.name || 'My Business'}</p>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter mt-1">Enterprise Admin</p>
            </div>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 p-1 pl-1 rounded-full hover:bg-slate-50 border border-slate-200 transition-all group lg:min-w-[44px]"
              title="Logout"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-bold text-xs uppercase tracking-tighter shrink-0 ring-offset-2 group-hover:ring-2 ring-slate-900 transition-all overflow-hidden relative">
                {businessData?.logo ? (
                  <img src={authService.getLogoUrl(businessData.logo) || ''} alt="L" className="w-full h-full object-cover" />
                ) : (
                  (businessData?.name?.substring(0, 2) || 'MB')
                )}
                <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-28 pb-12 px-6 sm:px-10 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Revenue', value: '$128,430', change: '+12.5%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Active Clients', value: '1,240', change: '+5.2%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Pending Payouts', value: '$12,400', change: '-2.1%', icon: CreditCard, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'Inventory Level', value: '94%', change: 'Normal', icon: Package, color: 'text-slate-500', bg: 'bg-slate-50' },
          ].map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm"
            >
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
            </motion.div>
          ))}
        </div>

        {/* Dashboard Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chart area */}
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
                  <motion.div 
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${val}%` }}
                    transition={{ delay: 0.5 + (i * 0.05), duration: 1 }}
                    className="flex-1 bg-slate-900 rounded-t-md opacity-20 hover:opacity-100 transition-opacity cursor-pointer relative group"
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      ${val}k
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex justify-between mt-4 px-2">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(m => (
                  <span key={m} className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{m}</span>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
               <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Recent Invoices</h3>
                <button className="text-sm font-bold text-blue-600 hover:underline">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50">
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Client</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Amount</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Status</th>
                      <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { client: 'Acme Corp', amount: '$4,500', status: 'Paid', date: 'Oct 24' },
                      { client: 'Globex Ltd', amount: '$2,100', status: 'Pending', date: 'Oct 23' },
                      { client: 'Soylent Inc', amount: '$8,900', status: 'Overdue', date: 'Oct 21' },
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
                        <td className="px-8 py-4 text-slate-400 text-xs">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-white overflow-hidden shadow-lg shadow-slate-900/10">
                  {businessData?.logo ? (
                    <img src={authService.getLogoUrl(businessData.logo) || ''} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ShieldCheck className="w-7 h-7" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{businessData?.name || 'Organization'}</h3>
                  <p className="text-xs text-emerald-600 font-bold uppercase tracking-widest">FBR Verified</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Business NTN</p>
                  <p className="text-sm font-mono font-bold text-slate-900">{businessData?.ntn || 'N/A'}</p>
                </div>
                {businessData?.cnic && (
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Proprietor CNIC</p>
                    <p className="text-sm font-mono font-bold text-slate-900">{businessData.cnic}</p>
                  </div>
                )}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Physical Location</p>
                  <p className="text-sm font-bold text-slate-900 truncate">{businessData?.address || 'N/A'}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{businessData?.province || 'Punjab'}</p>
                </div>
                <div className="p-4 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl shadow-slate-900/10">
                   <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connectivity</p>
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                  </div>
                  <p className="text-sm font-bold text-white">{businessData?.isFbrEnabled ? 'Live Production Mode' : 'Sandbox Integration'}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white relative overflow-hidden group">
              <HelpCircle className="absolute -right-6 -top-6 w-32 h-32 text-white/10 group-hover:scale-110 transition-transform duration-500" />
              <h3 className="text-lg font-bold mb-2">Need Assistance?</h3>
              <p className="text-blue-100 text-sm mb-6 leading-relaxed">Our enterprise account specialists are available 24/7 to help with your operations.</p>
              <button className="w-full py-3.5 bg-white text-blue-600 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transition-all active:scale-[0.98]">
                Chat with Support
              </button>
            </div>
          </div>
        </div>
      </main>
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

