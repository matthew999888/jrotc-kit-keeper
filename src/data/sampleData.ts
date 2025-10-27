import { Item, AllowedEmail } from '@/types/logistics';

export const getSampleItems = (): Item[] => [
  { 
    id: 1, 
    category: 'blues', 
    name: 'Service Dress Coat', 
    quantity: 15, 
    inUse: 3, 
    assignedTo: 'Cadet Johnson', 
    condition: 'good', 
    location: 'Supply Room A', 
    notes: 'Various sizes', 
    lastUpdated: '2025-10-20' 
  },
  { 
    id: 2, 
    category: 'blues', 
    name: 'Flight Cap', 
    quantity: 25, 
    inUse: 0, 
    assignedTo: null, 
    condition: 'new', 
    location: 'Supply Room A', 
    notes: 'Sizes 6-8', 
    lastUpdated: '2025-10-18' 
  },
  { 
    id: 3, 
    category: 'drill', 
    name: 'Drill Rifle (Daisy)', 
    quantity: 12, 
    inUse: 12, 
    assignedTo: 'Drill Team', 
    condition: 'good', 
    location: 'Armory', 
    notes: 'Inspected monthly', 
    lastUpdated: '2025-10-25' 
  },
  { 
    id: 4, 
    category: 'pt', 
    name: 'PT Shirt (S)', 
    quantity: 20, 
    inUse: 5, 
    assignedTo: null, 
    condition: 'good', 
    location: 'PE Storage', 
    notes: '', 
    lastUpdated: '2025-10-15' 
  },
  { 
    id: 5, 
    category: 'marksmanship', 
    name: 'Air Rifle', 
    quantity: 8, 
    inUse: 0, 
    assignedTo: null, 
    condition: 'good', 
    location: 'Range Locker', 
    notes: 'Competition grade', 
    lastUpdated: '2025-10-22' 
  },
  { 
    id: 6, 
    category: 'awards', 
    name: 'Ribbon Rack Set', 
    quantity: 50, 
    inUse: 12, 
    assignedTo: null, 
    condition: 'new', 
    location: 'Office Cabinet', 
    notes: 'Awards ceremony', 
    lastUpdated: '2025-10-10' 
  },
  { 
    id: 7, 
    category: 'ocp', 
    name: 'OCP Patrol Cap', 
    quantity: 18, 
    inUse: 2, 
    assignedTo: null, 
    condition: 'good', 
    location: 'Supply Room B', 
    notes: '', 
    lastUpdated: '2025-10-19' 
  },
  { 
    id: 8, 
    category: 'field', 
    name: 'Folding Table', 
    quantity: 6, 
    inUse: 0, 
    assignedTo: null, 
    condition: 'needs-repair', 
    location: 'Garage', 
    notes: 'One table leg damaged', 
    lastUpdated: '2025-10-23' 
  }
];

export const getDefaultEmails = (): AllowedEmail[] => [
  { email: 'instructor@school.edu', role: 'admin', name: 'Instructor Davis' },
  { email: 'logistics@school.edu', role: 'logistics', name: 'C/MSgt Rodriguez' },
  { email: 'cadet@school.edu', role: 'cadet', name: 'C/Amn Smith' }
];
