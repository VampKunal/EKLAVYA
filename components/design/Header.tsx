import { Search, Menu, X, Sun, Moon } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  isLightMode: boolean;
  onToggleTheme: () => void;
}

export default function Header({ isLightMode, onToggleTheme }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-background/80 backdrop-blur-md border-b border-white/5 z-50 sticky top-0">
      <div className="flex justify-between items-center w-full px-6 md:px-10 py-6 xl:pl-[120px] max-w-7xl mx-auto">
        <div className="flex items-center gap-6 md:gap-12">
          <div className="font-display text-2xl md:text-3xl font-black tracking-tighter uppercase whitespace-nowrap">
            Neural<span className="text-magenta">_Learn</span>
          </div>
          <nav className="hidden lg:flex items-center gap-10">
            <a className="text-[10px] uppercase tracking-[3px] font-bold transition-all hover:text-magenta" href="#">Companion</a>
            <a className="text-[10px] uppercase tracking-[3px] font-bold transition-all hover:text-magenta" href="#">Protocols</a>
            <a className="text-[10px] uppercase tracking-[3px] font-bold transition-all hover:text-magenta" href="#">Archive</a>
          </nav>
        </div>
        
        <div className="flex items-center gap-6 md:gap-10">
          <button 
            onClick={onToggleTheme}
            className="hover:text-magenta transition-colors p-2 border border-white/5 bg-white/5"
          >
            {isLightMode ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <div className="hidden sm:flex items-center gap-8 text-[10px] uppercase tracking-[3px] font-bold opacity-60">
            <div className="flex items-center gap-2 cursor-pointer hover:text-magenta transition-colors">
              <Search size={14} />
              <span>Search</span>
            </div>
            <span className="cursor-pointer hover:text-magenta transition-colors">Index (24)</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 md:w-10 md:h-10 border border-white/20 grayscale hover:grayscale-0 transition-all duration-500 overflow-hidden cursor-pointer">
              <img 
                alt="User avatar" 
                className="w-full h-full object-cover" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5nK_0OT5i2Bff5r_3NMRF5G8GmcScJHZojAPPmQe7o7r-5pUsfxZ0zqCd_QUDA44rMFeArf8NCbxbcjJIj22FL3GyaCcz44wHquWVguq9nGDkLR_TmaQQrlTN2qwxe03AQigxFk-1INzeEVMDep8zNi_-zfLAN8J5QWSoihSzoD3BH4pqZbAOdbC0Mfme0iOibfXdE08eOiCCC-Wn3Jwga7tmDNCO6HwheGOVR7nqAHSonn6GI-TTNHrZ-WO0p9cGgi3X2D4z93Uw"
                referrerPolicy="no-referrer"
              />
            </div>
            <button 
              className="lg:hidden hover:text-magenta transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 top-[81px] bg-background/95 backdrop-blur-xl z-40 lg:hidden flex flex-col p-10 animate-in fade-in slide-in-from-top-4 duration-300">
          <nav className="flex flex-col gap-8">
            <a className="text-4xl font-black uppercase tracking-tighter hover:text-magenta transition-colors" href="#">Companion</a>
            <a className="text-4xl font-black uppercase tracking-tighter hover:text-magenta transition-colors" href="#">Protocols</a>
            <a className="text-4xl font-black uppercase tracking-tighter hover:text-magenta transition-colors" href="#">Archive</a>
            <a className="text-4xl font-black uppercase tracking-tighter hover:text-magenta transition-colors" href="#">Studio</a>
          </nav>
          
          <div className="mt-auto border-t border-white/10 pt-10 space-y-6">
            <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-[4px] opacity-40">
              <Search size={16} />
              <span>Global Search</span>
            </div>
            <div className="text-xs font-bold uppercase tracking-[4px] opacity-40">
              System_Status // Online
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
