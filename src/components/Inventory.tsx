import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
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
  HelpCircle,
  TrendingUp,
  Box,
  Hash,
  Scale,
  DollarSign,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { productService } from '../services/api';

interface Product {
  id: number;
  productName: string;
  hsCode: string;
  sku: string;
  barcode: string;
  saleType: string;
  sellingUnit: string;
  pkgQty: number;
  packageSize: string;
  costPerUnitExclTax: number;
  sellPricePerUnitExclTax: number;
  gstRate: number;
  uom: string;
}

interface InventoryProps {
  businessId: number;
}

const Inventory: React.FC<InventoryProps> = ({ businessId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    productName: '',
    hsCode: '',
    sku: 'Auto',
    barcode: '',
    saleType: '1. Goods at standard rate (default)',
    sellingUnit: '',
    pkgQty: 1,
    packageSize: '',
    costPerUnitExclTax: 0,
    sellPricePerUnitExclTax: 0,
    gstRate: 18,
    uom: 'Numbers, pieces, units',
    description: ''
  });

  const saleTypes = [
    '1. Goods at standard rate (default)',
    '2. Zero rated goods',
    '3. Exempt goods',
    '4. Services at standard rate',
    '5. Fixed Assets',
    '6. Others'
  ];

  const uomTypes = [
    'Numbers, pieces, units',
    'Killogram',
    'Litre',
    'Metre',
    'Square Metre',
    'Cubic Metre'
  ];

  useEffect(() => {
    fetchProducts();
  }, [businessId]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await productService.getProducts(businessId);
      // Ensure data is an array
      setProducts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message);
      setProducts([]); // Fallback to empty array on error
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await productService.addProduct({ ...formData, businessId });
      setIsModalOpen(false);
      resetForm();
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      fetchProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      productName: '',
      hsCode: '',
      sku: 'Auto',
      barcode: '',
      saleType: '1. Goods at standard rate (default)',
      sellingUnit: '',
      pkgQty: 1,
      packageSize: '',
      costPerUnitExclTax: 0,
      sellPricePerUnitExclTax: 0,
      gstRate: 18,
      uom: 'Numbers, pieces, units',
      description: ''
    });
  };

  const calculateTax = (price: number, rate: number) => {
    return (price * rate) / 100;
  };

  const [isSearchingHS, setIsSearchingHS] = useState(false);

  const searchHSCode = () => {
    if (!formData.hsCode) return;
    setIsSearchingHS(true);
    // Mock API delay
    setTimeout(() => {
      setIsSearchingHS(false);
      // Logic for selecting from search results would go here
    }, 1500);
  };

  const filteredProducts = products.filter(p => 
    p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Stock Inventory</h1>
          <p className="text-slate-500 text-sm font-medium">Manage your product catalog and warehouse stock levels.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
            <input 
              type="text" 
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 text-sm font-medium w-full md:w-64 transition-all"
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-slate-900 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-slate-950 text-white px-5 py-2.5 rounded-xl text-sm font-black shadow-lg shadow-slate-900/20 hover:bg-slate-900 transition-all active:scale-95"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <Loader2 className="w-10 h-10 text-slate-950 animate-spin" />
          <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Loading Catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-[32px] border border-slate-200 p-20 flex flex-col items-center text-center">
          <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mb-6">
            <Package className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">No Products Found</h3>
          <p className="text-slate-500 mt-2 max-w-sm">Start building your inventory catalog by adding your first product.</p>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-8 flex items-center gap-2 text-slate-950 font-black text-sm hover:underline"
          >
            <Plus className="w-4 h-4" />
            Add New Item
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest w-16">ID</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Product Details</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">SKU/Barcode</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pricing</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tax (GST)</th>
                  <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-4">
                      <span className="text-[10px] font-black text-slate-300 group-hover:text-slate-900 transition-colors">#{product.id}</span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs">
                          {product.productName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm leading-none">{product.productName}</p>
                          <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-tight">{product.saleType}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-xs font-bold text-slate-900">{product.sku}</p>
                      <p className="text-[10px] font-medium text-slate-400 mt-1 tracking-wider">{product.barcode || 'NO BARCODE'}</p>
                    </td>
                    <td className="px-8 py-4">
                      <p className="text-xs font-black text-slate-900">PKR {product.sellPricePerUnitExclTax.toLocaleString()}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Cost: {product.costPerUnitExclTax}</p>
                    </td>
                    <td className="px-8 py-4">
                      <div className="inline-flex items-center px-2 py-1 bg-emerald-50 text-emerald-600 rounded-md text-[10px] font-black">
                        {product.gstRate}%
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
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

      {/* Add Product Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
              className="relative w-full max-w-6xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">New Stock Item</h2>
                  <p className="text-slate-400 text-xs font-bold mt-1 uppercase tracking-wider">Create a new product for your warehouse</p>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>

              {/* Form Content */}
              <div className="flex-1 overflow-y-auto p-8 bg-[#f8fafc]">
                {error && (
                  <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-shake">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                <div className="space-y-6">
                  {/* Top Header Bar */}
                  <div className="bg-[#4a2e1d] rounded-2xl p-2 flex items-center gap-1">
                    <button className="flex items-center gap-2 px-6 py-2 bg-[#ffffff15] rounded-xl text-white font-bold text-sm border border-white/5">
                      <Box className="w-4 h-4" /> Item Definition
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 text-white/50 font-bold text-sm hover:text-white transition-colors">
                      <TrendingUp className="w-4 h-4" /> Stock Management
                    </button>
                  </div>

                  {/* Main Form Section */}
                  <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                    <div className="grid grid-cols-12 gap-6">
                      {/* Sale Type */}
                      <div className="col-span-12 md:col-span-3 space-y-2">
                        <div className="flex items-center gap-1.5">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sale Type</label>
                          <HelpCircle className="w-3 h-3 text-slate-300" />
                        </div>
                        <div className="relative">
                          <select 
                            value={formData.saleType}
                            onChange={(e) => setFormData({...formData, saleType: e.target.value})}
                            className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 appearance-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 outline-none"
                          >
                            {saleTypes.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Product Name */}
                      <div className="col-span-12 md:col-span-4 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Name *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.productName}
                          onChange={(e) => setFormData({...formData, productName: e.target.value})}
                          placeholder="e.g. Panadol Syrup 100ml"
                          className="w-full px-5 py-3 bg-[#f0fff9] border-2 border-[#10b98120] rounded-xl font-bold text-xs text-emerald-900 placeholder:text-emerald-200 focus:border-emerald-500 outline-none transition-all"
                        />
                      </div>

                      {/* SKU */}
                      <div className="col-span-12 md:col-span-1 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SKU</label>
                        <input 
                          type="text" 
                          value={formData.sku}
                          onChange={(e) => setFormData({...formData, sku: e.target.value})}
                          className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-500 outline-none"
                        />
                      </div>

                      {/* Barcode */}
                      <div className="col-span-12 md:col-span-2 space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Barcode</label>
                        <input 
                          type="text" 
                          value={formData.barcode}
                          onChange={(e) => setFormData({...formData, barcode: e.target.value})}
                          placeholder="EAN/UPC"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 outline-none"
                        />
                      </div>

                      {/* HS Code */}
                      <div className="col-span-12 md:col-span-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">HS Code</label>
                            <Search className="w-3 h-3 text-emerald-600" />
                          </div>
                        </div>
                        <div className="relative group">
                          <input 
                            type="text" 
                            value={formData.hsCode}
                            onChange={(e) => setFormData({...formData, hsCode: e.target.value})}
                            placeholder="0000.0000"
                            className="w-full pl-4 pr-10 py-3 bg-red-50/30 border-2 border-red-100 rounded-xl font-mono text-xs font-bold text-red-900 outline-none focus:border-red-400 transition-all placeholder:text-red-200"
                          />
                          <button 
                            onClick={searchHSCode}
                            disabled={isSearchingHS}
                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-900 transition-colors disabled:opacity-50"
                          >
                            {isSearchingHS ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Search className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Description */}
                      <div className="col-span-12 space-y-2">
                         <input 
                          type="text" 
                          value={formData.description}
                          onChange={(e) => setFormData({...formData, description: e.target.value})}
                          placeholder="Item description for invoices (optional)"
                          className="w-full px-5 py-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-500 font-medium outline-none"
                        />
                      </div>
                    </div>

                    {/* Pricing Section */}
                    <div className="mt-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 rounded-full bg-[#0D47A1]" />
                        <h4 className="text-[10px] font-black text-[#0D47A1] uppercase tracking-[0.2em]">Your Sale <span className="text-slate-300 font-medium normal-case tracking-normal ml-2">— per selling unit</span></h4>
                      </div>

                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 md:col-span-2 space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Selling Unit *</label>
                          <input 
                            type="text" 
                            placeholder="Bottle, Strip..."
                            value={formData.sellingUnit}
                            onChange={(e) => setFormData({...formData, sellingUnit: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 outline-none"
                          />
                        </div>
                        <div className="col-span-12 md:col-span-1 space-y-2">
                          <label className="text-[9px] font-black text-[#0D47A1] uppercase tracking-widest">Pkg Qty</label>
                          <input 
                            type="number" 
                            value={formData.pkgQty}
                            onChange={(e) => setFormData({...formData, pkgQty: parseInt(e.target.value) || 1})}
                            className="w-full px-4 py-3 border-2 border-[#0D47A1] rounded-xl font-bold text-xs text-slate-900 outline-none"
                          />
                        </div>
                        <div className="col-span-12 md:col-span-2 space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Package Size</label>
                          <input 
                            type="text" 
                            placeholder="100ml, 50kg"
                            value={formData.packageSize}
                            onChange={(e) => setFormData({...formData, packageSize: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 outline-none"
                          />
                        </div>
                        <div className="col-span-12 md:col-span-2 space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Cost/Unit (Excl Tax)</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">Rs</span>
                            <input 
                              type="number" 
                              value={formData.costPerUnitExclTax}
                              onChange={(e) => setFormData({...formData, costPerUnitExclTax: parseFloat(e.target.value) || 0})}
                              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 outline-none"
                            />
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-2 space-y-2">
                          <label className="text-[9px] font-black text-red-600 uppercase tracking-widest">Sell Price/Unit (Excl Tax) *</label>
                          <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-300">Rs</span>
                            <input 
                              type="number" 
                              value={formData.sellPricePerUnitExclTax}
                              onChange={(e) => setFormData({...formData, sellPricePerUnitExclTax: parseFloat(e.target.value) || 0})}
                              className="w-full pl-10 pr-4 py-3 border-2 border-slate-900 rounded-xl font-bold text-xs text-slate-900 outline-none"
                            />
                          </div>
                        </div>
                        <div className="col-span-12 md:col-span-3 space-y-2">
                          <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Tax Base (Excl Tax)</label>
                          <div className="w-full px-6 py-3 bg-[#f0fff9] border-2 border-[#10b98120] rounded-xl flex items-center justify-between">
                            <span className="text-slate-400 text-xs font-bold">Base</span>
                            <span className="text-emerald-600 font-black text-sm">Rs {formData.sellPricePerUnitExclTax.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* FBR Conversion */}
                    <div className="mt-8 bg-[#fffcf0] rounded-2xl p-6 border border-amber-100 flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3">
                           <span className="text-[14px] font-black text-slate-900 tracking-tight">{formData.pkgQty} <span className="text-slate-400 font-bold mx-1">×</span> Unit</span>
                           <div className="flex bg-white px-3 py-1.5 border border-amber-300 rounded-lg text-[11px] font-bold">
                             (1 Unit = <input className="w-8 mx-1 text-center font-black outline-none" value="1" readOnly /> {formData.uom})
                           </div>
                        </div>
                        <ArrowRightIcon className="w-5 h-5 text-amber-400" />
                        <div className="px-6 py-2 bg-[#10b98110] border border-[#10b98150] rounded-xl text-emerald-600 font-black text-[15px]">
                          {formData.pkgQty} {formData.uom}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sent to FBR</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">UOM</label>
                        <select 
                          value={formData.uom}
                          onChange={(e) => setFormData({...formData, uom: e.target.value})}
                          className="bg-white border border-slate-200 rounded-xl px-4 py-2 font-bold text-xs text-slate-700 outline-none"
                        >
                          {uomTypes.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Tax Calculation */}
                    <div className="mt-10">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-2 h-2 rounded-full bg-emerald-600" />
                        <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">Tax Calculation</h4>
                      </div>

                      <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-12 md:col-span-2 space-y-2">
                           <label className="text-[9px] font-black text-teal-600 uppercase tracking-widest">Rate</label>
                           <select 
                            value={formData.gstRate}
                            onChange={(e) => setFormData({...formData, gstRate: parseInt(e.target.value) || 0})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-700 outline-none"
                           >
                            <option value={0}>0%</option>
                            <option value={5}>5%</option>
                            <option value={10}>10%</option>
                            <option value={18}>18%</option>
                            <option value={20}>20%</option>
                           </select>
                        </div>
                        <div className="col-span-12 md:col-span-3 space-y-2">
                           <label className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">GST Amount</label>
                           <div className="w-full px-6 py-3 bg-[#f0fff9] border-2 border-[#10b98120] rounded-xl flex items-center justify-between font-black text-xs">
                             <span className="text-slate-400">Tax</span>
                             <span className="text-emerald-600">Rs {calculateTax(formData.sellPricePerUnitExclTax, formData.gstRate).toFixed(2)}</span>
                           </div>
                        </div>
                        <div className="col-span-12 md:col-span-2 space-y-2">
                           <label className="text-[9px] font-black text-violet-600 uppercase tracking-widest">FT %</label>
                           <input type="number" value="0" readOnly className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-xs text-slate-400" />
                        </div>
                        <div className="col-span-12 md:col-span-2 space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">FT Amt</label>
                           <div className="w-full px-6 py-3 bg-amber-50/30 border border-amber-100 rounded-xl text-amber-600 font-bold text-xs text-center">0</div>
                        </div>
                        <div className="col-span-12 md:col-span-3 space-y-2">
                           <label className="text-[9px] font-black text-violet-600 uppercase tracking-widest">Total Tax</label>
                           <div className="w-full px-6 py-3 bg-violet-50/30 border border-violet-100 rounded-xl text-violet-600 font-black text-xs flex items-center justify-between">
                            <span>Sum</span>
                            <span>Rs {calculateTax(formData.sellPricePerUnitExclTax, formData.gstRate).toFixed(2)}</span>
                           </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary Bar */}
                  <div className="bg-[#10b981] rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl shadow-emerald-600/20">
                    <div className="flex items-center gap-4">
                      <button className="px-5 py-2.5 bg-[#ffffff20] border border-white/20 rounded-xl text-white font-bold text-xs hover:bg-[#ffffff30] transition-colors">
                        Auto from rate
                      </button>
                      <button className="px-5 py-2.5 bg-[#ffffff20] border border-white/20 rounded-xl text-white font-bold text-xs hover:bg-[#ffffff30] transition-colors">
                        Select SRO first
                      </button>
                      <div className="flex items-center gap-2 text-white/80 font-bold text-xs">
                        <CheckCircle2 className="w-4 h-4" /> FBR-ready
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-white/60 uppercase tracking-widest">Default Invoice Subtotal</p>
                      <div className="flex items-baseline justify-end gap-2 text-white">
                        <span className="text-xl font-black">Rs {(formData.sellPricePerUnitExclTax + calculateTax(formData.sellPricePerUnitExclTax, formData.gstRate)).toFixed(2)}</span>
                      </div>
                      <p className="text-[8px] font-bold text-white/50 uppercase tracking-tighter">per unit incl. tax — shown on new invoices</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-8 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-400">
                  <ShieldCheckIcon className="w-5 h-5" />
                  <p className="text-[10px] font-bold uppercase tracking-widest">Invoizeo AI Secured</p>
                </div>
                <div className="flex gap-4">
                   <button 
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-3.5 rounded-2xl font-bold text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Discard Changes
                  </button>
                  <button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-slate-950 text-white px-10 py-4 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/40 hover:bg-slate-900 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-70 group"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Save Stock Item
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

// Internal components
const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ShieldCheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default Inventory;
