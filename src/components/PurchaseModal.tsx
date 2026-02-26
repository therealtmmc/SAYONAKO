import { useState } from 'react';
import { KahootButton } from './KahootButton';
import { PopupModal } from './PopupModal';
import { Minus, Plus } from 'lucide-react';

interface PurchaseModalProps {
  item: { id: string; name: string; price: number; liquidDetails?: { volume: number; unit: string } };
  onConfirm: (quantity: number) => void;
  onCancel: () => void;
}

export function PurchaseModal({ item, onConfirm, onCancel }: PurchaseModalProps) {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity(q => q + 1);
  const decrement = () => setQuantity(q => Math.max(1, q - 1));

  const total = item.price * quantity;

  return (
    <PopupModal isOpen={true} onClose={onCancel} title="Purchase Item" variant="default">
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <h3 className="text-3xl font-black text-slate-800 mb-2 leading-tight">{item.name}</h3>
          {item.liquidDetails && (
            <div className="inline-block bg-blue-100 text-blue-600 font-bold text-sm px-3 py-1 rounded-full border border-blue-200 mb-2">
              {item.liquidDetails.volume} {item.liquidDetails.unit}
            </div>
          )}
          <p className="text-slate-500 font-bold text-xl">₱{item.price} each</p>
        </div>

        <div className="flex items-center gap-6 bg-slate-100 p-2 rounded-2xl border-2 border-slate-200">
          <button 
            onClick={decrement}
            className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border-b-4 border-slate-300 active:border-b-0 active:mt-1 transition-all hover:bg-red-50 text-slate-600 font-bold"
          >
            <Minus className="w-6 h-6" />
          </button>
          
          <div className="w-16 text-center font-black text-3xl text-slate-800">
            {quantity}
          </div>

          <button 
            onClick={increment}
            className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm border-b-4 border-slate-300 active:border-b-0 active:mt-1 transition-all hover:bg-green-50 text-slate-600 font-bold"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="w-full bg-blue-50 p-4 rounded-xl border-2 border-blue-100 flex justify-between items-center">
          <span className="font-bold text-blue-400 uppercase text-sm">Total Amount</span>
          <span className="font-black text-3xl text-blue-600">₱{total.toLocaleString()}</span>
        </div>

        <div className="flex gap-3 w-full">
          <KahootButton variant="secondary" onClick={onCancel} className="flex-1">
            Cancel
          </KahootButton>
          <KahootButton 
            variant="success" 
            onClick={() => onConfirm(quantity)} 
            className="flex-1 shadow-lg shadow-green-200"
          >
            Confirm
          </KahootButton>
        </div>
      </div>
    </PopupModal>
  );
}
