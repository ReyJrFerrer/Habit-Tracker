import { startOfDay, differenceInDays, isToday, isYesterday } from 'date-fns';
import type { Completion } from '@/types/habit.types';

export interface HeatmapCell {
  date: string;
  count: number;
}

export interface StreakData {
  current: number;
  longest: number;
  completionRate: number;
  heatmapData: HeatmapCell[];
}

export function calculateCompletionRate(completions: Completion[]): number {
  if (completions.length === 0) return 0;
  // Simplified for MVP: returning percentage based on some baseline or just total count
  return completions.length; // placeholder
}

export function generateHeatmapData(completions: Completion[]): HeatmapCell[] {
  const data: Record<string, number> = {};
  for (const c of completions) {
    const dStr = startOfDay(c.completedAt).toISOString().split('T')[0] as string;
    const current = data[dStr] || 0;
    data[dStr] = current + 1;
  }
  return Object.keys(data).map(date => ({ date, count: data[date] as number }));
}

export function calculateStreak(completions: Completion[]): StreakData {
  if (!completions || completions.length === 0) {
    return {
      current: 0,
      longest: 0,
      completionRate: 0,
      heatmapData: []
    };
  }

  const sortedCompletions = [...completions].sort((a, b) => 
    b.completedAt.getTime() - a.completedAt.getTime()
  );
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  let lastDate: Date | null = null;
  
  for (const completion of sortedCompletions) {
    const currentDate = startOfDay(completion.completedAt);
    
    if (lastDate) {
      const daysDiff = differenceInDays(lastDate, currentDate);
      
      if (daysDiff === 1) {
        tempStreak++;
      } else if (daysDiff > 1) {
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
      }
    } else {
      tempStreak = 1;
    }
    
    lastDate = currentDate;
  }
  
  currentStreak = lastDate && (isToday(lastDate) || isYesterday(lastDate)) ? tempStreak : 0;
  longestStreak = Math.max(longestStreak, tempStreak);
  
  return {
    current: currentStreak,
    longest: longestStreak,
    completionRate: calculateCompletionRate(completions),
    heatmapData: generateHeatmapData(completions),
  };
}
