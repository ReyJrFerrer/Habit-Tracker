import type { Habit } from '@/types/habit.types';

export function mockHabit(overrides?: Partial<Habit>): Habit {
  return {
    id: 'mock-id',
    userId: 'mock-user',
    title: 'Test Habit',
    description: 'Test description',
    icon: '🧪',
    color: '#000000',
    frequency: { type: 'daily' },
    reminderTime: null,
    sortOrder: 0,
    category: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    archivedAt: null,
    ...overrides
  };
}
