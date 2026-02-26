import { Save, Minus } from 'lucide-react';
import { KahootCard } from './KahootCard';
import { KahootButton } from './KahootButton';

interface SalesListProps {
  sales: Record<string, number>;
  items: Array<{ id: string; name: string; price: number }>;
  total: number;
  onCloseDay: () => void;
  onDecrement: (itemId: string) => void;
}

export function SalesList({ sales, items, total, onCloseDay, onDecrement }: SalesListProps) {
  // Sort items by sales count (descending)
  const sortedSales = Object.entries(sales)
    .map(([itemId, count]) => {
      const item = items.find(i => i.id === itemId);
      return {
        id: itemId,
        name: item?.name || 'Unknown Item',
        count,
        total: (item?.price || 0) * count
      };
    })
    .sort((a, b) => b.count - a.count);

  return (
    <KahootCard title="Current Register" className="h-full flex flex-col bg-white/90 backdrop-blur" color="purple">
      <div className="mb-6 bg-purple-50 p-6 rounded-2xl border-4 border-purple-200 text-center shadow-inner">
        <div className="text-sm font-bold text-purple-400 uppercase mb-2 tracking-widest">Total Revenue Today</div>
        <div className="text-5xl font-black text-purple-600 drop-shadow-sm">₱{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {sortedSales.length === 0 ? (
          <div className="text-center py-12 text-slate-400 italic flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">💤</span>
            </div>
            No sales yet today!
          </div>
        ) : (
          sortedSales.map((sale, idx) => (
            <div key={sale.id} className="flex items-center justify-between bg-white p-3 rounded-xl border-b-4 border-slate-100 hover:border-purple-100 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center font-black text-lg shadow-sm">
                  {sale.count}
                </div>
                <div>
                  <div className="font-bold text-slate-700 leading-tight">{sale.name}</div>
                  <div className="text-xs font-bold text-slate-400 uppercase">₱{sale.total.toLocaleString()} total</div>
                </div>
              </div>
              
              <button 
                onClick={() => onDecrement(sale.id)}
                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                title="Remove one"
              >
                <Minus className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t-2 border-slate-100">
        <KahootButton 
          onClick={onCloseDay}
          variant="success"
          className="w-full flex items-center justify-center gap-2 py-4 text-lg shadow-lg shadow-green-200"
          disabled={total === 0}
        >
          <Save className="w-6 h-6" />
          Close & Save Day
        </KahootButton>
      </div>
    </KahootCard>
  );
}
