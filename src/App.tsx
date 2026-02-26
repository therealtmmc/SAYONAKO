import { useState, useEffect } from 'react';
import { ShoppingBag, Store, History, Trash2, Check, AlertTriangle, Menu, X, Search, Package } from 'lucide-react';
import { KahootButton } from './components/KahootButton';
import { AddItemForm } from './components/AddItemForm';
import { SalesList } from './components/SalesList';
import { SalesHistoryModal } from './components/SalesHistoryModal';
import { PopupModal } from './components/PopupModal';
import { PurchaseModal } from './components/PurchaseModal';
import { LoadingScreen } from './components/LoadingScreen';
import { DigitalClock } from './components/DigitalClock';
import { InstallPWA } from './components/InstallPWA';
import { StorageView } from './components/StorageView';
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

interface HistoryEntry {
  id: string;
  date: string;
  total: number;
  itemCount: number;
  timestamp: number;
  items: { name: string; price: number; quantity: number }[];
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'sell' | 'storage'>('sell');
  const [isNavOpen, setIsNavOpen] = useState(false);

  // Initialize with EMPTY items as requested
  const [items, setItems] = useState<Item[]>(() => {
    try {
      const saved = localStorage.getItem('sayonako_items');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load items", e);
      return [];
    }
  });

  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sayonako_categories');
      return saved ? JSON.parse(saved) : ['Drinks', 'Snacks', 'Others'];
    } catch (e) {
      console.error("Failed to load categories", e);
      return ['Drinks', 'Snacks', 'Others'];
    }
  });

  const [sales, setSales] = useState<Record<string, number>>(() => {
    try {
      const saved = localStorage.getItem('sayonako_sales');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to load sales", e);
      return {};
    }
  });

  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const saved = localStorage.getItem('sayonako_history');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load history", e);
      return [];
    }
  });

  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    return localStorage.getItem('sayonako_selected_category') || 'All';
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showStatsMobile, setShowStatsMobile] = useState(false);
  
  // Popups state
  const [selectedItemForPurchase, setSelectedItemForPurchase] = useState<Item | null>(null);
  const [purchasedFeedback, setPurchasedFeedback] = useState<{name: string, price: number, quantity: number, time: string} | null>(null);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [historyToDelete, setHistoryToDelete] = useState<string | null>(null);
  const [showCloseDayConfirm, setShowCloseDayConfirm] = useState(false);
  const [showClearHistoryConfirm, setShowClearHistoryConfirm] = useState(false);

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem('sayonako_items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('sayonako_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('sayonako_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('sayonako_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('sayonako_selected_category', selectedCategory);
  }, [selectedCategory]);

  const handleAddItem = (newItem: any) => {
    const item: Item = {
      ...newItem,
      id: Date.now().toString(),
      quantity: parseInt(newItem.quantity) || 0,
    };
    setItems([...items, item]);
    setShowAddForm(false);
  };

  const handleUpdateItem = (id: string, updates: Partial<Item>) => {
    setItems(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const handleAddCategory = (newCat: string) => {
    if (!categories.includes(newCat)) {
      setCategories([...categories, newCat].sort());
    }
  };

  const handleDeleteCategory = (catToDelete: string) => {
    setCategories(categories.filter(c => c !== catToDelete));
    if (!categories.includes('Others') && catToDelete !== 'Others') {
        setCategories(prev => [...prev, 'Others'].sort());
    }
    setItems(items.map(i => i.category === catToDelete ? { ...i, category: 'Others' } : i));
  };

  const initiatePurchase = (itemId: string) => {
    const item = items.find(i => i.id === itemId);
    if (item) {
      setSelectedItemForPurchase(item);
    }
  };

  const confirmPurchase = (quantity: number) => {
    if (selectedItemForPurchase) {
      if (selectedItemForPurchase.quantity < quantity) {
        alert("Not enough stock!");
        return;
      }

      setItems(prevItems => prevItems.map(item => 
        item.id === selectedItemForPurchase.id 
          ? { ...item, quantity: item.quantity - quantity }
          : item
      ));

      setSales(prev => ({
        ...prev,
        [selectedItemForPurchase.id]: (prev[selectedItemForPurchase.id] || 0) + quantity
      }));
      
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
      
      setPurchasedFeedback({ 
        name: selectedItemForPurchase.name, 
        price: selectedItemForPurchase.price * quantity,
        quantity,
        time: timeString
      });
      
      setSelectedItemForPurchase(null);
      setTimeout(() => setPurchasedFeedback(null), 2000);
    }
  };

  const handleDecrementSale = (itemId: string) => {
    setItems(prevItems => prevItems.map(item => 
      item.id === itemId 
        ? { ...item, quantity: item.quantity + 1 }
        : item
    ));

    setSales(prev => {
      const current = prev[itemId] || 0;
      if (current <= 1) {
        const newState = { ...prev };
        delete newState[itemId];
        return newState;
      }
      return {
        ...prev,
        [itemId]: current - 1
      };
    });
  };

  const totalRevenue = Object.entries(sales).reduce((total, [itemId, count]) => {
    const item = items.find(i => i.id === itemId);
    return total + (item ? item.price * count : 0);
  }, 0);

  const totalItemsSold = Object.values(sales).reduce((sum, count) => sum + count, 0);

  const confirmCloseDay = () => {
    if (totalRevenue === 0) {
      alert("No sales to save!");
      return;
    }
    setShowCloseDayConfirm(true);
  };

  const handleCloseDay = () => {
    // Create a snapshot of sold items
    const soldItemsSnapshot = Object.entries(sales).map(([id, count]) => {
      const item = items.find(i => i.id === id);
      return {
        name: item ? item.name : 'Unknown Item',
        price: item ? item.price : 0,
        quantity: count
      };
    });

    const entry: HistoryEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      timestamp: Date.now(),
      total: totalRevenue,
      itemCount: totalItemsSold,
      items: soldItemsSnapshot
    };
    
    setHistory(prev => [...prev, entry]);
    setSales({});
    setShowCloseDayConfirm(false);
    setShowHistory(true);
  };

  const confirmDeleteItem = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setItemToDelete(id);
  };

  const handleDeleteItem = () => {
    if (itemToDelete) {
      setItems(items.filter(i => i.id !== itemToDelete));
      setItemToDelete(null);
    }
  };

  const confirmClearHistory = () => {
    setShowClearHistoryConfirm(true);
  };

  const handleClearHistory = () => {
    setHistory([]);
    setShowClearHistoryConfirm(false);
  };

  const confirmDeleteHistoryEntry = (id: string) => {
    setHistoryToDelete(id);
  };

  const handleDeleteHistoryEntry = () => {
    if (historyToDelete) {
      setHistory(prev => prev.filter(h => h.id !== historyToDelete));
      setHistoryToDelete(null);
    }
  };

  const filteredItems = items.filter(item => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8] font-sans text-slate-900 pb-24 lg:pb-20 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:16px_16px]">
      {/* Awning Header */}
      <div className="h-4 bg-[repeating-linear-gradient(45deg,#ef4444,#ef4444_20px,#ffffff_20px,#ffffff_40px)] shadow-md sticky top-0 z-40"></div>
      
      <header className="bg-white p-4 sm:p-6 shadow-lg border-b-4 border-slate-200 sticky top-4 z-30 mx-4 rounded-[2rem] mt-4">
        <div className="flex flex-col gap-6">
          
          {/* Top Row: Brand & Menu */}
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3 sm:gap-4">
              <InstallPWA className="hover:scale-105 transition-transform cursor-pointer active:scale-95">
                <div className="bg-[#ff3b30] p-3 sm:p-3.5 rounded-2xl shadow-sm">
                  <Store className="w-6 h-6 sm:w-8 sm:h-8 text-white" strokeWidth={2.5} />
                </div>
              </InstallPWA>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase text-[#1c1c1e] leading-none mt-1">Sayonako</h1>
            </div>

            <button 
              onClick={() => setIsNavOpen(true)}
              className="p-3 sm:p-4 bg-slate-100 text-slate-700 rounded-2xl hover:bg-slate-200 transition-colors"
            >
              <Menu className="w-6 h-6 sm:w-8 sm:h-8" strokeWidth={2.5} />
            </button>
          </div>

          {/* Bottom Row: Clock */}
          <div className="flex justify-center w-full">
            <DigitalClock />
          </div>

        </div>
      </header>

      {/* Navigation Drawer */}
      <AnimatePresence>
        {isNavOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNavOpen(false)}
              className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl p-6 flex flex-col gap-6"
            >
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black uppercase text-slate-800">Menu</h2>
                <button onClick={() => setIsNavOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => { setCurrentView('sell'); setIsNavOpen(false); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-b-4 transition-all font-bold text-lg ${
                    currentView === 'sell' 
                      ? 'bg-blue-50 border-blue-200 text-blue-600' 
                      : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Store className="w-6 h-6" />
                  Sell Section
                </button>

                <button 
                  onClick={() => { setCurrentView('storage'); setIsNavOpen(false); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-b-4 transition-all font-bold text-lg ${
                    currentView === 'storage' 
                      ? 'bg-orange-50 border-orange-200 text-orange-600' 
                      : 'bg-white border-slate-100 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Package className="w-6 h-6" />
                  Storage
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto p-4 mt-6">
        {currentView === 'sell' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Shop Grid */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search items..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none font-bold text-slate-700 shadow-inner bg-slate-50"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                <button
                  onClick={() => setSelectedCategory('All')}
                  className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap border-b-4 transition-all ${
                    selectedCategory === 'All' 
                      ? 'bg-blue-500 text-white border-blue-700' 
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  All Items
                </button>
                {categories.sort().map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-xl font-bold whitespace-nowrap border-b-4 transition-all ${
                      selectedCategory === cat 
                        ? 'bg-blue-500 text-white border-blue-700' 
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border-b-4 border-slate-200">
                <h2 className="text-lg sm:text-xl font-black text-slate-700 uppercase flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
                  {selectedCategory} Items
                </h2>
                <span className="text-xs sm:text-sm font-bold text-blue-500 bg-blue-50 px-3 py-1 sm:px-4 sm:py-2 rounded-xl border-2 border-blue-100">
                  {filteredItems.length} Products
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
                {filteredItems.map((item) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative group"
                  >
                    <button 
                      onClick={() => item.quantity > 0 && initiatePurchase(item.id)}
                      disabled={item.quantity <= 0}
                      className={`w-full text-left bg-white rounded-2xl sm:rounded-3xl shadow-sm border-b-4 sm:border-b-8 border-slate-200 overflow-hidden transition-all h-full flex flex-col duration-200 p-4 ${item.quantity > 0 ? 'hover:border-blue-500 hover:shadow-xl active:border-b-0 active:mt-2 active:shadow-none' : 'opacity-75 cursor-not-allowed border-slate-100'}`}
                    >
                      <div className="flex flex-col h-full justify-center items-center text-center gap-2">
                        <h3 className="font-black text-slate-800 leading-tight text-lg sm:text-xl line-clamp-2">{item.name}</h3>
                        
                        {item.liquidDetails && (
                          <div className="bg-blue-100 text-blue-600 font-bold text-xs px-3 py-1 rounded-full border border-blue-200">
                            {item.liquidDetails.volume} {item.liquidDetails.unit}
                          </div>
                        )}
                        
                        <div className="mt-2 bg-yellow-400 text-black font-black text-lg sm:text-xl px-4 py-1 rounded-xl shadow-sm border-b-4 border-yellow-500 rotate-[-2deg]">
                          ₱{item.price}
                        </div>

                        <div className={`mt-1 text-xs font-bold uppercase tracking-wider ${item.quantity > 0 ? 'text-slate-400' : 'text-red-500'}`}>
                          {item.quantity > 0 ? `${item.quantity} in stock` : 'Out of Stock'}
                        </div>
                      </div>
                      
                      {item.quantity <= 0 && (
                        <div className="absolute inset-0 bg-slate-100/80 backdrop-blur-[1px] flex items-center justify-center z-20">
                          <div className="bg-red-500 text-white px-4 py-2 rounded-xl font-black text-lg border-4 border-white shadow-xl rotate-[-5deg] uppercase tracking-widest">
                            Sold Out
                          </div>
                        </div>
                      )}
                    </button>
                  </motion.div>
                ))}
              </div>
              
              {filteredItems.length === 0 && (
                <div className="text-center py-20 bg-white rounded-3xl border-4 border-dashed border-slate-300 flex flex-col items-center justify-center gap-4">
                  <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center animate-bounce">
                    <Store className="w-12 h-12 text-slate-300" />
                  </div>
                  <div>
                    <p className="text-slate-500 font-black text-2xl uppercase">No items found!</p>
                    <p className="text-slate-400 font-medium">Try searching for something else.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: Stats - Mobile Drawer / Desktop Sticky */}
            <div className={`
              fixed inset-0 z-40 bg-black/50 lg:static lg:bg-transparent lg:z-auto
              ${showStatsMobile ? 'block' : 'hidden lg:block'}
            `}>
              <div className={`
                absolute right-0 top-0 bottom-0 w-80 bg-slate-100 p-4 shadow-2xl lg:shadow-none lg:static lg:w-auto lg:p-0 lg:bg-transparent
                transform transition-transform duration-300 ease-in-out
                ${showStatsMobile ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
              `}>
                 <div className="lg:hidden flex justify-end mb-4">
                   <button onClick={() => setShowStatsMobile(false)} className="p-2 bg-white rounded-full shadow-sm">
                     <X className="w-6 h-6 text-slate-500" />
                   </button>
                 </div>
                 <div className="lg:sticky lg:top-32 h-full lg:h-auto overflow-y-auto lg:overflow-visible pb-20 lg:pb-0">
                  <SalesList 
                    sales={sales} 
                    items={items} 
                    total={totalRevenue} 
                    onCloseDay={confirmCloseDay}
                    onDecrement={handleDecrementSale}
                    onShowHistory={() => setShowHistory(true)}
                  />
                </div>
              </div>
            </div>
            
            {/* Mobile Cart Toggle */}
            <button 
              onClick={() => setShowStatsMobile(!showStatsMobile)}
              className="lg:hidden fixed bottom-6 right-6 px-6 py-4 bg-blue-500 text-white rounded-full shadow-xl border-4 border-white z-40 hover:scale-110 transition-transform flex items-center gap-3"
            >
              <div className="relative">
                <ShoppingBag className="w-6 h-6" />
                {Object.keys(sales).length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-white">
                    {Object.keys(sales).length}
                  </span>
                )}
              </div>
              <span className="font-black uppercase tracking-wide">Checkout</span>
            </button>
          </div>
        ) : (
          <StorageView 
            items={items} 
            onUpdateItem={handleUpdateItem} 
            onDeleteItem={confirmDeleteItem}
            onAddItem={() => setShowAddForm(true)}
          />
        )}
      </main>

      {/* Modals */}
      {showAddForm && (
        <AddItemForm 
          categories={categories}
          onAdd={handleAddItem} 
          onCancel={() => setShowAddForm(false)}
          onAddCategory={handleAddCategory}
          onDeleteCategory={handleDeleteCategory}
        />
      )}

      {selectedItemForPurchase && (
        <PurchaseModal 
          item={selectedItemForPurchase} 
          onConfirm={confirmPurchase} 
          onCancel={() => setSelectedItemForPurchase(null)} 
        />
      )}

      {showHistory && (
        <SalesHistoryModal
          history={history}
          onClose={() => setShowHistory(false)}
          onClearHistory={confirmClearHistory}
          onDeleteEntry={confirmDeleteHistoryEntry}
        />
      )}

      {/* Purchase Feedback Popup */}
      <AnimatePresence>
        {purchasedFeedback && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none z-[60]"
          >
            <div className="bg-green-500 text-white px-8 py-6 rounded-3xl shadow-2xl border-b-8 border-green-700 flex flex-col items-center">
              <Check className="w-12 h-12 mb-2" strokeWidth={4} />
              <div className="text-2xl font-black uppercase tracking-wider">Sold!</div>
              <div className="text-lg font-bold opacity-90">{purchasedFeedback.name} (x{purchasedFeedback.quantity})</div>
              <div className="mt-2 bg-white text-green-600 px-4 py-1 rounded-full font-black text-xl">
                +₱{purchasedFeedback.price.toLocaleString()}
              </div>
              <div className="mt-2 text-xs font-bold bg-green-700 px-2 py-1 rounded text-green-100">
                {purchasedFeedback.time}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confirmation Popups */}
      <PopupModal 
        isOpen={showCloseDayConfirm} 
        onClose={() => setShowCloseDayConfirm(false)}
        title="Close Day?"
        variant="warning"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <p>This will save the current sales to history and reset the counter for a new day.</p>
          <div className="flex gap-3 pt-2">
            <KahootButton variant="secondary" onClick={() => setShowCloseDayConfirm(false)} className="flex-1">Cancel</KahootButton>
            <KahootButton variant="success" onClick={handleCloseDay} className="flex-1">Confirm</KahootButton>
          </div>
        </div>
      </PopupModal>

      <PopupModal 
        isOpen={!!itemToDelete} 
        onClose={() => setItemToDelete(null)}
        title="Delete Item?"
        variant="danger"
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <Trash2 className="w-8 h-8 text-red-600" />
          </div>
          <p>Are you sure you want to remove this item from the store?</p>
          <div className="flex gap-3 pt-2">
            <KahootButton variant="secondary" onClick={() => setItemToDelete(null)} className="flex-1">Cancel</KahootButton>
            <KahootButton variant="danger" onClick={handleDeleteItem} className="flex-1">Delete</KahootButton>
          </div>
        </div>
      </PopupModal>

      <PopupModal 
        isOpen={showClearHistoryConfirm} 
        onClose={() => setShowClearHistoryConfirm(false)}
        title="Clear History?"
        variant="danger"
      >
        <div className="text-center space-y-4">
          <p>This will delete ALL sales history records permanently. This cannot be undone.</p>
          <div className="flex gap-3 pt-2">
            <KahootButton variant="secondary" onClick={() => setShowClearHistoryConfirm(false)} className="flex-1">Cancel</KahootButton>
            <KahootButton variant="danger" onClick={handleClearHistory} className="flex-1">Delete All</KahootButton>
          </div>
        </div>
      </PopupModal>

      <PopupModal 
        isOpen={!!historyToDelete} 
        onClose={() => setHistoryToDelete(null)}
        title="Delete Record?"
        variant="danger"
      >
        <div className="text-center space-y-4">
          <p>Remove this entry from the sales history?</p>
          <div className="flex gap-3 pt-2">
            <KahootButton variant="secondary" onClick={() => setHistoryToDelete(null)} className="flex-1">Cancel</KahootButton>
            <KahootButton variant="danger" onClick={handleDeleteHistoryEntry} className="flex-1">Delete</KahootButton>
          </div>
        </div>
      </PopupModal>
    </div>
  );
}
