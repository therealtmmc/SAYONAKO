import { X, Trash2, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { PopupModal } from './PopupModal';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface HistoryEntry {
  id: string;
  date: string;
  total: number;
  itemCount: number;
  timestamp: number;
  items?: { name: string; price: number; quantity: number }[];
}

interface SalesHistoryModalProps {
  history: HistoryEntry[];
  onClose: () => void;
  onClearHistory: () => void;
  onDeleteEntry: (id: string) => void;
}

export function SalesHistoryModal({ history, onClose, onClearHistory, onDeleteEntry }: SalesHistoryModalProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalAllTime = history.reduce((sum, entry) => sum + entry.total, 0);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <PopupModal isOpen={true} onClose={onClose} title="Sales History" variant="default">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
        
        {/* Big Container: Total Sold */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 border-b-8 border-blue-700 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Calendar className="w-32 h-32" />
          </div>
          <div className="relative z-10">
            <h3 className="text-blue-100 font-bold uppercase tracking-widest text-sm mb-1">Total Revenue</h3>
            <div className="text-5xl sm:text-6xl font-black tracking-tighter">
              ₱{totalAllTime.toLocaleString()}
            </div>
            <div className="mt-4 inline-block bg-white/20 px-4 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
              {history.length} Records Found
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2">
          <h3 className="font-black text-slate-700 uppercase text-lg">Daily Records</h3>
          {history.length > 0 && (
            <button 
              onClick={onClearHistory}
              className="text-red-500 text-xs font-bold uppercase hover:bg-red-50 px-3 py-1 rounded-lg transition-colors"
            >
              Clear All History
            </button>
          )}
        </div>

        {/* Daily Records List */}
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-bold">No sales history yet.</p>
            </div>
          ) : (
            [...history].reverse().map((entry) => (
              <motion.div 
                key={entry.id}
                layout
                className="bg-white rounded-2xl border-b-4 border-slate-200 overflow-hidden shadow-sm"
              >
                <div 
                  className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => toggleExpand(entry.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 p-3 rounded-xl text-green-600 font-bold text-xs flex flex-col items-center justify-center w-16 h-16 border-2 border-green-200">
                      <span className="text-lg leading-none">{new Date(entry.date).getDate()}</span>
                      <span className="uppercase text-[10px]">{new Date(entry.date).toLocaleString('default', { month: 'short' })}</span>
                    </div>
                    <div>
                      <div className="text-slate-400 text-xs font-bold uppercase">
                        {new Date(entry.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                      <div className="text-2xl font-black text-slate-800">
                        ₱{entry.total.toLocaleString()}
                      </div>
                      <div className="text-xs font-bold text-slate-500">
                        {entry.itemCount} Items Sold
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteEntry(entry.id);
                      }}
                      className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                    <div className={`transform transition-transform duration-300 ${expandedId === entry.id ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedId === entry.id && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="bg-slate-50 border-t-2 border-slate-100"
                    >
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-bold text-slate-600 text-sm uppercase">Item Breakdown</h4>
                          <button 
                            onClick={() => setExpandedId(null)}
                            className="text-xs font-bold text-blue-500 flex items-center gap-1 hover:underline"
                          >
                            Minimize <ChevronUp className="w-3 h-3" />
                          </button>
                        </div>
                        
                        {entry.items && entry.items.length > 0 ? (
                          <div className="space-y-2">
                            {entry.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-sm border-b border-slate-100 pb-1 last:border-0">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-700 bg-slate-100 px-2 rounded text-xs">{item.quantity}x</span>
                                  <span className="text-slate-600">{item.name}</span>
                                </div>
                                <span className="font-bold text-slate-500">₱{(item.price * item.quantity).toLocaleString()}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400 italic">
                            No detailed item data available for this record.
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </PopupModal>
  );
}
