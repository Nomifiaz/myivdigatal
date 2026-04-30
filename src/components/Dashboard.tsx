import React from 'react';
import { motion } from 'motion/react';
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
  ShieldCheck
} from 'lucide-react';
import { authService } from '../services/api';

interface DashboardProps {
  businessData: any;
  onLogout: () => void;
}

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
              <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-xs uppercase tracking-tighter shrink-0 ring-offset-2 group-hover:ring-2 ring-slate-900 transition-all">
                {businessData?.logo ? (
                  <img src={businessData.logo} alt="L" className="w-full h-full object-cover rounded-full" />
                ) : (
                  (businessData?.name?.substring(0, 2) || 'MB')
                )}
              </div>
              <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600 transition-colors pr-1" />
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
            <button className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all flex items-center gap-2">
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
          {/* Main Chart/Activity Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold text-slate-900">Revenue Distribution</h3>
                <select className="bg-slate-50 border-none text-xs font-bold text-slate-500 rounded-lg px-3 py-1.5 outline-none">
                  <option>Last 30 Days</option>
                  <option>Last 6 Months</option>
                  <option>This Year</option>
                </select>
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
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
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
                      { client: 'Acme Corp', amount: '$4,500', status: 'Paid', date: 'Oct 24, 2024' },
                      { client: 'Globex Ltd', amount: '$2,100', status: 'Pending', date: 'Oct 23, 2024' },
                      { client: 'Soylent Inc', amount: '$8,900', status: 'Overdue', date: 'Oct 21, 2024' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-4 font-bold text-slate-900">{row.client}</td>
                        <td className="px-8 py-4 text-slate-500">{row.amount}</td>
                        <td className="px-8 py-4">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            row.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                            row.status === 'Pending' ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {row.status}
                          </span>
                        </td>
                        <td className="px-8 py-4 text-slate-400 text-sm">{row.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Business Details Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white overflow-hidden">
                  {businessData?.logo ? (
                    <img src={businessData.logo} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <ShieldCheck className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Compliance Status</h3>
                  <p className="text-xs text-emerald-600 font-bold">FBR Verified</p>
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
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Province</p>
                  <p className="text-sm font-bold text-slate-900">{businessData?.province || 'Punjab'}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">FBR Status</p>
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-bold text-emerald-600">{businessData?.isFbrEnabled ? 'Live' : 'Sandbox Ready'}</p>
                    <Settings className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 text-white relative overflow-hidden group">
              <HelpCircle className="absolute -right-4 -top-4 w-24 h-24 text-white/5 rotate-12 group-hover:rotate-0 transition-transform duration-500" />
              <h3 className="text-lg font-bold mb-2">Need Assistance?</h3>
              <p className="text-slate-400 text-sm mb-6 leading-relaxed">Our enterprise support team is available 24/7 to help with your operations.</p>
              <button className="w-full py-3 bg-white text-slate-950 rounded-xl font-bold text-sm hover:bg-slate-100 transition-all active:scale-[0.98]">
                Chat with Support
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
