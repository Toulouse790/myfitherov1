
import { renderHook, act } from '@testing-library/react';
import { useSessionActions } from '../use-session-actions';
import { supabase } from '@/integrations/supabase/client';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock necessary dependencies
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn()
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: { id: 'test-user-id' }
  })
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'profile-id' }, error: null }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({ data: { id: 'new-session-id' }, error: null }))
        }))
      })),
      update: vi.fn(() => ({
        eq: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null }))
        }))
      }))
    }))
  }
}));

vi.mock('@/utils/debug-logger', () => ({
  debugLogger: {
    log: vi.fn(),
    error: vi.fn(),
    warn: vi.fn()
  }
}));

// Mock window.location
const originalLocation = window.location;
beforeEach(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: { pathname: '/workouts/test-session-id' }
  });
});

afterEach(() => {
  Object.defineProperty(window, 'location', {
    configurable: true,
    value: originalLocation
  });
});

describe('useSessionActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create a workout session successfully', async () => {
    const { result } = renderHook(() => useSessionActions());
    
    await act(async () => {
      await result.current.createWorkoutSession(["Squats", "Push-ups"]);
    });
    
    // Verify Supabase calls
    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(supabase.from).toHaveBeenCalledWith('workout_sessions');
  });

  it('should handle confirm end workout correctly', async () => {
    const { result } = renderHook(() => useSessionActions());
    
    await act(async () => {
      await result.current.handleConfirmEndWorkout('medium', 300, ['chest', 'back']);
    });
    
    // Verify Supabase update call
    expect(supabase.from).toHaveBeenCalledWith('workout_sessions');
  });
});
