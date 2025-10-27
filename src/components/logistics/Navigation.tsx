import { useState } from 'react';
import { LogOut, Menu, X, Settings } from 'lucide-react';
import { User } from '@/types/logistics';
import { userRoles } from '@/data/userRoles';
import { Button } from '@/components/ui/button';

interface NavigationProps {
  currentUser: User;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onAdminPanel: () => void;
}

export const Navigation = ({ 
  currentUser, 
  currentPage, 
  onNavigate, 
  onLogout, 
  onAdminPanel 
}: NavigationProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-primary via-primary/90 to-accent text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <span className="text-3xl">🦅</span>
            <div>
              <h1 className="text-xl font-bold">AFJROTC Logistics</h1>
              <p className="text-xs text-primary-foreground/80">Management System</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <Button
              onClick={() => onNavigate('dashboard')}
              variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
              className={currentPage === 'dashboard' ? '' : 'text-primary-foreground hover:bg-primary/80'}
            >
              Dashboard
            </Button>
            <Button
              onClick={() => onNavigate('inventory')}
              variant={currentPage === 'inventory' ? 'secondary' : 'ghost'}
              className={currentPage === 'inventory' ? '' : 'text-primary-foreground hover:bg-primary/80'}
            >
              Inventory
            </Button>
            {userRoles[currentUser?.role]?.canManageUsers && (
              <Button
                onClick={onAdminPanel}
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary/80"
                title="Admin Panel"
              >
                <Settings size={20} />
              </Button>
            )}
            <div className="flex items-center gap-3 border-l border-primary-foreground/30 pl-6">
              <div className="text-right">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-primary-foreground/80">{userRoles[currentUser.role].name}</p>
              </div>
              <Button
                onClick={onLogout}
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-primary/80"
                title="Logout"
              >
                <LogOut size={20} />
              </Button>
            </div>
          </div>

          <Button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            variant="ghost"
            size="icon"
            className="md:hidden text-primary-foreground"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Button
              onClick={() => { onNavigate('dashboard'); setMobileMenuOpen(false); }}
              variant={currentPage === 'dashboard' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
            >
              Dashboard
            </Button>
            <Button
              onClick={() => { onNavigate('inventory'); setMobileMenuOpen(false); }}
              variant={currentPage === 'inventory' ? 'secondary' : 'ghost'}
              className="w-full justify-start"
            >
              Inventory
            </Button>
            {userRoles[currentUser?.role]?.canManageUsers && (
              <Button
                onClick={() => { onAdminPanel(); setMobileMenuOpen(false); }}
                variant="ghost"
                className="w-full justify-start"
              >
                <Settings size={18} className="mr-2" />
                Admin Panel
              </Button>
            )}
            <div className="border-t border-primary-foreground/30 pt-2 mt-2 px-4 space-y-2">
              <p className="text-sm font-medium">{currentUser.name}</p>
              <p className="text-xs text-primary-foreground/80">{userRoles[currentUser.role].name}</p>
              <Button
                onClick={() => { onLogout(); setMobileMenuOpen(false); }}
                variant="ghost"
                className="w-full justify-start mt-2"
              >
                <LogOut size={18} className="mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
