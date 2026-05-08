import type { MenuItems, MenuResponse } from '@/types/menu'

// TODO: 실제 serviceId 확정 후 post() 호출로 교체
export const menuApi = {
  async getMenus(role?: string): Promise<MenuResponse> {
    // const menus = role ? MOCK_MENUS.filter((m) => m.userGbn?.split(' ').includes(role)) : MOCK_MENUS
    const menus = role ? filterMenusByRole(MOCK_MENUS_CHILDREN, role) : MOCK_MENUS_CHILDREN
    return { menus }
  },
}

function filterMenusByRole(menus: MenuItems[], role: string): MenuItems[] {
  return menus
    .filter((m) => m.userGbn?.split(' ').includes(role))
    .map((m) => ({
      ...m,
      children: m.children ? filterMenusByRole(m.children, role) : undefined,
    }))
}

// const MOCK_MENUS: MenuItems[] = [
//   {
//     menuId: 'm1',
//     prntMenuId: '',
//     menuName: '업무관리',
//     menuUri: '/pay/num/',
//     menuDepth: '1',
//     userGbn: '1 2',
//   },
//   {
//     menuId: 'm1-1',
//     prntMenuId: 'm1',
//     menuName: '매출관리',
//     menuUri: '/pay/num',
//     menuDepth: '2',
//     userGbn: '1 2',
//   },
//   {
//     menuId: 'm1-1-1',
//     prntMenuId: 'm1-1',
//     menuName: '매출현황',
//     menuUri: '/pay/num',
//     menuDepth: '3',
//     userGbn: '1 2',
//   },
//   {
//     menuId: 'm2',
//     prntMenuId: '',
//     menuName: '관리자메뉴',
//     menuUri: '',
//     menuDepth: '1',
//     userGbn: '1 2',
//   },
// ]

const MOCK_MENUS_CHILDREN: MenuItems[] = [
  {
    menuId: 'm1',
    prntMenuId: '',
    menuName: '업무관리',
    menuUri: '/pay/num/',
    menuDepth: '1',
    userGbn: '1 2',
    children: [
      {
        menuId: 'm1-1',
        prntMenuId: 'm1',
        menuName: '매출관리',
        menuUri: '/pay/num',
        menuDepth: '2',
        userGbn: '1 2',
        children: [
          {
            menuId: 'm1-1-1',
            prntMenuId: 'm1-1',
            menuName: '매출현황',
            menuUri: '/pay/num',
            menuDepth: '3',
            userGbn: '1 2',
          }
        ]  
      }
    ]
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
