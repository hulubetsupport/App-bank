import React, { useState } from 'react';
import { ArrowLeft, Search, ChevronRight, Receipt, Globe, Building, X } from 'lucide-react';

interface GovernmentServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceName: string) => void;
}

const DarsEmblem = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8">
    <circle cx="20" cy="20" r="18" fill="#1E2B4D" stroke="#D4B15C" strokeWidth="1.5" />
    <circle cx="20" cy="20" r="12.5" fill="#E8E43A" />
    <path d="M15 15h10v10H15z" fill="#1E2B4D" opacity="0.85" />
    <path d="M17 18h6M17 21h6" stroke="#E8E43A" strokeWidth="1.4" />
  </svg>
);

const AaTmaEmblem = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8">
    <circle cx="20" cy="20" r="17" fill="#0B79B8" />
    <path
      d="M11 16c2 4 3 10 2 14M16 14c1 5 5-2 7 3s1 7 5 1"
      stroke="#FFFFFF"
      strokeWidth="2.4"
      strokeLinecap="round"
      fill="none"
    />
    <circle cx="28" cy="11" r="2.2" fill="#E98324" />
  </svg>
);

const LandAdminEmblem = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8">
    <rect x="4" y="6" width="32" height="28" rx="6" fill="#F0F5F9" />
    <path d="M10 24c4-5 16-5 20 0" stroke="#1C6E8C" strokeWidth="2.2" fill="none" />
    <path d="M20 11v13M16 16h8" stroke="#1C6E8C" strokeWidth="2" strokeLinecap="round" />
    <path d="M10 28h20" stroke="#1C6E8C" strokeWidth="1.5" strokeDasharray="2 2" />
  </svg>
);

const FhcEmblem = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8">
    <rect x="6" y="16" width="8" height="16" fill="#5D6B7E" />
    <rect x="16" y="10" width="9" height="22" fill="#2A7AB0" />
    <rect x="27" y="14" width="7" height="18" fill="#5D6B7E" />
    <path d="M8 29h24" stroke="#8C1D18" strokeWidth="2.5" />
    <text x="20" y="36" textAnchor="middle" fontSize="6" fontWeight="bold" fill="#8C1D18">
      FHC
    </text>
  </svg>
);

const MotriEmblem = () => (
  <svg viewBox="0 0 40 40" className="w-8 h-8">
    <circle cx="20" cy="20" r="14" fill="none" stroke="#183A5A" strokeWidth="3.2" />
    <circle cx="20" cy="20" r="9" fill="#E8F1F8" />
    <text x="20" y="22.5" textAnchor="middle" fontSize="6.8" fontWeight="bold" fill="#183A5A">
      MOTRI
    </text>
  </svg>
);

export const GovernmentServicesModal: React.FC<GovernmentServicesModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
}) => {
  const [showSearch, setShowSearch] = useState(false);
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  const services = [
    {
      title: 'Tax Payments',
      subtitle: 'Tax Payments',
      icon: <Receipt className="w-5.5 h-5.5 text-[#7B1FA2]" />,
    },
    {
      title: 'ICS / Immigration',
      subtitle: 'ICS / Immigration',
      icon: <Globe className="w-5.5 h-5.5 text-[#7B1FA2]" />,
    },
    {
      title: 'Mesob Services',
      subtitle: 'Mesob Services',
      icon: <Building className="w-5.5 h-5.5 text-[#7B1FA2]" />,
    },
    {
      title: 'DARS',
      subtitle: 'DARS',
      icon: <DarsEmblem />,
    },
    {
      title: 'A.A TMA Parking Payment',
      subtitle: 'A.A TMA Parking Payment',
      icon: <AaTmaEmblem />,
    },
    {
      title: 'A.A TMA Traffic Penalty',
      subtitle: 'A.A TMA Traffic Penalty',
      icon: <AaTmaEmblem />,
    },
    {
      title: 'Addis Ababa Land Admin',
      subtitle: 'Addis Ababa Land Admin',
      icon: <LandAdminEmblem />,
    },
    {
      title: 'Federal Housing Corporation',
      subtitle: 'Federal Housing Corporation',
      icon: <FhcEmblem />,
    },
    {
      title: 'Ministry of Trade and Industry',
      subtitle: 'Ministry of Trade and Industry',
      icon: <MotriEmblem />,
    },
  ];

  const filtered = query.trim()
    ? services.filter((s) => s.title.toLowerCase().includes(query.toLowerCase()))
    : services;

  return (
    <div className="absolute inset-x-0 top-0 bottom-[58px] phone:bottom-[64px] bg-[#F7F7F9] z-40 flex flex-col animate-in slide-in-from-right duration-200 select-none">
      {/* Header matching Screenshot_20261105_174858 */}
      <header className="bg-gradient-to-br from-[#76169B] via-[#8120A4] to-[#941FAE] px-4.5 phone:px-6 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-5 text-white shrink-0 shadow-sm">
        <div className="flex items-center justify-between max-w-[500px] mx-auto w-full">
          <div className="flex items-center gap-3 phone:gap-3.5">
            <button
              onClick={onClose}
              className="w-8.5 h-8.5 phone:w-10 phone:h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition shadow-2xs"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-[17px] phone:text-[19px] font-bold">Government Services</h2>
          </div>

          <button
            onClick={() => {
              setShowSearch((prev) => !prev);
              setQuery('');
            }}
            className={`w-8.5 h-8.5 phone:w-10 phone:h-10 rounded-full ${
              showSearch ? 'bg-white text-[#7B1FA2]' : 'bg-white/20 text-white'
            } flex items-center justify-center shadow-2xs transition`}
            aria-label="Search government services"
          >
            <Search className="w-4.5 h-4.5 phone:w-5 phone:h-5" />
          </button>
        </div>
      </header>

      {/* Curved White Sheet overlapping Header */}
      <div className="flex-1 bg-[#F7F7F9] rounded-t-[24px] -mt-3 px-4 phone:px-5 pt-4 pb-5 overflow-y-auto no-scrollbar space-y-2.5 phone:space-y-3 max-w-[500px] mx-auto w-full">
        {showSearch && (
          <div className="relative mb-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search government agencies..."
              autoFocus
              className="w-full h-11 pl-10 pr-9 bg-white rounded-2xl border border-[#ECECEF] text-sm text-[#29212E] placeholder-[#96939A] focus:outline-none focus:border-[#7B1FA2] shadow-2xs"
            />
            <Search className="w-4 h-4 text-[#96939A] absolute left-3.5 top-3.5" />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-3.5 text-[#96939A] hover:text-[#29212E]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-xs phone:text-sm text-[#96939A]">
            No matching government services found
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.title}
              onClick={() => onSelectService(item.title)}
              className="p-3.5 phone:p-4 bg-white rounded-[18px] phone:rounded-[20px] border border-[#ECECEF] shadow-[0_2px_8px_rgba(0,0,0,0.03)] hover:border-[#7B1FA2]/30 transition cursor-pointer flex items-center justify-between group active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 phone:w-11 phone:h-11 rounded-2xl bg-[#F8F6FA] flex items-center justify-center shrink-0 border border-[#ECECEF]">
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-[14px] phone:text-[15px] font-bold text-[#7B1FA2] leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[11px] phone:text-[12px] text-[#96939A] mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4.5 h-4.5 phone:w-5 phone:h-5 text-[#7B1FA2]/70 group-hover:text-[#7B1FA2] transition" />
            </div>
          ))
        )}
      </div>
    </div>
  );
};
