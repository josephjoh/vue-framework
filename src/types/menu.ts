export interface MenuItems {
  id: string
  label: string
  to?: string
  roles?: string[] // leaf 노드 접근 허용 역할 목록, 없으면 모든 역할 허용
  children?: MenuItems[]
}

export interface MenuResponse {
  menus: MenuItems[]
}