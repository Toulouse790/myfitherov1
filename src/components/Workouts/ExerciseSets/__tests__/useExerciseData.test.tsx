import { renderHook, waitFor } from '@testing-library/react';
import { useExerciseData } from '@/hooks/use-exercise-data';
import { supabase } from '@/integrations/supabase/client';
import { vi } from 'vitest';

// Mock de Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        in: vi.fn(() => ({
          data: [
            { id: '1', name: 'Exercise 1' },
            { id: '2', name: 'Exercise 2' }
          ],
          error: null
        }))
      }))
    }))
  }
}));

// Mock du hook toast
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn()
  })
}));

describe('useExerciseData', () => {
  it('devrait gérer correctement les IDs valides', async () => {
    const { result } = renderHook(() => useExerciseData(['1', '2']));

    await waitFor(() => {
      expect(result.current.exerciseNames).toEqual({
        '1': 'Exercise 1',
        '2': 'Exercise 2'
      });
    });
  });

  it('devrait gérer les IDs invalides', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    renderHook(() => useExerciseData([undefined, null, '']));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('No valid exercise IDs found');
    });
  });

  it('devrait gérer un tableau vide', async () => {
    const consoleSpy = vi.spyOn(console, 'log');
    
    renderHook(() => useExerciseData([]));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('No exercise IDs provided');
    });
  });
});