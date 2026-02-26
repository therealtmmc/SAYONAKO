import { useState } from 'react';
import { KahootButton } from './KahootButton';
import { Plus, Trash2 } from 'lucide-react';
import { PopupModal } from './PopupModal';

interface AddItemFormProps {
  categories: string[];
  onAdd: (item: any) => void;
  onCancel: () => void;
  onAddCategory: (category: string) => void;
  onDeleteCategory: (category: string) => void;
}

export function AddItemForm({ categories, onAdd, onCancel, onAddCategory, onDeleteCategory }: AddItemFormProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState(categories[0] || '');
  
  // Liquid options
  const [isLiquid, setIsLiquid] = useState(false);
  const [volume, setVolume] = useState('');
  const [unit, setUnit] = useState('oz');

  // New category input
  const [newCategory, setNewCategory] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const handleAddCategory = () => {
    if (newCategory.trim()) {
      onAddCategory(newCategory.trim());
      setCategory(newCategory.trim());
      setNewCategory('');
      setIsAddingCategory(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) return;
    
    onAdd({
      name,
      price: parseFloat(price),
      category,
      liquidDetails: isLiquid ? { volume: parseFloat(volume), unit } : undefined
    });
    
    // Reset form
    setName('');
    setPrice('');
    setIsLiquid(false);
    setVolume('');
  };

  return (
    <PopupModal isOpen={true} onClose={onCancel} title="Add New Item" variant="default">
      <form onSubmit={handleSubmit} className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
        {/* Basic Info */}
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-bold text-slate-700"
              placeholder="Item Name"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Price (₱)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-bold text-slate-700"
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>
        </div>

        {/* Category Selection */}
        <div>
          <label className="block text-xs font-bold text-slate-500 mb-1 uppercase">Category</label>
          {isAddingCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border-2 border-blue-500 focus:outline-none font-bold"
                placeholder="New Category Name"
                autoFocus
              />
              <button 
                type="button"
                onClick={handleAddCategory}
                className="bg-green-500 text-white px-3 rounded-lg font-bold hover:bg-green-600"
              >
                Add
              </button>
              <button 
                type="button"
                onClick={() => setIsAddingCategory(false)}
                className="bg-slate-200 text-slate-600 px-3 rounded-lg font-bold hover:bg-slate-300"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-bold text-slate-700 bg-white"
                required
              >
                <option value="" disabled>Select Category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <button 
                type="button"
                onClick={() => setIsAddingCategory(true)}
                className="bg-blue-100 text-blue-600 p-2 rounded-lg hover:bg-blue-200 border-2 border-blue-200"
                title="Add Category"
              >
                <Plus className="w-5 h-5" />
              </button>
              {category && (
                <button 
                  type="button"
                  onClick={() => {
                    if(confirm(`Delete category "${category}"?`)) {
                      onDeleteCategory(category);
                      setCategory('');
                    }
                  }}
                  className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 border-2 border-red-200"
                  title="Delete Selected Category"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Liquid Options */}
        <div className="bg-slate-50 p-3 rounded-xl border-2 border-slate-100">
          <label className="flex items-center gap-2 cursor-pointer mb-2">
            <input 
              type="checkbox" 
              checked={isLiquid} 
              onChange={(e) => setIsLiquid(e.target.checked)}
              className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="font-bold text-slate-600 text-sm uppercase">Is this a drink?</span>
          </label>
          
          {isLiquid && (
            <div className="grid grid-cols-2 gap-3 mt-2 animate-in slide-in-from-top-2">
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Volume</label>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-bold"
                  placeholder="e.g. 12"
                  required={isLiquid}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-1 uppercase">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-bold bg-white"
                >
                  <option value="oz">fl oz</option>
                  <option value="ml">ml</option>
                  <option value="l">L</option>
                  <option value="gal">gal</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <KahootButton type="button" variant="secondary" onClick={onCancel} className="flex-1 py-2">
            Cancel
          </KahootButton>
          <KahootButton type="submit" variant="success" className="flex-1 py-2">
            Save Item
          </KahootButton>
        </div>
      </form>
    </PopupModal>
  );
}
