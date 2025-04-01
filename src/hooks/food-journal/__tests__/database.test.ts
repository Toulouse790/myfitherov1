
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { loadFoodEntries, addFoodEntry, deleteFoodEntry, checkDuplicateEntry } from '../database';
import { supabase } from '@/integrations/supabase/client';

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(),
          gte: vi.fn(() => ({
            lte: vi.fn()
          }))
        }))
      })),
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      })),
      delete: vi.fn(() => ({
        eq: vi.fn()
      }))
    }))
  }
}));

describe('Food Journal Database Functions', () => {
  beforeEach(() => {
    // Reset supabase mocks
    vi.mocked(supabase.auth.getUser).mockReset();
    vi.mocked(supabase.from).mockReset();
  });

  describe('loadFoodEntries', () => {
    it('should throw an error if no user is authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null
      } as any);
      
      await expect(loadFoodEntries()).rejects.toThrow('Vous devez être connecté');
    });

    it('should return food entries if successful', async () => {
      // Mock authenticated user
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null
      } as any);
      
      // Mock successful entries fetch
      const mockEntries = [
        { id: 'entry-1', name: 'Apple', calories: 52 },
        { id: 'entry-2', name: 'Banana', calories: 89 }
      ];
      
      const mockOrder = vi.fn().mockResolvedValue({
        data: mockEntries,
        error: null
      });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: mockOrder
          })
        })
      } as any);
      
      const result = await loadFoodEntries();
      expect(result).toEqual(mockEntries);
    });

    it('should throw an error if database query fails', async () => {
      // Mock authenticated user
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: { id: 'user-123' } },
        error: null
      } as any);
      
      // Mock database error
      const mockOrder = vi.fn().mockResolvedValue({
        data: null,
        error: new Error('Database error')
      });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: mockOrder
          })
        })
      } as any);
      
      await expect(loadFoodEntries()).rejects.toThrow();
    });
  });

  // Tests for addFoodEntry, deleteFoodEntry, and checkDuplicateEntry would follow a similar pattern
  // I'm including just one more as an example
  
  describe('addFoodEntry', () => {
    it('should throw an error if no user is authenticated', async () => {
      vi.mocked(supabase.auth.getUser).mockResolvedValue({
        data: { user: null },
        error: null
      } as any);
      
      const entry = {
        name: 'Apple',
        calories: 52,
        proteins: 0.3,
        carbs: 14,
        fats: 0.2,
        mealType: 'breakfast'
      };
      
      await expect(addFoodEntry(entry)).rejects.toThrow('Vous devez être connecté');
    });
  });
});
