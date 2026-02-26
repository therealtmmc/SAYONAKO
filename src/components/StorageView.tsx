import { useState } from 'react';
import { Search, Plus, Trash2, Package, Save, Edit2, X } from 'lucide-react';
import { KahootButton } from './KahootButton';
import { motion, AnimatePresence } from 'motion/react';

interface Item {
  id: string;
  name: string;
  price: number;
  category: string;
  quantity: number;
  liquidDetails?: {
    volume: number;
    unit: string;
  };
}

interface StorageViewProps {
  items: Item[];
  onUpdateItem: (id: string, updates: Partial<Item>) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: () => void;
}

export function StorageView({ items, onUpdateItem, onDeleteItem, onAddItem }: StorageViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Edit states
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editQty, setEditQty] = useState('');

  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startEditing = (item: Item) => {
    setEditingId(item.id);
    setEditName(item.name);
    setEditPrice(item.price.toString());
    setEditQty(item.quantity.toString());
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditName('');
    setEditPrice('');
    setEditQty('');
  };

  const saveEdit = (id: string) => {
    const price = parseFloat(editPrice);
    const quantity = parseInt(editQty);

    if (editName.trim() && !isNaN(price) && !isNaN(quantity)) {
      onUpdateItem(id, {
        name: editName,
        price: price,
        quantity: quantity
      });
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm border-b-4 border-slate-200">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-3 rounded-xl border-2 border-orange-200">
            <Package className="w-6 h-6 text-orange-600" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-800 uppercase">Storage</h2>
            <p className="text-slate-500 font-bold text-sm">{items.length} Items Total</p>
          </div>
        </div>
        
        <KahootButton onClick={onAddItem} variant="primary" className="flex items-center gap-2 shadow-lg shadow-blue-200 w-full sm:w-auto justify-center">
          <Plus className="w-5 h-5" />
          Add New Item
        </KahootButton>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search inventory..."
          className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-bold text-slate-700 shadow-inner bg-slate-50"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
      </div>

      {/* Inventory List */}
      <div className="grid grid-cols-1 gap-3">
        <AnimatePresence>
          {filteredItems.map((item) => (
            <motion.div 
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`bg-white p-4 rounded-2xl shadow-sm border-b-4 transition-all ${editingId === item.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-slate-200 hover:border-blue-300'}`}
            >
              {editingId === item.id ? (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Name</label>
                      <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Price (₱)</label>
                      <input 
                        type="number" 
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase">Quantity</label>
                      <input 
                        type="number" 
                        value={editQty}
                        onChange={(e) => setEditQty(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button 
                      onClick={cancelEditing}
                      className="px-4 py-2 rounded-xl font-bold text-slate-500 hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => saveEdit(item.id)}
                      className="px-4 py-2 rounded-xl font-bold bg-green-500 text-white hover:bg-green-600 flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" /> Save
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-center gap-4 justify-between">
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center border-2 ${item.quantity > 0 ? 'bg-blue-50 border-blue-100 text-blue-500' : 'bg-red-50 border-red-100 text-red-500'}`}>
                      <Package className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-black text-slate-800 text-lg">{item.name}</h3>
                      <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-400">
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>₱{item.price}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg border-2 border-slate-100">
                      <span className="text-xs font-bold text-slate-400 uppercase px-2">Stock:</span>
                      <span className={`px-3 py-1 rounded-lg font-black text-lg min-w-[60px] text-center ${
                        item.quantity > 0 
                          ? 'bg-white text-slate-700' 
                          : 'bg-red-100 text-red-600'
                      }`}>
                        {item.quantity}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(item)}
                        className="p-3 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors"
                        title="Edit Item"
                      >
                        <Edit2 className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => onDeleteItem(item.id)}
                        className="p-3 bg-red-100 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-slate-400 font-bold">
            No items found in storage.
          </div>
        )}
      </div>
    </div>
  );
}
