import type { MenuItems, MenuResponse } from '@/types/menu'

// TODO: 실제 serviceId 확정 후 post() 호출로 교체
export const menuApi = {
  async getMenus(role: string): Promise<MenuResponse> {
    return { menus: MOCK_MENUS.filter((m) => m.userGbn?.split(' ').includes(role)) }
  },
}

const MOCK_MENUS: MenuItems[] = [
  {
    menuId: 'm1',
    prntMenuId: '',
    menuName: '업무관리',
    menuUri: '/pay/num/',
    menuDepth: '1',
    userGbn: '1 2',
  },
  {
    menuId: 'm1-1',
    prntMenuId: 'm1',
    menuName: '매출관리',
    menuUri: '/pay/num',
    menuDepth: '2',
    userGbn: '1 2',
  },
  {
    menuId: 'm1-1-1',
    prntMenuId: 'm1-1',
    menuName: '매출현황',
    menuUri: '/pay/num',
    menuDepth: '3',
    userGbn: '1 2',
  },
  {
    menuId: 'm2',
    prntMenuId: '',
    menuName: '관리자메뉴',
    menuUri: '',
    menuDepth: '1',
    userGbn: '1 2',
  },
]

// const MOCK_MENUS: Record<string, MenuItems[]> = {
//   user: [
//     {
//       id: 'm1',
//       label: '업무관리',
//       children: [
//         {
//           id: 'm1-1',
//           label: '매출관리',
//           children: [
//             {
//               id: 'm1-1-1',
//               label: '매출현황',
//               to: '/',
//               roles: ['user', 'admin'],
//             },
//             {
//               id: 'm1-1-23',
//               label: '매출등록',
//               to: '/sales/register',
//               roles: ['admin'],
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 'm2',
//       label: '업무관리2',
//       children: [
//         {
//           id: 'm2-1',
//           label: '매출관리2',
//           children: [
//             {
//               id: 'm2-1-1',
//               label: '매출현황2',
//               to: '/pay/num/PAYNUM000B01M',
//               roles: ['user', 'admin'],
//             },
//             {
//               id: 'm2-1-2',
//               label: '매출등록2',
//               to: '/sales/register',
//               roles: ['admin'],
//             }
//           ]
//         }
//       ]
//     }
//   ]
// }
