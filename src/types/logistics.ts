export interface Item {
  id: number;
  category: string;
  name: string;
  quantity: number;
  inUse: number;
  assignedTo: string | null;
  condition: 'new' | 'good' | 'needs-repair' | 'unserviceable';
  location: string;
  notes: string;
  lastUpdated: string;
  dueDate?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface User {
  name: string;
  role: 'admin' | 'logistics' | 'cadet';
  email: string;
}

export interface UserRole {
  name: string;
  canEdit: boolean;
  canDelete: boolean;
  canCheckout: boolean;
  canManageUsers: boolean;
}

export interface ActivityLog {
  timestamp: string;
  user: string;
  action: string;
  item: string;
}

export interface AllowedEmail {
  email: string;
  role: 'admin' | 'logistics' | 'cadet';
  name: string;
}
