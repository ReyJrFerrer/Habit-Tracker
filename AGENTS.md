# AGENTS.md - Habit Tracker

> AI-assisted development guide for building a glass morphism habit tracker with Trello-style flexibility, Tiimo intuitiveness, and Onrise simplicity.

## Project Overview

**Vision**: A progressive web app for habit tracking that combines streak visualization (GitHub-style), flexible card management (Trello-style), intuitive UX (Tiimo), and AI-powered habit creation.

**Tech Stack**:
- **Frontend**: Vue 3 with TypeScript (strict mode) and Composition API
- **Build Tool**: Bun (runtime and package manager)
- **Styling**: Tailwind CSS with custom glass morphism utilities
- **Backend**: Firebase (Authentication, Firestore, Cloud Functions)
- **Testing**: Vitest + Vue Testing Library (TDD approach)
- **Design**: Apple-inspired glass morphism with dark ombre backgrounds

**Target Platforms**: Web app first → Native mobile (Vue Native/Capacitor) → Desktop (Tauri)

**Prerequisites**: Bun is already installed in the system

## Architecture & Design Patterns

### System Architecture

- **Frontend**: Vue 3 SPA with component-driven architecture
- **State Management**: Pinia for global state management
- **Backend**: Firebase serverless architecture with Cloud Functions
- **Real-time Sync**: Firestore real-time listeners for cross-device updates
- **Build System**: Bun for fast package management and development server

## Code Standards & Conventions

### TypeScript Rules

- Use **strict TypeScript** - no `any` types without explicit justification
- Prefer `interface` for public APIs, `type` for unions/intersections
- Use explicit return types on all exported functions
- Enable `strictNullChecks` and handle `null`/`undefined` explicitly

**Example**:
```typescript
// ✅ Good
interface Habit {
  id: string;
  title: string;
  description: string | null;
  frequency: HabitFrequency;
  streak: number;
}

export async function createHabit(data: HabitInput): Promise<Habit> {
  // implementation
}

// ❌ Bad
function createHabit(data: any) {
  // implementation
}
```

### Vue Component Patterns

- Use **Composition API** with `<script setup>` syntax exclusively
- Follow **composition over inheritance**
- Keep components **small and focused** (max 200 lines)
- Use **composables** for shared logic
- Implement **error handling** with `onErrorCaptured`

**Component Structure**:
```vue
<!-- ✅ Good: Small, focused component -->
<script setup lang="ts">
import { useCompleteHabit } from '@/composables/useCompleteHabit';
import { useHabitStatus } from '@/composables/useHabitStatus';

interface Props {
  habit: Habit;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  complete: [habitId: string]
}>();

const { mutate } = useCompleteHabit();
const { streak, isCompleted } = useHabitStatus(props.habit);

const handleComplete = () => {
  mutate(props.habit.id);
  emit('complete', props.habit.id);
};
</script>

<template>
  <div class="glass-card">
    <HabitIcon :icon="habit.icon" />
    <HabitTitle>{{ habit.title }}</HabitTitle>
    <StreakDisplay :count="streak" />
    <CompleteButton @click="handleComplete" />
  </div>
</template>
```

```vue
<!-- ❌ Bad: God component -->
<script setup lang="ts">
// 500 lines of mixed concerns
</script>
```

### File Organization

```
src/
├── components/
│   ├── habits/           # Habit-specific components
│   │   ├── HabitCard.vue
│   │   ├── HabitList.vue
│   │   └── __tests__/
│   ├── streaks/          # Streak visualization
│   │   ├── StreakDisplay.vue
│   │   └── HeatmapChart.vue
│   └── ui/               # Reusable glass morphism components
│       ├── GlassCard.vue
│       ├── GlassButton.vue
│       └── GlassModal.vue
├── composables/          # Vue composables (shared logic)
│   ├── useHabits.ts
│   ├── useStreak.ts
│   └── useFirestore.ts
├── lib/
│   ├── firebase/         # Firebase config and helpers
│   └── utils/            # Utility functions
├── stores/               # Pinia stores
│   ├── habitStore.ts
│   └── uiStore.ts
├── types/                # TypeScript type definitions
│   ├── habit.types.ts
│   └── firebase.types.ts
└── views/                # Page-level components
    ├── HomeView.vue
    └── HabitDetailView.vue
```

## Design System - Glass Morphism

### Color Palette

**Dark Mode** (Primary):
```css
--bg-base: #0a0a0f;           /* Deep dark background */
--bg-gradient-start: #1a0f2e; /* Dark purple ombre */
--bg-gradient-end: #0a0a0f;   /* Deep black ombre */

--glass-bg: rgba(255, 255, 255, 0.05);
--glass-border: rgba(255, 255, 255, 0.1);
--glass-shadow: rgba(0, 0, 0, 0.3);

--accent-primary: #a78bfa;    /* Soft purple */
--accent-success: #34d399;    /* Emerald for streaks */
--accent-warning: #fbbf24;    /* Amber for warnings */
--text-primary: #f9fafb;      /* Off-white */
--text-secondary: rgba(249, 250, 251, 0.7);
```

### Glass Card Component

**Base Implementation**:
```vue
<!-- src/components/ui/GlassCard.vue -->
<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  variant?: 'default' | 'highlighted';
  class?: string;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default'
});

const cardClasses = computed(() => [
  'glass-card backdrop-blur-xl',
  'bg-white/5 border border-white/10',
  'rounded-2xl shadow-glass',
  'transition-all duration-300',
  'hover:bg-white/8 hover:border-white/20',
  props.variant === 'highlighted' && 'ring-2 ring-accent-primary/50',
  props.class
]);
</script>

<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'glass': {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.1)',
        },
      },
      backdropBlur: {
        'glass': '16px',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.3)',
      },
    },
  },
};
```

### Responsive Design

- **Mobile-first** design approach
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`
- Touch targets minimum 44x44px
- Test on Chrome DevTools device emulation

## Feature Implementation Guidelines

### Habit Frequency System

**Supported Frequencies**:

| Type | Description |
|------|-------------|
| Daily | Every day |
| Weekly | Custom days (M, T, W, Th, F, Sa, Su) |
| Monthly | Specific dates or nth day |
| Custom | User-defined intervals |
| Anytime | No schedule, complete when ready |

**Implementation**:
```typescript
// src/types/habit.types.ts
export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'custom' | 'anytime';

export interface HabitFrequency {
  type: FrequencyType;
  days?: number[];        // 0-6 for weekly, 1-31 for monthly
  interval?: number;      // For custom: every N days
  target?: number;        // Target completions per period
}

// src/lib/utils/frequency.ts
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
```

### Streak Calculation

**GitHub-style Contribution Graph**:

```typescript
// src/lib/utils/streak.ts
export interface StreakData {
  current: number;
  longest: number;
  completionRate: number;
  heatmapData: HeatmapCell[];
}

export function calculateStreak(completions: Completion[]): StreakData {
  const sortedCompletions = completions.sort((a, b) => 
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
  
  currentStreak = isToday(lastDate) || isYesterday(lastDate) ? tempStreak : 0;
  longestStreak = Math.max(longestStreak, tempStreak);
  
  return {
    current: currentStreak,
    longest: longestStreak,
    completionRate: calculateCompletionRate(completions),
    heatmapData: generateHeatmapData(completions),
  };
}
```

### Notification System

- Use **Firebase Cloud Messaging** for push notifications
- Implement **service worker** for web push
- Email reminders via **SendGrid** or **Firebase Extensions**
- Smart timing: avoid notification fatigue

**Implementation**:
```typescript
// src/lib/notifications/scheduler.ts
export async function scheduleHabitReminder(habit: Habit, userId: string) {
  const reminderTime = habit.reminderTime ?? getDefaultReminderTime(habit);
  
  await scheduleNotification({
    userId,
    habitId: habit.id,
    scheduledFor: reminderTime,
    type: 'reminder',
    payload: {
      title: `Time for: ${habit.title}`,
      body: habit.description ?? 'Don\'t break your streak!',
      icon: habit.icon,
      actions: [
        { action: 'complete', title: 'Mark Complete' },
        { action: 'snooze', title: 'Snooze 1hr' },
      ],
    },
  });
}
```

## Testing Strategy (TDD Approach)

### Test Structure

```
__tests__/
├── unit/
│   ├── components/
│   ├── composables/
│   └── utils/
├── integration/
│   └── habits/
└── e2e/
    └── user-flows/
```

### Testing Rules

1. **Write tests first** - Red → Green → Refactor
2. Test component behavior, not implementation
3. Use `data-testid` for test selectors, not class names
4. Mock Firebase calls in unit tests
5. Maintain 80%+ code coverage

**Component Test Example**:
```typescript
// src/components/habits/__tests__/HabitCard.test.ts
import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import HabitCard from '../HabitCard.vue';
import { mockHabit } from '@/test/mocks';

describe('HabitCard', () => {
  it('displays habit information correctly', () => {
    const habit = mockHabit({ title: 'Exercise', streak: 5 });
    const wrapper = mount(HabitCard, {
      props: { habit }
    });
    
    expect(wrapper.text()).toContain('Exercise');
    expect(wrapper.text()).toContain('5 day streak');
  });
  
  it('emits complete event when complete button clicked', async () => {
    const habit = mockHabit();
    const wrapper = mount(HabitCard, {
      props: { habit }
    });
    
    await wrapper.find('button[aria-label*="complete"]').trigger('click');
    expect(wrapper.emitted('complete')).toBeTruthy();
    expect(wrapper.emitted('complete')?.[0]).toEqual([habit.id]);
  });
  
  it('applies glass morphism styles', () => {
    const habit = mockHabit();
    const wrapper = mount(HabitCard, {
      props: { habit }
    });
    
    expect(wrapper.classes()).toContain('glass-card');
    expect(wrapper.classes()).toContain('backdrop-blur-xl');
  });
});
```

## Firebase Configuration

### Firestore Schema

**Collections Structure**:

| Collection | Document Structure |
|------------|-------------------|
| `users` | User profile and settings |
| `habits` | Habit definitions |
| `completions` | Completion records |

**Habit Document**:
```typescript
// Firestore: habits/{habitId}
{
  id: string;
  userId: string;
  title: string;
  description: string | null;
  icon: string;
  color: string;
  frequency: {
    type: 'daily' | 'weekly' | 'monthly' | 'custom' | 'anytime';
    days?: number[];
    interval?: number;
    target?: number;
  };
  reminderTime: string | null; // ISO time format
  sortOrder: number;
  category: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  archivedAt: Timestamp | null;
}
```

**Completion Document**:
```typescript
// Firestore: completions/{completionId}
{
  id: string;
  habitId: string;
  userId: string;
  completedAt: Timestamp;
  notes: string | null;
  location: GeoPoint | null;
}
```

### Security Rules

```javascript
// firestore.rules
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isOwner(userId) {
      return request.auth.uid == userId;
    }
    
    match /habits/{habitId} {
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow update, delete: if isAuthenticated() && isOwner(resource.data.userId);
    }
    
    match /completions/{completionId} {
      allow read: if isAuthenticated() && isOwner(resource.data.userId);
      allow create: if isAuthenticated() && isOwner(request.resource.data.userId);
      allow delete: if isAuthenticated() && isOwner(resource.data.userId);
    }
  }
}
```

## Performance Optimization

- Use **computed properties** and **memo** for expensive glass morphism calculations
- Implement **virtualization** for large habit lists (VueUse `useVirtualList`)
- Use **Firestore composite indexes** for queries
- Implement **offline persistence** with Firestore
- Leverage **Bun's speed** for fast hot module replacement

**Example Optimization**:
```vue
<!-- Virtualized habit list -->
<script setup lang="ts">
import { ref } from 'vue';
import { useVirtualList } from '@vueuse/core';
import type { Habit } from '@/types/habit.types';

interface Props {
  habits: Habit[];
}

const props = defineProps<Props>();

const { list, containerProps, wrapperProps } = useVirtualList(
  props.habits,
  {
    itemHeight: 120,
  }
);
</script>

<template>
  <div v-bind="containerProps" style="height: 600px">
    <div v-bind="wrapperProps">
      <HabitCard
        v-for="{ data: habit, index } in list"
        :key="habit.id"
        :habit="habit"
      />
    </div>
  </div>
</template>
```

## Build & Deployment

### Development Workflow

**Prerequisites**: Ensure Bun is installed (`bun --version` should return version number)

```bash
# Install dependencies (fast with Bun)
bun install

# Start dev server (Vite powered by Bun)
bun run dev

# Run tests (watch mode)
bun run test

# Run tests (CI mode)
bun run test:ci

# Type checking
bun run type-check

# Linting
bun run lint

# Build production
bun run build

# Preview production build
bun run preview
```

**Note**: Bun provides significantly faster package installation and script execution compared to npm/yarn.

### Environment Variables

```bash
# .env.local
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Deployment Pipeline

1. **Development**: Auto-deploy to Firebase Hosting preview channel on PR
2. **Staging**: Deploy to staging environment on merge to `develop`
3. **Production**: Deploy to production on merge to `main`

```yaml
# .github/workflows/deploy.yml
name: Deploy to Firebase
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      
      - run: bun install
      - run: bun run test:ci
      - run: bun run build
      
      - uses: FirebaseExtended/action-hosting-deploy@v0
        with:
          repoToken: '${{ secrets.GITHUB_TOKEN }}'
          firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT }}'
          channelId: live
          projectId: habit-tracker-app
```

## Common Patterns & Anti-Patterns

### Do's ✅

- Use glass morphism components from `src/components/ui/`
- Use `<script setup>` with TypeScript for all Vue components
- Use composables for shared logic instead of mixins
- Implement optimistic UI updates for habit completion
- Use Firestore batch writes for bulk operations
- Add loading states with glass skeleton components
- Handle offline mode gracefully with Firestore persistence
- Use TypeScript discriminated unions for complex types
- Leverage Bun's speed for development and testing

### Don'ts ❌

- Don't use `any` types - always define proper interfaces
- Don't create God components - keep them focused
- Don't use Options API - stick to Composition API
- Don't hardcode colors - use Tailwind classes or CSS variables
- Don't ignore accessibility - test with screen readers
- Don't use Vue 2 patterns - this is Vue 3 only
- Don't over-fetch data - use Firestore queries efficiently
- Don't ignore test coverage - maintain 80%+

## Troubleshooting & Common Issues

### Glass Morphism Not Rendering

**Issue**: Glass effect not visible on some browsers

**Solution**:
```css
/* Ensure backdrop-filter support */
.glass-card {
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px); /* Safari support */
}

/* Fallback for unsupported browsers */
@supports not (backdrop-filter: blur(16px)) {
  .glass-card {
    background: rgba(255, 255, 255, 0.15);
  }
}
```

### Firestore Query Performance

**Issue**: Slow habit list loading

**Solutions**:
```javascript
// Create composite index
// firestore.indexes.json
{
  "indexes": [
    {
      "collectionGroup": "habits",
      "queryScope": "COLLECTION",
      "fields": [
        { "fieldPath": "userId", "order": "ASCENDING" },
        { "fieldPath": "archivedAt", "order": "ASCENDING" },
        { "fieldPath": "sortOrder", "order": "ASCENDING" }
      ]
    }
  ]
}

// Optimized query
const habitsQuery = query(
  collection(db, 'habits'),
  where('userId', '==', userId),
  where('archivedAt', '==', null),
  orderBy('sortOrder', 'asc'),
  limit(50)
);
```

### Bun Compatibility Issues

**Issue**: Some packages not working with Bun

**Solution**:
```bash
# Use Node.js fallback for incompatible packages
bun install --backend=hardlink

# Or use npm for specific packages
npm install problematic-package
```

## Roadmap & Future Features

### Phase 1: MVP (Current)
- Basic habit CRUD operations
- Daily completion tracking
- Simple streak calculation
- Glass morphism UI

## Version History

- **v1.0.0** (2026-02-22): Initial AGENTS.md creation
  - Document covers: Architecture, code standards, testing, Firebase setup
  - Design system: Glass morphism with dark ombre backgrounds
  - Tech stack: Vue 3, TypeScript, Bun, Firebase

- **v1.1.0** (2026-02-22): Updated for Vue 3 and Bun
  - Removed AI agent architecture sections
  - Updated component patterns from React to Vue Composition API
  - Changed build system to Bun for faster development
  - Updated testing examples for Vue Testing Library
  - Revised file organization for Vue project structure