export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'custom' | 'anytime';

export interface HabitFrequency {
  type: FrequencyType;
  days?: number[];        // 0-6 for weekly, 1-31 for monthly
  interval?: number;      // For custom: every N days
  target?: number;        // Target completions per period
}

export interface Habit {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  reminderTime: string | null;
  sortOrder: number;
  category: string | null;
  createdAt: Date;
  updatedAt: Date;
  archivedAt: Date | null;
}

export interface Completion {
  id: string;
  habitId: string;
  userId: string;
  completedAt: Date;
  notes: string | null;
}

export interface HabitInput extends Omit<Habit, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'archivedAt'> {}
