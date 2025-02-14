
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useSignUp } from '../use-signup';
import { supabase } from '@/integrations/supabase/client';
import { 
  createMockUser, 
  createMockSupabaseQuery,
  mockSuccessfulSignup,
  type MockSupabaseMethod,
  type AuthSignUpResponse 
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

describe('Inscription Standard - Flux Nominal', () => {
  let signUpMock: MockSupabaseMethod<AuthSignUpResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
    signUpMock = jest.fn();
    (supabase.auth.signUp as jest.Mock) = signUpMock;
  });

  it('devrait créer un compte et un profil avec succès', async () => {
    const mockUser = createMockUser();
    const mockFrom = createMockSupabaseQuery({
      maybeSingleData: null,
      singleData: { id: mockUser.id }
    });

    (supabase.from as jest.Mock).mockImplementation(() => mockFrom());
    signUpMock.mockResolvedValue(mockSuccessfulSignup(mockUser));

    const { result } = renderHook(() => useSignUp());

    let success;
    await act(async () => {
      success = await result.current.handleSignUp(
        'test_standard@exemple.com',
        'MotDePasse123!',
        'utilisateur_standard'
      );
    });

    expect(success).toBe(true);
    expect(signUpMock).toHaveBeenCalledTimes(1);
    expect(mockFrom().select().eq().single).toHaveBeenCalled();
  });
});
