export const navigations = [
  { name: 'Dashboard', path: '/dashboard/default', icon: 'dashboard' },
  // { label: 'PAGES', type: 'label' },
  {
    name: 'Request',
    icon: 'approval',
    children: [
      { name: 'Requests', path: '/material/table', iconText: 'T' },
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
      { name: 'Users', path: '/material/table', iconText: 'T' },
      { name: 'Logs', path: '/material/table', iconText: 'T' },
    ]
  },
];
