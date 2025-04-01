
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFoodJournal } from '../use-food-journal';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { 
  loadFoodEntries, 
  addFoodEntry, 
  deleteFoodEntry, 
  checkDuplicateEntry
} from '../database';
import { useFoodValidation } from '../validation';
import { useBarcodeScan } from '../use-barcode-scan';
import { useFoodInput } from '../use-food-input';

// Mock all dependencies
vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn()
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn()
}));

vi.mock('../database', () => ({
  loadFoodEntries: vi.fn(),
  addFoodEntry: vi.fn(),
  deleteFoodEntry: vi.fn(),
  checkDuplicateEntry: vi.fn()
}));

vi.mock('../validation', () => ({
  useFoodValidation: vi.fn()
}));

vi.mock('../use-barcode-scan', () => ({
  useBarcodeScan: vi.fn()
}));

vi.mock('../use-food-input', () => ({
  useFoodInput: vi.fn()
}));

describe('useFoodJournal', () => {
  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Setup default mocks
    vi.mocked(useToast).mockReturnValue({ toast: vi.fn() });
    vi.mocked(useFoodValidation).mockReturnValue({ validateFoodEntry: vi.fn().mockReturnValue(true) });
    vi.mocked(useBarcodeScan).mockReturnValue({ handleBarcodeScan: vi.fn() });
    vi.mocked(useFoodInput).mockReturnValue({
      newFood: 'Apple',
      calories: 52,
      proteins: 0.3,
      carbs: 14,
      fats: 0.2,
      weight: 100,
      notes: '',
      baseCalories: 100,
      selectedCategory: null,
      filteredFoods: [],
      setNewFood: vi.fn(),
      setCalories: vi.fn(),
      setProteins: vi.fn(),
      setCarbs: vi.fn(),
      setFats: vi.fn(),
      setWeight: vi.fn(),
      setNotes: vi.fn(),
      setSelectedCategory: vi.fn(),
      setFilteredFoods: vi.fn()
    });
    
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: vi.fn()
    } as any);
  });

  it('should return an object with the expected properties', () => {
    const { result } = renderHook(() => useFoodJournal());
    
    expect(result.current).toHaveProperty('newFood');
    expect(result.current).toHaveProperty('calories');
    expect(result.current).toHaveProperty('handleAddEntry');
    expect(result.current).toHaveProperty('handleDeleteEntry');
    expect(result.current).toHaveProperty('handleBarcodeScan');
    expect(result.current).toHaveProperty('entries');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('isError');
    expect(result.current).toHaveProperty('refetchEntries');
  });

  it('should call validateFoodEntry when adding an entry', async () => {
    const mockValidateFoodEntry = vi.fn().mockReturnValue(true);
    vi.mocked(useFoodValidation).mockReturnValue({ validateFoodEntry: mockValidateFoodEntry });
    
    const { result } = renderHook(() => useFoodJournal());
    
    await act(async () => {
      await result.current.handleAddEntry('breakfast');
    });
    
    expect(mockValidateFoodEntry).toHaveBeenCalled();
  });

  it('should call addFoodEntry and refetchEntries when adding a valid entry', async () => {
    const mockAddFoodEntry = vi.fn().mockResolvedValue({ id: 'entry-123' });
    const mockRefetch = vi.fn();
    vi.mocked(addFoodEntry).mockImplementation(mockAddFoodEntry);
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: mockRefetch
    } as any);
    
    const { result } = renderHook(() => useFoodJournal());
    
    await act(async () => {
      await result.current.handleAddEntry('breakfast');
    });
    
    expect(mockAddFoodEntry).toHaveBeenCalled();
    expect(mockRefetch).toHaveBeenCalled();
  });

  it('should call deleteFoodEntry and refetchEntries when deleting an entry', async () => {
    const mockDeleteFoodEntry = vi.fn().mockResolvedValue(undefined);
    const mockRefetch = vi.fn();
    vi.mocked(deleteFoodEntry).mockImplementation(mockDeleteFoodEntry);
    vi.mocked(useQuery).mockReturnValue({
      data: [],
      isLoading: false,
      isError: false,
      refetch: mockRefetch
    } as any);
    
    const { result } = renderHook(() => useFoodJournal());
    
    await act(async () => {
      await result.current.handleDeleteEntry('entry-123');
    });
    
    expect(mockDeleteFoodEntry).toHaveBeenCalledWith('entry-123');
    expect(mockRefetch).toHaveBeenCalled();
  });
});
