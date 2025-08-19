import { Deal, Activity, ColumnConfig } from './types';

// Static deals data mimicking Monday.com structure
export const dealsData: Deal[] = [
  {
    id: '1',
    dealName: 'Enterprise Software License',
    company: 'TechCorp Solutions',
    owner: 'Sarah Johnson',
    status: 'Negotiation',
    priority: 'High',
    amount: 125000,
    probability: 85,
    closeDate: '2024-09-15',
    createdDate: '2024-07-10',
    lastActivity: '2024-08-15',
    source: 'Website',
    tags: ['Enterprise', 'Software', 'Recurring'],
    notes: 'Large enterprise deal with potential for expansion',
    activities: [
      { id: '1a', type: 'meeting', description: 'Demo presentation', date: '2024-08-15', user: 'Sarah Johnson' },
      { id: '1b', type: 'email', description: 'Sent proposal', date: '2024-08-10', user: 'Sarah Johnson' },
      { id: '1c', type: 'call', description: 'Initial discovery call', date: '2024-07-15', user: 'Sarah Johnson' }
    ]
  },
  {
    id: '2',
    dealName: 'Marketing Automation Platform',
    company: 'GrowthCo Inc',
    owner: 'Mike Chen',
    status: 'Qualified',
    priority: 'Medium',
    amount: 45000,
    probability: 60,
    closeDate: '2024-10-01',
    createdDate: '2024-08-01',
    lastActivity: '2024-08-14',
    source: 'Cold Outreach',
    tags: ['Marketing', 'SaaS'],
    notes: 'Mid-market company looking to scale marketing efforts',
    activities: [
      { id: '2a', type: 'call', description: 'Qualification call', date: '2024-08-14', user: 'Mike Chen' },
      { id: '2b', type: 'email', description: 'Follow-up email', date: '2024-08-05', user: 'Mike Chen' }
    ]
  },
  {
    id: '3',
    dealName: 'Cloud Infrastructure Migration',
    company: 'DataFlow Systems',
    owner: 'Emily Rodriguez',
    status: 'Proposal',
    priority: 'Critical',
    amount: 280000,
    probability: 75,
    closeDate: '2024-09-30',
    createdDate: '2024-06-15',
    lastActivity: '2024-08-16',
    source: 'Referral',
    tags: ['Cloud', 'Infrastructure', 'Migration'],
    notes: 'Complex migration project with multiple phases',
    activities: [
      { id: '3a', type: 'meeting', description: 'Technical requirements review', date: '2024-08-16', user: 'Emily Rodriguez' },
      { id: '3b', type: 'note', description: 'Updated proposal with new requirements', date: '2024-08-12', user: 'Emily Rodriguez' },
      { id: '3c', type: 'meeting', description: 'Stakeholder meeting', date: '2024-08-08', user: 'Emily Rodriguez' }
    ]
  },
  {
    id: '4',
    dealName: 'CRM Implementation',
    company: 'StartupXYZ',
    owner: 'David Kim',
    status: 'New',
    priority: 'Low',
    amount: 15000,
    probability: 25,
    closeDate: '2024-11-15',
    createdDate: '2024-08-10',
    lastActivity: '2024-08-10',
    source: 'Trade Show',
    tags: ['CRM', 'Startup'],
    notes: 'Early stage startup, budget constraints',
    activities: [
      { id: '4a', type: 'note', description: 'Initial contact at trade show', date: '2024-08-10', user: 'David Kim' }
    ]
  },
  {
    id: '5',
    dealName: 'Analytics Dashboard',
    company: 'RetailMax',
    owner: 'Lisa Wang',
    status: 'Won',
    priority: 'Medium',
    amount: 75000,
    probability: 100,
    closeDate: '2024-08-01',
    createdDate: '2024-05-20',
    lastActivity: '2024-08-01',
    source: 'Website',
    tags: ['Analytics', 'Dashboard', 'Retail'],
    notes: 'Successfully closed - implementation starting next month',
    activities: [
      { id: '5a', type: 'note', description: 'Contract signed', date: '2024-08-01', user: 'Lisa Wang' },
      { id: '5b', type: 'meeting', description: 'Final negotiation', date: '2024-07-28', user: 'Lisa Wang' },
      { id: '5c', type: 'email', description: 'Contract review', date: '2024-07-25', user: 'Lisa Wang' }
    ]
  },
  {
    id: '6',
    dealName: 'Security Audit Services',
    company: 'FinanceFirst Bank',
    owner: 'Alex Thompson',
    status: 'Lost',
    priority: 'High',
    amount: 95000,
    probability: 0,
    closeDate: '2024-07-30',
    createdDate: '2024-05-01',
    lastActivity: '2024-07-30',
    source: 'Referral',
    tags: ['Security', 'Audit', 'Finance'],
    notes: 'Lost to competitor - price was the main factor',
    activities: [
      { id: '6a', type: 'note', description: 'Deal marked as lost', date: '2024-07-30', user: 'Alex Thompson' },
      { id: '6b', type: 'meeting', description: 'Final presentation', date: '2024-07-25', user: 'Alex Thompson' },
      { id: '6c', type: 'email', description: 'Competitive analysis', date: '2024-07-20', user: 'Alex Thompson' }
    ]
  },
  {
    id: '7',
    dealName: 'E-commerce Platform',
    company: 'FashionForward',
    owner: 'Rachel Green',
    status: 'Qualified',
    priority: 'Medium',
    amount: 180000,
    probability: 70,
    closeDate: '2024-10-15',
    createdDate: '2024-07-01',
    lastActivity: '2024-08-16',
    source: 'Cold Outreach',
    tags: ['E-commerce', 'Fashion', 'Platform'],
    notes: 'Growing fashion brand looking to upgrade platform',
    activities: [
      { id: '7a', type: 'call', description: 'Technical discussion', date: '2024-08-16', user: 'Rachel Green' },
      { id: '7b', type: 'meeting', description: 'Platform demo', date: '2024-08-10', user: 'Rachel Green' },
      { id: '7c', type: 'email', description: 'Requirements gathering', date: '2024-07-20', user: 'Rachel Green' }
    ]
  },
  {
    id: '8',
    dealName: 'Mobile App Development',
    company: 'HealthTech Innovations',
    owner: 'James Wilson',
    status: 'Proposal',
    priority: 'High',
    amount: 220000,
    probability: 65,
    closeDate: '2024-09-20',
    createdDate: '2024-06-10',
    lastActivity: '2024-08-15',
    source: 'Website',
    tags: ['Mobile', 'Healthcare', 'App'],
    notes: 'Healthcare app with regulatory compliance requirements',
    activities: [
      { id: '8a', type: 'meeting', description: 'Compliance review', date: '2024-08-15', user: 'James Wilson' },
      { id: '8b', type: 'email', description: 'Updated proposal', date: '2024-08-12', user: 'James Wilson' },
      { id: '8c', type: 'call', description: 'Technical architecture discussion', date: '2024-08-05', user: 'James Wilson' }
    ]
  }
];

// Default column configuration
export const defaultColumns: ColumnConfig[] = [
  { key: 'dealName', label: 'Deal Name', visible: true, width: 200, sortable: true, filterable: true, type: 'text' },
  { key: 'company', label: 'Company', visible: true, width: 180, sortable: true, filterable: true, type: 'text' },
  { key: 'owner', label: 'Owner', visible: true, width: 150, sortable: true, filterable: true, type: 'text' },
  { key: 'status', label: 'Status', visible: true, width: 120, sortable: true, filterable: true, type: 'status' },
  { key: 'priority', label: 'Priority', visible: true, width: 100, sortable: true, filterable: true, type: 'status' },
  { key: 'amount', label: 'Amount', visible: true, width: 120, sortable: true, filterable: true, type: 'currency' },
  { key: 'probability', label: 'Probability', visible: true, width: 100, sortable: true, filterable: false, type: 'percentage' },
  { key: 'closeDate', label: 'Close Date', visible: true, width: 120, sortable: true, filterable: true, type: 'date' },
  { key: 'lastActivity', label: 'Last Activity', visible: true, width: 130, sortable: true, filterable: false, type: 'date' },
  { key: 'source', label: 'Source', visible: false, width: 120, sortable: true, filterable: true, type: 'text' },
  { key: 'createdDate', label: 'Created', visible: false, width: 120, sortable: true, filterable: false, type: 'date' }
];

// Helper functions for data manipulation
export const getUniqueValues = (data: Deal[], key: keyof Deal): string[] => {
  const values = data.map(item => String(item[key]));
  return Array.from(new Set(values)).sort();
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    'New': 'bg-blue-100 text-blue-800 border-blue-200',
    'Qualified': 'bg-yellow-100 text-yellow-800 border-yellow-200',
    'Proposal': 'bg-purple-100 text-purple-800 border-purple-200',
    'Negotiation': 'bg-orange-100 text-orange-800 border-orange-200',
    'Won': 'bg-green-100 text-green-800 border-green-200',
    'Lost': 'bg-red-100 text-red-800 border-red-200',
    'Low': 'bg-gray-100 text-gray-800 border-gray-200',
    'Medium': 'bg-blue-100 text-blue-800 border-blue-200',
    'High': 'bg-orange-100 text-orange-800 border-orange-200',
    'Critical': 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
};
