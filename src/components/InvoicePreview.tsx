import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Printer, 
  Download, 
  Loader2,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { invoiceService } from '../services/api';

interface InvoicePreviewProps {
  invoice: any;
  businessData: any;
  onBack: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice: initialInvoice, businessData: initialBusinessData, onBack }) => {
  const [invoice, setInvoice] = useState<any>(initialInvoice);
  const [isLoading, setIsLoading] = useState(!initialInvoice.InvoiceItems);

  useEffect(() => {
    const fetchFullInvoice = async () => {
      if (!initialInvoice.InvoiceItems && initialInvoice.id) {
        try {
          const response = await invoiceService.getInvoiceById(initialInvoice.id);
          setInvoice(response.invoice || response);
        } catch (err) {
          console.error("Failed to fetch full invoice:", err);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchFullInvoice();
  }, [initialInvoice]);

  const printInvoice = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#0D47A1] mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Professional Invoice...</p>
      </div>
    );
  }

  const business = invoice.Business || initialBusinessData;
  const client = invoice.Client || {};
  const items = invoice.InvoiceItems || invoice.items || [];

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

      {/* Professional A4 Invoice */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white shadow-2xl rounded-none overflow-hidden print:shadow-none print:m-0"
        id="printable-invoice"
        style={{ minHeight: '1120px', padding: '40px' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#0D47A1] rounded-lg flex items-center justify-center text-white">
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-2.5 h-2.5 bg-white rounded-sm" />
                        <div className="w-2.5 h-2.5 bg-white/40 rounded-sm" />
                        <div className="w-2.5 h-2.5 bg-white/40 rounded-sm" />
                        <div className="w-2.5 h-2.5 bg-white rounded-sm" />
                    </div>
                </div>
                <div>
                   <h1 className="text-2xl font-black text-slate-900 tracking-tighter leading-none">{business?.name || business?.businessName}</h1>
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Innovations</p>
                </div>
            </div>
            <div className="text-right">
                <div className="bg-[#1e40af] text-white px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest mb-3 inline-block">
                    FBR TAX INVOICE
                </div>
                <div className="space-y-0.5">
                    <p className="text-[11px] font-bold text-slate-900">Invoice #: <span className="font-black text-slate-900">{invoice.invoiceRefNo || `INV-${invoice.id}`}</span></p>
                    <p className="text-[11px] font-bold text-slate-900">Date: <span className="font-black text-slate-900">{new Date(invoice.invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></p>
                </div>
            </div>
        </div>

        <div className="h-0.5 bg-[#1e40af] mb-8" />

        {/* Info Blocks */}
        <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-[#f8fafc] border border-slate-100 rounded-lg overflow-hidden">
                <div className="bg-[#f8fafc] border-b border-slate-100 px-4 py-2">
                    <h3 className="text-[10px] font-black text-blue-800 uppercase tracking-widest">SELLER INFORMATION</h3>
                </div>
                <div className="p-4 space-y-2">
                    <p className="text-sm font-black text-slate-900">{business?.name || business?.businessName}</p>
                    <div className="text-[11px] font-medium text-slate-600 space-y-1">
                        <p>Province: <span className="font-bold">{business?.province || 'NCR'}</span></p>
                        <p>Tel: <span className="font-bold text-slate-900">+{business?.phone || '923456789546'}</span></p>
                    </div>
                </div>
            </div>
            <div className="bg-[#f8fafc] border border-slate-100 rounded-lg overflow-hidden">
                <div className="bg-[#f8fafc] border-b border-slate-100 px-4 py-2">
                    <h3 className="text-[10px] font-black text-blue-800 uppercase tracking-widest">BUYER INFORMATION</h3>
                </div>
                <div className="p-4 space-y-1.5">
                    <p className="text-sm font-black text-slate-900">{client?.name || 'Walk-in Customer'}</p>
                    <div className="text-[11px] font-medium text-slate-600 space-y-1">
                        <p>Address: <span className="font-bold">{client?.address || 'N/A'}</span></p>
                        <div className="flex items-center gap-1.5">
                           <span>Phone:</span>
                           <div className="flex items-center gap-1 text-emerald-600 font-bold">
                              <MessageCircle className="w-3 h-3" />
                              <span>+{client?.phone || '923498282340'}</span>
                           </div>
                        </div>
                        <p>Province: <span className="font-bold">{client?.province || 'NCR'}</span></p>
                        <p>Status: <span className="text-red-500 font-black">{client?.type || 'Unregistered'}</span></p>
                    </div>
                </div>
            </div>
        </div>

        {/* Table Head */}
        <div className="bg-[#2b58ae] text-white grid grid-cols-12 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-t-lg">
            <div className="col-span-1">Sr</div>
            <div className="col-span-4">Description / HS Code</div>
            <div className="col-span-1 text-center">Qty/UOM</div>
            <div className="col-span-2 text-right">Per Unit Price</div>
            <div className="col-span-1 text-right">Sub Total</div>
            <div className="col-span-1 text-right">Discount</div>
            <div className="col-span-2 text-right">Total Value</div>
        </div>

        {/* Table Content */}
        <div className="border-x border-b border-slate-200 rounded-b-lg divide-y divide-slate-100">
            {items.map((item: any, idx: number) => {
                const totalTaxable = (item.salePriceUnitExclTax || item.price) * item.fbrQty;
                return (
                    <div key={idx} className="bg-white">
                        {/* Main Row */}
                        <div className="grid grid-cols-12 px-4 py-3 text-[11px] items-start">
                            <div className="col-span-1 text-slate-400 font-bold">{idx + 1}</div>
                            <div className="col-span-4 pr-4">
                                <p className="font-black text-slate-900">{item.Product?.productName || item.productName || 'Product Title'}</p>
                                <p className="text-[10px] text-slate-500 mt-0.5">{item.hsCode || item.Product?.hsCode || '0000.0000'}</p>
                            </div>
                            <div className="col-span-1 text-center font-bold">
                                {item.fbrQty || item.quantity}
                                <p className="text-[8px] text-slate-400 uppercase font-black tracking-tighter mt-0.5">{item.uom || item.Product?.uom || 'piece'}</p>
                            </div>
                            <div className="col-span-2 text-right font-black">{(item.salePriceUnitExclTax || item.price).toLocaleString()}</div>
                            <div className="col-span-1 text-right font-black">{(item.taxableValue || totalTaxable).toLocaleString()}</div>
                            <div className="col-span-1 text-right font-black text-slate-300">-</div>
                            <div className="col-span-2 text-right font-black bg-[#fffce0] py-2 px-2 rounded -my-2">
                                {(item.valueInclTax || item.totalInclTax).toLocaleString()}
                            </div>
                        </div>
                        {/* Tax Row */}
                        <div className="grid grid-cols-12 px-4 py-2 text-[9px] bg-[#f8fafc] border-t border-slate-50 italic">
                            <div className="col-span-4">
                                <p className="font-black text-slate-500">Sale Type</p>
                                <p className="font-medium text-slate-400 truncate">{item.saleType || 'Goods at standard rate (default)'}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="font-black text-slate-500">Taxable Value</p>
                                <p className="font-medium text-slate-400">Price {(item.salePriceUnitExclTax || item.price)} x {(item.fbrQty || item.quantity)}</p>
                                <p className="font-black text-slate-900">{(item.taxableValue || totalTaxable).toLocaleString()}</p>
                            </div>
                            <div className="col-span-1 text-center">
                                <p className="font-black text-slate-500 uppercase">GST</p>
                                <p className="font-black text-blue-700">{item.gstPercent || item.gstRate}%</p>
                                <p className="font-bold">{(item.gstAmt).toFixed(2)}</p>
                            </div>
                            <div className="col-span-1 text-center">
                                <p className="font-black text-slate-500 uppercase">F.Tax</p>
                                <p className="font-black text-blue-700">{item.ftPercent || item.ftRate || 0}%</p>
                                <p className="font-bold">{(item.ftAmt || 0).toFixed(2)}</p>
                            </div>
                            <div className="col-span-1 text-center">
                                <p className="font-black text-slate-500 uppercase">FED</p>
                                <p className="font-black text-blue-700">{item.fedPercent || item.fedRate || 0}%</p>
                                <p className="font-bold">{(item.fedAmt || 0).toFixed(2)}</p>
                            </div>
                            <div className="col-span-1 text-center">
                                <p className="font-black text-slate-500 uppercase">Extra</p>
                                <p className="font-black text-blue-700">{item.extPercent || item.extRate || 0}%</p>
                                <p className="font-bold">{(item.extAmt || 0).toFixed(2)}</p>
                            </div>
                            <div className="col-span-1 text-center">
                                <p className="font-black text-emerald-600 uppercase">Total Tax</p>
                                <p className="font-black text-emerald-700">{(item.totalTax).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="col-span-1 text-right">
                                <p className="font-black text-blue-800 uppercase">Total + Tax</p>
                                <p className="font-black text-blue-900 text-[10px]">{(item.valueInclTax || item.totalInclTax).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* QR & Totals */}
        <div className="grid grid-cols-12 gap-8 items-start mt-12 mb-12">
            <div className="col-span-5">
                <div className="aspect-square bg-amber-50 border-2 border-amber-200 rounded-2xl flex flex-col items-center justify-center p-8 text-center border-dashed">
                    <p className="text-amber-700 font-black text-sm uppercase tracking-widest leading-tight">Pending FBR Submission</p>
                    <p className="text-amber-500 text-[10px] font-bold mt-2">QR code will appear after FBR submission</p>
                </div>
            </div>
            <div className="col-span-7">
                <div className="border border-slate-100 rounded-xl overflow-hidden shadow-sm">
                    <div className="p-4 grid grid-cols-2 text-xs font-bold items-center">
                        <p className="text-slate-500">Total Value (Excl. Tax)</p>
                        <p className="text-right text-slate-900 font-black">{invoice.subtotal?.toLocaleString()}</p>
                    </div>
                    <div className="p-4 grid grid-cols-2 text-xs font-bold items-center border-t border-slate-50">
                        <p className="text-slate-500">Total GST</p>
                        <p className="text-right text-slate-900 font-black">{invoice.totalGST?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="p-5 grid grid-cols-2 text-lg font-black items-center bg-[#2b58ae] text-white">
                        <p className="uppercase tracking-tighter text-sm">Grand Total</p>
                        <p className="text-right tracking-tight">Rs {invoice.grandTotal?.toLocaleString()}</p>
                    </div>
                    <div className="p-3 grid grid-cols-2 text-xs font-black items-center bg-red-50 text-red-600">
                        <p className="uppercase tracking-widest text-[10px]">Amount Due</p>
                        <p className="text-right">Rs {invoice.grandTotal?.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-auto pt-12 border-t border-slate-100 text-[10px] text-slate-400">
            <div className="flex justify-between items-end">
                <div>
                    <p className="font-black text-slate-900 mb-1">{business?.name || business?.businessName}</p>
                    <p>Tel: +{business?.phone || '923456789546'}</p>
                </div>
                <div className="text-right space-y-1">
                    <p className="font-bold">Generated: {new Date().toLocaleString()}</p>
                    <p className="font-black text-slate-900 tracking-widest">This is a computer-generated document</p>
                </div>
            </div>
        </div>
      </motion.div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          body {
            background: white;
          }
          .no-print {
            display: none !important;
          }
          #printable-invoice {
            width: 100% !important;
            min-height: 100vh !important;
            padding: 20mm !important;
            box-shadow: none !important;
            margin: 0 !important;
            border: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoicePreview;
