import { useState, useEffect } from 'react';
import { Package, Users, AlertCircle, ArrowLeft, Plus, Search } from 'lucide-react';
import { Item, User, ActivityLog, AllowedEmail } from '@/types/logistics';
import { categories } from '@/data/categories';
import { userRoles } from '@/data/userRoles';
import { getSampleItems, getDefaultEmails } from '@/data/sampleData';
import { storage } from '@/lib/storage';
import { LoginPage } from '@/components/logistics/LoginPage';
import { Navigation } from '@/components/logistics/Navigation';
import { StatsCard } from '@/components/logistics/StatsCard';
import { CategoryCard } from '@/components/logistics/CategoryCard';
import { ActivityLogItem } from '@/components/logistics/ActivityLogItem';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCondition, setFilterCondition] = useState('all');
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [allowedEmails, setAllowedEmails] = useState<AllowedEmail[]>([]);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');
  const [pageHistory, setPageHistory] = useState<any[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const initData = async () => {
      try {
        const itemsData = await storage.get('afjrotc-items');
        const activityData = await storage.get('afjrotc-activity');
        const userData = await storage.get('afjrotc-current-user');
        const emailsData = await storage.get('afjrotc-allowed-emails');
        
        if (itemsData) setItems(JSON.parse(itemsData.value));
        else setItems(getSampleItems());
        
        if (activityData) setActivityLog(JSON.parse(activityData.value));
        if (userData) setCurrentUser(JSON.parse(userData.value));
        
        if (emailsData) {
          setAllowedEmails(JSON.parse(emailsData.value));
        } else {
          const defaultEmails = getDefaultEmails();
          setAllowedEmails(defaultEmails);
          await storage.set('afjrotc-allowed-emails', JSON.stringify(defaultEmails));
        }
      } catch (error) {
        console.log('Initializing with default data');
        setItems(getSampleItems());
        setAllowedEmails(getDefaultEmails());
      }
    };
    initData();
  }, []);

  const saveData = async (newItems?: Item[], newActivity?: ActivityLog[]) => {
    try {
      await storage.set('afjrotc-items', JSON.stringify(newItems || items));
      if (newActivity) {
        await storage.set('afjrotc-activity', JSON.stringify(newActivity));
      }
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const handleLogin = async (email: string) => {
    const allowedUser = allowedEmails.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (allowedUser) {
      const user = { name: allowedUser.name, role: allowedUser.role, email: allowedUser.email };
      setCurrentUser(user);
      await storage.set('afjrotc-current-user', JSON.stringify(user));
      setLoginError('');
      toast({
        title: "Welcome!",
        description: `Logged in as ${user.name}`,
      });
    } else {
      setLoginError('Access denied. This email is not authorized.');
    }
  };

  const handleLogout = async () => {
    setCurrentUser(null);
    await storage.delete('afjrotc-current-user');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  const navigateTo = (page: string, category: string | null = null) => {
    setPageHistory([...pageHistory, { page: currentPage, category: selectedCategory }]);
    setCurrentPage(page);
    if (category !== null) setSelectedCategory(category);
  };

  const goBack = () => {
    if (pageHistory.length > 0) {
      const previous = pageHistory[pageHistory.length - 1];
      setCurrentPage(previous.page);
      setSelectedCategory(previous.category);
      setPageHistory(pageHistory.slice(0, -1));
    }
  };

  const addActivity = (action: string, itemName: string) => {
    const newLog: ActivityLog[] = [{
      timestamp: new Date().toISOString(),
      user: currentUser?.name || 'Unknown',
      action,
      item: itemName
    }, ...activityLog].slice(0, 50);
    setActivityLog(newLog);
    saveData(items, newLog);
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.assignedTo?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesCondition = filterCondition === 'all' || item.condition === filterCondition;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const getStats = () => {
    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    const inUse = items.reduce((sum, item) => sum + item.inUse, 0);
    const lowStock = items.filter(item => (item.quantity - item.inUse) < 5).length;
    const needsRepair = items.filter(item => item.condition === 'needs-repair').length;
    return { total, inUse, lowStock, needsRepair };
  };

  const stats = getStats();

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} loginError={loginError} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary/50">
      <Navigation
        currentUser={currentUser}
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          setSelectedCategory(null);
          setPageHistory([]);
        }}
        onLogout={handleLogout}
        onAdminPanel={() => toast({ title: "Admin Panel", description: "Feature coming soon" })}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {pageHistory.length > 0 && (
          <Button
            onClick={goBack}
            variant="ghost"
            className="mb-4"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back
          </Button>
        )}

        <div className="mb-6">
          <h2 className="text-3xl font-bold text-foreground">
            {currentPage === 'dashboard' ? 'Dashboard Overview' : 'Inventory Management'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {currentPage === 'dashboard' 
              ? 'Monitor your unit\'s equipment and resources' 
              : 'View and manage all inventory items'}
          </p>
        </div>

        {currentPage === 'dashboard' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatsCard label="Total Items" value={stats.total} icon={Package} colorClass="border-primary" />
              <StatsCard label="Currently In Use" value={stats.inUse} icon={Users} colorClass="border-accent" />
              <StatsCard label="Low Stock Alerts" value={stats.lowStock} icon={AlertCircle} colorClass="border-warning" />
              <StatsCard label="Needs Repair" value={stats.needsRepair} icon={AlertCircle} colorClass="border-destructive" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {categories.map(cat => {
                const catItems = items.filter(item => item.category === cat.id);
                const catTotal = catItems.reduce((sum, item) => sum + item.quantity, 0);
                const catInUse = catItems.reduce((sum, item) => sum + item.inUse, 0);
                return (
                  <CategoryCard
                    key={cat.id}
                    category={cat}
                    totalItems={catTotal}
                    inUse={catInUse}
                    onClick={() => navigateTo('inventory', cat.id)}
                  />
                );
              })}
            </div>

            <div className="bg-card rounded-lg shadow-md p-6 border border-border">
              <h3 className="text-xl font-bold text-foreground mb-4">Recent Activity</h3>
              <div className="space-y-1">
                {activityLog.slice(0, 10).map((log, idx) => (
                  <ActivityLogItem key={idx} log={log} />
                ))}
                {activityLog.length === 0 && (
                  <p className="text-muted-foreground text-center py-4">No recent activity</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-card rounded-lg shadow-md p-6 border border-border">
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
                  <Input
                    type="text"
                    placeholder="Search items or cadets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCondition} onValueChange={setFilterCondition}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by condition" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Conditions</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="needs-repair">Needs Repair</SelectItem>
                    <SelectItem value="unserviceable">Unserviceable</SelectItem>
                  </SelectContent>
                </Select>
                {userRoles[currentUser?.role]?.canEdit && (
                  <Button>
                    <Plus size={20} className="mr-2" />
                    Add Item
                  </Button>
                )}
              </div>

              {selectedCategory && (
                <div className="mb-4 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Category:</span>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                    {categories.find(c => c.id === selectedCategory)?.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Clear filter
                  </Button>
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Item</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Quantity</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">In Use</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">Location</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredItems.map(item => (
                      <tr key={item.id} className="hover:bg-muted/30">
                        <td className="px-4 py-3">
                          <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                            {item.notes && <p className="text-xs text-muted-foreground">{item.notes}</p>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm">
                          {categories.find(c => c.id === item.category)?.icon}
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground font-medium">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm text-foreground">{item.inUse}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{item.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredItems.length === 0 && (
                  <div className="text-center py-12">
                    <Package size={48} className="mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No items found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-primary text-primary-foreground mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm opacity-90">
            AFJROTC Logistics Management System • Aim High • Fly-Fight-Win
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
