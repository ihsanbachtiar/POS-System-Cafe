import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
  const [activeTab, setActiveTab] = useState('menu');
  const [menu, setMenu] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: 'Coffee', price: '', description: '', image_url: '' });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  
  // Theme state
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login');
    } else {
      fetchData();
    }
  }, [navigate, user]);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const fetchData = async () => {
    try {
      const [menuRes, txRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5001/api/menu'),
        axios.get('http://localhost:5001/api/transactions'),
        axios.get('http://localhost:5001/api/users')
      ]);
      setMenu(menuRes.data);
      setTransactions(txRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMenu = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/api/menu', {
        ...formData,
        price: parseFloat(formData.price)
      });
      setShowForm(false);
      setFormData({ name: '', category: 'Coffee', price: '', description: '', image_url: '' });
      fetchData();
    } catch (err) {
      alert('Error adding menu');
    }
  };

  const handleDeleteMenu = async (id) => {
    if(window.confirm('Yakin ingin menghapus menu ini?')) {
      try {
        await axios.delete(`http://localhost:5001/api/menu/${id}`);
        fetchData();
      } catch (err) {
        alert('Error deleting menu');
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const renderContent = () => {
    if (activeTab === 'menu') {
      return (
        <div className="flex-1 overflow-y-auto pb-24 lg:pb-6">
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <h2 className="font-headline-lg text-2xl font-bold text-on-surface dark:text-on-primary">Kelola Menu</h2>
            <button 
              onClick={() => setShowForm(true)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-DEFAULT font-label-lg text-label-lg hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm dark:bg-primary-fixed dark:text-on-primary-fixed dark:hover:bg-primary-fixed-dim"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Tambah Menu Baru
            </button>
          </div>

          {/* Product Table Data List */}
          <div className="bg-surface-container-lowest dark:bg-surface-container rounded-lg border border-outline-variant dark:border-outline shadow-[0px_4px_12px_rgba(31,21,18,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low dark:bg-inverse-surface border-b border-outline-variant dark:border-outline">
                    <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider font-semibold">Image</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider font-semibold">Nama Produk</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider font-semibold">Kategori</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider font-semibold">Harga</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant dark:divide-outline">
                  {menu.map(item => (
                    <tr key={item.id} className="hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors group cursor-pointer dark:bg-surface-container">
                      <td className="px-6 py-4">
                        <div className="w-12 h-12 rounded-DEFAULT bg-surface-container dark:bg-inverse-surface overflow-hidden border border-outline-variant dark:border-outline flex items-center justify-center text-outline">
                          {item.image_url ? (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="material-symbols-outlined">image</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-body-md text-body-md font-medium text-on-surface dark:text-on-primary">{item.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm bg-secondary-container text-on-secondary-container dark:bg-secondary-fixed dark:text-on-secondary-fixed">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-body-md text-body-md text-on-surface dark:text-on-primary">
                        Rp {parseFloat(item.price).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleDeleteMenu(item.id)} className="p-2 text-error hover:text-error transition-colors rounded-full hover:bg-error-container" title="Hapus">
                            <span className="material-symbols-outlined text-[20px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {menu.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant dark:text-outline-variant font-body-md">Belum ada menu</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else if (activeTab === 'reports') {
      return (
        <div className="flex-1 overflow-y-auto pb-24 lg:pb-6">
          <h2 className="font-headline-lg text-2xl font-bold mb-6 text-on-surface dark:text-on-primary">Laporan Penjualan</h2>
          <div className="bg-surface-container-lowest dark:bg-surface-container rounded-lg border border-outline-variant dark:border-outline shadow-[0px_4px_12px_rgba(31,21,18,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low dark:bg-inverse-surface border-b border-outline-variant dark:border-outline">
                    <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider font-semibold">ID</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider font-semibold">Tanggal</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider font-semibold">Kasir</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider font-semibold">Total</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider font-semibold">Pembayaran</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant dark:divide-outline">
                  {transactions.map(tx => (
                    <tr key={tx.id} className="hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors cursor-default dark:bg-surface-container">
                      <td className="px-6 py-4 font-body-md text-on-surface dark:text-on-primary">#{tx.id}</td>
                      <td className="px-6 py-4 font-body-md text-on-surface dark:text-on-primary">{new Date(tx.created_at).toLocaleString()}</td>
                      <td className="px-6 py-4 font-body-md text-on-surface dark:text-on-primary">{tx.user_id}</td>
                      <td className="px-6 py-4 font-body-md font-semibold text-primary dark:text-primary-fixed-dim">Rp {parseFloat(tx.total).toLocaleString('id-ID')}</td>
                      <td className="px-6 py-4 font-body-md text-on-surface dark:text-on-primary capitalize">{tx.payment_type}</td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-on-surface-variant dark:text-outline-variant font-body-md">Belum ada transaksi</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    } else if (activeTab === 'users') {
      return (
        <div className="flex-1 overflow-y-auto pb-24 lg:pb-6">
          <h2 className="font-headline-lg text-2xl font-bold mb-6 text-on-surface dark:text-on-primary">Manajemen Staf</h2>
          <div className="bg-surface-container-lowest dark:bg-surface-container rounded-lg border border-outline-variant dark:border-outline shadow-[0px_4px_12px_rgba(31,21,18,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low dark:bg-inverse-surface border-b border-outline-variant dark:border-outline">
                    <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider font-semibold">ID</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider font-semibold">Username</th>
                    <th className="px-6 py-4 font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant uppercase tracking-wider font-semibold">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant dark:divide-outline">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-surface-container-low dark:hover:bg-surface-container-high transition-colors cursor-default dark:bg-surface-container">
                      <td className="px-6 py-4 font-body-md text-on-surface dark:text-on-primary">#{u.id}</td>
                      <td className="px-6 py-4 font-body-md text-on-surface dark:text-on-primary">{u.username}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full font-label-sm text-label-sm ${u.role === 'admin' ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container dark:bg-secondary-fixed dark:text-on-secondary-fixed'} capitalize`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="bg-background dark:bg-inverse-surface text-on-background font-body-md antialiased h-screen flex overflow-hidden">
      {/* Desktop SideNavBar */}
      <aside className="hidden lg:flex flex-col h-screen w-64 bg-surface-container-low dark:bg-surface-container border-r border-outline-variant dark:border-outline fixed left-0 top-0 z-40">
        <div className="px-4 py-6 font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed-dim">
          Artisan Brew
        </div>
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 p-3 bg-surface-container-highest dark:bg-inverse-surface rounded-lg border border-outline-variant dark:border-outline cursor-pointer relative" onClick={() => setShowProfileMenu(!showProfileMenu)}>
            <div className="w-10 h-10 rounded-full bg-secondary-container dark:bg-secondary-fixed overflow-hidden flex-shrink-0 flex items-center justify-center text-primary dark:text-on-primary-fixed">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div className="flex flex-col overflow-hidden">
              <span className="font-label-lg text-label-lg text-on-surface dark:text-on-primary truncate">{user?.username}</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant dark:text-outline-variant truncate capitalize">{user?.role}</span>
            </div>
            
            {showProfileMenu && (
              <div className="absolute top-16 left-0 w-full bg-surface-container-lowest dark:bg-surface-container border border-outline-variant dark:border-outline rounded-xl shadow-lg z-50 overflow-hidden">
                <button onClick={(e) => { e.stopPropagation(); toggleTheme(); }} className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 hover:bg-surface-container dark:hover:bg-inverse-surface text-on-surface dark:text-on-primary transition-colors">
                  <span className="material-symbols-outlined">{theme === 'light' ? 'dark_mode' : 'light_mode'}</span>
                  {theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}
                </button>
                <button onClick={(e) => { e.stopPropagation(); handleLogout(); }} className="w-full text-left px-4 py-3 text-sm flex items-center gap-2 text-error hover:bg-error-container hover:text-on-error-container transition-colors">
                  <span className="material-symbols-outlined">logout</span>
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
        <nav className="flex flex-col h-full gap-2 py-4 px-2 overflow-y-auto">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-highest dark:text-outline-variant dark:hover:bg-inverse-surface rounded-lg mx-2 transition-all duration-200"
          >
            <span className="material-symbols-outlined">pos</span>
            <span className="font-body-md text-body-md">Buka Kasir</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('menu')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-all duration-200 ${activeTab === 'menu' ? 'bg-primary text-on-primary dark:bg-primary-fixed dark:text-on-primary-fixed' : 'text-on-surface-variant hover:bg-surface-container-highest dark:text-outline-variant dark:hover:bg-inverse-surface'}`}
          >
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>restaurant_menu</span>
            <span className="font-body-md text-body-md font-medium">Menu</span>
          </button>

          <button 
            onClick={() => setActiveTab('reports')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-all duration-200 ${activeTab === 'reports' ? 'bg-primary text-on-primary dark:bg-primary-fixed dark:text-on-primary-fixed' : 'text-on-surface-variant hover:bg-surface-container-highest dark:text-outline-variant dark:hover:bg-inverse-surface'}`}
          >
            <span className="material-symbols-outlined">receipt_long</span>
            <span className="font-body-md text-body-md font-medium">Laporan</span>
          </button>

          <button 
            onClick={() => setActiveTab('users')} 
            className={`flex items-center gap-3 px-4 py-3 rounded-lg mx-2 transition-all duration-200 ${activeTab === 'users' ? 'bg-primary text-on-primary dark:bg-primary-fixed dark:text-on-primary-fixed' : 'text-on-surface-variant hover:bg-surface-container-highest dark:text-outline-variant dark:hover:bg-inverse-surface'}`}
          >
            <span className="material-symbols-outlined">group</span>
            <span className="font-body-md text-body-md font-medium">Staf</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 flex flex-col h-screen relative">
        {/* Header Section */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center px-container-margin py-6 gap-4 bg-surface-container-lowest dark:bg-surface-container border-b border-outline-variant dark:border-outline z-10">
          <div>
            <h1 className="font-headline-lg text-headline-lg text-on-surface dark:text-on-primary">Dashboard Admin</h1>
            <p className="font-body-md text-body-md text-on-surface-variant dark:text-outline-variant mt-1">Kelola sistem kafe Anda.</p>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="flex-1 overflow-y-auto p-container-margin relative">
          {renderContent()}
        </div>
      </main>

      {/* Mobile BottomNavBar */}
      <nav className="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 py-3 pb-safe bg-surface-container-highest dark:bg-surface-container shadow-[0px_-4px_12px_rgba(31,21,18,0.05)] rounded-t-xl">
        <button onClick={() => navigate('/')} className="flex flex-col items-center justify-center text-secondary font-label-sm text-label-sm hover:bg-surface-bright dark:text-outline-variant p-2 rounded-lg transition-colors">
          <span className="material-symbols-outlined mb-1">pos</span>
          Kasir
        </button>
        <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center justify-center font-label-sm text-label-sm p-2 rounded-lg transition-colors ${activeTab === 'menu' ? 'text-primary dark:text-primary-fixed font-bold' : 'text-secondary dark:text-outline-variant'}`}>
          <span className="material-symbols-outlined mb-1">restaurant_menu</span>
          Menu
        </button>
        <button onClick={() => setActiveTab('reports')} className={`flex flex-col items-center justify-center font-label-sm text-label-sm p-2 rounded-lg transition-colors ${activeTab === 'reports' ? 'text-primary dark:text-primary-fixed font-bold' : 'text-secondary dark:text-outline-variant'}`}>
          <span className="material-symbols-outlined mb-1">receipt_long</span>
          Laporan
        </button>
        <button onClick={() => setShowProfileMenu(true)} className="flex flex-col items-center justify-center text-secondary font-label-sm text-label-sm hover:bg-surface-bright dark:text-outline-variant p-2 rounded-lg transition-colors">
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
            <p className="font-body-md text-on-surface-variant dark:text-outline-variant mb-4">Admin: {user?.username}</p>
            <button onClick={() => setActiveTab('users')} className="w-full flex items-center gap-3 p-4 mb-2 bg-surface-container dark:bg-inverse-surface rounded-xl font-body-md dark:text-on-primary">
              <span className="material-symbols-outlined">group</span>
              Manajemen Staf
            </button>
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

      {/* Add Menu Sliding Panel Overlay */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 transition-opacity" onClick={() => setShowForm(false)}></div>
          <aside className="fixed right-0 top-0 h-screen w-full sm:w-[400px] bg-surface-container-lowest dark:bg-surface-container shadow-[0px_8px_24px_rgba(31,21,18,0.1)] border-l border-outline-variant dark:border-outline flex flex-col z-50 transform transition-transform duration-300">
            <div className="flex items-center justify-between px-6 py-5 border-b border-outline-variant dark:border-outline">
              <h2 className="font-headline-md text-headline-md text-on-surface dark:text-on-primary">Tambah Produk Baru</h2>
              <button onClick={() => setShowForm(false)} className="p-2 text-on-surface-variant hover:bg-surface-container-highest dark:text-outline-variant dark:hover:bg-inverse-surface rounded-full transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-6">
              <form id="addMenuForm" onSubmit={handleAddMenu} className="flex flex-col gap-6">
                
                <div className="flex flex-col gap-2">
                  <label className="font-label-lg text-label-lg text-on-surface dark:text-on-primary">Nama Produk <span className="text-error">*</span></label>
                  <input 
                    required 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})} 
                    className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-DEFAULT font-body-md text-body-md text-on-surface dark:text-on-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    placeholder="Contoh: Iced Matcha Latte" 
                    type="text"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-lg text-label-lg text-on-surface dark:text-on-primary">Kategori <span className="text-error">*</span></label>
                  <div className="relative">
                    <select 
                      value={formData.category} 
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-DEFAULT font-body-md text-body-md text-on-surface dark:text-on-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-all"
                    >
                      <option value="Coffee">Coffee</option>
                      <option value="Non-Coffee">Non-Coffee</option>
                      <option value="Snacks">Snacks</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-lg text-label-lg text-on-surface dark:text-on-primary">Harga (Rp) <span className="text-error">*</span></label>
                  <input 
                    required 
                    type="number" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-DEFAULT font-body-md text-body-md text-on-surface dark:text-on-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    placeholder="0" 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-lg text-label-lg text-on-surface dark:text-on-primary">URL Gambar (Opsional)</label>
                  <input 
                    value={formData.image_url} 
                    onChange={e => setFormData({...formData, image_url: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-DEFAULT font-body-md text-body-md text-on-surface dark:text-on-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all" 
                    placeholder="https://..." 
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-label-lg text-label-lg text-on-surface dark:text-on-primary">Deskripsi</label>
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-4 py-3 bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-DEFAULT font-body-md text-body-md text-on-surface dark:text-on-primary focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all resize-none" 
                    placeholder="Jelaskan detail produk ini..." 
                    rows="4"
                  ></textarea>
                </div>

              </form>
            </div>
            <div className="p-6 border-t border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-surface-container flex gap-4">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 px-4 py-3 border border-outline-variant text-on-surface dark:border-outline dark:text-on-primary font-label-lg text-label-lg rounded-DEFAULT hover:bg-surface-container-highest dark:hover:bg-inverse-surface transition-colors text-center">
                Batal
              </button>
              <button form="addMenuForm" type="submit" className="flex-1 px-4 py-3 bg-primary text-on-primary dark:bg-primary-fixed dark:text-on-primary-fixed font-label-lg text-label-lg rounded-DEFAULT hover:bg-primary-container hover:text-on-primary-container dark:hover:bg-primary-fixed-dim transition-colors shadow-sm text-center">
                Simpan
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}

export default Admin;
