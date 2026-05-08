<template>
  <div class="flex h-screen flex-col bg-gray-50">
    <AppHeader />

    <div class="flex flex-1 overflow-hidden">
      <AppSidebar />

      <main class="flex-1 overflow-y-auto">
        <!-- <Transition name="fade">
          <div
            v-if="uiStore.isLoading"
            class="fixed inset-0 z-40 flex items-center justify-center bg-white/60"
          >
            <svg
              class="h-10 w-10 animate-spin text-primary-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              />
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        </Transition> -->

        <div class="mx-auto max-w-screen-xl p-6">
          <RouterView />
        </div>
      </main>
    </div>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
  import { useUiStore } from '@/stores/ui'
  import AppHeader from './AppHeader.vue'
  import AppSidebar from './AppSidebar.vue'
  import AppFooter from './AppFooter.vue'

  const uiStore = useUiStore()
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.15s;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
