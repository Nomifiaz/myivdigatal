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
// @ts-ignore
import html2pdf from 'html2pdf.js';

interface InvoicePreviewProps {
  invoice: any;
  businessData: any;
  onBack: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice: initialInvoice, businessData: initialBusinessData, onBack }) => {
  const [invoice, setInvoice] = useState<any>(initialInvoice);
  const [isLoading, setIsLoading] = useState(!initialInvoice.InvoiceItems);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const downloadPDF = () => {
    const element = document.getElementById('printable-invoice');
    if (!element) return;

    setIsGeneratingPDF(true);

    const opt = {
      margin: 0,
      filename: `${invoice.invoiceRefNo || `INV-${invoice.id}`}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    html2pdf().from(element).set(opt).save().then(() => {
      setIsGeneratingPDF(false);
    }).catch((err: any) => {
      console.error("PDF Error:", err);
      setIsGeneratingPDF(false);
    });
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
            onClick={downloadPDF}
            disabled={isGeneratingPDF}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 disabled:opacity-50"
          >
            {isGeneratingPDF ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
          </button>
        </div>
      </div>

      {/* Professional A4 Invoice */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white shadow-2xl rounded-none overflow-hidden print:shadow-none print:m-0"
        id="printable-invoice"
        style={{ minHeight: '1120px', padding: '40px', boxSizing: 'border-box' }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-[#0D47A1] rounded-lg flex items-center justify-center text-white">
                    <div className="grid grid-cols-2 gap-0.5">
                        <div className="w-3 h-3 bg-white rounded-sm" />
                        <div className="w-3 h-3 bg-white/40 rounded-sm" />
                        <div className="w-3 h-3 bg-white/40 rounded-sm" />
                        <div className="w-3 h-3 bg-white rounded-sm" />
                    </div>
                </div>
                <div>
                   <h1 className="text-2xl font-black text-[#0D47A1] uppercase tracking-tight leading-none mb-1">{business?.name || business?.businessName || 'Innovations'}</h1>
                   <p className="text-[12px] font-black text-slate-800 uppercase tracking-[0.2em]">Innovations</p>
                </div>
            </div>
            <div className="text-right">
                <div className="bg-[#1e40af] text-white px-4 py-1.5 rounded text-[11px] font-black uppercase tracking-[0.2em] mb-4 inline-block">
                    FBR TAX INVOICE
                </div>
                <div className="space-y-1">
                    <p className="text-[12px] font-bold text-slate-600">Invoice #: <span className="font-black text-slate-900">{invoice.invoiceRefNo || `INV-${invoice.id}`}</span></p>
                    <p className="text-[12px] font-bold text-slate-600">Date: <span className="font-black text-slate-900 uppercase">{new Date(invoice.invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></p>
                </div>
            </div>
        </div>

        <div className="h-1 bg-[#2b58ae] mb-8" />

        {/* Info Blocks */}
        <div className="grid grid-cols-2 gap-6 mb-8">
            <div className="bg-[#f8fafc] border border-slate-200 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-[#f8fafc] border-b border-slate-200 px-5 py-2.5">
                    <h3 className="text-[11px] font-black text-blue-800 uppercase tracking-[0.1em]">SELLER INFORMATION</h3>
                </div>
                <div className="p-5 flex-1 space-y-3">
                    <p className="text-base font-black text-slate-900">{business?.name || business?.businessName || 'Innovations'}</p>
                    <div className="text-[12px] font-medium text-slate-600 space-y-1.5">
                        <p className="flex justify-between"><span>Province:</span> <span className="font-black text-slate-900">{business?.province || 'Punjab'}</span></p>
                        <p className="flex justify-between"><span>Tel:</span> <span className="font-black text-slate-900">+{business?.phone || '923456789546'}</span></p>
                    </div>
                </div>
            </div>
            <div className="bg-[#f8fafc] border border-slate-200 rounded-lg overflow-hidden flex flex-col">
                <div className="bg-[#f8fafc] border-b border-slate-200 px-5 py-2.5">
                    <h3 className="text-[11px] font-black text-blue-800 uppercase tracking-[0.1em]">BUYER INFORMATION</h3>
                </div>
                <div className="p-5 flex-1 space-y-2">
                    <p className="text-base font-black text-slate-900">{client?.name || 'samar fiaz'}</p>
                    <div className="text-[12px] font-medium text-slate-600 space-y-1.5">
                        <p className="flex justify-between"><span>Address:</span> <span className="font-black text-slate-900 text-right">{client?.address || 'power market G10/4 islambad'}</span></p>
                        <div className="flex justify-between items-center">
                           <span>Phone:</span>
                           <div className="flex items-center gap-1.5 text-emerald-600 font-black">
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>+{client?.phone || '923498282340'}</span>
                           </div>
                        </div>
                        <p className="flex justify-between"><span>Province:</span> <span className="font-black text-slate-900">{client?.province || 'Sindh'}</span></p>
                        <p className="flex justify-between"><span>Status:</span> <span className="text-red-600 font-black uppercase tracking-wider underline decoration-2 underline-offset-4">{client?.type || 'Unregistered'}</span></p>
                    </div>
                </div>
            </div>
        </div>

        {/* Table Head */}
        <div className="bg-[#2b58ae] text-white grid grid-cols-12 text-[11px] font-black uppercase tracking-[0.1em] px-5 py-3 rounded-t-lg items-center">
            <div className="col-span-1">Sr</div>
            <div className="col-span-4">Description / HS Code</div>
            <div className="col-span-1 text-center">Qty/UOM</div>
            <div className="col-span-2 text-right px-2">Per Unit Price</div>
            <div className="col-span-1 text-right px-2">Sub Total</div>
            <div className="col-span-1 text-right px-2">Discount</div>
            <div className="col-span-2 text-right">Total Value</div>
        </div>

        {/* Table Content */}
        <div className="border-x border-b border-slate-200 rounded-b-lg divide-y divide-slate-200">
            {items.map((item: any, idx: number) => {
                const itemPrice = item.salePriceUnitExclTax || item.price || 0;
                const itemQty = item.fbrQty || item.quantity || 1;
                const totalTaxable = item.taxableValue || (itemPrice * itemQty);
                const valInclTax = item.valueInclTax || item.totalInclTax || (totalTaxable + (item.gstAmt || 0));

                return (
                    <div key={idx} className="bg-white">
                        {/* Main Row */}
                        <div className="grid grid-cols-12 px-5 py-4 text-[12px] items-center">
                            <div className="col-span-1 text-slate-400 font-black">{idx + 1}</div>
                            <div className="col-span-4 pr-6">
                                <p className="font-black text-slate-900 text-sm">{item.Product?.productName || item.productName || 'laptop'}</p>
                                <p className="text-[11px] text-slate-500 font-bold mt-1 tracking-wider">{item.hsCode || item.Product?.hsCode || '2820.1010'}</p>
                            </div>
                            <div className="col-span-1 text-center font-black">
                                <span className="text-slate-900">{itemQty}</span>
                                <p className="text-[9px] text-slate-400 uppercase font-black mt-1 leading-none">{item.uom || item.Product?.uom || 'piece'}</p>
                            </div>
                            <div className="col-span-2 text-right font-black px-2">{itemPrice.toLocaleString()}</div>
                            <div className="col-span-1 text-right font-black px-2">{totalTaxable.toLocaleString()}</div>
                            <div className="col-span-1 text-right font-black text-slate-300 px-2">-</div>
                            <div className="col-span-2 text-right font-black bg-[#fffce0] py-3 px-3 rounded-lg">
                                {valInclTax.toLocaleString()}
                            </div>
                        </div>
                        {/* Tax Row */}
                        <div className="grid grid-cols-12 px-5 py-3 text-[10px] bg-[#f8fafc] border-t border-slate-100">
                            <div className="col-span-3">
                                <p className="font-black text-slate-500 uppercase tracking-widest text-[9px] mb-1">Sale Type</p>
                                <p className="font-bold text-slate-700 leading-tight pr-4">{item.saleType || 'Goods at standard rate (default)'}</p>
                                <p className="text-[9px] font-black text-slate-400 mt-1">SR # N/A</p>
                            </div>
                            <div className="col-span-2">
                                <p className="font-black text-slate-500 uppercase tracking-widest text-[9px] mb-1">Taxable Value</p>
                                <p className="font-bold text-slate-400">Price {itemPrice.toLocaleString()} × {itemQty}</p>
                                <p className="font-black text-slate-900 mt-0.5">{totalTaxable.toLocaleString()}</p>
                            </div>
                            <div className="col-span-1 text-center border-l border-slate-200">
                                <p className="font-black text-slate-500 uppercase tracking-widest text-[8px] mb-1">GST</p>
                                <p className="font-black text-blue-700">{item.gstPercent || item.gstRate || 18}%</p>
                                <p className="font-black text-slate-900 mt-0.5">{(item.gstAmt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="col-span-1 text-center border-l border-slate-200">
                                <p className="font-black text-slate-500 uppercase tracking-widest text-[8px] mb-1">F.Tax</p>
                                <p className="font-black text-blue-700">{item.ftPercent || item.ftRate || 0}%</p>
                                <p className="font-black text-slate-900 mt-0.5">{(item.ftAmt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="col-span-1 text-center border-l border-slate-200">
                                <p className="font-black text-slate-500 uppercase tracking-widest text-[8px] mb-1">FED</p>
                                <p className="font-black text-blue-700">{item.fedPercent || item.fedRate || 0}%</p>
                                <p className="font-black text-slate-900 mt-0.5">{(item.fedAmt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="col-span-1 text-center border-l border-slate-200">
                                <p className="font-black text-slate-500 uppercase tracking-widest text-[8px] mb-1">Extra</p>
                                <p className="font-black text-blue-700">{item.extPercent || item.extRate || 0}%</p>
                                <p className="font-black text-slate-900 mt-0.5">{(item.extAmt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="col-span-1 text-center border-l border-emerald-200 bg-emerald-50/30">
                                <p className="font-black text-emerald-600 uppercase tracking-widest text-[8px] mb-1">Total Tax</p>
                                <p className="font-black text-emerald-700 mt-0.5 text-[11px]">{(item.totalTax || item.gstAmt || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="col-span-2 text-right border-l border-blue-200 bg-blue-50/30 px-3">
                                <p className="font-black text-blue-800 uppercase tracking-widest text-[8px] mb-1">Total + Tax</p>
                                <p className="font-black text-blue-900 text-[12px]">{valInclTax.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>

        {/* QR & Totals */}
        <div className="grid grid-cols-12 gap-10 items-stretch mt-12 mb-12">
            <div className="col-span-5">
                <div className="h-full min-h-[160px] bg-amber-50 border-2 border-amber-200 rounded-3xl flex flex-col items-center justify-center p-8 text-center border-dashed">
                    <p className="text-amber-800 font-black text-base uppercase tracking-[0.1em] leading-tight">Pending FBR Submission</p>
                    <p className="text-amber-600 text-[11px] font-black mt-3 uppercase tracking-wider opacity-60">QR code will appear after FBR submission</p>
                </div>
            </div>
            <div className="col-span-7">
                <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col">
                    <div className="p-4 grid grid-cols-2 text-[13px] font-black items-center px-8 flex-1">
                        <p className="text-slate-500 uppercase tracking-wider">Total Value (Excl. Tax)</p>
                        <p className="text-right text-slate-900">{invoice.subtotal?.toLocaleString()}</p>
                    </div>
                    <div className="p-4 grid grid-cols-2 text-[13px] font-black items-center border-t border-slate-100 px-8 flex-1">
                        <p className="text-slate-500 uppercase tracking-wider">Total GST</p>
                        <p className="text-right text-slate-900">{invoice.totalGST?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                    </div>
                    <div className="p-6 grid grid-cols-2 text-2xl font-black items-center bg-[#2b58ae] text-white px-8">
                        <p className="uppercase tracking-tighter text-base">Grand Total</p>
                        <p className="text-right tracking-tight font-black">Rs {invoice.grandTotal?.toLocaleString()}</p>
                    </div>
                    <div className="p-4 grid grid-cols-2 text-[13px] font-black items-center bg-red-50 text-red-600 px-8">
                        <p className="uppercase tracking-[0.2em] text-[10px]">Amount Due</p>
                        <p className="text-right font-black">Rs {invoice.grandTotal?.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-auto pt-10 border-t border-slate-200 text-[11px] text-slate-400 font-bold">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <p className="font-black text-slate-900 text-[13px]">{business?.name || business?.businessName || 'Innovations'}</p>
                    <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5" />
                        <span>+{business?.phone || '923456789546'}</span>
                    </div>
                </div>
                <div className="text-right space-y-1">
                    <p className="uppercase tracking-widest text-[10px]">Generated: <span className="font-black text-slate-700">{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' })}, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span></p>
                    <p className="font-black text-slate-900 uppercase tracking-[0.1em] text-[10px]">This is a computer-generated document</p>
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
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          #printable-invoice {
            width: 100% !important;
            min-height: 100vh !important;
            padding: 15mm !important;
            box-shadow: none !important;
            margin: 0 !important;
            border: none !important;
            transform: none !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
};

export default InvoicePreview;
