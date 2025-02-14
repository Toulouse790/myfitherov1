
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useSignUp } from '../use-signup';
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from "@supabase/supabase-js";
import { 
  createMockUser, 
  createMockSupabaseQuery, 
  mockSuccessfulSignup,
  mockSignupError
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

describe('Gestion des Erreurs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait gérer une erreur de création de profil', async () => {
    const mockUser = createMockUser();
    const mockFrom = createMockSupabaseQuery({
      maybeSingleData: null,
      singleError: new Error('Erreur de création de profil')
    });

    (supabase.from as jest.Mock).mockImplementation(() => mockFrom());
    (supabase.auth.signUp as jest.Mock).mockImplementation(() => 
      Promise.resolve(mockSuccessfulSignup(mockUser))
    );

    const { result } = renderHook(() => useSignUp());

    await expect(
      act(async () => {
        await result.current.handleSignUp(
          'test@exemple.com',
          'MotDePasse123!',
          'test_user'
        );
      })
    ).rejects.toThrow();
  });

  it('devrait gérer une erreur d\'authentification', async () => {
    const mockFrom = createMockSupabaseQuery({
      maybeSingleData: null
    });

    (supabase.from as jest.Mock).mockImplementation(() => mockFrom());
    (supabase.auth.signUp as jest.Mock).mockImplementation(() => 
      Promise.reject(new AuthError('Invalid password'))
    );

    const { result } = renderHook(() => useSignUp());

    await expect(
      act(async () => {
        await result.current.handleSignUp(
          'test@exemple.com',
          'faible',
          'test_user'
        );
      })
    ).rejects.toThrow();
  });
});
