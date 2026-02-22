<script setup lang="ts">
import { computed } from 'vue';
import { CheckIcon } from '@heroicons/vue/24/solid';

interface Props {
  isCompleted?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isCompleted: false
});

const buttonClass = computed(() => {
  return props.isCompleted
    ? 'bg-accent-success text-white ring-2 ring-accent-success/50 scale-95 opacity-80 cursor-not-allowed'
    : 'bg-white/10 text-white hover:bg-white/20 hover:scale-105 active:scale-95 shadow-glass';
});
</script>

<template>
  <button 
    class="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 backdrop-blur-md border border-white/10"
    :class="buttonClass"
    :disabled="isCompleted"
    aria-label="complete"
  >
    <CheckIcon v-if="isCompleted" class="w-6 h-6" />
    <div v-else class="w-4 h-4 rounded-full border-2 border-white/80"></div>
  </button>
</template>
