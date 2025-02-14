
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useSignUp } from '../use-signup';
import { supabase } from '@/integrations/supabase/client';
import { 
  createMockUser, 
  createMockSupabaseQuery,
  mockSuccessfulSignup,
  type SupabaseMockFunction,
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
  let signUpMock: SupabaseMockFunction<AuthSignUpResponse>;

  beforeEach(() => {
    jest.clearAllMocks();
    signUpMock = createMockSupabaseMethod();
    (supabase.auth.signUp as jest.Mock) = signUpMock;
  });

  it('devrait créer un compte et un profil avec succès', async () => {
    const mockUser = createMockUser();
    const mockFromFn = createMockSupabaseQuery({
      maybeSingleData: null,
      singleData: { id: mockUser.id }
    });

    (supabase.from as jest.Mock).mockImplementation(() => mockFromFn());
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
    
    const mockFromResult = mockFromFn();
    const selectResult = mockFromResult.select();
    const eqResult = selectResult.eq();
    expect(eqResult.single).toHaveBeenCalled();
  });
});
