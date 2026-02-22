<script setup lang="ts">
import { computed, onMounted } from 'vue';
import DashboardLayout from '@/components/ui/DashboardLayout.vue';
import HabitList from '@/components/habits/HabitList.vue';
import HeatmapChart from '@/components/streaks/HeatmapChart.vue';
import GlassCard from '@/components/ui/GlassCard.vue';
import { useHabitStore } from '@/stores/habitStore';
import { calculateStreak } from '@/lib/utils/streak';
import { FireIcon, TrophyIcon, ArrowTrendingUpIcon } from '@heroicons/vue/24/solid';

const habitStore = useHabitStore();

onMounted(() => {
  habitStore.loadMockData();
});

const allCompletions = computed(() => habitStore.completions);

const streakData = computed(() => {
  return calculateStreak(allCompletions.value);
});

const stats = computed(() => ({
  currentStreak: streakData.value.current,
  longestStreak: streakData.value.longest,
  totalCompletions: allCompletions.value.length,
}));
</script>

<template>
  <DashboardLayout>
    <div class="p-8 space-y-8">
      <header class="flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-white">Dashboard</h1>
          <p class="text-text-secondary mt-1">Track your progress and build consistent habits</p>
        </div>
        <div class="text-sm text-text-secondary">
          {{ new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) }}
        </div>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard class="p-6 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-accent-warning/20 flex items-center justify-center">
            <FireIcon class="w-6 h-6 text-accent-warning" />
          </div>
          <div>
            <p class="text-text-secondary text-sm">Current Streak</p>
            <p class="text-2xl font-bold text-white">{{ stats.currentStreak }} days</p>
          </div>
        </GlassCard>

        <GlassCard class="p-6 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-accent-success/20 flex items-center justify-center">
            <TrophyIcon class="w-6 h-6 text-accent-success" />
          </div>
          <div>
            <p class="text-text-secondary text-sm">Longest Streak</p>
            <p class="text-2xl font-bold text-white">{{ stats.longestStreak }} days</p>
          </div>
        </GlassCard>

        <GlassCard class="p-6 flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-accent-primary/20 flex items-center justify-center">
            <ArrowTrendingUpIcon class="w-6 h-6 text-accent-primary" />
          </div>
          <div>
            <p class="text-text-secondary text-sm">Total Completions</p>
            <p class="text-2xl font-bold text-white">{{ stats.totalCompletions }}</p>
          </div>
        </GlassCard>
      </div>

      <GlassCard class="p-6">
        <h2 class="text-lg font-semibold text-white mb-4">Activity Overview</h2>
        <HeatmapChart :data="streakData.heatmapData" :weeks="20" />
      </GlassCard>

      <HabitList />
    </div>
  </DashboardLayout>
</template>
