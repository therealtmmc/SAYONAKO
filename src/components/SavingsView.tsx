import { useState } from 'react';
import { PiggyBank, Plus, Trash2, History, TrendingUp, X, Save, Calendar, Target, DollarSign } from 'lucide-react';
import { KahootButton } from './KahootButton';
import { PopupModal } from './PopupModal';
import { motion, AnimatePresence } from 'motion/react';

export interface SavingsHistoryEntry {
  id: string;
  amount: number;
  date: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  history: SavingsHistoryEntry[];
}

interface SavingsViewProps {
  savings: SavingsGoal[];
  onAddGoal: (goal: Omit<SavingsGoal, 'id' | 'currentAmount' | 'history'>) => void;
  onAddMoney: (id: string, amount: number) => void;
  onDeleteGoal: (id: string) => void;
}

export function SavingsView({ savings, onAddGoal, onAddMoney, onDeleteGoal }: SavingsViewProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMoneyModal, setShowMoneyModal] = useState<string | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState<string | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<string | null>(null);

  // Form states
  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [moneyAmount, setMoneyAmount] = useState('');

  const handleCreate = () => {
    if (newGoalName && newGoalTarget) {
      onAddGoal({
        name: newGoalName,
        targetAmount: parseFloat(newGoalTarget)
      });
      setNewGoalName('');
      setNewGoalTarget('');
      setShowAddModal(false);
    }
  };

  const handleAddMoneySubmit = () => {
    if (showMoneyModal && moneyAmount) {
      onAddMoney(showMoneyModal, parseFloat(moneyAmount));
      setMoneyAmount('');
      setShowMoneyModal(null);
    }
  };

  const getProgress = (current: number, target: number) => {
    return Math.min(100, (current / target) * 100);
  };

  const selectedHistoryGoal = savings.find(s => s.id === showHistoryModal);
  const moneyModalGoal = savings.find(s => s.id === showMoneyModal);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-b-4 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-pink-100 p-3 rounded-xl border-2 border-pink-200">
            <PiggyBank className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase">Savings</h2>
            <p className="text-slate-500 font-bold text-sm">{savings.length} Goals Active</p>
          </div>
        </div>
        
        <KahootButton onClick={() => setShowAddModal(true)} variant="primary" className="flex items-center gap-2 shadow-lg shadow-blue-200 w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" />
          New Goal
        </KahootButton>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {savings.map(goal => {
            const progress = getProgress(goal.currentAmount, goal.targetAmount);
            const isCompleted = goal.currentAmount >= goal.targetAmount;

            return (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative overflow-hidden bg-white rounded-3xl border-b-8 border-slate-200 shadow-sm group"
              >
                {/* Progress Background Fill */}
                <div 
                  className={`absolute bottom-0 left-0 top-0 transition-all duration-1000 ease-out opacity-20 ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                  style={{ width: `${progress}%` }}
                />

                <div className="relative z-10 p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{goal.name}</h3>
                      <div className="flex items-center gap-2 text-slate-500 font-bold text-sm mt-1">
                        <Target className="w-4 h-4" />
                        Target: ₱{goal.targetAmount.toLocaleString()}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-lg font-black text-sm ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {progress.toFixed(1)}%
                    </div>
                  </div>

                  <div className="py-4">
                    <div className="flex items-end gap-2">
                      <span className="text-4xl font-black text-slate-800">₱{goal.currentAmount.toLocaleString()}</span>
                      <span className="text-slate-400 font-bold mb-1.5">saved</span>
                    </div>
                    {/* Progress Bar Visual */}
                    <div className="h-4 bg-slate-100 rounded-full mt-2 overflow-hidden border-2 border-slate-200">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-full ${isCompleted ? 'bg-green-500' : 'bg-blue-500'}`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <KahootButton 
                      onClick={() => setShowMoneyModal(goal.id)} 
                      variant="success" 
                      className="flex-1 flex justify-center items-center gap-2 text-sm"
                    >
                      <Plus className="w-4 h-4" /> Add Money
                    </KahootButton>
                    <button 
                      onClick={() => setShowHistoryModal(goal.id)}
                      className="p-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors border-b-4 border-slate-200 active:border-b-0 active:mt-1 active:border-t-4 active:border-transparent"
                      title="View History"
                    >
                      <History className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => setGoalToDelete(goal.id)}
                      className="p-3 bg-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors border-b-4 border-red-200 active:border-b-0 active:mt-1 active:border-t-4 active:border-transparent"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        
        {savings.length === 0 && (
          <div className="col-span-full text-center py-20 bg-white rounded-3xl border-4 border-dashed border-slate-300 flex flex-col items-center justify-center gap-4">
            <div className="w-24 h-24 bg-pink-50 rounded-full flex items-center justify-center animate-bounce">
              <PiggyBank className="w-12 h-12 text-pink-300" />
            </div>
            <div>
              <p className="text-slate-500 font-black text-2xl uppercase">No savings goals yet!</p>
              <p className="text-slate-400 font-medium">Start saving for something special today.</p>
            </div>
            <KahootButton onClick={() => setShowAddModal(true)} variant="primary" className="mt-4">
              Create First Goal
            </KahootButton>
          </div>
        )}
      </div>

      {/* Add Goal Modal */}
      <PopupModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} title="New Savings Goal" variant="default">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">What are you saving for?</label>
            <input 
              type="text" 
              value={newGoalName}
              onChange={(e) => setNewGoalName(e.target.value)}
              placeholder="e.g. New Phone, Vacation..."
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-bold text-lg"
              autoFocus
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Target Amount (₱)</label>
            <input 
              type="number" 
              value={newGoalTarget}
              onChange={(e) => setNewGoalTarget(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-bold text-lg"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <KahootButton variant="secondary" onClick={() => setShowAddModal(false)} className="flex-1">Cancel</KahootButton>
            <KahootButton variant="primary" onClick={handleCreate} className="flex-1" disabled={!newGoalName || !newGoalTarget}>Create Goal</KahootButton>
          </div>
        </div>
      </PopupModal>

      {/* Add Money Modal */}
      <PopupModal isOpen={!!showMoneyModal} onClose={() => setShowMoneyModal(null)} title="Add to Savings" variant="success">
        <div className="space-y-4">
          <div className="text-center mb-4">
            <div className="text-sm text-slate-500 font-bold uppercase">Adding to</div>
            <div className="text-xl font-black text-slate-800">{moneyModalGoal?.name}</div>
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase block mb-1">Amount to Add (₱)</label>
            <input 
              type="number" 
              value={moneyAmount}
              onChange={(e) => setMoneyAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-green-500 focus:outline-none font-black text-2xl text-center text-green-600"
              autoFocus
            />
          </div>
          <div className="flex gap-3 pt-4">
            <KahootButton variant="secondary" onClick={() => setShowMoneyModal(null)} className="flex-1">Cancel</KahootButton>
            <KahootButton variant="success" onClick={handleAddMoneySubmit} className="flex-1" disabled={!moneyAmount}>Add Money</KahootButton>
          </div>
        </div>
      </PopupModal>

      {/* History Modal */}
      <PopupModal isOpen={!!showHistoryModal} onClose={() => setShowHistoryModal(null)} title="Savings History" variant="default">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {selectedHistoryGoal?.history.length === 0 ? (
            <div className="text-center py-8 text-slate-400 font-bold">No deposits yet.</div>
          ) : (
            [...(selectedHistoryGoal?.history || [])].reverse().map((entry) => (
              <div key={entry.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border-2 border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="bg-green-100 p-2 rounded-lg text-green-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-700">Added Money</div>
                    <div className="text-xs font-bold text-slate-400 uppercase">
                      {new Date(entry.date).toLocaleDateString()} • {new Date(entry.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                </div>
                <div className="font-black text-green-600 text-lg">
                  +₱{entry.amount.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="pt-4">
          <KahootButton onClick={() => setShowHistoryModal(null)} variant="secondary" className="w-full">Close</KahootButton>
        </div>
      </PopupModal>

      {/* Delete Confirmation */}
      <PopupModal isOpen={!!goalToDelete} onClose={() => setGoalToDelete(null)} title="Delete Goal?" variant="danger">
        <div className="text-center space-y-4">
          <p>Are you sure you want to delete this savings goal? This action cannot be undone.</p>
          <div className="flex gap-3 pt-2">
            <KahootButton variant="secondary" onClick={() => setGoalToDelete(null)} className="flex-1">Cancel</KahootButton>
            <KahootButton variant="danger" onClick={() => { if(goalToDelete) onDeleteGoal(goalToDelete); setGoalToDelete(null); }} className="flex-1">Delete</KahootButton>
          </div>
        </div>
      </PopupModal>
    </div>
  );
}
