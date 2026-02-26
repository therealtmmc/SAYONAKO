import { Calendar, Trash2 } from 'lucide-react';
import { KahootButton } from './KahootButton';
import { PopupModal } from './PopupModal';

interface HistoryEntry {
  id: string;
  date: string;
  total: number;
  itemCount: number;
  timestamp: number;
}

interface SalesHistoryModalProps {
  history: HistoryEntry[];
  onClose: () => void;
  onClearHistory: () => void;
  onDeleteEntry: (id: string) => void;
}

export function SalesHistoryModal({ history, onClose, onClearHistory, onDeleteEntry }: SalesHistoryModalProps) {
  const totalAllTime = history.reduce((sum, entry) => sum + entry.total, 0);

  return (
    <PopupModal isOpen={true} onClose={onClose} title="Sales History" variant="default">
      <div className="max-h-[70vh] flex flex-col">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-100 p-3 rounded-xl border-2 border-blue-200 text-center">
            <div className="text-xs font-bold text-blue-400 uppercase">Records</div>
            <div className="text-2xl font-black text-blue-600">{history.length}</div>
          </div>
          <div className="bg-green-100 p-3 rounded-xl border-2 border-green-200 text-center">
            <div className="text-xs font-bold text-green-500 uppercase">Total</div>
            <div className="text-2xl font-black text-green-600">₱{totalAllTime.toLocaleString()}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-2 custom-scrollbar min-h-[200px]">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-bold text-lg">No history yet</p>
              <p className="text-xs">Close a register day to save it here.</p>
            </div>
          ) : (
            history.sort((a, b) => b.timestamp - a.timestamp).map((entry) => (
              <div key={entry.id} className="bg-white p-3 rounded-xl border-2 border-slate-100 flex items-center justify-between group">
                <div>
                  <div className="font-bold text-slate-700 text-sm">
                    {new Date(entry.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">
                    {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {entry.itemCount} Items
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="font-black text-lg text-green-600">
                    ₱{entry.total.toLocaleString()}
                  </div>
                  <button 
                    onClick={() => onDeleteEntry(entry.id)}
                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-4 pt-4 border-t-2 border-slate-100 flex justify-between items-center">
          <button 
            onClick={onClearHistory}
            className="text-red-400 hover:text-red-600 text-xs font-bold uppercase hover:underline"
          >
            Clear All
          </button>
          <KahootButton onClick={onClose} className="py-2 px-6 text-sm">
            Close
          </KahootButton>
        </div>
      </div>
    </PopupModal>
  );
}
