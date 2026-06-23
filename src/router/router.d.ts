import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresFullMember?: boolean
    guestOnly?: boolean
    title?: string
    allowedRoles?: string[]
    nativeScreen?: {
      screenId: string
      payload?: Record<string, unknown>
    }
  }
}
