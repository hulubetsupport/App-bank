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
      icon: <Receipt className="w-5 h-5 text-[#7B1FA2]" />,
    },
    {
      title: 'ICS / Immigration',
      subtitle: 'ICS / Immigration',
      icon: <Globe className="w-5 h-5 text-[#7B1FA2]" />,
    },
    {
      title: 'Mesob Services',
      subtitle: 'Mesob Services',
      icon: <Building className="w-5 h-5 text-[#7B1FA2]" />,
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
    <div className="absolute inset-0 bg-[#F7F7F9] z-40 flex flex-col animate-in slide-in-from-right duration-200 select-none">
      {/* Header */}
      <header className="bg-gradient-to-br from-[#76169B] via-[#8120A4] to-[#941FAE] px-4.5 phone:px-6 pt-[calc(env(safe-area-inset-top,0px)+12px)] pb-3.5 phone:pb-4.5 text-white flex items-center justify-between shrink-0 shadow-sm">
        <div className="flex items-center justify-between max-w-[500px] mx-auto w-full">
          <div className="flex items-center gap-3 phone:gap-3.5">
            <button
              onClick={onClose}
              className="w-8.5 h-8.5 phone:w-10 phone:h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition shadow-2xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h2 className="text-[17px] phone:text-[19px] font-bold">Government Services</h2>
          </div>

          <button className="w-8.5 h-8.5 phone:w-10 phone:h-10 rounded-full bg-white/20 text-white flex items-center justify-center shadow-2xs">
            <Search className="w-4.5 h-4.5 phone:w-5 phone:h-5" />
          </button>
        </div>
      </header>

      {/* Services List Card */}
      <div className="flex-1 bg-[#F7F7F9] p-4 phone:p-6 overflow-y-auto no-scrollbar space-y-2.5 phone:space-y-3 max-w-[500px] mx-auto w-full">
        {services.map((item) => (
          <div
            key={item.title}
            onClick={() => onSelectService(item.title)}
            className="p-3.5 phone:p-4.5 bg-white rounded-[18px] phone:rounded-[22px] border border-[#ECECEF] shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-[#7B1FA2]/30 transition cursor-pointer flex items-center justify-between group active:scale-[0.99]"
          >
            <div className="flex items-center gap-3.5 phone:gap-4">
              <div className="w-10 h-10 phone:w-12 phone:h-12 rounded-2xl bg-purple-50 flex items-center justify-center shrink-0 border border-purple-100/50">
                {item.icon}
              </div>
              <div>
                <h4 className="text-[13.5px] phone:text-[15px] font-bold text-[#29212E] leading-tight">
                  {item.title}
                </h4>
                <p className="text-[11px] phone:text-[12.5px] text-[#96939A] mt-0.5">{item.subtitle}</p>
              </div>
            </div>

            <ChevronRight className="w-4.5 h-4.5 phone:w-5 phone:h-5 text-[#96939A] group-hover:text-[#7B1FA2] transition" />
          </div>
        ))}
      </div>
    </div>
  );
};
