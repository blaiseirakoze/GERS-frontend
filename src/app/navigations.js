export const navigations = [
  { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard' },
  // { label: 'PAGES', type: 'label' },
  {
    name: 'Requests',
    icon: 'approval',
    children: [
      { name: 'Requests', path: '/requests', iconText: 'T' },
      // { name: 'Create Request', path: '/requests/create', iconText: 'T' },
    ]
  },
  {
    name: 'Tenders',
    icon: 'work',
    children: [
      { name: 'Tenders', path: '/tenders', iconText: 'T' },
      // { name: 'Create Tender', path: '/tenders/create', iconText: 'T' },
    ]
  },
  {
    name: 'Configuration',
    icon: 'settings',
    children: [
      { name: 'Roles', path: '/configuration/roles', iconText: 'T' },
      { name: 'Institutions', path: '/configuration/institutions', iconText: 'T' },
      { name: 'Supplier', path: '/configuration/supplier', iconText: 'T' },
      { name: 'Risa', path: '/configuration/Risa', iconText: 'T' },
      { name: 'Logs', path: '/configuration/logs', iconText: 'T' },
    ]
  },
];
