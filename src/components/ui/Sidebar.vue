<script setup lang="ts">
import {
  HomeIcon,
  ChartBarIcon,
  CalendarIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  FolderIcon
} from '@heroicons/vue/24/outline';

interface NavItem {
  name: string;
  icon: typeof HomeIcon;
  active?: boolean;
}

const navItems: NavItem[] = [
  { name: 'Dashboard', icon: HomeIcon, active: true },
  { name: 'Habits', icon: FolderIcon },
  { name: 'Analytics', icon: ChartBarIcon },
  { name: 'Calendar', icon: CalendarIcon },
];
</script>

<template>
  <aside class="w-64 min-h-screen bg-black/20 backdrop-blur-xl border-r border-white/10 flex flex-col">
    <div class="p-6">
      <h1 class="text-xl font-bold text-white flex items-center gap-2">
        <span class="w-8 h-8 rounded-lg bg-accent-primary/20 flex items-center justify-center">
          <ChartBarIcon class="w-5 h-5 text-accent-primary" />
        </span>
        HabitFlow
      </h1>
    </div>

    <nav class="flex-1 px-3">
      <ul class="space-y-1">
        <li v-for="item in navItems" :key="item.name">
          <a
            href="#"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200"
            :class="item.active 
              ? 'bg-accent-primary/20 text-accent-primary' 
              : 'text-text-secondary hover:text-white hover:bg-white/5'"
          >
            <component :is="item.icon" class="w-5 h-5" />
            {{ item.name }}
          </a>
        </li>
      </ul>

      <div class="mt-8 px-3">
        <button
          class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-accent-primary/20 text-accent-primary text-sm font-medium hover:bg-accent-primary/30 transition-all duration-200"
        >
          <PlusCircleIcon class="w-5 h-5" />
          New Habit
        </button>
      </div>
    </nav>

    <div class="p-3 border-t border-white/10">
      <a
        href="#"
        class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-white hover:bg-white/5 transition-all duration-200"
      >
        <Cog6ToothIcon class="w-5 h-5" />
        <span class="text-sm font-medium">Settings</span>
      </a>
    </div>
  </aside>
</template>
