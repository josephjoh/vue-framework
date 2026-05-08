export interface MenuItems {
  menuId: string
  prntMenuId?: string
  menuName: string
  menuUri: string
  menuDepth: string
  userGbn?: string
  children?: MenuItems[]
}

export interface MenuResponse {
  menus: MenuItems[]
}
