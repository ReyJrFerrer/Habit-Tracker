<script setup lang="ts">
import { computed } from 'vue';
import { subDays, format, eachDayOfInterval, startOfWeek, endOfWeek } from 'date-fns';
import type { HeatmapCell } from '@/lib/utils/streak';

interface Props {
  data: HeatmapCell[];
  weeks?: number;
}

const props = withDefaults(defineProps<Props>(), {
  weeks: 20
});

const today = new Date();

const days = computed(() => {
  const startDate = subDays(today, props.weeks * 7);
  const start = startOfWeek(startDate);
  const end = endOfWeek(today);
  return eachDayOfInterval({ start, end });
});

const weeks = computed(() => {
  const result: (Date | null)[][] = [];
  let currentWeek: (Date | null)[] = [];
  
  for (let i = 0; i < days.value.length; i++) {
    const day = days.value[i];
    if (!day) continue;
    const dayOfWeek = day.getDay();
    
    if (i === 0) {
      for (let j = 0; j < dayOfWeek; j++) {
        currentWeek.push(null);
      }
    }
    
    currentWeek.push(day);
    
    if (dayOfWeek === 6 || i === days.value.length - 1) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      result.push(currentWeek);
      currentWeek = [];
    }
  }
  
  return result;
});

const dataMap = computed(() => {
  const map: Record<string, number> = {};
  for (const cell of props.data) {
    map[cell.date] = cell.count;
  }
  return map;
});

const getLevel = (date: Date | null): number => {
  if (!date) return -1;
  const dateStr = format(date, 'yyyy-MM-dd');
  const count = dataMap.value[dateStr] || 0;
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count >= 3) return 3;
  return 0;
};

const levelColors = [
  'bg-white/5',
  'bg-accent-success/20',
  'bg-accent-success/40',
  'bg-accent-success/70'
];
</script>

<template>
  <div class="overflow-x-auto">
    <div class="flex gap-0.5">
      <div v-for="(week, weekIdx) in weeks" :key="weekIdx" class="flex flex-col gap-0.5">
        <div
          v-for="(day, dayIdx) in week"
          :key="dayIdx"
          class="w-3 h-3 rounded-sm transition-all duration-200"
          :class="day ? levelColors[getLevel(day)] : 'bg-transparent'"
          :title="day ? `${format(day, 'MMM d, yyyy')}: ${dataMap[format(day, 'yyyy-MM-dd')] || 0} completions` : ''"
        />
      </div>
    </div>
    
    <div class="flex items-center gap-2 mt-3 text-xs text-text-secondary">
      <span>Less</span>
      <div class="flex gap-0.5">
        <div v-for="i in 4" :key="i" class="w-3 h-3 rounded-sm" :class="levelColors[i - 1]" />
      </div>
      <span>More</span>
    </div>
  </div>
</template>
