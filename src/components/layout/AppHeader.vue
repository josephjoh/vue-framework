<template>
  <header class="border-b border-gray-200 bg-white shadow-sm">
    <div
      class="mx-auto flex h-16 max-w-screen-xl items-center justify-between px-4 sm:px-6 lg:px-8"
    >
      <!-- Logo -->
      <router-link to="/" class="flex items-center gap-2 text-xl font-bold text-primary-600">
        <svg class="h-7 w-7" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 14a6 6 0 110-12 6 6 0 010 12z" />
        </svg>
        {{ appName }}
      </router-link>

      <!-- GNB -->
      <nav class="flex items-center gap-1">
        <div
          v-for="item in treeMenus"
          :key="item.menuId"
          class="relative"
          @mouseenter="activeMenu = item.menuId"
          @mouseleave="activeMenu = null"
        >
          <button
            class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary-600"
          >
            {{ item.menuName }}
          </button>

          <!-- 2뎁스 드롭다운 -->
          <div
            v-if="item.children && activeMenu === item.menuId"
            class="absolute left-0 top-full z-50 min-w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
          >
            <div
              v-for="sub in item.children"
              :key="sub.menuId"
              class="relative"
              @mouseenter="activeSub = sub.menuId"
              @mouseleave="activeSub = null"
            >
              <div
                class="flex cursor-pointer items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {{ sub.menuName }}
                <svg
                  v-if="sub.children"
                  class="h-4 w-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>

              <!-- 3뎁스 플라이아웃 -->
              <div
                v-if="sub.children && activeSub === sub.menuId"
                class="absolute left-full top-0 z-50 min-w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
              >
                <router-link
                  v-for="leaf in sub.children"
                  :key="leaf.menuId"
                  :to="leaf.menuUri || '/'"
                  class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                >
                  {{ leaf.menuName }}
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- User area -->
      <div class="flex items-center gap-4">
        <span class="text-sm text-gray-600">{{ authStore.user?.name }}</span>
        <Button variant="secondary" size="sm" @click="handleLogout">로그아웃</Button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { ref, computed } from 'vue'
  import { useAuthStore } from '@/stores/auth'
  import { useMenuStore } from '@/stores/menu'
  import type { MenuItems } from '@/types/menu'
  import { useRouter } from 'vue-router'
  import { Button } from '@/components/ui/button'

  interface MenuTree extends MenuItems {
    children?: MenuTree[]
  }

  const authStore = useAuthStore()
  const menuStore = useMenuStore()
  const router = useRouter()
  const appName = import.meta.env.VITE_APP_NAME || 'vue-framework'

  const activeMenu = ref<string | null>(null)
  const activeSub = ref<string | null>(null)

  const treeMenus = computed<MenuTree[]>(() => {
    const map = new Map<string, MenuTree>()
    menuStore.menus.forEach((item) => map.set(item.menuId, { ...item }))
    const roots: MenuTree[] = []
    menuStore.menus.forEach((item) => {
      if (item.prntMenuId) {
        const parent = map.get(item.prntMenuId)
        if (parent) {
          if (!parent.children) parent.children = []
          parent.children.push(map.get(item.menuId)!)
        }
      } else {
        roots.push(map.get(item.menuId)!)
      }
    })
    return roots
  })

  async function handleLogout() {
    await authStore.logout()
    router.push({ name: 'Login' })
  }
</script>
