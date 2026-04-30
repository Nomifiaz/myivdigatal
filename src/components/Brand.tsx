import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Logo: React.FC<LogoProps> = ({ className = '', showText = false, size = 'md' }) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-10',
    lg: 'h-16',
    xl: 'h-24'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizes[size]} aspect-square relative`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Main D shape gradient background */}
          <path d="M30 10C55 10 90 25 90 50C90 75 55 90 30 90L30 10Z" fill="url(#logo_grad)" />
          
          {/* Invoice document shape */}
          <path d="M35 30H65V70H35V30Z" fill="white" />
          <path d="M55 30H65V40L55 30Z" fill="#00B8D4" />
          
          {/* Invoice lines */}
          <rect x="42" y="45" width="16" height="3" rx="1.5" fill="#0D47A1" />
          <rect x="42" y="53" width="16" height="3" rx="1.5" fill="#0D47A1" />
          <rect x="42" y="61" width="12" height="3" rx="1.5" fill="#0D47A1" />
          
          {/* Pixels/Data squares */}
          <rect x="10" y="32" width="8" height="8" fill="#00B8D4" />
          <rect x="20" y="42" width="8" height="8" fill="#0D47A1" />
          <rect x="10" y="52" width="8" height="8" fill="#00B8D4" />
          <rect x="25" y="35" width="8" height="8" fill="#0D47A1" />
          <rect x="18" y="58" width="8" height="8" fill="#0D47A1" />

          <defs>
            <linearGradient id="logo_grad" x1="30" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0D47A1" />
              <stop offset="1" stopColor="#00B8D4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {showText && (
        <span className={`${size === 'xl' ? 'text-4xl' : size === 'lg' ? 'text-2xl' : 'text-xl'} font-black tracking-tight text-slate-900`}>
          Invoizeo<span className="text-[#00B8D4]">.</span>
        </span>
      )}
    </div>
  );
};
