import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit3, 
  Trash2, 
  ChevronDown,
  Info,
  X,
  Loader2,
  AlertCircle,
  Hash,
  Contact,
  Mail,
  Phone,
  MapPin,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Briefcase
} from 'lucide-react';
import { clientService } from '../services/api';

interface Client {
  id: number;
  name: string;
  cnic: string;
  ntn: string;
  type: string;
  phone: string;
  email: string;
  address: string;
  province: string;
  createdAt: string;
}

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    cnic: '',
    ntn: '',
    type: 'Registered',
    phone: '',
    email: '',
    address: '',
    province: 'Punjab'
  });

  const provinces = ['Punjab', 'Sindh', 'Khyber Pakhtunkhwa', 'Balochistan', 'Islamabad', 'Gilgit-Baltistan', 'Azad Kashmir'];
  const clientTypes = ['Registered', 'Unregistered', 'Wholesale', 'Retail', 'International'];

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await clientService.getClients();
      if (response && response.success && Array.isArray(response.data)) {
        setClients(response.data);
      } else if (Array.isArray(response)) {
        setClients(response);
      } else {
        setClients([]);
      }
    } catch (err: any) {
      setError(err.message);
      setClients([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      await clientService.addClient(formData);
      setIsModalOpen(false);
      resetForm();
      fetchClients();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this client?')) return;
    try {
      await clientService.deleteClient(id);
      fetchClients();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      cnic: '',
      ntn: '',
      type: 'Registered',
      phone: '',
      email: '',
      address: '',
      province: 'Punjab'
    });
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.ntn.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Partner Directory</h1>
          <p className="text-slate-500 text-sm font-medium">Manage your registered customers, wholesalers and vendors.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, phone or NTN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 text-sm font-medium w-full md:w-80 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Partner
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Loading Directory...</p>
        </div>
      ) : filteredClients.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-slate-200 p-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
            <Users className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Partners Found</h3>
          <p className="text-slate-500 mt-2 max-w-sm">Connect with your customers by adding their profiles and financial details.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-8 flex items-center gap-2 text-slate-900 font-black text-sm hover:underline"
          >
            <Plus className="w-4 h-4" />
            Register Your First Client
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Partner Details</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contact Info</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Identity (NTN/CNIC)</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Region</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-black text-xs">
                          {client.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-none">{client.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${
                              client.type === 'Registered' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {client.type}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                          <Phone className="w-3 h-3 text-slate-300" />
                          {client.phone}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
                          <Mail className="w-3 h-3" />
                          {client.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-slate-300 uppercase">NTN:</span>
                          <span className="text-[10px] font-bold text-slate-700 font-mono">{client.ntn || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black text-slate-300 uppercase">CNIC:</span>
                          <span className="text-[10px] font-bold text-slate-700 font-mono">{client.cnic || 'N/A'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-[#00B8D4]" />
                        <span className="text-xs font-bold text-slate-700">{client.province}</span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1 truncate max-w-[150px] font-medium">{client.address}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(client.id)}
                          className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Client Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl max-h-[calc(100vh-4rem)] bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Partner Registration</h2>
                    <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider">Onboard new clients to your business profile</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white rounded-xl transition-colors shadow-sm"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-8">
                {error && (
                  <div className="mb-8 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Basic Identity */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-4 bg-slate-900 rounded-full" />
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Partner Identity</h4>
                    </div>
                    
                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12 md:col-span-8 space-y-2">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Full Business/Customer Name *</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Enter business or person name"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-slate-900 focus:bg-white focus:border-slate-900 outline-none transition-all pr-12"
                          />
                          <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        </div>
                      </div>
                      
                      <div className="col-span-12 md:col-span-4 space-y-2">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Partner Category</label>
                        <div className="relative">
                          <select 
                             value={formData.type}
                             onChange={(e) => setFormData({...formData, type: e.target.value})}
                             className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-slate-900 appearance-none focus:bg-white focus:border-slate-900 outline-none transition-all cursor-pointer"
                          >
                            {clientTypes.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6 space-y-2">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">CNIC (Pakistan)</label>
                        <input 
                          type="text" 
                          value={formData.cnic}
                          onChange={(e) => setFormData({...formData, cnic: e.target.value})}
                          placeholder="42101-XXXXXXX-X"
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-900 outline-none"
                        />
                      </div>

                      <div className="col-span-12 md:col-span-6 space-y-2">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">NTN Number</label>
                        <input 
                          type="text" 
                          value={formData.ntn}
                          onChange={(e) => setFormData({...formData, ntn: e.target.value})}
                          placeholder="1234567-0"
                          className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm font-bold text-slate-900 focus:bg-white focus:border-slate-900 outline-none"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Reachability */}
                  <section className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-4 bg-slate-900 rounded-full" />
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Contact & Location</h4>
                    </div>

                    <div className="grid grid-cols-12 gap-6">
                      <div className="col-span-12 md:col-span-6 space-y-2">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Primary Phone *</label>
                        <div className="relative">
                          <input 
                            type="tel" 
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="03XX-XXXXXXX"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-slate-900 focus:bg-white focus:border-slate-900 outline-none pr-12"
                          />
                          <Phone className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-6 space-y-2">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Email Address</label>
                        <div className="relative">
                          <input 
                            type="email" 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="customer@domain.com"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-slate-900 focus:bg-white focus:border-slate-900 outline-none pr-12"
                          />
                          <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-4 space-y-2">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Province</label>
                        <div className="relative">
                          <select 
                             value={formData.province}
                             onChange={(e) => setFormData({...formData, province: e.target.value})}
                             className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-slate-900 appearance-none focus:bg-white focus:border-slate-900 outline-none transition-all cursor-pointer"
                          >
                            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                          </select>
                          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      <div className="col-span-12 md:col-span-8 space-y-2">
                        <label className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Office/Billing Address</label>
                        <div className="relative">
                          <input 
                            type="text" 
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            placeholder="Complete street address, city"
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-slate-900 focus:bg-white focus:border-slate-900 outline-none pr-12"
                          />
                          <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        </div>
                      </div>
                    </div>
                  </section>
                </form>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3 text-slate-400">
                  <ShieldCheck className="w-5 h-5" />
                  <p className="text-[10px] font-bold uppercase tracking-widest font-mono">Tax Compliance Verified</p>
                </div>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 rounded-2xl font-black text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/40 hover:bg-slate-800 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-70 group"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Complete Registration
                        <Plus className="w-5 h-5 group-hover:scale-110 transition-transform" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Clients;
