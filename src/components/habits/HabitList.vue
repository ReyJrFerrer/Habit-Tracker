<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useHabitStore } from '@/stores/habitStore';
import HabitCard from '@/components/habits/HabitCard.vue';
import { CheckCircleIcon, SparklesIcon } from '@heroicons/vue/24/outline';

const habitStore = useHabitStore();

onMounted(() => {
  habitStore.loadMockData();
});

const todayHabits = computed(() => habitStore.habitsDueToday);
const completedToday = computed(() => {
  return todayHabits.value.filter(h => habitStore.isHabitCompletedToday(h.id));
});

const pendingToday = computed(() => {
  return todayHabits.value.filter(h => !habitStore.isHabitCompletedToday(h.id));
});
</script>

<template>
  <div class="space-y-8">
    <div class="flex items-center justify-between px-2">
      <h2 class="text-2xl font-bold text-text-primary">Your Habits</h2>
      <span class="text-sm font-medium bg-white/10 px-3 py-1 rounded-full text-text-secondary">
        {{ completedToday.length }}/{{ todayHabits.length }} Completed
      </span>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <div class="w-3 h-3 rounded-full bg-accent-warning"></div>
          <h3 class="text-lg font-semibold text-text-primary">To Do</h3>
          <span class="text-sm text-text-secondary">({{ pendingToday.length }})</span>
        </div>
        
        <div v-if="pendingToday.length > 0" class="space-y-4 min-h-[200px] p-4 rounded-2xl bg-white/5 border border-white/10">
          <HabitCard 
            v-for="habit in pendingToday" 
            :key="habit.id" 
            :habit="habit" 
          />
        </div>
        <div v-else class="p-8 rounded-2xl bg-white/5 border border-white/10 border-dashed text-center">
          <p class="text-text-secondary">No pending habits</p>
        </div>
      </div>

      <div class="space-y-4">
        <div class="flex items-center gap-2 mb-4">
          <CheckCircleIcon class="w-5 h-5 text-accent-success" />
          <h3 class="text-lg font-semibold text-text-primary">Completed</h3>
          <span class="text-sm text-text-secondary">({{ completedToday.length }})</span>
        </div>
        
        <div v-if="completedToday.length > 0" class="space-y-4 min-h-[200px] p-4 rounded-2xl bg-accent-success/5 border border-accent-success/20">
          <HabitCard 
            v-for="habit in completedToday" 
            :key="habit.id" 
            :habit="habit" 
          />
        </div>
        <div v-else class="p-8 rounded-2xl bg-white/5 border border-white/10 border-dashed text-center">
          <p class="text-text-secondary">No completed habits yet</p>
        </div>
      </div>
    </div>

    <div v-if="todayHabits.length === 0" class="text-center py-12 glass-card rounded-3xl border border-white/10 shadow-glass bg-white/5">
      <SparklesIcon class="w-12 h-12 mx-auto mb-4 text-accent-primary opacity-50" />
      <h3 class="text-xl font-medium text-text-primary mb-2">All done for today!</h3>
      <p class="text-text-secondary max-w-sm mx-auto">You've completed all your scheduled habits. Great job maintaining your streaks!</p>
    </div>
  </div>
</template>
