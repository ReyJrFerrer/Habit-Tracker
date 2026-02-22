import type { Habit } from '@/types/habit.types';

export function isHabitDueToday(habit: Habit): boolean {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayOfMonth = today.getDate();
  
  switch (habit.frequency.type) {
    case 'daily':
      return true;
    case 'weekly':
      return habit.frequency.days?.includes(dayOfWeek) ?? false;
    case 'monthly':
      return habit.frequency.days?.includes(dayOfMonth) ?? false;
    case 'anytime':
      return true;
    default:
      return false;
  }
}
