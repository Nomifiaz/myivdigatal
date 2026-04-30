import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  FileText, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Download, 
  Printer, 
  Loader2,
  Calendar,
  DollarSign,
  User,
  ArrowUpRight,
  Receipt
} from 'lucide-react';
import { invoiceService } from '../services/api';
import NewInvoice from './NewInvoice';
import InvoicePreview from './InvoicePreview';

const Invoices: React.FC<{ businessData: any }> = ({ businessData }) => {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const response = await invoiceService.getInvoices();
      if (response && response.success && Array.isArray(response.data)) {
        setInvoices(response.data);
      } else if (Array.isArray(response)) {
        setInvoices(response);
      } else {
        setInvoices([]);
      }
    } catch (err) {
      console.error('Failed to fetch invoices', err);
      setInvoices([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.id.toString().includes(searchTerm) || 
    inv.clientName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isCreating) {
    return (
      <NewInvoice 
        businessData={businessData} 
        onBack={() => setIsCreating(false)} 
        onSuccess={() => {
          setIsCreating(false);
          fetchInvoices();
        }}
      />
    );
  }

  if (selectedInvoice) {
    return (
        <InvoicePreview 
            invoice={selectedInvoice} 
            businessData={businessData}
            onBack={() => setSelectedInvoice(null)} 
        />
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight text-white px-2">Ledger Archive</h1>
          <p className="text-slate-500 text-sm font-medium">Tracking all financial flows and tax settlements.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by ID or client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 text-sm font-medium w-full md:w-80 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            New Invoice
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Scanning Ledger...</p>
        </div>
      ) : filteredInvoices.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-slate-200 p-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-6">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">Archive Empty</h3>
          <p className="text-slate-500 mt-2 max-w-sm">Start generating tax-compliant invoices to track your business growth.</p>
          <button 
            onClick={() => setIsCreating(true)}
            className="mt-8 flex items-center gap-2 text-slate-900 font-black text-sm hover:underline"
          >
            <Plus className="w-4 h-4" />
            Create Your First Invoice
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredInvoices.map((inv) => (
            <motion.div 
              key={inv.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setSelectedInvoice(inv)}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                 <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                      <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">INV #{inv.id}</span>
                          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                            inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                          }`}>
                            {inv.status}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900 leading-none">{inv.clientName || 'Direct Sale'}</h3>
                    </div>
                 </div>

                 <div className="flex flex-wrap items-center gap-8">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg">
                            <Calendar className="w-4 h-4 text-slate-400" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Date</p>
                            <p className="text-xs font-bold text-slate-700">{new Date(inv.invoiceDate).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 min-w-[120px]">
                        <div className="p-2 bg-slate-50 rounded-lg">
                            <DollarSign className="w-4 h-4 text-[#00B8D4]" />
                        </div>
                        <div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Settlement</p>
                            <p className="text-sm font-black text-slate-900">Rs {inv.totalInclTax || inv.grandTotal || '0'}</p>
                        </div>
                    </div>
                    <button className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all">
                        <ArrowUpRight className="w-5 h-5" />
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Invoices;
