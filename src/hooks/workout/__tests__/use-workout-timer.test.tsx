
import { renderHook, act } from '@testing-library/react';
import { useWorkoutTimer } from '../use-workout-timer';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

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
    // Nous supprimons la vérification de isPaused car cette propriété n'existe pas
  });

  it('should start timer correctly', () => {
    const { result } = renderHook(() => useWorkoutTimer());
    
    act(() => {
      result.current.startTimer();
    });
    
    expect(result.current.isRunning).toBe(true);
    // Nous supprimons la vérification de isPaused car cette propriété n'existe pas
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

  it('should stop timer correctly', () => {
    const { result } = renderHook(() => useWorkoutTimer());
    
    // Démarrer le timer
    act(() => {
      result.current.startTimer();
    });
    
    // Avancer de 2 secondes
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    // Arrêter le timer
    act(() => {
      result.current.stopTimer();
    });
    
    expect(result.current.isRunning).toBe(false);
    expect(result.current.duration).toBe(2);
    
    // La durée ne devrait pas augmenter après l'arrêt
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(result.current.duration).toBe(2);
  });

  it('should not increment when timer is stopped', () => {
    const { result } = renderHook(() => useWorkoutTimer());
    
    // S'assurer que le timer est arrêté
    act(() => {
      result.current.stopTimer();
    });
    
    act(() => {
      vi.advanceTimersByTime(3000);
    });
    
    expect(result.current.duration).toBe(0);
  });

  it('should reset timer correctly', () => {
    const { result } = renderHook(() => useWorkoutTimer());
    
    // Démarrer et avancer le timer
    act(() => {
      result.current.startTimer();
    });
    
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    
    expect(result.current.duration).toBe(5);
    
    // Réinitialiser le timer
    act(() => {
      result.current.resetTimer();
    });
    
    expect(result.current.duration).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it('should allow manual isRunning state control via setIsRunning', () => {
    const { result } = renderHook(() => useWorkoutTimer());
    
    act(() => {
      result.current.setIsRunning(true);
    });
    
    expect(result.current.isRunning).toBe(true);
    
    act(() => {
      vi.advanceTimersByTime(2000);
    });
    
    expect(result.current.duration).toBe(2);
    
    act(() => {
      result.current.setIsRunning(false);
    });
    
    expect(result.current.isRunning).toBe(false);
  });
});
