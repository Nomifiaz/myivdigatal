import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Printer, 
  Loader2,
  Phone,
  MessageCircle,
  Download,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { invoiceService, authService } from '../services/api';

interface InvoicePreviewProps {
  invoice: any;
  businessData: any;
  onBack: () => void;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoice: initialInvoice, businessData: initialBusinessData, onBack }) => {
  const [invoice, setInvoice] = useState<any>(initialInvoice);
  const [isLoading, setIsLoading] = useState(!initialInvoice.InvoiceItems);
  const [downloading, setDownloading] = useState(false);

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

  const handleDownload = async () => {
    if (!invoice?.id) return;
    try {
      setDownloading(true);
      await authService.downloadInvoice(invoice.id, `${invoiceNo}.pdf`);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-[#0D47A1] mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Loading Professional Invoice...</p>
      </div>
    );
  }

  const business = invoice.Business || initialBusinessData || {};
  const client = invoice.Client || {};
  const items = invoice.InvoiceItems || invoice.items || [];
  const invoiceNo = invoice.invoiceRefNo || (invoice.id ? `INV-${invoice.id}` : 'TEMP');

  // Fallback for buyer details if they are top-level on invoice
  const buyerName = client.name || invoice.clientName || 'Customer';
  const buyerAddress = client.address || invoice.clientAddress || invoice.buyerAddress || 'N/A';
  const buyerPhone = client.phone || invoice.clientPhone || invoice.buyerPhone || 'N/A';
  const buyerProvince = client.province || invoice.clientProvince || invoice.buyerProvince || 'N/A';
  const buyerStatus = client.type || invoice.clientStatus || 'Unregistered';

  return (
    <div className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-sm overflow-y-auto invoice-preview-container">
      <div className="min-h-screen flex flex-col py-6 px-4">
        {/* Action Bar */}
        <div className="max-w-5xl mx-auto w-full mb-6 flex items-center justify-between no-print bg-white p-4 rounded-2xl shadow-xl">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-3 hover:bg-slate-100 rounded-xl transition-colors flex items-center gap-2 text-slate-600 font-bold"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Ledger</span>
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={handleDownload}
              disabled={downloading}
              className="flex items-center gap-2 px-6 py-4 bg-slate-100 text-slate-700 rounded-xl text-lg font-bold hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {downloading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              <span>Download PDF</span>
            </button>
            <button 
              onClick={printInvoice}
              className="flex items-center gap-2 px-10 py-4 bg-[#0D47A1] text-white rounded-xl text-lg font-black hover:bg-[#1565C0] transition-all shadow-2xl shadow-blue-900/30 active:scale-95"
            >
              <Printer className="w-6 h-6" />
              Print Official Invoice
            </button>
          </div>
        </div>

        {/* Professional A4 Invoice */}
        <div className="flex justify-center pb-10">
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white shadow-[0_0_100px_rgba(0,0,0,0.1)] rounded-none overflow-hidden print:shadow-none print:m-0"
            id="printable-invoice"
            style={{ 
              width: '210mm',
              minHeight: '297mm',
              padding: '30px 40px', 
              boxSizing: 'border-box',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              position: 'relative'
            }}
          >
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                  {business?.logo ? (
                    <img 
                      src={authService.getLogoUrl(business.logo) || ''} 
                      alt="Logo" 
                      className="w-16 h-16 object-contain" 
                      referrerPolicy="no-referrer" 
                    />
                  ) : (
                    <div className="w-14 h-14 bg-[#0D47A1] rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: '#0D47A1' }}>
                        <div className="grid grid-cols-2 gap-0.5">
                            <div className="w-3 h-3 bg-white rounded-sm" />
                            <div className="w-3 h-3 bg-white/40 rounded-sm" />
                            <div className="w-3 h-3 bg-white/40 rounded-sm" />
                            <div className="w-3 h-3 bg-white rounded-sm" />
                        </div>
                    </div>
                  )}
                  <div>
                     <h1 className="text-2xl font-black text-[#0D47A1] uppercase tracking-tight leading-none mb-1" style={{ color: '#0D47A1' }}>{business?.name || business?.businessName || 'Innovations'}</h1>
                     <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">{business?.type || 'Innovations'}</p>
                  </div>
              </div>
              <div className="text-right">
                  <div className="bg-[#1e40af] text-white px-4 py-1.5 rounded text-[11px] font-black uppercase tracking-[0.2em] mb-4 inline-block" style={{ backgroundColor: '#1e40af' }}>
                      FBR TAX INVOICE
                  </div>
                  <div className="space-y-1">
                      <p className="text-[12px] font-bold text-slate-600" style={{ color: '#475569' }}>Invoice #: <span className="font-black text-slate-900" style={{ color: '#0f172a' }}>{invoiceNo}</span></p>
                      <p className="text-[12px] font-bold text-slate-600" style={{ color: '#475569' }}>Date: <span className="font-black text-slate-900 uppercase" style={{ color: '#0f172a' }}>{new Date(invoice.invoiceDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span></p>
                  </div>
              </div>
          </div>

          <div className="h-0.5 bg-slate-200 mb-6" />

          {/* Info Blocks */}
          <div className="grid grid-cols-2 gap-4 mb-5">
              <div className="bg-[#f8fafc] border border-slate-200 rounded-xl overflow-hidden flex flex-col" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                  <div className="bg-slate-100/50 border-b border-slate-200 px-4 py-1.5" style={{ borderBottomColor: '#e2e8f0' }}>
                      <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">SELLER INFORMATION</h3>
                  </div>
                  <div className="p-4 flex-1 space-y-2">
                      <p className="text-base font-black text-slate-900" style={{ color: '#0f172a' }}>{business?.name || business?.businessName || 'Innovations'}</p>
                      <div className="text-[11px] font-medium text-slate-600 space-y-1" style={{ color: '#475569' }}>
                          <p className="flex justify-between"><span>Province:</span> <span className="font-black text-slate-900" style={{ color: '#0f172a' }}>{business?.province || 'Punjab'}</span></p>
                          <p className="flex justify-between"><span>Tel:</span> <span className="font-black text-slate-900" style={{ color: '#0f172a' }}>+{business?.phone || '923456789546'}</span></p>
                      </div>
                  </div>
              </div>
              <div className="bg-[#f8fafc] border border-slate-200 rounded-xl overflow-hidden flex flex-col" style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}>
                  <div className="bg-slate-100/50 border-b border-slate-200 px-4 py-1.5" style={{ borderBottomColor: '#e2e8f0' }}>
                      <h3 className="text-[9px] font-black text-slate-500 uppercase tracking-widest">BUYER INFORMATION</h3>
                  </div>
                  <div className="p-4 flex-1 space-y-1.5">
                      <p className="text-base font-black text-slate-900" style={{ color: '#0f172a' }}>{buyerName}</p>
                      <div className="text-[11px] font-medium text-slate-600 space-y-1" style={{ color: '#475569' }}>
                          <p className="flex justify-between"><span>Address:</span> <span className="font-black text-slate-900 text-right max-w-[150px]" style={{ color: '#0f172a' }}>{buyerAddress}</span></p>
                          <div className="flex justify-between items-center">
                             <span>Phone:</span>
                             <div className="flex items-center gap-1 text-emerald-600 font-black" style={{ color: '#059669' }}>
                                <MessageCircle className="w-3 h-3" />
                                <span>{buyerPhone !== 'N/A' ? `+${buyerPhone}` : 'N/A'}</span>
                             </div>
                          </div>
                          <p className="flex justify-between"><span>Province:</span> <span className="font-black text-slate-900" style={{ color: '#0f172a' }}>{buyerProvince}</span></p>
                          <p className="flex justify-between"><span>Status:</span> <span className="text-red-600 font-black uppercase tracking-wider underline decoration-2 underline-offset-4" style={{ color: '#dc2626' }}>{buyerStatus}</span></p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Table Head */}
          <div className="bg-[#2b58ae] text-white grid grid-cols-12 text-[10px] font-black uppercase tracking-wider px-5 py-2.5 rounded-t-xl items-center" style={{ backgroundColor: '#2b58ae' }}>
              <div className="col-span-1">Sr</div>
              <div className="col-span-4">Description / HS Code</div>
              <div className="col-span-1 text-center">Qty/UOM</div>
              <div className="col-span-2 text-right px-2">Unit Price</div>
              <div className="col-span-1 text-right px-2">SubTotal</div>
              <div className="col-span-1 text-right px-2">Disc</div>
              <div className="col-span-2 text-right">Total Value</div>
          </div>

          {/* Table Content */}
          <div className="border-x border-b rounded-b-xl overflow-hidden" style={{ borderColor: '#e2e8f0', borderTop: 'none' }}>
              {items.map((item: any, idx: number) => {
                  const itemPrice = item.salePriceUnitExclTax || item.price || 0;
                  const itemQty = item.fbrQty || item.quantity || 1;
                  const totalTaxable = item.taxableValue || (itemPrice * itemQty);
                  const valInclTax = item.valueInclTax || item.totalInclTax || (totalTaxable + (item.gstAmt || 0));

                  return (
                      <div key={idx} style={{ borderTop: idx === 0 ? 'none' : '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
                          {/* Main Row */}
                          <div className="grid grid-cols-12 px-5 py-3 text-[11px] items-center">
                              <div className="col-span-1 font-black" style={{ color: '#94a3b8' }}>{idx + 1}</div>
                              <div className="col-span-4 pr-6">
                                  <p className="font-black text-sm" style={{ color: '#0f172a' }}>{item.Product?.productName || item.productName || item.productDescription || item.name || 'Product'}</p>
                                  <p className="text-[10px] font-bold mt-0.5 tracking-wider" style={{ color: '#64748b' }}>{item.hsCode || item.Product?.hsCode || '0000.0000'}</p>
                              </div>
                              <div className="col-span-1 text-center font-black">
                                  <span style={{ color: '#0f172a' }}>{itemQty}</span>
                                  <p className="text-[8px] uppercase font-black mt-0.5 leading-none" style={{ color: '#94a3b8' }}>{item.uom || item.Product?.uom || 'Unit'}</p>
                              </div>
                              <div className="col-span-2 text-right font-black px-2">{itemPrice.toLocaleString()}</div>
                              <div className="col-span-1 text-right font-black px-2">{totalTaxable.toLocaleString()}</div>
                              <div className="col-span-1 text-right font-black px-2" style={{ color: '#cbd5e1' }}>-</div>
                              <div className="col-span-2 text-right font-black py-2 px-3 rounded-lg" style={{ backgroundColor: '#fffce0' }}>
                                  {valInclTax.toLocaleString()}
                              </div>
                          </div>
                          {/* Tax Row */}
                          <div className="grid grid-cols-12 px-5 py-2 text-[9px] bg-[#f8fafc] border-t" style={{ backgroundColor: '#f8fafc', borderTopColor: '#f1f5f9' }}>
                              <div className="col-span-3">
                                  <p className="font-black uppercase tracking-widest text-[8px] mb-0.5" style={{ color: '#64748b' }}>Sale Type</p>
                                  <p className="font-bold leading-tight pr-4" style={{ color: '#334155' }}>{item.saleType || 'Standard Rate'}</p>
                              </div>
                              <div className="col-span-2">
                                  <p className="font-black uppercase tracking-widest text-[8px] mb-0.5" style={{ color: '#64748b' }}>Taxable Value</p>
                                  <p className="font-black" style={{ color: '#0f172a' }}>{totalTaxable.toLocaleString()}</p>
                              </div>
                              <div className="col-span-1 text-center border-l" style={{ borderLeftColor: '#e2e8f0' }}>
                                  <p className="font-black uppercase tracking-widest text-[7px] mb-0.5" style={{ color: '#64748b' }}>GST</p>
                                  <p className="font-black" style={{ color: '#1d4ed8' }}>{item.gstPercent || item.gstRate || 18}%</p>
                              </div>
                              <div className="col-span-1 text-center border-l" style={{ borderLeftColor: '#e2e8f0' }}>
                                  <p className="font-black uppercase tracking-widest text-[7px] mb-0.5" style={{ color: '#64748b' }}>F.Tax</p>
                                  <p className="font-black" style={{ color: '#1d4ed8' }}>{item.ftPercent || item.ftRate || 0}%</p>
                              </div>
                              <div className="col-span-1 text-center border-l" style={{ borderLeftColor: '#e2e8f0' }}>
                                  <p className="font-black uppercase tracking-widest text-[7px] mb-0.5" style={{ color: '#64748b' }}>FED</p>
                                  <p className="font-black" style={{ color: '#1d4ed8' }}>{item.fedPercent || item.fedRate || 0}%</p>
                              </div>
                              <div className="col-span-1 text-center border-l" style={{ borderLeftColor: '#e2e8f0' }}>
                                  <p className="font-black uppercase tracking-widest text-[7px] mb-0.5" style={{ color: '#64748b' }}>Extra</p>
                                  <p className="font-black" style={{ color: '#1d4ed8' }}>{item.extPercent || item.extRate || 0}%</p>
                              </div>
                              <div className="col-span-1 text-center border-l bg-emerald-50/50" style={{ borderLeftColor: '#a7f3d0' }}>
                                  <p className="font-black uppercase tracking-widest text-[7px] mb-0.5" style={{ color: '#059669' }}>Total Tax</p>
                                  <p className="font-black" style={{ color: '#047857' }}>{(item.totalTax || item.gstAmt || 0).toLocaleString()}</p>
                              </div>
                              <div className="col-span-2 text-right border-l px-3 bg-blue-50/50" style={{ borderLeftColor: '#bfdbfe' }}>
                                  <p className="font-black uppercase tracking-widest text-[7px] mb-0.5" style={{ color: '#1e40af' }}>Total + Tax</p>
                                  <p className="font-black" style={{ color: '#1e3a8a' }}>{valInclTax.toLocaleString()}</p>
                              </div>
                          </div>
                      </div>
                  );
              })}
          </div>

          {/* QR & Totals */}
          <div className="grid grid-cols-12 gap-8 items-stretch mt-8 mb-8">
              <div className="col-span-4">
                  <div className="h-full bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center p-4 text-center">
                      <div className="bg-white p-2 rounded-lg shadow-sm mb-3">
                        <QRCodeSVG 
                          value={`Invoice No: ${invoiceNo}\nDate: ${new Date(invoice.invoiceDate).toLocaleDateString()}\nTotal: Rs ${invoice.grandTotal?.toLocaleString()}`}
                          size={100}
                          level="H"
                        />
                      </div>
                      <p className="text-[#0D47A1] font-black text-[9px] uppercase tracking-widest mb-1 underline">FBR SECURE VERIFICATION</p>
                      <p className="text-slate-400 text-[8px] font-bold uppercase tracking-tighter">Scan to verify this tax invoice</p>
                  </div>
              </div>
              <div className="col-span-8">
                  <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-full flex flex-col" style={{ borderColor: '#e2e8f0' }}>
                      <div className="p-3.5 grid grid-cols-2 text-[12px] font-black items-center px-8 flex-1" style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <p style={{ color: '#64748b' }} className="uppercase tracking-wider">Total Value (Excl. Tax)</p>
                          <p className="text-right" style={{ color: '#0f172a' }}>{invoice.subtotal?.toLocaleString()}</p>
                      </div>
                      <div className="p-3.5 grid grid-cols-2 text-[12px] font-black items-center px-8 flex-1">
                          <p style={{ color: '#64748b' }} className="uppercase tracking-wider">Total GST</p>
                          <p className="text-right" style={{ color: '#0f172a' }}>{invoice.totalGST?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div className="p-5 grid grid-cols-2 text-xl font-black items-center bg-[#2b58ae] text-white px-8" style={{ backgroundColor: '#2b58ae' }}>
                          <p className="uppercase tracking-tighter text-sm">Grand Total</p>
                          <p className="text-right tracking-tight font-black">Rs {invoice.grandTotal?.toLocaleString()}</p>
                      </div>
                      <div className="p-3 grid grid-cols-2 text-[12px] font-black items-center bg-red-50 text-red-600 px-8" style={{ backgroundColor: '#fef2f2' }}>
                          <p className="uppercase tracking-[0.2em] text-[9px]" style={{ color: '#dc2626' }}>Amount Due</p>
                          <p className="text-right font-black" style={{ color: '#dc2626' }}>Rs {invoice.grandTotal?.toLocaleString()}</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Bottom Footer */}
          <div className="mt-auto pt-4 border-t border-slate-200 text-[10px] text-slate-400 font-bold" style={{ borderTopColor: '#e2e8f0' }}>
              <div className="flex justify-between items-end">
                  <div className="space-y-1">
                      <p className="font-black text-slate-900 text-[12px]">{business?.name || business?.businessName || 'Innovations'}</p>
                      <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>+{business?.phone || '923456789546'}</span>
                      </div>
                  </div>
                  <div className="text-right space-y-0.5">
                      <p className="uppercase tracking-widest text-[9px]">Generated: <span className="font-black text-slate-700">{new Date().toLocaleDateString('en-GB')}, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></p>
                      <p className="font-black text-slate-900 uppercase tracking-[0.1em] text-[10px]">This is a computer-generated document</p>
                  </div>
              </div>
          </div>
        </motion.div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 0;
          }
          
          body {
            background-color: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          /* Hide everything except our specific container */
          #root > div:not(.invoice-preview-container) {
            display: none !important;
          }

          .no-print {
            display: none !important;
          }

          .invoice-preview-container {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            display: block !important;
            z-index: 9999 !important;
            overflow: visible !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          .invoice-preview-container > div {
            padding: 0 !important;
            margin: 0 !important;
            min-height: auto !important;
            display: block !important;
          }

          #printable-invoice {
            margin: 0 auto !important;
            width: 210mm !important;
            height: 297mm !important;
            padding: 20mm !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            display: block !important;
          }

          /* Keep colors in print */
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  </div>
  );
};

export default InvoicePreview;

