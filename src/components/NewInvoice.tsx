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
  price: number;
  discount: number;
  uom: string;
  gstRate: number;
  totalTax: number;
  totalInclTax: number;
  poNumber?: string;
  batchNumber?: string;
  batchExpiry?: string;
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
      discount: 0,
      uom: '',
      gstRate: 18,
      totalTax: 0,
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

    // Calculate totals for the line item
    if (field === 'productId') {
      const product = products.find(p => p.id.toString() === value);
      if (product) {
        item.productName = product.productName;
        item.price = product.sellPricePerUnitExclTax;
        item.hsCode = product.hsCode;
        item.uom = product.uom;
        item.gstRate = product.gstRate || 18;
      }
    }

    const taxableValue = (item.price * item.quantity) - item.discount;
    item.totalTax = (taxableValue * item.gstRate) / 100;
    item.totalInclTax = taxableValue + item.totalTax;

    newItems[index] = item;
    setItems(newItems);
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = items.reduce((sum, item) => sum + item.discount, 0);
    const gstTotal = items.reduce((sum, item) => sum + item.totalTax, 0);
    const incomeTax = ((subtotal - discount) * invoiceData.incomeTaxRate) / 100;
    const grandTotal = (subtotal - discount) + gstTotal;

    return {
      subtotal,
      discount,
      gstTotal,
      incomeTax,
      grandTotal
    };
  };

  const { subtotal, discount, gstTotal, incomeTax, grandTotal } = calculateTotals();

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
            quantity: item.quantity,
            price: item.price,
            discount: item.discount,
            poNumber: item.poNumber,
            batchNumber: item.batchNumber,
            batchExpiry: item.batchExpiry
          };
        }
        return {
          productId: parseInt(item.productId),
          quantity: item.quantity,
          price: item.price,
          discount: item.discount,
          poNumber: item.poNumber,
          batchNumber: item.batchNumber,
          batchExpiry: item.batchExpiry
        };
      }));

      const payload = {
        businessId: businessData.id,
        clientId: selectedClient.id,
        ...invoiceData,
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
        <div className="col-span-12 lg:col-span-5 bg-black h-full rounded-[32px] p-8 text-white shadow-xl">
          <div className="flex items-center gap-2 mb-8">
            <FileText className="w-5 h-5 text-slate-400" />
            <h3 className="text-sm font-black uppercase tracking-widest">Metadata</h3>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Invoice Date</label>
              <div className="relative">
                <input 
                  type="date"
                  value={invoiceData.invoiceDate}
                  onChange={(e) => setInvoiceData({...invoiceData, invoiceDate: e.target.value})}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white/20 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Due Date</label>
              <div className="relative">
                <input 
                  type="date"
                  value={invoiceData.dueDate}
                  onChange={(e) => setInvoiceData({...invoiceData, dueDate: e.target.value})}
                  className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white/20 outline-none transition-all"
                />
              </div>
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Client Purchase Order (PO)</label>
              <input 
                type="text"
                value={invoiceData.clientPO}
                onChange={(e) => setInvoiceData({...invoiceData, clientPO: e.target.value})}
                placeholder="PO-9988-ABC"
                className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white/20 outline-none transition-all"
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

        <div className="p-8 space-y-6">
          {items.map((item, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="group relative grid grid-cols-12 gap-4 p-6 bg-slate-50 rounded-[24px] border border-slate-200 hover:border-[#0D47A1] hover:bg-white transition-all shadow-sm hover:shadow-md"
            >
              <button 
                onClick={() => removeItem(idx)}
                className="absolute -right-3 -top-3 w-8 h-8 bg-red-500 text-white rounded-xl flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <div className="col-span-12 md:col-span-5 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Product Description</label>
                  <button 
                    onClick={() => {
                      const isManual = item.productId === 'manual';
                      updateItem(idx, 'productId', isManual ? '' : 'manual');
                    }}
                    className="text-[8px] font-black text-[#0D47A1] uppercase tracking-widest hover:underline"
                  >
                    {item.productId === 'manual' ? 'Select from Stock' : 'Manual Entry'}
                  </button>
                </div>
                <div className="relative">
                  {item.productId === 'manual' ? (
                    <input 
                      type="text"
                      value={item.productName}
                      onChange={(e) => updateItem(idx, 'productName', e.target.value)}
                      placeholder="Enter custom product name..."
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#0D47A1]"
                    />
                  ) : (
                    <select 
                      value={item.productId}
                      onChange={(e) => updateItem(idx, 'productId', e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#0D47A1]"
                    >
                      <option value="">Select a product...</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.productName} ({p.sku})</option>)}
                    </select>
                  )}
                </div>
              </div>

              <div className="col-span-6 md:col-span-2 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Quantity</label>
                <input 
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#0D47A1]"
                />
              </div>

              <div className="col-span-6 md:col-span-2 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Price (Excl. Tax)</label>
                <input 
                  type="number"
                  value={item.price}
                  onChange={(e) => updateItem(idx, 'price', parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#0D47A1]"
                />
              </div>

              <div className="col-span-6 md:col-span-2 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Discount</label>
                <input 
                  type="number"
                  value={item.discount}
                  onChange={(e) => updateItem(idx, 'discount', parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-[#0D47A1]"
                />
              </div>

              <div className="col-span-6 md:col-span-1 space-y-2">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GST %</label>
                <select 
                  value={item.gstRate}
                  onChange={(e) => updateItem(idx, 'gstRate', parseFloat(e.target.value))}
                  className="w-full bg-white border border-slate-200 rounded-xl px-2 py-3 text-sm font-bold outline-none focus:border-[#0D47A1]"
                >
                  <option value={0}>0%</option>
                  <option value={10}>10%</option>
                  <option value={18}>18%</option>
                  <option value={25}>25%</option>
                </select>
              </div>

              <div className="md:col-span-12 border-t border-slate-100 mt-4 pt-4 flex items-center justify-between">
                <div className="flex gap-4">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">PO#</label>
                    <input 
                      type="text"
                      value={item.poNumber || ''}
                      onChange={(e) => updateItem(idx, 'poNumber', e.target.value)}
                      placeholder="PO#"
                      className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1] w-24"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Batch#</label>
                    <input 
                      type="text"
                      value={item.batchNumber || ''}
                      onChange={(e) => updateItem(idx, 'batchNumber', e.target.value)}
                      placeholder="Batch#"
                      className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1] w-24"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Expiry</label>
                    <input 
                      type="date"
                      value={item.batchExpiry || ''}
                      onChange={(e) => updateItem(idx, 'batchExpiry', e.target.value)}
                      className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-[10px] font-bold outline-none focus:border-[#0D47A1]"
                    />
                  </div>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-right">
                  <span className="text-[8px] font-black text-emerald-400 uppercase block tracking-widest mb-0.5">Value Incl. Tax</span>
                  <p className="text-sm font-black text-emerald-700">Rs {item.totalInclTax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {items.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
              <Package className="w-12 h-12 text-slate-300 mb-4" />
              <p className="text-sm font-bold text-slate-400">Inventory items will appear here.</p>
              <button 
                onClick={addItem}
                className="mt-4 text-[#0D47A1] text-xs font-black uppercase tracking-widest hover:underline"
              >
                Add Your First Row
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-12">
        <div className="lg:col-span-7 bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm h-full">
           <div className="flex items-center gap-2 mb-6">
            <Calculator className="w-5 h-5 text-[#0D47A1]" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Calculations & Notes</h3>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Income Tax Rate (%)</label>
                <input 
                  type="number"
                  value={invoiceData.incomeTaxRate}
                  onChange={(e) => setInvoiceData({...invoiceData, incomeTaxRate: parseFloat(e.target.value)})}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:bg-white focus:border-[#0D47A1] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Income Tax Amount</label>
                <div className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 text-sm font-black text-slate-500">
                  PKR {incomeTax.toLocaleString()}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Customer Note / Special Instructions</label>
              <textarea 
                value={invoiceData.invoiceNote}
                onChange={(e) => setInvoiceData({...invoiceData, invoiceNote: e.target.value})}
                placeholder="Ex: Please deliver before 5 PM at Gate 2..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 rounded-[24px] px-6 py-4 text-sm font-medium focus:bg-white focus:border-[#0D47A1] outline-none transition-all resize-none"
              />
            </div>
          </div>
        </div>

        <div className="lg:col-span-12">
          <div className="bg-[#0f172a] rounded-[40px] p-2 flex flex-col md:flex-row items-stretch gap-2 shadow-2xl">
            <div className="flex-1 bg-white rounded-[32px] p-6 flex flex-col justify-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Subtotal</p>
              <h3 className="text-xl font-black text-slate-900 leading-none">Rs {subtotal.toLocaleString()}</h3>
            </div>
            <div className="flex-1 bg-pink-50 rounded-[32px] p-6 flex flex-col justify-center">
              <p className="text-[10px] font-black text-pink-400 uppercase tracking-widest mb-1">Discount</p>
              <h3 className="text-xl font-black text-pink-600 leading-none">Rs {discount.toLocaleString()}</h3>
            </div>
            <div className="flex-1 bg-emerald-50 rounded-[32px] p-6 flex flex-col justify-center">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">GST</p>
              <h3 className="text-xl font-black text-emerald-600 leading-none">Rs {gstTotal.toLocaleString()}</h3>
            </div>
            <div className="flex-1 bg-amber-50 rounded-[32px] p-6 flex flex-col justify-center">
              <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Other Taxes</p>
              <h3 className="text-xl font-black text-amber-600 leading-none">Rs {incomeTax.toLocaleString()}</h3>
            </div>
            <div className="flex-[1.5] bg-[#004D40] rounded-[32px] p-6 flex items-center justify-between group cursor-pointer hover:bg-[#003d33] transition-colors">
              <div>
                <p className="text-[10px] font-black text-emerald-300 uppercase tracking-widest mb-1">Grand Total</p>
                <h3 className="text-2xl font-black text-white leading-none">Rs {grandTotal.toLocaleString()}</h3>
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white">
                <Calculator className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-6 left-0 right-0 z-50 flex justify-center">
        <div className="bg-[#004D40] px-8 py-4 rounded-full shadow-2xl flex items-center gap-12 text-white border border-white/10">
            <div className="flex items-center gap-3">
                <span className="text-[10px] font-black uppercase text-emerald-300 tracking-widest">Grand Total</span>
                <span className="text-xl font-black">Rs {grandTotal.toLocaleString()}</span>
            </div>
            <button 
                onClick={() => handleSubmit('Paid')}
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
