
import { describe, expect, it } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useFoodInput } from '../use-food-input';

describe('useFoodInput', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useFoodInput());
    
    expect(result.current.newFood).toBe('');
    expect(result.current.calories).toBe(0);
    expect(result.current.proteins).toBe(0);
    expect(result.current.carbs).toBe(0);
    expect(result.current.fats).toBe(0);
    expect(result.current.weight).toBe(100);
    expect(result.current.notes).toBe('');
    expect(result.current.baseCalories).toBe(100);
    expect(result.current.selectedCategory).toBe(null);
    expect(result.current.filteredFoods).toEqual([]);
  });

  it('should update food name correctly', () => {
    const { result } = renderHook(() => useFoodInput());
    
    act(() => {
      result.current.setNewFood('Chicken Breast');
    });
    
    expect(result.current.newFood).toBe('Chicken Breast');
  });

  it('should update nutritional values correctly', () => {
    const { result } = renderHook(() => useFoodInput());
    
    act(() => {
      result.current.setCalories(165);
      result.current.setProteins(31);
      result.current.setCarbs(0);
      result.current.setFats(3.6);
      result.current.setWeight(100);
    });
    
    expect(result.current.calories).toBe(165);
    expect(result.current.proteins).toBe(31);
    expect(result.current.carbs).toBe(0);
    expect(result.current.fats).toBe(3.6);
    expect(result.current.weight).toBe(100);
  });

  it('should update notes correctly', () => {
    const { result } = renderHook(() => useFoodInput());
    
    act(() => {
      result.current.setNotes('High protein, low fat');
    });
    
    expect(result.current.notes).toBe('High protein, low fat');
  });

  it('should update selected category correctly', () => {
    const { result } = renderHook(() => useFoodInput());
    
    act(() => {
      result.current.setSelectedCategory('Protéines');
    });
    
    expect(result.current.selectedCategory).toBe('Protéines');
  });
});
