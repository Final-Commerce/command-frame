import type { GetRoles, GetRolesResponse } from './types';

export const mockGetRoles: GetRoles = async (params): Promise<GetRolesResponse> => {
  console.log('[Mock] getRoles called with params:', params);
  return {
    roles: [
      {
        id: '691df9c6c478bada1fb23d0b',
        name: 'Owner',
        permissions: [
          { category: 'hub_access', label: 'taxes', name: 'taxes', value: true },
          { category: 'hub_access', label: 'general', name: 'general', value: true },
          { category: 'hub_access', label: 'reports', name: 'reports', value: true },
          { category: 'hub_access', label: 'products', name: 'products', value: true },
          { category: 'hub_access', label: 'users', name: 'users', value: true },
          { category: 'hub_access', label: 'outlets', name: 'outlets', value: true },
          { category: 'hub_access', label: 'builder', name: 'builder', value: true },
          { category: 'hub_access', label: 'global_blocks', name: 'global_blocks', value: true },
          { category: 'hub_access', label: 'images', name: 'images', value: true },
          { category: 'hub_access', label: 'transactions', name: 'transactions', value: true },
          { category: 'hub_access', label: 'payouts', name: 'payouts', value: true },
          { category: 'hub_access', label: 'terminals', name: 'terminals', value: true },
          { category: 'hub_access', label: 'billing', name: 'billing', value: true },
          { category: 'station_access', label: 'give_discounts', name: 'give_discounts', value: true },
          { category: 'station_access', label: 'issue_refunds', name: 'issue_refunds', value: true },
          { category: 'station_access', label: 'delete_customers', name: 'delete_customers', value: true },
          { category: 'station_access', label: 'version_control', name: 'version_control', value: true },
          { category: 'station_access', label: 'session_reports', name: 'session_reports', value: true },
          { category: 'station_access', label: 'cash_drawer', name: 'cash_drawer', value: true },
          { category: 'station_access', label: 'station_setting', name: 'station_setting', value: true },
          { category: 'station_access', label: 'station_transactions', name: 'station_transactions', value: true },
        ],
      },
      {
        id: '691df9c6c478bada1fb23d0c',
        name: 'admin',
        permissions: [
          { category: 'hub_access', label: 'taxes', name: 'taxes', value: true },
          { category: 'hub_access', label: 'general', name: 'general', value: true },
          { category: 'hub_access', label: 'reports', name: 'reports', value: true },
          { category: 'hub_access', label: 'products', name: 'products', value: true },
          { category: 'hub_access', label: 'users', name: 'users', value: true },
          { category: 'hub_access', label: 'transactions', name: 'transactions', value: true },
          { category: 'station_access', label: 'give_discounts', name: 'give_discounts', value: true },
          { category: 'station_access', label: 'issue_refunds', name: 'issue_refunds', value: true },
          { category: 'station_access', label: 'delete_customers', name: 'delete_customers', value: true },
        ],
      },
      {
        id: '691df9c6c478bada1fb23d0d',
        name: 'cashier',
        permissions: [
          { category: 'station_access', label: 'give_discounts', name: 'give_discounts', value: false },
          { category: 'station_access', label: 'issue_refunds', name: 'issue_refunds', value: false },
          { category: 'station_access', label: 'delete_customers', name: 'delete_customers', value: false },
          { category: 'station_access', label: 'session_reports', name: 'session_reports', value: true },
          { category: 'station_access', label: 'cash_drawer', name: 'cash_drawer', value: true },
        ],
      },
    ],
    success: true,
    timestamp: new Date().toISOString(),
  };
};
