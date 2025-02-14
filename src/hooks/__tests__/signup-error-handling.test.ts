
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useSignUp } from '../use-signup';
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from "@supabase/supabase-js";
import { 
  createMockUser, 
  createMockSupabaseQuery, 
  mockSuccessfulSignup,
  mockSignupError,
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

describe('Gestion des Erreurs', () => {
  let signUpMock: SupabaseMockFunction<AuthSignUpResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
    signUpMock = createMockSupabaseMethod();
    (supabase.auth.signUp as jest.Mock) = signUpMock;
  });

  it('devrait gérer une erreur de création de profil', async () => {
    const mockUser = createMockUser();
    const mockFrom = createMockSupabaseQuery({
      maybeSingleData: null,
      singleError: new AuthError('Erreur de création de profil', 400, 'ProfileCreationError', '')
    });

    (supabase.from as jest.Mock).mockImplementation(() => mockFrom());
    signUpMock.mockResolvedValue(mockSuccessfulSignup(mockUser));

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
    signUpMock.mockRejectedValue(new AuthError('Invalid password', 400, 'InvalidCredentials', ''));

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
