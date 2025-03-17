
import { renderHook, act } from '@testing-library/react';
import { useWorkoutTimer } from '../use-workout-timer';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('useWorkoutTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useWorkoutTimer());
    
    expect(result.current.duration).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(false);
  });

  it('should start timer correctly', () => {
    const { result } = renderHook(() => useWorkoutTimer());
    
    act(() => {
      result.current.startTimer();
    });
    
    expect(result.current.isRunning).toBe(true);
    expect(result.current.isPaused).toBe(false);
  });

  it('should increment duration when timer is running', () => {
    const { result } = renderHook(() => useWorkoutTimer());
    
    act(() => {
      result.current.startTimer();
    });
    
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(result.current.duration).toBe(3);
  });

  it('should pause timer correctly', () => {
    const { result } = renderHook(() => useWorkoutTimer());
    
    act(() => {
      result.current.startTimer();
    });
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    act(() => {
      result.current.pauseTimer();
    });
    
    expect(result.current.isPaused).toBe(true);
    
    // Duration should not increase while paused
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(result.current.duration).toBe(2);
  });

  it('should resume timer correctly', () => {
    const { result } = renderHook(() => useWorkoutTimer());
    
    act(() => {
      result.current.startTimer();
    });
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    act(() => {
      result.current.pauseTimer();
    });
    
    act(() => {
      result.current.resumeTimer();
    });
    
    expect(result.current.isPaused).toBe(false);
    
    // Duration should increase after resuming
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(result.current.duration).toBe(5);
  });

  it('should reset timer correctly', () => {
    const { result } = renderHook(() => useWorkoutTimer());
    
    act(() => {
      result.current.startTimer();
    });
    
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(result.current.duration).toBe(5);
    
    act(() => {
      result.current.resetTimer();
    });
    
    expect(result.current.duration).toBe(0);
    expect(result.current.isRunning).toBe(false);
    expect(result.current.isPaused).toBe(false);
  });
});
