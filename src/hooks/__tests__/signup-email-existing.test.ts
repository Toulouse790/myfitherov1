
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useSignUp } from '../use-signup';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  createMockSupabaseQuery,
  type SupabaseMockFunction,
  type AuthSignUpResponse,
  createMockSupabaseMethod 
} from './signup-test-utils';

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
  let signUpMock: SupabaseMockFunction<AuthSignUpResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
    signUpMock = createMockSupabaseMethod();
    (supabase.auth.signUp as jest.Mock) = signUpMock;
  });

  it('devrait bloquer l\'inscription avec un email existant', async () => {
    const mockFrom = createMockSupabaseQuery({
      maybeSingleData: { email: 'existant@exemple.com' }
    });

    (supabase.from as jest.Mock).mockImplementation(() => mockFrom());

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
        description: expect.stringContaining('déjà utilisé')
      })
    );
  });
});
