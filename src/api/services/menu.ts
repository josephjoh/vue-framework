import type { MenuItems, MenuResponse } from '@/types/menu'

// TODO: 실제 serviceId 확정 후 post() 호출로 교체
export const menuApi = {
  async getMenus(role: string): Promise<MenuResponse> {
    void role
    return { menus: MOCK_MENUS[role] ?? MOCK_MENUS['user'] }
  }
}

const MOCK_MENUS: Record<string, MenuItems[]> = {
  user: [
    {
      id: 'm1',
      label: '업무관리',
      children: [
        {
          id: 'm1-1',
          label: '매출관리',
          children: [
            {
              id: 'm1-1-1',
              label: '매출현황',
              to: '/',
              roles: ['user', 'admin'],
            },
            {
              id: 'm1-1-23',
              label: '매출등록',
              to: '/sales/register',
              roles: ['admin'],
            }
          ]
        }
      ]
    },
    {
      id: 'm2',
      label: '업무관리2',
      children: [
        {
          id: 'm2-1',
          label: '매출관리2',
          children: [
            {
              id: 'm2-1-1',
              label: '매출현황2',
              to: '/pay/num/PAYNUM000B01M',
              roles: ['user', 'admin'],
            },
            {
              id: 'm2-1-2',
              label: '매출등록2',
              to: '/sales/register',
              roles: ['admin'],
            }
          ]
        }
      ]
    }
  ]
}