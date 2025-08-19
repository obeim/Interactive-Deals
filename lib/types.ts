export type DealStatus = 'New' | 'Qualified' | 'Proposal' | 'Negotiation' | 'Won' | 'Lost';
export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';

// Reusable option lists
export const STATUS_OPTIONS: DealStatus[] = ['New', 'Qualified', 'Proposal', 'Negotiation', 'Won', 'Lost'];
export const PRIORITY_OPTIONS: Priority[] = ['Low', 'Medium', 'High', 'Critical'];

export interface Deal {
  id: string;
  dealName: string;
  company: string;
  owner: string;
  status: DealStatus;
  priority: Priority;
  amount: number;
  probability: number;
  closeDate: string;
  createdDate: string;
  lastActivity: string;
  source: string;
  tags: string[];
  notes: string;
  activities: Activity[];
}

export interface Activity {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  description: string;
  date: string;
  user: string;
}

export interface SortConfig {
  key: keyof Deal;
  direction: 'asc' | 'desc';
}

export interface FilterConfig {
  status?: DealStatus[];
  owner?: string[];
  amountRange?: { min: number; max: number };
  dateRange?: { start: string; end: string };
  search?: string;
}

export interface ColumnConfig {
  key: keyof Deal;
  label: string;
  visible: boolean;
  width: number;
  sortable: boolean;
  filterable: boolean;
  type: 'text' | 'number' | 'date' | 'status' | 'currency' | 'percentage';
}
