import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiredAuth?: boolean
    guestOnly?: boolean
    title?: string
    allowedRoles?: string[]
  }
}