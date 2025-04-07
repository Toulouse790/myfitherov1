
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useBarcodeScan } from '../use-barcode-scan';
import { supabase } from '@/integrations/supabase/client';

// Mock supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      getUser: vi.fn()
    },
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn()
        }))
      }))
    }))
  }
}));

describe('useBarcodeScan', () => {
  let originalRandom: typeof Math.random;
  
  beforeEach(() => {
    originalRandom = Math.random;
    // Mock Math.random to always return 0.5 for deterministic testing
    Math.random = vi.fn(() => 0.5);
    
    // Reset supabase mocks
    vi.mocked(supabase.auth.getUser).mockReset();
    vi.mocked(supabase.from).mockReset();
  });

  afterEach(() => {
    Math.random = originalRandom;
  });

  it('should return null if no user is authenticated', async () => {
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: null },
      error: null
    } as any);
    
    const { handleBarcodeScan } = useBarcodeScan();
    const result = await handleBarcodeScan('123456789');
    
    expect(result).toBeNull();
  });

  it('should return a FoodEntry object if successful', async () => {
    // Mock authenticated user
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null
    } as any);
    
    // Mock successful database insertion
    const mockInsertResult = {
      id: 'entry-123',
      name: 'Produit 1234',
      calories: 300,
      proteins: 15,
      carbs: 25,
      fats: 10,
      meal_type: 'snack',
      notes: 'Scanné via code-barres: 1234567890'
    };
    
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: mockInsertResult,
            error: null
          })
        })
      })
    } as any);
    
    const { handleBarcodeScan } = useBarcodeScan();
    const result = await handleBarcodeScan('1234567890');
    
    expect(result).not.toBeNull();
    expect(result?.name).toBe('Produit 1234');
    expect(result?.calories).toBeGreaterThan(0);
    expect(result?.mealType).toBe('snack');
  });

  it('should handle database errors gracefully', async () => {
    // Mock authenticated user
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null
    } as any);
    
    // Mock database error
    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({
            data: null,
            error: new Error('Database error')
          })
        })
      })
    } as any);
    
    const { handleBarcodeScan } = useBarcodeScan();
    const result = await handleBarcodeScan('1234567890');
    
    expect(result).toBeNull();
  });
  
  it('should handle network errors when scanning', async () => {
    // Mock authenticated user
    vi.mocked(supabase.auth.getUser).mockResolvedValue({
      data: { user: { id: 'user-123' } },
      error: null
    } as any);
    
    // Mock network error
    vi.mocked(supabase.from).mockImplementation(() => {
      throw new Error('Network error');
    });
    
    const { handleBarcodeScan } = useBarcodeScan();
    const result = await handleBarcodeScan('1234567890');
    
    expect(result).toBeNull();
  });
});
