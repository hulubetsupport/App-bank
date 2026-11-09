import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  ShoppingCart,
  Store,
  Tag,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { formatETB } from '../utils/banking.ts';

interface ShoppingModalProps {
  isOpen: boolean;
  onClose: () => void;
  balance: number;
  onSuccessPayShopping: (amount: number, storeName: string, orderNumber: string) => void;
}

export const ShoppingModal: React.FC<ShoppingModalProps> = ({
  isOpen,
  onClose,
  balance,
  onSuccessPayShopping,
}) => {
  const [storeCategory, setStoreCategory] = useState<'supermarket' | 'electronics' | 'pharmacy' | 'fashion'>('supermarket');
  const [storeName, setStoreName] = useState('All Mart Hypermarket (CMC)');
  const [orderNumber, setOrderNumber] = useState('ORD-99120');
  const [amount, setAmount] = useState('1250');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const stores = [
    { cat: 'supermarket', name: 'All Mart Hypermarket (CMC)', defaultAmt: '1250' },
    { cat: 'supermarket', name: 'Safeway Supermarket', defaultAmt: '740' },
    { cat: 'electronics', name: 'Garad Electronics (Bole)', defaultAmt: '4800' },
    { cat: 'pharmacy', name: 'Kenema Pharmacy #12', defaultAmt: '320' },
    { cat: 'fashion', name: 'Zara Addis Fashion House', defaultAmt: '1850' },
  ];

  const filteredStores = stores.filter((s) => s.cat === storeCategory);

  const numAmount = Number(amount) || 0;

  const handlePay = () => {
    if (numAmount <= 0 || numAmount > balance) return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      onSuccessPayShopping(numAmount, storeName, orderNumber);
      onClose();
    }, 800);
  };

  return (
    <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] z-50 flex flex-col justify-end animate-in fade-in duration-200 select-none">
      <div className="bg-white rounded-t-[32px] phone:rounded-t-[36px] max-h-[92vh] flex flex-col shadow-2xl border-t border-[#ECECEF] animate-in slide-in-from-bottom-10 duration-200 max-w-[500px] mx-auto w-full">
        {/* Handle */}
        <div className="pt-3 pb-1">
          <div className="w-12 h-1.5 bg-[#E5DFD7] rounded-full mx-auto"></div>
        </div>

        {/* Header */}
        <div className="px-6 py-2.5 flex items-center justify-between border-b border-[#ECECEF]">
          <div className="flex items-center gap-2.5">
            <div className="w-8.5 h-8.5 rounded-full bg-[#F3EBDD] flex items-center justify-center text-[#7B1FA2]">
              <ShoppingBag className="w-4.5 h-4.5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-[15px] phone:text-[16px] font-bold text-[#29212E] leading-tight">
                Shopping &amp; Retail
              </h3>
              <p className="text-[11px] text-[#96939A] leading-none">የግዢ እና ሱቆች ክፍያ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F7F7F9] hover:bg-[#ECECEF] text-[#96939A] hover:text-[#29212E] flex items-center justify-center transition"
          >
            <X className="w-4.5 h-4.5 stroke-[2]" />
          </button>
        </div>

        {/* Body downwards */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-5 phone:p-6 space-y-4">
          {/* Category Tabs */}
          <div className="flex p-1 bg-[#F7F7F9] rounded-xl border border-[#ECECEF] text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setStoreCategory('supermarket');
                setStoreName('All Mart Hypermarket (CMC)');
                setAmount('1250');
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                storeCategory === 'supermarket' ? 'bg-[#7B1FA2] text-white shadow-xs' : 'text-[#96939A]'
              }`}
            >
              Grocery
            </button>
            <button
              type="button"
              onClick={() => {
                setStoreCategory('electronics');
                setStoreName('Garad Electronics (Bole)');
                setAmount('4800');
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                storeCategory === 'electronics' ? 'bg-[#7B1FA2] text-white shadow-xs' : 'text-[#96939A]'
              }`}
            >
              Electronics
            </button>
            <button
              type="button"
              onClick={() => {
                setStoreCategory('pharmacy');
                setStoreName('Kenema Pharmacy #12');
                setAmount('320');
              }}
              className={`flex-1 py-1.5 rounded-lg transition ${
                storeCategory === 'pharmacy' ? 'bg-[#7B1FA2] text-white shadow-xs' : 'text-[#96939A]'
              }`}
            >
              Pharmacy
            </button>
          </div>

          {/* Store Selector */}
          <div className="bg-[#F7F7F9] rounded-2xl p-4 border border-[#ECECEF] space-y-3">
            <div>
              <label className="text-xs font-bold text-[#29212E] block mb-1">
                Merchant / Store
              </label>
              <div className="font-semibold text-sm text-[#7B1FA2] bg-white px-3 py-2 rounded-xl border border-[#ECECEF]">
                {storeName}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#29212E] block mb-1">
                Order / Cart Reference
              </label>
              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="ORD-99120"
                className="w-full h-11 px-3.5 bg-white rounded-xl border border-[#ECECEF] text-sm font-mono text-[#29212E] focus:outline-none focus:border-[#7B1FA2]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[#29212E] block mb-1">
                Bill Amount (ETB)
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full h-11 px-3.5 bg-white rounded-xl border border-[#ECECEF] text-base font-bold text-[#29212E] font-mono focus:outline-none focus:border-[#7B1FA2]"
              />
            </div>
          </div>

          {/* Available Balance Reveal */}
          <div className="flex items-center justify-between px-3 py-2.5 bg-[#EBF6EE] rounded-xl text-xs border border-[#159B75]/20">
            <span className="text-[#159B75] font-semibold">Available Account Balance</span>
            <span className="font-bold font-mono text-[#159B75]">{formatETB(balance)} ETB</span>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-4 border-t border-[#ECECEF] bg-white">
          <button
            onClick={handlePay}
            disabled={isSubmitting || numAmount <= 0 || numAmount > balance}
            className="w-full h-12 phone:h-13 rounded-full bg-gradient-to-r from-[#7B1FA2] to-[#8D24AA] hover:from-[#6B188E] hover:to-[#7B1FA2] active:scale-98 text-white font-bold text-xs phone:text-sm flex items-center justify-center gap-2 shadow-md transition disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Confirming Purchase...</span>
            ) : (
              <>
                <span>Pay Store ({numAmount > 0 ? `${formatETB(numAmount)} ETB` : ''})</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
