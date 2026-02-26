import { Trash2, ShoppingBag, ArrowRight, History } from 'lucide-react';
import { KahootButton } from './KahootButton';

interface Item {
  id: string;
  name: string;
  price: number;
}

interface SalesListProps {
  sales: Record<string, number>;
  items: Item[];
  total: number;
  onCloseDay: () => void;
  onDecrement: (id: string) => void;
  onShowHistory: () => void;
}

export function SalesList({ sales, items, total, onCloseDay, onDecrement, onShowHistory }: SalesListProps) {
  const salesEntries = Object.entries(sales).map(([id, count]) => {
    const item = items.find(i => i.id === id);
    return {
      id,
      count,
      item
    };
  }).filter(entry => entry.item !== undefined);

  return (
    <div className="bg-white rounded-2xl shadow-xl border-b-4 border-slate-200 overflow-hidden flex flex-col h-full">
      <div className="p-4 bg-slate-50 border-b-2 border-slate-100 flex justify-between items-center">
        <h2 className="text-xl font-black text-slate-800 uppercase flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-blue-500" />
          Checkout
        </h2>
        <button 
          onClick={onShowHistory}
          className="text-xs font-bold text-blue-500 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 hover:bg-blue-100 flex items-center gap-1"
        >
          <History className="w-3 h-3" /> History
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-[200px]">
        {salesEntries.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2 opacity-60">
            <ShoppingBag className="w-12 h-12" />
            <p className="font-bold text-sm">No items yet</p>
          </div>
        ) : (
          salesEntries.map(({ id, count, item }) => (
            <div key={id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border-2 border-slate-100 group hover:border-blue-200 transition-colors">
              <div className="flex-1">
                <div className="font-bold text-slate-700 leading-tight">{item!.name}</div>
                <div className="text-xs text-slate-400 font-bold mt-1">
                  ₱{item!.price} x {count}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="font-black text-slate-800">
                  ₱{(item!.price * count).toLocaleString()}
                </div>
                <button 
                  onClick={() => onDecrement(id)}
                  className="p-2 bg-white text-red-500 rounded-lg shadow-sm border border-slate-200 hover:bg-red-50 hover:border-red-200 transition-all active:scale-95"
                  title="Remove one"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-50 border-t-2 border-slate-100 space-y-4">
        <div className="flex justify-between items-end">
          <span className="text-slate-500 font-bold uppercase text-sm">Total Today</span>
          <span className="text-4xl font-black text-slate-800 tracking-tight">
            ₱{total.toLocaleString()}
          </span>
        </div>

        <KahootButton 
          onClick={onCloseDay} 
          variant="success" 
          className="w-full py-4 text-xl flex items-center justify-center gap-2 shadow-lg shadow-green-200"
          disabled={total === 0}
        >
          Checkout <ArrowRight className="w-6 h-6" />
        </KahootButton>
      </div>
    </div>
  );
}
