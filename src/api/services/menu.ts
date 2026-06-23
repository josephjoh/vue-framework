import type { MenuItems, MenuResponse } from '@/types/menu'

export const menuApi = {
  // ① 최초 접속: 전체 메뉴 (사용자 구분 없이)
  async getAllMenus(): Promise<MenuResponse> {
    // TODO: 실제 API 연동 시 교체
    // return api.post('/menus', { serviceId: 'MENU_ALL' })
    return { menus: MOCK_ALL_MENUS }
  },

  // ② 수임인 전용: 로그인 후 서버 재호출
  async getDelegateeMenus(): Promise<MenuResponse> {
    // TODO: 실제 API 연동 시 교체
    // return api.post('/menus', { serviceId: 'MENU_DLGE' })
    return { menus: MOCK_DLGE_MENUS }
  },
}

// ── 전체 메뉴 Mock ─────────────────────────────────────────────────────────────
// userGbn: 해당 메뉴에 접근 가능한 사용자 유형 코드 (공백 구분)
// INDV=개인, SOPR=개인사업자, CORP=법인, DLGR=위임자
const MOCK_ALL_MENUS: MenuItems[] = [
  {
    menuId: 'm1',
    prntMenuId: '',
    menuName: '업무관리',
    menuUri: '/screen/pay',
    menuDepth: '1',
    userGbn: 'INDV SOPR CORP DLGR',
    children: [
      {
        menuId: 'm1-1',
        prntMenuId: 'm1',
        menuName: '매출관리',
        menuUri: '/screen/pay/num',
        menuDepth: '2',
        userGbn: 'INDV SOPR CORP DLGR',
        children: [
          {
            menuId: 'm1-1-1',
            prntMenuId: 'm1-1',
            menuName: '매출현황',
            menuUri: '/screen/pay/num/PAYNUM000B01M',
            menuDepth: '3',
            userGbn: 'INDV SOPR CORP DLGR',
          },
        ],
      },
    ],
  },
  {
    menuId: 'm2',
    prntMenuId: '',
    menuName: '법인전용',
    menuUri: '',
    menuDepth: '1',
    userGbn: 'CORP',
    children: [
      {
        menuId: 'm2-1',
        prntMenuId: 'm2',
        menuName: '법인관리',
        menuUri: '/screen/pay/num',
        menuDepth: '2',
        userGbn: 'CORP',
        children: [
          {
            menuId: 'm2-1-1',
            prntMenuId: 'm2-1',
            menuName: '법인현황',
            menuUri: '/screen/pay/num/PAYNUM000B01M',
            menuDepth: '3',
            userGbn: 'CORP',
          },
        ],
      },
    ],
  },
  {
    menuId: 'm3',
    prntMenuId: '',
    menuName: '위임자메뉴',
    menuUri: '',
    menuDepth: '1',
    userGbn: 'DLGR',
    children: [
      {
        menuId: 'm3-1',
        prntMenuId: 'm3',
        menuName: '위임관리',
        menuUri: '/screen/pay/num',
        menuDepth: '2',
        userGbn: 'DLGR',
        children: [
          {
            menuId: 'm3-1-1',
            prntMenuId: 'm3-1',
            menuName: '위임현황',
            menuUri: '/screen/pay/num/PAYNUM000B01M',
            menuDepth: '3',
            userGbn: 'DLGR',
          },
        ],
      },
    ],
  },
]

// ── 수임인 전용 메뉴 Mock ──────────────────────────────────────────────────────
// 로그인 후 수임인(DLGE) 판별 시 서버 재호출로 받는 메뉴
const MOCK_DLGE_MENUS: MenuItems[] = [
  {
    menuId: 'dm1',
    prntMenuId: '',
    menuName: '수임업무',
    menuUri: '/screen/pay',
    menuDepth: '1',
    userGbn: 'DLGE',
    children: [
      {
        menuId: 'dm1-1',
        prntMenuId: 'dm1',
        menuName: '수임매출',
        menuUri: '/screen/pay/num',
        menuDepth: '2',
        userGbn: 'DLGE',
        children: [
          {
            menuId: 'dm1-1-1',
            prntMenuId: 'dm1-1',
            menuName: '수임매출현황',
            menuUri: '/screen/pay/num/PAYNUM000B01M',
            menuDepth: '3',
            userGbn: 'DLGE',
          },
        ],
      },
    ],
  },
]
