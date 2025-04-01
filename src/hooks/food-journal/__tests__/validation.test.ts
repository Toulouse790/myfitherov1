
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useFoodValidation, validateNumericInput } from '../validation';
import { useToast } from '@/hooks/use-toast';
import { type Toast } from "@/components/ui/toast";

// Mock useToast hook
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
    dismiss: vi.fn(),
    toasts: []
  })
}));

describe('validateNumericInput', () => {
  it('should validate a positive number correctly', () => {
    const result = validateNumericInput(10, 'calories');
    expect(result.isValid).toBe(true);
    expect(result.value).toBe(10);
  });

  it('should handle string numeric inputs', () => {
    const result = validateNumericInput('20', 'proteins');
    expect(result.isValid).toBe(true);
    expect(result.value).toBe(20);
  });

  it('should reject negative values', () => {
    const result = validateNumericInput(-5, 'fats');
    expect(result.isValid).toBe(false);
    expect(result.message).toContain('ne peut pas être négative');
  });

  it('should reject non-numeric inputs', () => {
    const result = validateNumericInput('abc', 'carbs');
    expect(result.isValid).toBe(false);
    expect(result.message).toContain("n'est pas un nombre valide");
  });
});

describe('useFoodValidation', () => {
  let validation: ReturnType<typeof useFoodValidation>;
  let toastSpy: any;

  beforeEach(() => {
    toastSpy = vi.fn();
    vi.mocked(useToast).mockReturnValue({ toast: toastSpy, dismiss: vi.fn(), toasts: [] });
    validation = useFoodValidation();
  });

  it('should validate a valid food entry', () => {
    const result = validation.validateFoodEntry('Apple', 52, 0.3, 14, 0.2);
    expect(result).toBe(true);
    expect(toastSpy).not.toHaveBeenCalled();
  });

  it('should reject an entry with empty food name', () => {
    const result = validation.validateFoodEntry('', 52, 0.3, 14, 0.2);
    expect(result).toBe(false);
    expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Erreur de validation',
      variant: 'destructive'
    }));
  });

  it('should reject an entry with invalid calorie value', () => {
    const result = validation.validateFoodEntry('Apple', -52, 0.3, 14, 0.2);
    expect(result).toBe(false);
    expect(toastSpy).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Erreur de validation',
      variant: 'destructive'
    }));
  });
});
