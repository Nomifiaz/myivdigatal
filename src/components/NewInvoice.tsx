import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Search, 
  ChevronDown, 
  Calendar,
  FileText,
  User,
  Info,
  AlertTriangle,
  Receipt,
  Download,
  Printer,
  Calculator,
  Loader2,
  CheckCircle2,
  Package,
  ArrowRight
} from 'lucide-react';
import { clientService, productService, invoiceService } from '../services/api';

interface NewInvoiceProps {
  businessData: any;
  onBack: () => void;
  onSuccess: () => void;
}

interface InvoiceItem {
  productId: string;
  productName: string;
  hsCode: string;
  quantity: number;
  price: number; // Sale Price/Unit (Excl Tax)
  costPrice: number; // Cost/Unit (Excl Tax)
  discount: number;
  uom: string;
  gstRate: number;
  gstAmt: number;
  ftRate: number;
  ftAmt: number;
  fedRate: number;
  fedAmt: number;
  extRate: number;
  extAmt: number;
  isExempt: boolean;
  poNumber: string;
  batchNumber: string;
  batchExpiry: string;
  biltiNo: string;
  challanNo: string;
  grNo: string;
  gpNo: string;
  lineNote: string;
  saleType: string;
  totalTax: number;
  taxableValue: number;
  totalInclTax: number;
}

const NewInvoice: React.FC<NewInvoiceProps> = ({ businessData, onBack, onSuccess }) => {
  const [clients, setClients] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isQuickClientModalOpen, setIsQuickClientModalOpen] = useState(false);
  const [quickClientData, setQuickClientData] = useState({
    name: '',
    phone: '',
    type: 'Registered',
    province: 'Punjab'
  });
  
  const [invoiceData, setInvoiceData] = useState({
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    clientPO: '',
    invoiceNote: '',
    internalPO: '',
    incomeTaxDescription: '',
    incomeTaxRate: 0,
    status: 'Draft'
  });

  const [items, setItems] = useState<InvoiceItem[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [clientsRes, productsRes] = await Promise.all([
          clientService.getClients(),
          productService.getProducts()
        ]);
        setClients(clientsRes.data || clientsRes || []);
        const prodData = productsRes.success ? productsRes.data : productsRes;
        setProducts(Array.isArray(prodData) ? prodData : []);
      } catch (err) {
        console.error('Failed to load invoice data', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const addItem = () => {
    const newItem: InvoiceItem = {
      productId: '',
      productName: '',
      hsCode: '',
      quantity: 1,
      price: 0,
      costPrice: 0,
      discount: 0,
      uom: '',
      gstRate: 18,
      gstAmt: 0,
      ftRate: 0,
      ftAmt: 0,
      fedRate: 0,
      fedAmt: 0,
      extRate: 0,
      extAmt: 0,
      isExempt: false,
      poNumber: '',
      batchNumber: '',
      batchExpiry: '',
      biltiNo: '',
      challanNo: '',
      grNo: '',
      gpNo: '',
      lineNote: '',
      saleType: 'Goods at standard rate (default)',
      totalTax: 0,
      taxableValue: 0,
      totalInclTax: 0
    };
    setItems([...items, newItem]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: any) => {
    const newItems = [...items];
    const item = { ...newItems[index], [field]: value };

    if (field === 'productId') {
      const product = products.find(p => p.id.toString() === value);
      if (product) {
        item.productName = product.productName;
        item.price = product.sellPricePerUnitExclTax;
        item.costPrice = product.costPricePerUnitExclTax || 0;
        item.hsCode = product.hsCode;
        item.uom = product.uom;
        item.gstRate = product.gstRate || 18;
      }
    }

    // Calculations
    const taxableValue = (item.price * item.quantity) - item.discount;
    item.taxableValue = taxableValue;
    
    item.gstAmt = item.isExempt ? 0 : (taxableValue * item.gstRate) / 100;
    item.ftAmt = (taxableValue * item.ftRate) / 100;
    item.fedAmt = (taxableValue * item.fedRate) / 100;
    item.extAmt = (taxableValue * item.extRate) / 100;

    item.totalTax = item.gstAmt + item.ftAmt + item.fedAmt + item.extAmt;
    item.totalInclTax = taxableValue + item.totalTax;

    newItems[index] = item;
    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = items.reduce((sum, item) => sum + item.discount, 0);
    const gstTotal = items.reduce((sum, item) => sum + item.gstAmt, 0);
    const otherTaxes = items.reduce((sum, item) => sum + item.ftAmt + item.fedAmt + item.extAmt, 0);
    const taxableAmount = subtotal - discount;
    const incomeTax = (taxableAmount * invoiceData.incomeTaxRate) / 100;
    const grandTotal = taxableAmount + gstTotal + otherTaxes;

    return {
      subtotal,
      discount,
      gstTotal,
      otherTaxes,
      incomeTax,
      grandTotal
    };
  };

  const { subtotal, discount, gstTotal, otherTaxes, incomeTax, grandTotal } = calculateTotals();

  const handleQuickClientSubmit = async () => {
    if (!quickClientData.name || !quickClientData.phone) return;
    setIsSubmitting(true);
    try {
      const response = await clientService.addClient(quickClientData);
      const newClient = response.data || response;
      setClients([...clients, newClient]);
      setSelectedClient(newClient);
      setIsQuickClientModalOpen(false);
      setQuickClientData({ name: '', phone: '', type: 'Registered', province: 'Punjab' });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (status: string = 'Draft') => {
    if (!selectedClient) {
      alert('Please select a client');
      return;
    }
    if (items.length === 0) {
      alert('Please add at least one item');
      return;
    }

    setIsSubmitting(true);
    try {
      // Handle manual items: create products if they don't exist
      const processedItems = await Promise.all(items.map(async (item) => {
        const itemBase = {
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          gstRate: item.gstRate,
          gstAmt: item.gstAmt,
          ftRate: item.ftRate,
          ftAmt: item.ftAmt,
          fedRate: item.fedRate,
          fedAmt: item.fedAmt,
          extRate: item.extRate,
          extAmt: item.extAmt,
          poNumber: item.poNumber,
          batchNumber: item.batchNumber,
          batchExpiry: item.batchExpiry,
          biltiNo: item.biltiNo,
          challanNo: item.challanNo,
          grNo: item.grNo,
          gpNo: item.gpNo,
          lineNote: item.lineNote,
          saleType: item.saleType
        };

        if (item.productId === 'manual') {
          const newProd = await productService.addProduct({
            businessId: businessData.id,
            productName: item.productName,
            sku: 'AUTO-' + Math.random().toString(36).substring(7).toUpperCase(),
            sellPricePerUnitExclTax: item.price,
            gstRate: item.gstRate,
            hsCode: item.hsCode || '0000.0000',
            uom: item.uom || 'piece',
            pkgQty: 1
          });
          return {
            productId: newProd.id || newProd.data?.id,
            ...itemBase
          };
        }
        return {
          productId: parseInt(item.productId),
          ...itemBase
        };
      }));

      const payload = {
        businessId: businessData.id,
        clientId: selectedClient.id,
        invoiceType: 'Sale Invoice',
        ...invoiceData,
        subtotal,
        totalDiscount: discount,
        totalGST: gstTotal,
        totalOtherTaxes: otherTaxes,
        grandTotal,
        status,
        items: processedItems
      };

      await invoiceService.createInvoice(payload);
      onSuccess();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4">
        <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Preparing Invoice Editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">New Invoice</h1>
              <div className="px-3 py-1 bg-white border border-slate-200 rounded-full flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-sm" />
                <span className="text-[10px] font-black uppercase text-slate-500">{invoiceData.status}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleSubmit('Draft')}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-white border border-slate-200 text-slate-900 rounded-xl text-sm font-black hover:bg-slate-50 active:scale-95 transition-all shadow-sm"
          >
            Save Draft
          </button>
          <button 
            onClick={() => handleSubmit('Paid')}
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-black hover:bg-slate-800 active:scale-95 transition-all shadow-lg shadow-slate-900/20"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Invoice'}
          </button>
        </div>
      </div>

      {/* Client & Date Section */}
      <div className="grid grid-cols-12 gap-6">
        {/* Client Selection */}
        <div className="col-span-12 lg:col-span-7 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-[#0D47A1]" />
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Client Selection</h3>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsQuickClientModalOpen(true)}
                className="text-[10px] font-black text-[#0D47A1] hover:underline uppercase tracking-widest flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                Quick Add Client
              </button>
              {selectedClient && (
                <button 
                  onClick={() => setSelectedClient(null)}
                  className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest"
                >
                  Change Client
                </button>
              )}
            </div>
          </div>

          {!selectedClient ? (
            <div className="space-y-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-[#0D47A1] transition-colors" />
                <select 
                  onChange={(e) => {
                    const client = clients.find(c => c.id.toString() === e.target.value);
                    setSelectedClient(client);
                  }}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm text-slate-900 focus:bg-white focus:border-[#0D47A1] outline-none appearance-none cursor-pointer"
                >
                  <option value="">Search or select a partner...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
              <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-3">
                <Info className="w-4 h-4 text-[#0D47A1] mt-0.5" />
                <p className="text-[10px] font-medium text-slate-600 leading-relaxed">
                  Select a registered partner from your directory. If the partner isn't listed, you can register them in the Clients tab first.
                </p>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-6 p-6 bg-slate-50 border border-slate-200 rounded-[24px]"
            >
              <div className="w-16 h-16 bg-[#0D47A1] rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg shadow-blue-900/20">
                {selectedClient.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black text-slate-900 truncate">{selectedClient.name}</h4>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs font-bold text-slate-500">{selectedClient.email}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-300" />
                  <span className="text-xs font-bold text-slate-500">{selectedClient.phone}</span>
                </div>
                {!selectedClient.ntn && !selectedClient.cnic && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-tighter">No NTN/CNIC on file (Register as Unregistered)</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>

        {/* Date & Reference */}
        <div className="col-span-12 lg:col-span-5 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-8">
            <FileText className="w-5 h-5 text-[#0D47A1]" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Invoice Details</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Invoice Date</label>
              <input 
                type="date"
                value={invoiceData.invoiceDate}
                onChange={(e) => setInvoiceData({...invoiceData, invoiceDate: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Due Date</label>
              <input 
                type="date"
                value={invoiceData.dueDate}
                onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">Today Client PO# <Info className="w-2.5 h-2.5 opacity-30" /></label>
              <input 
                type="text"
                value={invoiceData.clientPO}
                onChange={(e) => setInvoiceData({...invoiceData, clientPO: e.target.value})}
                placeholder="Optional"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">Invoice Note <Info className="w-2.5 h-2.5 opacity-30" /></label>
              <input 
                type="text"
                value={invoiceData.invoiceNote}
                onChange={(e) => setInvoiceData({...invoiceData, invoiceNote: e.target.value})}
                placeholder="Optional"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
              />
            </div>
            <div className="col-span-2 space-y-1.5">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">Internal PO# <Info className="w-2.5 h-2.5 opacity-30" /></label>
              <input 
                type="text"
                value={invoiceData.internalPO}
                onChange={(e) => setInvoiceData({...invoiceData, internalPO: e.target.value})}
                placeholder="Optional"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Line Items */}
      <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0D47A1] rounded-2xl flex items-center justify-center text-white">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 tracking-tight">Line Items</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Add products and services to your invoice</p>
            </div>
          </div>
          <button 
            onClick={addItem}
            className="flex items-center gap-2 bg-emerald-500 text-white px-5 py-2.5 rounded-xl text-xs font-black shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Add Item Row
          </button>
        </div>

        <div className="p-4 space-y-4">
          {items.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative bg-[#f8fafc] rounded-[24px] border border-slate-200 p-6 overflow-hidden hover:bg-white transition-all"
            >
              <button 
                onClick={() => removeItem(idx)}
                className="absolute right-4 top-4 w-8 h-8 bg-white border border-slate-200 text-slate-400 rounded-lg flex items-center justify-center hover:bg-red-50 hover:text-red-500 hover:border-red-100 transition-all z-10"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {/* Row 1: Key Fields */}
              <div className="grid grid-cols-12 gap-4 mb-6">
                <div className="col-span-3 space-y-1.5">
                   <div className="flex items-center gap-1">
                      <label className="text-[8px] font-black text-red-400 uppercase tracking-[0.1em]">Sale Type *</label>
                      <Info className="w-2.5 h-2.5 text-slate-300" />
                   </div>
                   <select 
                     value={item.saleType}
                     onChange={(e) => updateItem(idx, 'saleType', e.target.value)}
                     className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
                   >
                     <option>Goods at standard rate (default)</option>
                     <option>Zero Rated</option>
                     <option>Exempt</option>
                   </select>
                </div>

                <div className="col-span-5 space-y-1.5">
                   <div className="flex items-center justify-between">
                      <label className="text-[8px] font-black text-emerald-400 uppercase tracking-[0.1em]">Product Description *</label>
                      <button 
                        onClick={() => updateItem(idx, 'productId', item.productId === 'manual' ? '' : 'manual')}
                        className="text-[8px] font-black text-[#0D47A1] uppercase tracking-widest leading-none hover:underline"
                      >
                        {item.productId === 'manual' ? 'Stock List' : 'Manual Entry'}
                      </button>
                   </div>
                   {item.productId === 'manual' ? (
                     <input 
                       type="text"
                       value={item.productName}
                       onChange={(e) => updateItem(idx, 'productName', e.target.value)}
                       placeholder="Type to search stock items..."
                       className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
                     />
                   ) : (
                     <select 
                       value={item.productId}
                       onChange={(e) => updateItem(idx, 'productId', e.target.value)}
                       className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
                     >
                       <option value="">Select a product...</option>
                       {products.map(p => <option key={p.id} value={p.id}>{p.productName}</option>)}
                     </select>
                   )}
                </div>

                <div className="col-span-2 space-y-1.5 font-mono">
                   <div className="flex items-center gap-1">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em]">HS Code</label>
                      <Search className="w-2.5 h-2.5 text-slate-300" />
                   </div>
                   <input 
                     type="text"
                     value={item.hsCode}
                     onChange={(e) => updateItem(idx, 'hsCode', e.target.value)}
                     className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
                   />
                </div>

                <div className="col-span-2 space-y-1.5 flex items-end gap-2">
                   <div className="flex-1 space-y-1.5">
                      <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em]">UOM</label>
                      <input 
                        type="text"
                        value={item.uom}
                        onChange={(e) => updateItem(idx, 'uom', e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
                      />
                   </div>
                   <button className="p-2 bg-slate-100 rounded-lg text-slate-400 hover:text-slate-900">
                      <Download className="w-3.5 h-3.5" />
                   </button>
                </div>
              </div>

              {/* Row 2: Quantities & Prices */}
              <div className="grid grid-cols-12 gap-4 mb-6">
                <div className="col-span-1.5 space-y-1.5">
                   <label className="text-[8px] font-black text-red-500 uppercase tracking-[0.1em]">FBR QTY (PCS) *</label>
                   <input 
                     type="number"
                     value={item.quantity}
                     onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                     className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
                   />
                </div>
                <div className="col-span-2.5 space-y-1.5">
                   <label className="text-[8px] font-black text-slate-400 uppercase tracking-[0.1em]">Cost/Unit (Excl Tax)</label>
                   <input 
                     type="number"
                     value={item.costPrice}
                     onChange={(e) => updateItem(idx, 'costPrice', parseFloat(e.target.value))}
                     className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
                   />
                </div>
                <div className="col-span-2.5 space-y-1.5">
                   <label className="text-[8px] font-black text-red-400 uppercase tracking-[0.1em]">Sale Price/Unit (Excl Tax) *</label>
                   <input 
                     type="number"
                     value={item.price}
                     onChange={(e) => updateItem(idx, 'price', parseFloat(e.target.value))}
                     className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
                   />
                </div>
                <div className="col-span-2.5 space-y-1.5">
                   <label className="text-[8px] font-black text-pink-400 uppercase tracking-[0.1em]">Discount</label>
                   <input 
                     type="number"
                     value={item.discount}
                     onChange={(e) => updateItem(idx, 'discount', parseFloat(e.target.value))}
                     className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
                   />
                </div>
                <div className="col-span-3 space-y-1.5">
                   <label className="text-[8px] font-black text-amber-500 uppercase tracking-[0.1em] block text-right">Taxable Value</label>
                   <div className="w-full bg-amber-50 border border-amber-100 rounded-lg px-4 py-2 text-right">
                      <span className="text-xs font-black text-amber-700">Rs {item.taxableValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                   </div>
                </div>
              </div>

              {/* Row 3: Complex Tax Grid */}
              <div className="grid grid-cols-12 gap-2 mb-6">
                <div className="col-span-2 space-y-1.5">
                   <label className="text-[8px] font-black text-emerald-400 uppercase">Rate</label>
                   <select 
                     value={item.gstRate}
                     onChange={(e) => updateItem(idx, 'gstRate', parseFloat(e.target.value))}
                     className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-bold"
                   >
                      <option value={18}>Select sale type</option>
                      <option value={18}>Standard 18%</option>
                      <option value={10}>Reduced 10%</option>
                      <option value={0}>Exempt 0%</option>
                   </select>
                </div>
                <div className="col-span-1 flex flex-col items-center justify-center pt-4">
                   <label className="text-[8px] font-black text-slate-400 uppercase mb-1">EXMT</label>
                   <input 
                     type="checkbox"
                     checked={item.isExempt}
                     onChange={(e) => updateItem(idx, 'isExempt', e.target.checked)}
                     className="w-4 h-4 rounded border-slate-300"
                   />
                </div>
                <div className="col-span-2 space-y-1.5">
                   <label className="text-[8px] font-black text-emerald-400 uppercase">GST AMT</label>
                   <div className="bg-emerald-50 border border-emerald-100 rounded-lg px-2 py-2 text-[10px] font-bold text-center text-emerald-700">
                      {item.gstAmt.toFixed(2)}
                   </div>
                </div>
                <div className="col-span-1 space-y-1.5">
                   <label className="text-[8px] font-black text-amber-400 uppercase">FT %</label>
                   <input type="number" value={item.ftRate} onChange={(e) => updateItem(idx, 'ftRate', parseFloat(e.target.value))} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-bold"/>
                </div>
                <div className="col-span-1 space-y-1.5">
                   <label className="text-[8px] font-black text-amber-400 uppercase">FT AMT</label>
                   <div className="bg-amber-50 border border-amber-100 rounded-lg px-2 py-2 text-[10px] font-bold text-center text-amber-700">
                      {item.ftAmt.toFixed(2)}
                   </div>
                </div>
                <div className="col-span-1 space-y-1.5">
                   <label className="text-[8px] font-black text-blue-400 uppercase">FED %</label>
                   <input type="number" value={item.fedRate} onChange={(e) => updateItem(idx, 'fedRate', parseFloat(e.target.value))} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-2 text-[10px] font-bold"/>
                </div>
                <div className="col-span-1 space-y-1.5">
                   <label className="text-[8px] font-black text-blue-400 uppercase">FED AMT</label>
                   <div className="bg-blue-50 border border-blue-100 rounded-lg px-2 py-2 text-[10px] font-bold text-center text-blue-700">
                      {item.fedAmt.toFixed(2)}
                   </div>
                </div>
                <div className="col-span-1.5 space-y-1.5">
                   <label className="text-[8px] font-black text-pink-400 uppercase">Total Tax</label>
                   <div className="bg-pink-50 border border-pink-100 rounded-lg px-2 py-2 text-[10px] font-black text-center text-pink-600">
                      {item.totalTax.toFixed(2)}
                   </div>
                </div>
              </div>

              {/* Row 4: Shipping & Metadata */}
              <div className="grid grid-cols-9 gap-2 mb-6">
                 {[
                   { label: 'PO#', key: 'poNumber' },
                   { label: 'Bilti#', key: 'biltiNo' },
                   { label: 'D. Challan#', key: 'challanNo' },
                   { label: 'G.R#', key: 'grNo' },
                   { label: 'G.P#', key: 'gpNo' },
                   { label: 'Note', key: 'lineNote' },
                   { label: 'Batch#', key: 'batchNumber' },
                 ].map(field => (
                   <div key={field.key} className="space-y-1">
                      <label className="text-[7px] font-black text-slate-400 uppercase">{field.label}</label>
                      <input 
                        type="text"
                        value={(item as any)[field.key]}
                        onChange={(e) => updateItem(idx, field.key as any, e.target.value)}
                        placeholder={field.label}
                        className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-[9px] font-bold"
                      />
                   </div>
                 ))}
                 <div className="col-span-2 space-y-1">
                    <label className="text-[7px] font-black text-slate-400 uppercase">Batch Expiry</label>
                    <input 
                      type="date"
                      value={item.batchExpiry}
                      onChange={(e) => updateItem(idx, 'batchExpiry', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded px-2 py-1.5 text-[9px] font-bold"
                    />
                 </div>
              </div>

              {/* Row 5: Action SROs & Final Total */}
              <div className="bg-[#0f4c3a] -mx-6 -mb-6 px-6 py-3 flex items-center justify-between">
                 <div className="flex gap-2">
                    <button className="bg-[#146e54] text-white/70 px-3 py-1.5 rounded-md text-[8px] font-black uppercase flex items-center gap-1.5 hover:text-white transition-colors">
                       <span className="text-emerald-400">SRO</span>
                       Select rate first
                    </button>
                    <button className="bg-[#146e54] text-white/70 px-3 py-1.5 rounded-md text-[8px] font-black uppercase flex items-center gap-1.5 hover:text-white transition-colors">
                       <span className="text-emerald-400">SR#</span>
                       Select SRO first
                    </button>
                 </div>
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">Value Incl. Tax</span>
                    <span className="text-lg font-black text-white">Rs {item.totalInclTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                 </div>
              </div>
            </motion.div>
          ))}
          
          <button 
            onClick={addItem}
            className="w-full py-4 border-2 border-dashed border-emerald-100 rounded-[24px] flex items-center justify-center gap-2 text-emerald-600 font-black text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all group"
          >
            <div className="p-1 bg-emerald-100 rounded-full group-hover:bg-emerald-200">
               <Plus className="w-3 h-3" />
            </div>
            Add another item to this invoice
          </button>
        </div>
      </div>

      {/* Income Tax Section */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
           <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest">Income Tax</h3>
           <div className="text-right">
              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Total Value Incl. Tax</p>
              <p className="text-sm font-black text-slate-900">Rs {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
           </div>
        </div>
        <div className="grid grid-cols-12 gap-4">
           <div className="col-span-12 md:col-span-5 space-y-1.5">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Description</label>
              <input 
                type="text" 
                value={invoiceData.incomeTaxDescription}
                onChange={(e) => setInvoiceData({...invoiceData, incomeTaxDescription: e.target.value})}
                placeholder="e.g., Income Tax u/s 153" 
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-[10px] font-bold outline-none"
              />
           </div>
           <div className="col-span-6 md:col-span-3 space-y-1.5">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Tax Rate (%)</label>
              <input 
                type="number" 
                value={invoiceData.incomeTaxRate}
                onChange={(e) => setInvoiceData({...invoiceData, incomeTaxRate: parseFloat(e.target.value) || 0})}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-3 text-[10px] font-bold outline-none text-center"
              />
           </div>
           <div className="col-span-6 md:col-span-4 space-y-1.5">
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Income Tax Amount</label>
              <div className="w-full bg-slate-100 border border-slate-200 rounded-lg px-3 py-3 text-[10px] font-black text-slate-500 text-right">
                 Rs {incomeTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
           </div>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
        <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none block mb-4">Notes</label>
        <textarea 
          value={invoiceData.invoiceNote}
          onChange={(e) => setInvoiceData({...invoiceData, invoiceNote: e.target.value})}
          placeholder="Additional notes..."
          rows={3}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none"
        />
      </div>

      {/* Invoice Summary */}
      <div className="bg-[#0f172a] rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
        <h3 className="text-white text-sm font-black uppercase tracking-[0.2em] mb-8">Invoice Summary</h3>
        
        <div className="grid grid-cols-5 gap-4">
            <div className="bg-white rounded-[24px] p-6">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Subtotal</p>
              <p className="text-lg font-black text-slate-900 leading-none">Rs {subtotal.toLocaleString()}</p>
            </div>
            <div className="bg-pink-50 rounded-[24px] p-6">
              <p className="text-[9px] font-black text-pink-400 uppercase tracking-widest mb-1">Discount</p>
              <p className="text-lg font-black text-pink-600 leading-none">Rs {discount.toLocaleString()}</p>
            </div>
            <div className="bg-emerald-50 rounded-[24px] p-6">
              <p className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mb-1">GST</p>
              <p className="text-lg font-black text-emerald-600 leading-none">Rs {gstTotal.toLocaleString()}</p>
            </div>
            <div className="bg-amber-50 rounded-[24px] p-6">
              <p className="text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1">Other Taxes</p>
              <p className="text-lg font-black text-amber-600 leading-none">Rs {otherTaxes.toLocaleString()}</p>
            </div>
            <div className="bg-[#004D40] rounded-[24px] p-6 flex flex-col justify-center border border-emerald-400/20">
              <p className="text-[9px] font-black text-emerald-300 uppercase tracking-widest mb-1">Grand Total</p>
              <p className="text-2xl font-black text-white leading-none">Rs {grandTotal.toLocaleString()}</p>
            </div>
        </div>
      </div>

      <div className="sticky bottom-6 left-0 right-0 z-50 flex justify-center">
        <div className="bg-[#004D40] px-8 py-4 rounded-full shadow-2xl flex items-center gap-12 text-white border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <span className="text-[9px] font-black uppercase text-emerald-300 tracking-widest">Grand Total</span>
                <span className="text-xl font-black">Rs {grandTotal.toLocaleString()}</span>
            </div>
            <button 
                onClick={() => handleSubmit('Draft')}
                disabled={isSubmitting}
                className="bg-[#FF9800] text-white px-8 py-3 rounded-full font-black text-xs uppercase tracking-widest hover:bg-[#F57C00] transition-colors active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Draft'}
                <ArrowRight className="w-4 h-4" />
            </button>
        </div>
      </div>

      {/* Quick Client Modal */}
      <AnimatePresence>
        {isQuickClientModalOpen && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickClientModalOpen(false)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl p-8 overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#0D47A1] rounded-xl flex items-center justify-center text-white">
                    <User className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-black text-slate-900 tracking-tight">Quick Client</h3>
                </div>
                <button onClick={() => setIsQuickClientModalOpen(false)} className="p-2 hover:bg-slate-50 rounded-lg">
                   <ArrowLeft className="w-5 h-5 text-slate-400 rotate-90" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Client Name</label>
                  <input 
                    type="text"
                    value={quickClientData.name}
                    onChange={(e) => setQuickClientData({...quickClientData, name: e.target.value})}
                    placeholder="Full name or business"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:bg-white focus:border-[#0D47A1]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone Number</label>
                  <input 
                    type="tel"
                    value={quickClientData.phone}
                    onChange={(e) => setQuickClientData({...quickClientData, phone: e.target.value})}
                    placeholder="0300-XXXXXXX"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm outline-none focus:bg-white focus:border-[#0D47A1]"
                  />
                </div>
                <button 
                  onClick={handleQuickClientSubmit}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-900/20"
                >
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Register & Select'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NewInvoice;
