<script setup lang="ts">
import { computed } from 'vue';
import type { Habit } from '@/types/habit.types';
import GlassCard from '@/components/ui/GlassCard.vue';
import CompleteButton from '@/components/ui/CompleteButton.vue';
import StreakDisplay from '@/components/streaks/StreakDisplay.vue';
import { useHabitStore } from '@/stores/habitStore';
import { calculateStreak } from '@/lib/utils/streak';
import { HeartIcon, BoltIcon, BookOpenIcon, GlobeAltIcon } from '@heroicons/vue/24/outline';

interface Props {
  habit: Habit;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  complete: [habitId: string]
}>();

const habitStore = useHabitStore();

const streak = computed(() => {
  const completions = habitStore.getHabitCompletions(props.habit.id);
  const data = calculateStreak(completions);
  return data.current;
});

const isCompleted = computed(() => {
  return habitStore.isHabitCompletedToday(props.habit.id);
});

const handleComplete = () => {
  if (!isCompleted.value) {
    habitStore.completeHabit(props.habit.id);
    emit('complete', props.habit.id);
  }
};

const habitIcon = computed(() => {
  const category = props.habit.category;
  if (category === 'Health' || category === 'health') return HeartIcon;
  if (category === 'Exercise' || category === 'exercise') return BoltIcon;
  if (category === 'Education' || category === 'education') return BookOpenIcon;
  return GlobeAltIcon;
});
</script>

<template>
  <GlassCard 
    :variant="isCompleted ? 'default' : 'highlighted'" 
    class="flex items-center justify-between group overflow-hidden relative cursor-move"
  >
    <div 
      class="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl transition-all duration-300"
      :style="{ backgroundColor: habit.color, opacity: isCompleted ? 0.3 : 1 }"
    ></div>

    <div class="flex items-center pl-4 space-x-4">
      <div 
        class="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-glass"
      >
        <component :is="habitIcon" class="w-6 h-6" :style="{ color: habit.color }" />
      </div>
      <div>
        <h3 class="font-semibold text-lg text-text-primary" :class="isCompleted ? 'line-through text-text-secondary' : ''">{{ habit.title }}</h3>
        <p class="text-sm text-text-secondary line-clamp-1" v-if="habit.description">{{ habit.description }}</p>
        <StreakDisplay class="mt-1" :count="streak" />
      </div>
    </div>
    
    <div class="pr-2">
      <CompleteButton :isCompleted="isCompleted" @click="handleComplete" />
    </div>
  </GlassCard>
</template>
