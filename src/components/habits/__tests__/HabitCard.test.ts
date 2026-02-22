import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createTestingPinia } from '@pinia/testing';
import HabitCard from '../HabitCard.vue';
import { mockHabit } from '@/test/mocks';
import { useHabitStore } from '@/stores/habitStore';

describe('HabitCard', () => {
  beforeEach(() => {
    // Reset vi mocks
    vi.clearAllMocks();
  });

  it('displays habit information correctly', () => {
    const habit = mockHabit({ title: 'Exercise' });
    const wrapper = mount(HabitCard, {
      props: { habit },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      }
    });
    
    expect(wrapper.text()).toContain('Exercise');
  });
  
  it('emits complete event when complete button clicked', async () => {
    const habit = mockHabit();
    const wrapper = mount(HabitCard, {
      props: { habit },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn, stubActions: false })],
      }
    });
    
    const store = useHabitStore();
    // Simulate habit not completed yet
    vi.mocked(store.isHabitCompletedToday).mockReturnValue(false);

    await wrapper.find('button[aria-label="complete"]').trigger('click');
    expect(wrapper.emitted('complete')).toBeTruthy();
    expect(wrapper.emitted('complete')?.[0]).toEqual([habit.id]);
  });
  
  it('applies glass morphism styles', () => {
    const habit = mockHabit();
    const wrapper = mount(HabitCard, {
      props: { habit },
      global: {
        plugins: [createTestingPinia({ createSpy: vi.fn })],
      }
    });
    
    expect(wrapper.classes()).toContain('glass-card');
    expect(wrapper.classes()).toContain('backdrop-blur-xl');
  });
});
