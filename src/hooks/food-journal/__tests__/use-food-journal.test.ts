
import { describe, expect, it, vi, beforeEach } from 'vitest';
import { useFoodJournal } from '../use-food-journal';
import { useToast } from '@/hooks/use-toast';
import { useFoodValidation } from '../validation';
import { useFoodInput } from '../use-food-input';
import { useBarcodeScan } from '../use-barcode-scan';
import { loadFoodEntries, addFoodEntry, deleteFoodEntry, checkDuplicateEntry } from '../database';

// Mock les hooks et fonctions
vi.mock('@/hooks/use-toast', () => ({
  useToast: vi.fn()
}));

vi.mock('../validation', () => ({
  useFoodValidation: vi.fn(),
  validateNumericInput: vi.fn((val) => ({ isValid: true, value: Number(val) }))
}));

vi.mock('../use-food-input', () => ({
  useFoodInput: vi.fn()
}));

vi.mock('../use-barcode-scan', () => ({
  useBarcodeScan: vi.fn()
}));

vi.mock('../database', () => ({
  loadFoodEntries: vi.fn(),
  addFoodEntry: vi.fn(),
  deleteFoodEntry: vi.fn(),
  checkDuplicateEntry: vi.fn()
}));

vi.mock('@tanstack/react-query', () => ({
  useQuery: vi.fn(() => ({
    data: [],
    isLoading: false,
    isError: false,
    refetch: vi.fn()
  }))
}));

describe('useFoodJournal', () => {
  let mockToast: any;
  let mockValidation: any;
  let mockFoodInput: any;
  let mockBarcodeScan: any;
  let mockRefetch: any;

  beforeEach(() => {
    mockToast = { toast: vi.fn(), dismiss: vi.fn(), toasts: [] };
    mockValidation = { 
      validateFoodEntry: vi.fn(), 
      validateNumericInput: vi.fn((val) => ({ isValid: true, value: Number(val) }))
    };
    mockRefetch = vi.fn();
    mockBarcodeScan = { handleBarcodeScan: vi.fn() };
    mockFoodInput = {
      newFood: 'Test Food',
      calories: 100,
      proteins: 10,
      carbs: 20,
      fats: 5,
      weight: 100,
      notes: '',
      baseCalories: 100,
      selectedCategory: '',
      filteredFoods: [],
      setNewFood: vi.fn(),
      setCalories: vi.fn(),
      setProteins: vi.fn(),
      setCarbs: vi.fn(),
      setFats: vi.fn(),
      setWeight: vi.fn(),
      setNotes: vi.fn(),
      setSelectedCategory: vi.fn(),
      setBaseCalories: vi.fn(),
      setFilteredFoods: vi.fn()
    };

    vi.mocked(useToast).mockReturnValue(mockToast);
    vi.mocked(useFoodValidation).mockReturnValue(mockValidation);
    vi.mocked(useFoodInput).mockReturnValue(mockFoodInput);
    vi.mocked(useBarcodeScan).mockReturnValue(mockBarcodeScan);
  });

  it('should add a food entry successfully', async () => {
    // Setup
    mockValidation.validateFoodEntry.mockReturnValue(true);
    vi.mocked(checkDuplicateEntry).mockResolvedValue(false);
    vi.mocked(addFoodEntry).mockResolvedValue({ id: '123', name: 'Test Food' });

    // Execute
    const { handleAddEntry } = useFoodJournal();
    const result = await handleAddEntry('lunch');

    // Verify
    expect(mockValidation.validateFoodEntry).toHaveBeenCalled();
    expect(checkDuplicateEntry).toHaveBeenCalledWith('Test Food', 'lunch');
    expect(addFoodEntry).toHaveBeenCalled();
    expect(mockToast.toast).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Succès',
      variant: 'default'
    }));
    expect(result).not.toBeNull();
  });

  it('should validate input before adding entry', async () => {
    // Setup
    mockValidation.validateFoodEntry.mockReturnValue(false);

    // Execute
    const { handleAddEntry } = useFoodJournal();
    const result = await handleAddEntry('lunch');

    // Verify
    expect(mockValidation.validateFoodEntry).toHaveBeenCalled();
    expect(addFoodEntry).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });
});
