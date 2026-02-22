<script setup lang="ts">
import { computed } from 'vue';
import { FireIcon } from '@heroicons/vue/24/solid';

interface Props {
  count: number;
}

const props = defineProps<Props>();

const displayClass = computed(() => {
  if (props.count > 10) return 'text-accent-success';
  if (props.count > 0) return 'text-accent-warning';
  return 'text-text-secondary';
});
</script>

<template>
  <div class="flex items-center gap-1" :class="displayClass">
    <FireIcon class="w-4 h-4" />
    <span class="text-sm">{{ count }} day streak</span>
  </div>
</template>
