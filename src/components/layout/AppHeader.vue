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
        <span class="text-sm text-gray-600">{{ user?.name }}</span>
        <Button variant="secondary" size="sm" @click="handleLogout">로그아웃</Button>
      </div>
    </div>

    <!-- GNB v2 : label/href 바인딩 방식 -->
    <div class="border-t border-gray-100 bg-gray-50">
      <div class="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center gap-1 py-1">
          <div
            v-for="(item, i) in gnbItems2"
            :key="i"
            class="relative"
            @mouseenter="activeMenu2 = i"
            @mouseleave="activeMenu2 = null"
          >
            <button
              class="rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-white hover:text-primary-600"
            >
              {{ item.label }}
            </button>

            <div
              v-if="item.children && activeMenu2 === i"
              class="absolute left-0 top-full z-50 min-w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
            >
              <div
                v-for="(sub, j) in item.children"
                :key="j"
                class="relative"
                @mouseenter="activeSub2 = `${i}-${j}`"
                @mouseleave="activeSub2 = null"
              >
                <div
                  class="flex cursor-pointer items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {{ sub.label }}
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

                <div
                  v-if="sub.children && activeSub2 === `${i}-${j}`"
                  class="absolute left-full top-0 z-50 min-w-40 rounded-md border border-gray-200 bg-white py-1 shadow-lg"
                >
                  <router-link
                    v-for="(leaf, k) in sub.children"
                    :key="k"
                    :to="leaf.href || '/'"
                    class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-600"
                  >
                    {{ leaf.label }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import { useMenuStore } from '@/stores/menu'
import type { MenuItems } from '@/types/menu'
import { Button } from '@/components/ui/button'

interface MenuTree extends MenuItems {
  children?: MenuTree[]
}

interface MenuTree2 extends MenuItems {
  children?: MenuTree2[]
}

const { user, logout } = useAuth()
const menuStore = useMenuStore()
const appName = import.meta.env.VITE_APP_NAME || 'vue-framework'

const activeMenu = ref<string | null>(null)
const activeSub = ref<string | null>(null)
const activeMenu2 = ref<number | null>(null)
const activeSub2 = ref<string | null>(null)

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

interface GnbLeaf { label: string; href?: string }
interface GnbSub  { label: string; href?: string; children?: GnbLeaf[] }
interface GnbItem { label: string; href?: string; children?: GnbSub[] }

const treeMenus2 = computed<MenuTree2[]>(() => {
  const map = new Map<string, MenuTree2>()
  menuStore.menus.forEach((item) => map.set(item.menuId, { ...item }))
  const roots: MenuTree2[] = []
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

const gnbItems2 = computed<GnbItem[]>(() =>
  treeMenus2.value.map((item) => ({
    label: item.menuName,
    href: item.menuUri || undefined,
    children: item.children?.map((sub) => ({
      label: sub.menuName,
      href: sub.menuUri || undefined,
      children: sub.children?.map((leaf) => ({
        label: leaf.menuName,
        href: leaf.menuUri || undefined,
      })),
    })),
  }))
)

async function handleLogout() {
  await logout()
}
</script>
