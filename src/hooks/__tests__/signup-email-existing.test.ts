
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useSignUp } from '../use-signup';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { createMockSupabaseQuery } from './signup-test-utils';

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn()
    }
  }
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn()
  }))
}));

describe('Email Existant', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait bloquer l\'inscription avec un email existant', async () => {
    const mockSupabaseQuery = createMockSupabaseQuery({
      maybeSingleData: { email: 'existant@exemple.com' }
    });

    (supabase.from as jest.Mock).mockImplementation(mockSupabaseQuery);

    const { result } = renderHook(() => useSignUp());

    let success;
    await act(async () => {
      success = await result.current.handleSignUp(
        'existant@exemple.com',
        'MotDePasse123!',
        'test_user'
      );
    });

    expect(success).toBe(false);
    expect(useToast().toast).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Erreur',
        description: 'Cet email est déjà utilisé'
      })
    );
  });
});
