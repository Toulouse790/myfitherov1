
import { renderHook } from '@testing-library/react';
import { useWorkoutSession } from '../use-workout-session';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('@tanstack/react-query', () => ({
  useQuery: ({ queryFn }) => {
    if (queryFn) {
      return { 
        data: { id: 'test-session', status: 'in_progress' }, 
        isLoading: false 
      };
    }
    return { data: null, isLoading: false };
  }
}));

vi.mock('../use-workout-exercises', () => ({
  useWorkoutExercises: () => ({
    exercises: ['Squat', 'Bench Press', 'Deadlift'],
    isLoading: false
  })
}));

vi.mock('@/hooks/use-auth', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

describe('useWorkoutSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return session data and exercises correctly', () => {
    const { result } = renderHook(() => useWorkoutSession('test-session-id'));
    
    expect(result.current.session).toEqual({ id: 'test-session', status: 'in_progress' });
    expect(result.current.exercises).toEqual(['Squat', 'Bench Press', 'Deadlift']);
    expect(result.current.isLoading).toBe(false);
  });

  it('should handle undefined sessionId correctly', () => {
    const { result } = renderHook(() => useWorkoutSession(undefined));
    
    // When sessionId is undefined, session should be null
    expect(result.current.session).toBe(null);
    expect(result.current.exercises).toEqual(['Squat', 'Bench Press', 'Deadlift']);
    expect(result.current.isLoading).toBe(false);
  });
});
