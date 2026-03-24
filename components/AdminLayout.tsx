import React, { useState, useEffect } from 'react';
import { LogoutIcon, DashboardIcon, ShowroomIcon, OrderIcon, SettingsIcon, SwitchUserIcon, FinancesIcon, HamburgerIcon, CloseIcon, TutorialsGestionIcon } from './icons';

interface AdminLayoutProps {
  currentPage: string;
  setCurrentPage: (p: any) => void;
  logout: () => void;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPage, setCurrentPage, logout, children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsMobileSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: DashboardIcon, description: 'Tableau de bord' },
    { id: 'ateliers', label: 'Ateliers', icon: OrderIcon, description: 'Gestion des partenaires' },
    { id: 'payments', label: 'Paiements', icon: FinancesIcon, description: 'Transactions & confirmations' },
    { id: 'paymentSettings', label: 'Paiement - Paramètres', icon: SettingsIcon, description: 'Configurer les fournisseurs' },
    { id: 'showroom', label: 'Modération', icon: ShowroomIcon, description: 'Validation modèles' },
    { id: 'tutorials', label: 'Tutoriels', icon: TutorialsGestionIcon, description: 'Gérer les tutoriels vidéo' },
    { id: 'cms', label: 'Site Public', icon: SettingsIcon, description: 'CMS & personnalisation' },
    { id: 'users', label: 'Utilisateurs', icon: SwitchUserIcon, description: 'Gestion des accès' },
    { id: 'logs', label: 'Logs', icon: FinancesIcon, description: 'Historique & audit' },
  ];

  const getPageTitle = () => {
    const item = menuItems.find(m => m.id === currentPage);
    return item ? item.label : 'Accueil';
  };

  const getPageDescription = () => {
    const item = menuItems.find(m => m.id === currentPage);
    return item ? item.description : 'Console d\'administration';
  };

  const handleMenuClick = (pageId: string) => {
    setCurrentPage(pageId);
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-slate-950' : 'bg-slate-50'} font-sans transition-colors duration-300`}>
      {/* Sidebar - Desktop */}
      <div className={`hidden md:flex ${isSidebarCollapsed ? 'w-20' : 'w-72'} ${isDarkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-orange-900 via-orange-850 to-orange-800'} text-white flex-col z-20 shadow-2xl transition-all duration-300`}>
        
        {/* Logo Section */}
        <div className={`${isDarkMode ? 'border-slate-700/30' : 'border-orange-700/30'} p-6 border-b backdrop-blur-sm`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className={`${isDarkMode ? 'text-slate-900' : 'text-orange-900'} font-black text-lg`}>M</span>
            </div>
            {!isSidebarCollapsed && (
              <div>
                <h1 className="text-sm font-black tracking-tight leading-none">MMV COUTURE</h1>
                <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-orange-200'} font-bold uppercase tracking-widest`}>Admin</p>
              </div>
            )}
          </div>
          {!isSidebarCollapsed && <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-orange-100'} mt-3`}>Plateforme SaaS</p>}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-700/50">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                title={isSidebarCollapsed ? item.label : ''}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 relative group ${
                  isActive
                    ? `${isDarkMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-orange-900 shadow-lg shadow-orange-500/20'} scale-105`
                    : `${isDarkMode ? 'text-slate-300 hover:bg-slate-700/50 hover:text-white' : 'text-orange-100 hover:bg-orange-700/50 hover:text-white'}`
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isSidebarCollapsed && <span>{item.label}</span>}
                {isActive && <div className="absolute right-3 w-2 h-2 rounded-full bg-white animate-pulse"></div>}
              </button>
            );
          })}
        </nav>

        {/* Footer Sidebar */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700/30' : 'border-orange-700/30'} backdrop-blur-sm space-y-3`}>
          {!isSidebarCollapsed && (
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${isDarkMode ? 'bg-slate-700/50 text-yellow-300' : 'bg-orange-700/30 text-orange-100'}`}
            >
              {isDarkMode ? '☀️' : '🌙'} {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
            </button>
          )}
          
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all duration-200 ${isDarkMode ? 'text-red-300 hover:bg-red-900/30' : 'text-red-200 hover:bg-red-900/30'}`}
          >
            <LogoutIcon className="w-4 h-4" />
            {!isSidebarCollapsed && 'Déconnexion'}
          </button>
          
          {!isSidebarCollapsed && <p className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-orange-200/60'} text-center`}>MMV © 2026</p>}
        </div>

        {/* Collapse Button */}
        <button
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`m-2 p-2 rounded-lg transition-all ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-orange-700/50'}`}
          title={isSidebarCollapsed ? 'Déplier' : 'Replier'}
        >
          <span className="text-xl">{isSidebarCollapsed ? '→' : '←'}</span>
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 w-[min(16rem,85vw)] ${isDarkMode ? 'bg-gradient-to-b from-slate-900 to-slate-800' : 'bg-gradient-to-b from-orange-900 via-orange-850 to-orange-800'} text-white z-40 transform transition-transform duration-200 md:hidden ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo Section */}
        <div className={`${isDarkMode ? 'border-slate-700/30' : 'border-orange-700/30'} p-6 border-b backdrop-blur-sm flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <span className={`${isDarkMode ? 'text-slate-900' : 'text-orange-900'} font-black text-lg`}>M</span>
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight leading-none">MMV COUTURE</h1>
              <p className={`text-[10px] ${isDarkMode ? 'text-slate-400' : 'text-orange-200'} font-bold uppercase tracking-widest`}>Admin</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-orange-700/50'}`}
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? `${isDarkMode ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-white text-orange-900 shadow-lg shadow-orange-500/20'}`
                    : `${isDarkMode ? 'text-slate-300 hover:bg-slate-700/50' : 'text-orange-100 hover:bg-orange-700/50'}`
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile Footer with Logout */}
        <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700/30' : 'border-orange-700/30'} backdrop-blur-sm`}>
          <button
            onClick={logout}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all duration-200 ${isDarkMode ? 'text-red-300 hover:bg-red-900/30' : 'text-red-200 hover:bg-red-900/30'}`}
          >
            <LogoutIcon className="w-4 h-4" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-orange-100'} border-b flex items-center justify-between px-4 md:px-8 py-4 md:py-6 z-10 shadow-sm transition-colors duration-300`}>
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className={`md:hidden p-2 rounded-lg flex-shrink-0 ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-stone-100'}`}
              aria-label="Toggle sidebar"
            >
              {isMobileSidebarOpen ? <CloseIcon className="w-6 h-6" /> : <HamburgerIcon className="w-6 h-6" />}
            </button>
            
            <div className="min-w-0">
              <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDarkMode ? 'text-slate-500' : 'text-gray-400'}`}>Section /</h2>
              <p className={`text-xl sm:text-2xl md:text-3xl font-black uppercase tracking-tight truncate ${isDarkMode ? 'text-white' : 'text-orange-900'}`}>{getPageTitle()}</p>
            </div>
          </div>

          {/* Status Indicator */}
          <div className={`flex items-center gap-2 ${isDarkMode ? 'bg-emerald-900/30 border-emerald-700' : 'bg-green-50 border-green-200'} px-2 sm:px-4 py-2 rounded-lg border flex-shrink-0`}>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className={`text-[10px] font-black uppercase hidden sm:inline ${isDarkMode ? 'text-emerald-300' : 'text-green-700'}`}>OK</span>
          </div>
        </header>

        {/* Content Area */}
        <main className={`flex-1 overflow-y-auto px-4 py-4 md:px-8 md:py-8 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} transition-colors duration-300`}>
          <div className="w-full max-w-full md:max-w-7xl md:mx-auto">
            <p className={`text-xs md:text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-gray-500'}`}>{getPageDescription()}</p>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
