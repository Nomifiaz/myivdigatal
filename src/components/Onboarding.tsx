import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Loader2, 
  AlertCircle,
  Building,
  Upload,
  X,
  Image as ImageIcon,
  ChevronRight,
  Info,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { authService } from '../services/api';

interface OnboardingProps {
  onComplete: () => void;
}

type Step = 1 | 2 | 3 | 4 | 5;

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    ntn: '',
    cnic: '',
    address: '',
    province: 'Punjab',
    fbrSandboxToken: '',
    fbrProductionToken: '',
    logo: null as File | null
  });

  const steps = [
    { id: 1, label: 'Brand Identity', icon: ImageIcon },
    { id: 2, label: 'Business & Tax Info', icon: Building },
    { id: 3, label: 'Physical Location', icon: MapPin },
    { id: 4, label: 'FBR Configuration', icon: ShieldCheck },
    { id: 5, label: 'Review & Complete', icon: CheckCircle2 },
  ];

  const handleSubmit = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          data.append(key, value as string | Blob);
        }
      });

      await authService.registerBusiness(data);
      onComplete();
    } catch (err: any) {
      setError(err.message);
      setCurrentStep(2); // Go back to tax info if there's an error usually related to fields
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep((prev) => (prev + 1) as Step);
    else handleSubmit();
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as Step);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, logo: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({ ...prev, logo: null }));
    setLogoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-hidden flex flex-col font-sans">
      {/* Background Geometric Decor */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#0f172a_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto py-8 px-4 flex-1 flex flex-col justify-center">
        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative max-w-4xl mx-auto">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center relative z-10">
                <div 
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-500 border-2 ${
                    currentStep >= step.id 
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg' 
                    : 'bg-white border-slate-200 text-slate-300'
                  }`}
                >
                  <step.icon className="w-5 h-5" />
                </div>
                <div className="mt-3 text-center">
                  <p className={`text-[9px] font-bold uppercase tracking-widest ${currentStep === step.id ? 'text-slate-900' : 'text-slate-400'}`}>
                    Step {step.id}
                  </p>
                  <p className={`text-[10px] font-bold whitespace-nowrap mt-0.5 ${currentStep === step.id ? 'text-slate-900' : 'text-slate-400'}`}>
                    {step.label}
                  </p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="absolute top-[22px] left-full w-full h-0.5 bg-slate-200 -ml-5" style={{ width: 'calc(100% - 20px)' }}>
                    <div 
                      className="h-full bg-slate-900 transition-all duration-500" 
                      style={{ width: currentStep > step.id ? '100%' : '0%' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Card */}
        <div className="flex items-center justify-center">
          <motion.div 
            layout
            className="bg-white w-full rounded-[32px] shadow-2xl shadow-slate-900/5 border border-white p-8 md:p-12 relative"
          >
            {error && (
              <div className="mb-6 bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-bold">
                <AlertCircle className="w-5 h-5" />
                {error}
              </div>
            )}

            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Step 1: Brand Identity</h2>
                    <p className="text-slate-500 text-xs mt-2 font-medium">Establish your professional digital presence</p>
                  </div>

                  <div className="flex flex-col items-center">
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full max-w-lg aspect-video rounded-[24px] border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center relative overflow-hidden group ${
                        logoPreview ? 'border-slate-400 bg-slate-50/30' : 'border-slate-200 hover:border-slate-950 bg-slate-50/50'
                      }`}
                    >
                      {logoPreview ? (
                        <>
                          <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-8" />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <p className="text-white font-bold text-xs bg-slate-950 px-5 py-2 rounded-xl">Update Logo</p>
                          </div>
                          <button 
                            onClick={(e) => { e.stopPropagation(); removeLogo(); }}
                            className="absolute top-5 right-5 p-2 bg-white rounded-full text-red-500 shadow-md hover:bg-red-50"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-4 text-slate-900 group-hover:scale-110 transition-transform">
                            <Upload className="w-8 h-8" />
                          </div>
                          <div className="bg-slate-950 text-white px-8 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-slate-900/20 uppercase tracking-widest mb-4">
                            Choose File
                          </div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">PNG, SVG or JPG | MAX 5MB</p>
                        </>
                      )}
                    </div>
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleLogoChange} />
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Step 2: Business & Tax Info</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">Business Name</label>
                      <input 
                        type="text" 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Invoizeo Enterprise Solutions"
                        className="w-full px-6 py-4 bg-white border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">NTN Number</label>
                        <Info className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                      <input 
                        type="text" 
                        name="ntn"
                        value={formData.ntn}
                        onChange={handleChange}
                        placeholder="1234567-8"
                        className="w-full px-6 py-4 bg-white border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">CNIC Number (Proprietor)</label>
                      <input 
                        type="text" 
                        name="cnic"
                        value={formData.cnic}
                        onChange={handleChange}
                        placeholder="42101-1234567-1"
                        className="w-full px-6 py-4 bg-white border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-bold text-slate-800"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Step 3: Physical Location</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3 md:col-span-2">
                      <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">Street Address</label>
                      <input 
                        type="text" 
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="123 Street, City"
                        className="w-full px-6 py-4 bg-white border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-bold text-slate-800"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">Province</label>
                      <div className="relative">
                        <select 
                          name="province"
                          value={formData.province}
                          onChange={handleChange}
                          className="w-full px-6 py-4 bg-white border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-bold text-slate-800 appearance-none"
                        >
                          <option value="Punjab">Punjab</option>
                          <option value="Sindh">Sindh</option>
                          <option value="KPK">KPK</option>
                          <option value="Balochistan">Balochistan</option>
                          <option value="Islamabad">Islamabad</option>
                        </select>
                        <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 rotate-90" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-wide opacity-50">Country (Auto)</label>
                      <input value="Pakistan" readOnly className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-400" />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div 
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-10"
                >
                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Step 4: FBR Configuration</h2>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">FBR Sandbox Token</label>
                        <span className="text-[10px] font-bold text-slate-900 uppercase">Test Mode</span>
                      </div>
                      <input 
                        type="text" 
                        name="fbrSandboxToken"
                        value={formData.fbrSandboxToken}
                        onChange={handleChange}
                        placeholder="Paste your sandbox token"
                        className="w-full px-6 py-4 bg-white border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-mono text-sm font-bold text-slate-700"
                      />
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-900 uppercase tracking-wide">FBR Production Token</label>
                        <Lock className="w-3.5 h-3.5 text-slate-300" />
                      </div>
                      <input 
                        type="text" 
                        name="fbrProductionToken"
                        value={formData.fbrProductionToken}
                        onChange={handleChange}
                        placeholder="Paste your production token"
                        className="w-full px-6 py-4 bg-white border border-slate-300 rounded-2xl outline-none focus:ring-4 focus:ring-slate-900/5 focus:border-slate-900 transition-all font-mono text-sm font-bold text-slate-700"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 5 && (
                <motion.div 
                  key="step5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Final Step: Review</h2>
                    <p className="text-slate-500 font-medium mt-2">Everything looks ready for deployment.</p>
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex items-center gap-6">
                    <div className="w-20 h-20 bg-white rounded-2xl shadow-sm flex items-center justify-center p-4 border border-slate-200">
                      {logoPreview ? <img src={logoPreview} alt="Logo" className="w-full h-full object-contain" /> : <Building2 className="w-8 h-8 text-slate-300" />}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">{formData.name || 'Your Business Name'}</h3>
                      <div className="flex gap-4 mt-1">
                        <p className="text-xs font-bold text-slate-400">NTN: <span className="text-slate-900">{formData.ntn || 'N/A'}</span></p>
                        <p className="text-xs font-bold text-slate-400">Location: <span className="text-slate-900">{formData.province}</span></p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex items-center gap-4">
                    <CheckCircle2 className="w-6 h-6 text-slate-900" />
                    <p className="text-sm font-bold text-slate-900">Your configuration meets enterprise compliance standards.</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Actions */}
            <div className="mt-14 pt-10 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3 text-slate-400">
                <ShieldCheck className="w-5 h-5" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Enterprise-Grade Security</p>
              </div>

              <div className="flex gap-4">
                {currentStep > 1 && (
                  <button 
                    onClick={prevStep}
                    className="px-8 py-3.5 rounded-2xl font-bold text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Go Back
                  </button>
                )}
                <button 
                  onClick={nextStep}
                  disabled={isLoading}
                  className="bg-slate-950 text-white pl-10 pr-8 py-4 rounded-2xl font-black text-sm shadow-xl shadow-slate-900/30 hover:bg-slate-900 transition-all flex items-center gap-3 active:scale-95 disabled:opacity-70 group"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      {currentStep === 5 ? 'Complete Setup' : 'Continue to Step ' + (currentStep + 1)}
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </div>

            {currentStep === 1 && (
              <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-full text-center">
                <button className="text-xs font-bold text-slate-400 hover:text-slate-950 uppercase tracking-widest bg-white/50 backdrop-blur px-6 py-2 rounded-full border border-slate-200/50">
                  Save as Draft
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
