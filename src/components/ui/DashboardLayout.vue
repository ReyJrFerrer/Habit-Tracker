<script setup lang="ts">
import Sidebar from '@/components/ui/Sidebar.vue';
</script>

<template>
  <div class="flex min-h-screen">
    <Sidebar />
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>
