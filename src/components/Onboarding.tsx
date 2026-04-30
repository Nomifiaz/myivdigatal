import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Building2, 
  Fingerprint, 
  MapPin, 
  ShieldCheck, 
  Send, 
  Loader2, 
  AlertCircle,
  Building,
  Globe,
  CreditCard
} from 'lucide-react';
import { authService } from '../services/api';

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    ntn: '',
    cnic: '',
    address: '',
    province: 'Punjab',
    fbrSandboxToken: '',
    fbrProductionToken: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await authService.registerBusiness(formData);
      onComplete();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 text-center">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center justify-center p-3 bg-slate-900 rounded-2xl shadow-xl mb-6"
          >
            <Building2 className="w-8 h-8 text-white" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl font-bold text-slate-900 tracking-tight"
          >
            Setup Your Business
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-3 text-lg text-slate-500"
          >
            Register your enterprise identity and configure FBR connectivity.
          </motion.p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8 bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-2xl flex items-center gap-4 font-medium"
          >
            <AlertCircle className="w-6 h-6" />
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* General Information Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
              <Building className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">General Information</h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Business Name</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. BizManager Pro Enterprise"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">NTN Number</label>
                <input 
                  type="text" 
                  name="ntn"
                  required
                  value={formData.ntn}
                  onChange={handleChange}
                  placeholder="1234567-8"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">CNIC Number (Proprietor)</label>
                <input 
                  type="text" 
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  placeholder="42101-1234567-1"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
                />
              </div>
            </div>
          </section>

          {/* Location Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
              <MapPin className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Physical Location</h2>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700">Street Address</label>
                <input 
                  type="text" 
                  name="address"
                  required
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Street, City"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Province</label>
                <select 
                  name="province"
                  value={formData.province}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-medium appearance-none"
                >
                  <option value="Punjab">Punjab</option>
                  <option value="Sindh">Sindh</option>
                  <option value="KPK">KPK</option>
                  <option value="Balochistan">Balochistan</option>
                  <option value="Islamabad">Islamabad</option>
                </select>
              </div>
            </div>
          </section>

          {/* FBR Compliance Section */}
          <section className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">FBR Configuration</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">FBR Sandbox Token</label>
                <input 
                  type="text" 
                  name="fbrSandboxToken"
                  value={formData.fbrSandboxToken}
                  onChange={handleChange}
                  placeholder="Paste your sandbox token"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-mono text-sm"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">FBR Production Token</label>
                <input 
                  type="text" 
                  name="fbrProductionToken"
                  value={formData.fbrProductionToken}
                  onChange={handleChange}
                  placeholder="Paste your production token"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 transition-all font-mono text-sm"
                />
              </div>
            </div>
          </section>

          <footer className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-4">
            <div className="flex items-center gap-3 text-slate-500">
              <Fingerprint className="w-5 h-5" />
              <p className="text-sm font-medium">Your data is secured with enterprise-grade encryption.</p>
            </div>
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-slate-950 text-white px-10 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-900 transition-all active:scale-[0.98] shadow-2xl shadow-slate-900/20 disabled:opacity-70"
            >
              {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                  Complete Setup
                  <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;
