
import { renderHook, act } from '@testing-library/react';
import { useWorkoutExercisesState } from '../use-workout-exercises-state';
import { supabase } from '@/integrations/supabase/client';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => ({
            single: vi.fn(() => Promise.resolve({ data: { exercises: ['Squat', 'Deadlift'], status: 'in_progress' }, error: null }))
          }))
        }))
      }))
    }))
  }
}));

// Mock AuthContext
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

describe('useWorkoutExercisesState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with default state values', () => {
    const { result } = renderHook(() => useWorkoutExercisesState());
    
    expect(result.current.exercises).toEqual([]);
    expect(result.current.currentExerciseIndex).toBe(0);
    expect(result.current.workoutStarted).toBe(false);
  });

  it('should handle exercise click correctly', () => {
    const { result } = renderHook(() => useWorkoutExercisesState());
    
    act(() => {
      result.current.handleExerciseClick(2);
    });
    
    expect(result.current.currentExerciseIndex).toBe(2);
  });

  it('should fetch session exercises successfully', async () => {
    const { result } = renderHook(() => useWorkoutExercisesState());
    
    await act(async () => {
      await result.current.fetchSessionExercises('test-session-id');
    });
    
    expect(result.current.exercises).toEqual(['Squat', 'Deadlift']);
    expect(result.current.workoutStarted).toBe(true);
    expect(supabase.from).toHaveBeenCalledWith('workout_sessions');
  });
});
