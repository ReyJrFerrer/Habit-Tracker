import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { Habit, Completion, HabitInput } from '@/types/habit.types';
import { isHabitDueToday } from '@/lib/utils/frequency';
import { startOfDay } from 'date-fns';

export const useHabitStore = defineStore('habit', () => {
  // State
  const habits = ref<Habit[]>([]);
  const completions = ref<Completion[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Getters
  const activeHabits = computed(() => 
    habits.value.filter(h => !h.archivedAt).sort((a, b) => a.sortOrder - b.sortOrder)
  );

  const habitsDueToday = computed(() => 
    activeHabits.value.filter(isHabitDueToday)
  );

  // Actions
  function getHabitCompletions(habitId: string) {
    return completions.value.filter(c => c.habitId === habitId);
  }

  function isHabitCompletedToday(habitId: string) {
    const today = startOfDay(new Date());
    return completions.value.some(c => 
      c.habitId === habitId && startOfDay(c.completedAt).getTime() === today.getTime()
    );
  }

  async function createHabit(data: HabitInput) {
    loading.value = true;
    try {
      const newHabit: Habit = {
        ...data,
        id: crypto.randomUUID(),
        userId: 'temp-user', // Will be replaced by actual user ID from auth
        createdAt: new Date(),
        updatedAt: new Date(),
        archivedAt: null
      };
      habits.value.push(newHabit);
      return newHabit;
    } catch (e) {
      error.value = (e as Error).message;
    } finally {
      loading.value = false;
    }
  }

  async function completeHabit(habitId: string) {
    if (isHabitCompletedToday(habitId)) return;
    
    const newCompletion: Completion = {
      id: crypto.randomUUID(),
      habitId,
      userId: 'temp-user',
      completedAt: new Date(),
      notes: null
    };
    completions.value.push(newCompletion);
  }

  // Load some dummy data for MVP display
  function loadMockData() {
    if (habits.value.length === 0) {
      const h1: Habit = {
        id: '1',
        userId: 'u1',
        title: 'Morning Workout',
        description: '30 mins of cardio',
        icon: '🏋️',
        color: '#a78bfa',
        frequency: { type: 'daily' },
        reminderTime: null,
        sortOrder: 0,
        category: 'Health',
        createdAt: new Date(),
        updatedAt: new Date(),
        archivedAt: null
      };
      const h2: Habit = {
        id: '2',
        userId: 'u1',
        title: 'Read a Book',
        description: 'Read 20 pages',
        icon: '📚',
        color: '#34d399',
        frequency: { type: 'daily' },
        reminderTime: null,
        sortOrder: 1,
        category: 'Education',
        createdAt: new Date(),
        updatedAt: new Date(),
        archivedAt: null
      };
      habits.value.push(h1, h2);
    }
  }

  return {
    habits,
    completions,
    loading,
    error,
    activeHabits,
    habitsDueToday,
    getHabitCompletions,
    isHabitCompletedToday,
    createHabit,
    completeHabit,
    loadMockData
  };
});
