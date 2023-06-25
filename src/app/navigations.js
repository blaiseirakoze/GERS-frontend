export const navigations = [
  { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard' },
  // { label: 'PAGES', type: 'label' },
  {
    name: 'Requests',
    icon: 'approval',
    children: [
      { name: 'Requests', path: '/requests', iconText: 'T' },
      { name: 'Create Request', path: '/requests/create', iconText: 'T' },
    ]
  },
  {
    name: 'Tenders',
    icon: 'work',
    children: [
      { name: 'Tenders', path: '/material/table', iconText: 'T' },
    ]
  },
  {
    name: 'Bids',
    icon: 'note',
    children: [
      { name: 'Bids', path: '/material/table', iconText: 'T' },
    ]
  },
  {
    name: 'Configuration',
    icon: 'settings',
    children: [
      { name: 'Roles', path: '/configuration/roles', iconText: 'T' },
      { name: 'Users', path: '/configuration/users', iconText: 'T' },
      { name: 'Logs', path: '/configuration/logs', iconText: 'T' },
    ]
  },
];
