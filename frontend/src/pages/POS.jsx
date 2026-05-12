import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function POS() {
  const [menu, setMenu] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentType, setPaymentType] = useState('cash');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      fetchMenu();
    }
  }, [navigate, user]);

  useEffect(() => {
    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchMenu = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/menu');
      setMenu(res.data.filter(m => m.is_active));
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (item) => {
    const exist = cart.find(x => x.id === item.id);
    if (exist) {
      setCart(cart.map(x => x.id === item.id ? { ...exist, qty: exist.qty + 1 } : x));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const updateQty = (id, delta) => {
    setCart(cart.map(x => {
      if (x.id === id) {
        return { ...x, qty: Math.max(0, x.qty + delta) };
      }
      return x;
    }).filter(x => x.qty > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(x => x.id !== id));
  };

  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const tax = total * 0.11; // 11% Tax
  const grandTotal = total + tax;

  const handleCheckout = async () => {
    if (cart.length === 0) return alert('Keranjang kosong');
    
    const pay = parseFloat(paymentAmount) || 0;
    if (paymentType === 'cash' && pay < grandTotal) {
      return alert('Pembayaran kurang');
    }

    const change = paymentType === 'cash' ? pay - grandTotal : 0;

    try {
      const payload = {
        user_id: user.id,
        total: grandTotal,
        payment_type: paymentType,
        payment_amount: paymentType === 'cash' ? pay : grandTotal,
        change_amount: change,
        items: cart.map(c => ({ menu_id: c.id, qty: c.qty, price: c.price, subtotal: c.price * c.qty }))
      };
      const res = await axios.post('http://localhost:5001/api/transactions', payload);
      if (res.data.success) {
        alert(`Transaksi berhasil! Kembalian: Rp ${change.toLocaleString('id-ID')}`);
        setCart([]);
        setPaymentAmount('');
      }
    } catch (err) {
      alert('Error checkout');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
    setShowProfileMenu(false);
  };

  // Filter menu
  const filteredMenu = menu.filter(item => {
    const matchCategory = activeCategory === 'Semua' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const categories = ['Semua', ...new Set(menu.map(m => m.category))];

  return (
    <div className="bg-surface text-on-surface antialiased pb-24 md:pb-0 min-h-screen">
      {/* TopNavBar (Web) */}
      <nav className="hidden md:flex justify-between items-center px-container-margin py-4 w-full sticky top-0 z-50 shadow-sm bg-surface dark:bg-surface-container">
        <div className="flex items-center gap-8">
          <div className="font-headline-md text-headline-md font-bold tracking-tight text-primary dark:text-primary-fixed-dim">
            Artisan Brew
          </div>
          <div className="flex gap-6 items-center">
            <span className="text-primary border-b-2 border-primary pb-1 font-headline-md text-headline-md font-semibold dark:text-primary-fixed dark:border-primary-fixed">
              Menu
            </span>
            {user?.role === 'admin' && (
              <button onClick={() => navigate('/admin')} className="text-on-surface-variant font-medium hover:text-primary transition-colors active:scale-95 duration-200 font-headline-md text-headline-md font-semibold dark:text-outline-variant dark:hover:text-primary-fixed">
                Dashboard Admin
              </button>
            )}
          </div>
        </div>
        {/* Search & Trailing Icons */}
        <div className="flex items-center gap-4 relative">
          <div className="relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-full text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all w-64 shadow-sm dark:bg-inverse-surface dark:border-outline dark:text-on-primary" 
              placeholder="Cari menu..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              type="text"
            />
          </div>
          
          <button 
            className="text-on-surface-variant hover:text-primary transition-colors w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container active:scale-95 duration-200 dark:text-outline-variant dark:hover:text-primary-fixed"
            onClick={() => setShowProfileMenu(!showProfileMenu)}
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 top-12 mt-2 w-48 bg-surface-container-lowest dark:bg-surface-container border border-outline-variant rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-surface-variant">
                <p className="text-sm font-semibold text-on-surface dark:text-on-primary">{user?.username}</p>
                <p className="text-xs text-on-surface-variant dark:text-outline-variant capitalize">{user?.role}</p>
              </div>
              <button onClick={toggleTheme} className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-surface-container dark:hover:bg-inverse-surface text-on-surface dark:text-on-primary transition-colors">
                <span className="material-symbols-outlined">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
                {theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
              </button>
              <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 text-error hover:bg-error-container hover:text-on-error-container transition-colors">
                <span className="material-symbols-outlined">logout</span>
                Keluar
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Content Layout */}
      <main className="max-w-[1440px] mx-auto px-container-margin py-6 flex flex-col lg:flex-row gap-gutter">
        {/* Left Canvas: Categories & Product Grid */}
        <section className="w-full lg:w-8/12 flex flex-col gap-6">
          {/* Mobile Header & Search */}
          <div className="md:hidden flex flex-col gap-4 mb-2">
            <div className="font-headline-lg-mobile text-headline-lg-mobile font-bold tracking-tight text-primary dark:text-primary-fixed-dim">
                Artisan Brew
            </div>
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                className="w-full pl-10 pr-4 py-3 bg-surface-container-lowest border border-outline-variant rounded-full text-body-md focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all shadow-sm dark:bg-inverse-surface dark:border-outline dark:text-on-primary" 
                placeholder="Cari menu..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                type="text"
              />
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex overflow-x-auto no-scrollbar gap-3 pb-2 -mx-container-margin px-container-margin md:mx-0 md:px-0">
            {categories.map(cat => (
              <button 
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-2 rounded-full font-label-lg text-label-lg shadow-sm transition-transform active:scale-95 ${
                  activeCategory === cat 
                    ? 'bg-primary-container text-on-primary-container dark:bg-primary-fixed dark:text-on-primary-fixed' 
                    : 'bg-surface-container-lowest border border-outline-variant text-on-surface-variant hover:bg-surface-container dark:bg-surface-container dark:border-outline dark:text-outline-variant dark:hover:bg-inverse-surface'
                }`}
              >
                  {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredMenu.map(item => (
              <article key={item.id} onClick={() => addToCart(item)} className="bg-surface-container-lowest dark:bg-surface-container rounded-xl border border-outline-variant dark:border-outline shadow-sm overflow-hidden flex flex-col group cursor-pointer hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] w-full relative bg-surface-container dark:bg-inverse-surface overflow-hidden">
                  {item.image_url ? (
                    <img alt={item.name} src={item.image_url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-surface-container-low dark:bg-surface-container-high">
                      <span className="material-symbols-outlined text-4xl text-outline-variant">local_cafe</span>
                    </div>
                  )}
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <div className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider mb-1">{item.category}</div>
                  <h3 className="font-headline-md text-[16px] leading-[22px] font-semibold text-on-surface dark:text-on-primary line-clamp-2 mb-3">{item.name}</h3>
                  <div className="mt-auto flex justify-between items-center pt-2">
                    <span className="font-body-lg text-body-lg font-semibold text-primary dark:text-primary-fixed-dim">
                      Rp {parseFloat(item.price).toLocaleString('id-ID')}
                    </span>
                    <button className="w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center hover:bg-inverse-surface active:scale-90 transition-all shadow-sm dark:bg-primary-fixed dark:text-on-primary-fixed">
                      <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>add</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Right Canvas: Order Summary (Sidebar) */}
        <aside className="hidden lg:flex w-4/12 flex-col bg-surface-container-lowest dark:bg-surface-container border border-outline-variant dark:border-outline rounded-xl shadow-[0px_4px_12px_rgba(31,21,18,0.05)] h-[calc(100vh-112px)] sticky top-[88px] overflow-hidden">
          {/* Sidebar Header */}
          <div className="p-6 pb-4 border-b border-surface-variant flex justify-between items-center bg-surface-container-lowest dark:bg-surface-container z-10">
            <div>
              <h2 className="font-headline-md text-headline-md font-semibold text-on-surface dark:text-on-primary">Current Order</h2>
              <div className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant mt-1">Kasir: {user?.username}</div>
            </div>
            <button onClick={() => setCart([])} aria-label="Clear order" className="text-on-surface-variant hover:text-error transition-colors dark:text-outline-variant dark:hover:text-error-container">
              <span className="material-symbols-outlined">delete_outline</span>
            </button>
          </div>

          {/* Order Items */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-1">
            {cart.length === 0 ? (
               <p className="text-center text-on-surface-variant dark:text-outline-variant mt-4">Belum ada pesanan</p>
            ) : (
              cart.map(item => (
                <div key={item.id} className="py-3 border-b border-surface-variant dark:border-outline last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex flex-col gap-1">
                      <span className="font-body-md text-body-md font-medium text-on-surface dark:text-on-primary">{item.name}</span>
                    </div>
                    <span className="font-body-md text-body-md font-medium text-on-surface dark:text-on-primary">
                      Rp {(item.price * item.qty).toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors dark:border-outline dark:text-outline-variant dark:hover:bg-inverse-surface">
                      <span className="material-symbols-outlined text-[18px]">remove</span>
                    </button>
                    <span className="font-body-md text-body-md font-medium w-4 text-center dark:text-on-primary">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 rounded border border-outline-variant flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors dark:border-outline dark:text-outline-variant dark:hover:bg-inverse-surface">
                      <span className="material-symbols-outlined text-[18px]">add</span>
                    </button>
                    <button onClick={() => removeFromCart(item.id)} className="w-8 h-8 rounded text-error hover:bg-error-container transition-colors ml-auto flex items-center justify-center">
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Totals & Checkout */}
          <div className="p-6 bg-surface-container-lowest dark:bg-surface-container border-t border-surface-variant dark:border-outline mt-auto">
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between text-on-surface-variant dark:text-outline-variant font-body-md text-body-md">
                <span>Subtotal</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-on-surface-variant dark:text-outline-variant font-body-md text-body-md">
                <span>Tax (11%)</span>
                <span>Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between text-on-surface dark:text-on-primary font-headline-md text-[20px] font-bold mt-2 pt-2 border-t border-surface-variant dark:border-outline">
                <span>Total</span>
                <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <select 
              value={paymentType} 
              onChange={e => setPaymentType(e.target.value)}
              className="w-full p-3 mb-3 bg-surface border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary dark:bg-inverse-surface dark:border-outline dark:text-on-primary"
            >
              <option value="cash">Tunai</option>
              <option value="qris">QRIS</option>
              <option value="debit">Debit/Credit Card</option>
            </select>

            {paymentType === 'cash' && (
              <input 
                type="number" 
                placeholder="Jumlah Uang Tunai" 
                value={paymentAmount} 
                onChange={e => setPaymentAmount(e.target.value)}
                className="w-full p-3 mb-4 bg-surface border border-outline-variant rounded-lg font-body-md focus:outline-none focus:border-primary dark:bg-inverse-surface dark:border-outline dark:text-on-primary"
              />
            )}

            <button onClick={handleCheckout} className="w-full bg-primary text-on-primary py-4 rounded-xl font-label-lg text-[16px] tracking-wide font-semibold flex justify-center items-center gap-2 hover:bg-inverse-surface active:scale-95 transition-all shadow-[0px_4px_12px_rgba(31,21,18,0.15)] dark:bg-primary-fixed dark:text-on-primary-fixed dark:hover:bg-primary-fixed-dim">
              <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>payments</span>
                Proses Pembayaran
            </button>
          </div>
        </aside>
      </main>

      {/* BottomNavBar (Mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface-container-highest dark:bg-surface-container shadow-[0px_-4px_12px_rgba(31,21,18,0.05)] rounded-t-xl">
        <button className="flex flex-col items-center justify-center text-primary font-bold font-label-sm text-label-sm p-2 rounded-lg active:scale-90 transition-transform duration-150 dark:text-primary-fixed-dim">
            <span className="material-symbols-outlined mb-1" style={{fontVariationSettings: "'FILL' 1"}}>coffee</span>
            Menu
        </button>
        <button onClick={() => {
          // In a real app we would toggle a modal for the cart
          alert('Cart modal dipanggil! (Mobile view)');
        }} className="flex flex-col items-center justify-center text-secondary font-label-sm text-label-sm hover:bg-surface-bright p-2 rounded-lg transition-colors dark:text-outline-variant">
            <div className="relative">
              <span className="material-symbols-outlined mb-1">shopping_bag</span>
              {cart.length > 0 && <span className="absolute -top-1 -right-2 bg-error text-on-error rounded-full w-4 h-4 text-[10px] flex items-center justify-center">{cart.length}</span>}
            </div>
            Cart
        </button>
        <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="flex flex-col items-center justify-center text-secondary font-label-sm text-label-sm hover:bg-surface-bright p-2 rounded-lg transition-colors dark:text-outline-variant">
            <span className="material-symbols-outlined mb-1">person</span>
            Profile
        </button>
      </nav>

      {/* Mobile Profile Menu Modal */}
      {showProfileMenu && (
        <div className="lg:hidden fixed inset-0 bg-black/50 z-50 flex items-end justify-center" onClick={() => setShowProfileMenu(false)}>
          <div className="bg-surface-container-lowest dark:bg-surface-container w-full rounded-t-2xl p-6" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-headline-md text-xl font-bold dark:text-on-primary">Profil ({user?.role})</h3>
              <button onClick={() => setShowProfileMenu(false)}><span className="material-symbols-outlined dark:text-outline-variant">close</span></button>
            </div>
            <p className="font-body-md text-on-surface-variant dark:text-outline-variant mb-4">Masuk sebagai: {user?.username}</p>
            {user?.role === 'admin' && (
              <button onClick={() => navigate('/admin')} className="w-full flex items-center gap-3 p-4 mb-2 bg-surface-container dark:bg-inverse-surface rounded-xl font-body-md dark:text-on-primary">
                <span className="material-symbols-outlined">dashboard</span>
                Dashboard Admin
              </button>
            )}
            <button onClick={toggleTheme} className="w-full flex items-center gap-3 p-4 mb-2 bg-surface-container dark:bg-inverse-surface rounded-xl font-body-md dark:text-on-primary">
              <span className="material-symbols-outlined">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
              Ubah Tema ({theme === 'light' ? 'Mode Gelap' : 'Mode Terang'})
            </button>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 p-4 bg-error-container text-on-error-container rounded-xl font-body-md font-semibold">
              <span className="material-symbols-outlined">logout</span>
              Keluar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default POS;
