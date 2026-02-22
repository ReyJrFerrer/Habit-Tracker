<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'highlighted';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
});

const cardClasses = computed(() => [
  'glass-card backdrop-blur-xl',
  'bg-white/5 border border-white/10',
  'rounded-2xl shadow-glass p-4',
  'transition-all duration-300',
  'hover:bg-white/8 hover:border-white/20',
  props.variant === 'highlighted' && 'ring-2 ring-accent-primary/50',
  props.class
]);
</script>

<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>
