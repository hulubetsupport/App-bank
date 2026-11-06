import React from 'react';
import {
  ArrowLeft,
  Search,
  ChevronRight,
  Receipt,
  Globe,
  Building,
  FileSpreadsheet,
  Car,
  AlertTriangle,
  MapPin,
  Home,
  Briefcase,
} from 'lucide-react';

interface GovernmentServicesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceName: string) => void;
}

export const GovernmentServicesModal: React.FC<GovernmentServicesModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
}) => {
  if (!isOpen) return null;

  const services = [
    {
      title: 'Tax Payments',
      subtitle: 'Tax Payments',
      icon: <Receipt className="w-5 h-5 text-[#7C21A4]" />,
    },
    {
      title: 'ICS / Immigration',
      subtitle: 'ICS / Immigration',
      icon: <Globe className="w-5 h-5 text-[#7C21A4]" />,
    },
    {
      title: 'Mesob Services',
      subtitle: 'Mesob Services',
      icon: <Building className="w-5 h-5 text-[#7C21A4]" />,
    },
    {
      title: 'DARS',
      subtitle: 'DARS',
      icon: <FileSpreadsheet className="w-5 h-5 text-amber-600" />,
    },
    {
      title: 'A.A TMA Parking Payment',
      subtitle: 'A.A TMA Parking Payment',
      icon: <Car className="w-5 h-5 text-blue-600" />,
    },
    {
      title: 'A.A TMA Traffic Penalty',
      subtitle: 'A.A TMA Traffic Penalty',
      icon: <AlertTriangle className="w-5 h-5 text-sky-600" />,
    },
    {
      title: 'Addis Ababa Land Admin',
      subtitle: 'Addis Ababa Land Admin',
      icon: <MapPin className="w-5 h-5 text-teal-600" />,
    },
    {
      title: 'Federal Housing Corporation',
      subtitle: 'Federal Housing Corporation',
      icon: <Home className="w-5 h-5 text-indigo-600" />,
    },
    {
      title: 'Ministry of Trade and Industry',
      subtitle: 'Ministry of Trade and Industry',
      icon: <Briefcase className="w-5 h-5 text-purple-700" />,
    },
  ];

  return (
    <div className="absolute inset-0 bg-[#F5F3EC] z-40 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Header */}
      <div className="bg-[#7C21A4] px-4.5 pt-3 pb-3 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <h2 className="text-base font-bold">Government Services</h2>
        </div>

        <button className="w-8 h-8 rounded-full bg-white/20 text-white flex items-center justify-center">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {/* Services List Card */}
      <div className="flex-1 bg-white rounded-t-[28px] -mt-1 p-4 overflow-y-auto no-scrollbar shadow-inner space-y-2.5">
        {services.map((item) => (
          <div
            key={item.title}
            onClick={() => onSelectService(item.title)}
            className="p-3 bg-white rounded-2xl border border-neutral-150 shadow-2xs hover:shadow-sm transition cursor-pointer flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-50/80 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <h4 className="text-[13px] font-bold text-neutral-800 leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] text-neutral-400 mt-0.5">{item.subtitle}</p>
              </div>
            </div>

            <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#7C21A4] transition" />
          </div>
        ))}
      </div>
    </div>
  );
};
