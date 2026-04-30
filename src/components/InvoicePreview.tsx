import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  ShieldCheck, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin,
  Globe,
  Loader2
} from 'lucide-react';

interface InvoicePreviewProps {
  invoice: any;
  businessData: any;
  onBack: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice, businessData, onBack }) => {
  const printInvoice = () => {
    window.print();
  };

  // Mock calculations if data missing from simplified fetch
  const subtotal = invoice.items?.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) || 0;
  const gst = subtotal * 0.18;
  const total = subtotal + gst;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Action Bar */}
      <div className="flex items-center justify-between no-print">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-xl font-black text-slate-900 tracking-tight">Invoice Review</h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={printInvoice}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm font-black hover:bg-slate-50 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print
          </button>
          <button 
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      {/* Actual Paper Invoice */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-2xl rounded-none md:rounded-lg overflow-hidden border border-slate-100 print:shadow-none print:border-none"
        id="printable-invoice"
      >
        {/* Blue Header Stripe */}
        <div className="bg-[#0D47A1] text-white px-10 py-4 flex justify-between items-center">
            <h2 className="text-sm font-black uppercase tracking-[0.2em]">Sales Tax Invoice</h2>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-blue-200">FBR Compliant - System Generated</span>
            </div>
        </div>

        <div className="p-10 space-y-10">
            {/* Business Info Layer */}
            <div className="flex justify-between items-start gap-10">
                <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-[#0D47A1] font-black text-xl italic p-2 text-center leading-tight">
                        {businessData.businessName}
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-[#0D47A1] tracking-tighter">{businessData.businessName}</h1>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">NTN: {businessData.ntn || 'PENDING'}</span>
                            <div className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">STRN: {businessData.strn || 'PENDING'}</span>
                        </div>
                    </div>
                </div>
                <div className="text-right space-y-1">
                    <p className="text-lg font-black text-slate-900">Invoice #: <span className="font-mono">INV-{new Date(invoice.invoiceDate).getFullYear()}{invoice.id.toString().padStart(4, '0')}</span></p>
                    <p className="text-sm font-bold text-slate-500">Date: {new Date(invoice.invoiceDate).toLocaleDateString()}</p>
                    <div className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mt-2 ${
                        invoice.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                        {invoice.status}
                    </div>
                </div>
            </div>

            {/* Supplier & Buyer Boxes */}
            <div className="grid grid-cols-2 border border-slate-200 rounded-lg overflow-hidden">
                <div className="border-r border-slate-200">
                    <div className="bg-[#0D47A1] text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest">Supplier</div>
                    <div className="p-6 space-y-3">
                        <p className="font-black text-slate-900">{businessData.businessName}</p>
                        <div className="space-y-1 text-xs font-bold text-slate-500">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                                <span>{businessData.address}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-3 h-3 shrink-0" />
                                <span>{businessData.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <div className="bg-[#0D47A1] text-white px-4 py-2 text-[10px] font-black uppercase tracking-widest">Buyer</div>
                    <div className="p-6 space-y-3">
                        <p className="font-black text-slate-900">{invoice.clientName || 'Cash Customer'}</p>
                        <div className="space-y-1 text-xs font-bold text-slate-500">
                            <div className="flex items-start gap-2">
                                <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                                <span>{invoice.clientAddress || 'Default Location'}</span>
                            </div>
                            <div className="flex items-center gap-2 text-emerald-600">
                                <Phone className="w-3 h-3 shrink-0" />
                                <span>+92 {invoice.clientPhone || '0000000000'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Line Items Table */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 text-[10px] font-black uppercase tracking-widest text-[#0D47A1] border-b border-slate-200">
                            <th className="px-6 py-4">SR#</th>
                            <th className="px-6 py-4">Item Description & HS Code</th>
                            <th className="px-6 py-4 text-center">Qty</th>
                            <th className="px-6 py-4 text-right">Rate</th>
                            <th className="px-6 py-4 text-right">Excl. Tax</th>
                            <th className="px-6 py-4 text-center">Tax%</th>
                            <th className="px-6 py-4 text-right">Tax Amt</th>
                            <th className="px-6 py-4 text-right">Incl. Tax</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                        {(invoice.items || []).map((item: any, idx: number) => (
                            <tr key={idx}>
                                <td className="px-6 py-4 text-slate-400">{idx + 1}</td>
                                <td className="px-6 py-4">
                                    <p className="text-slate-900 font-black">{item.productName}</p>
                                    <p className="text-[10px] text-[#0D47A1]">HS: {item.hsCode || '2820.1010'}</p>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    {item.quantity}
                                    <p className="text-[9px] text-slate-400 uppercase">piece</p>
                                </td>
                                <td className="px-6 py-4 text-right">{item.price.toLocaleString()}</td>
                                <td className="px-6 py-4 text-right">{(item.price * item.quantity).toLocaleString()}</td>
                                <td className="px-6 py-4 text-center text-emerald-600 font-black">18%</td>
                                <td className="px-6 py-4 text-right">{((item.price * item.quantity) * 0.18).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                                <td className="px-6 py-4 text-right font-black">{(item.price * item.quantity * 1.18).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals Section */}
            <div className="flex justify-end pt-10">
                <div className="w-80 space-y-4">
                    <div className="grid grid-cols-2 text-sm">
                        <span className="font-black text-slate-900">Subtotal</span>
                        <span className="text-right font-black text-slate-900">PKR {subtotal.toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-2 text-sm py-2">
                        <span className="text-slate-500 font-bold">Sales Tax 18%</span>
                        <span className="text-right text-slate-500 font-bold">PKR {gst.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="grid grid-cols-2 text-lg border-t-2 border-[#0D47A1] pt-4">
                        <span className="font-black text-[#0D47A1]">Total</span>
                        <span className="text-right font-black text-[#0D47A1]">PKR {total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                </div>
            </div>

            {/* Footer Branding */}
            <div className="pt-20 flex items-center justify-center gap-4 text-[10px] font-bold text-slate-400 no-print">
                <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white text-[8px] font-black">FBR</div>
                <p>Powered by <span className="text-slate-900 font-black">Invoizeo Digital</span> — Pakistan's FBR Digital Invoicing Platform</p>
            </div>
        </div>
      </motion.div>
      
      {/* Print Specific CSS */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            border: none;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoicePreview;
