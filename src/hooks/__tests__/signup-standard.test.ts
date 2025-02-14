
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useSignUp } from '../use-signup';
import { supabase } from '@/integrations/supabase/client';
import { createMockUser, createMockSupabaseQuery, MockSupabaseResponse, MockUser } from './signup-test-utils';

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      signUp: jest.fn<Promise<MockSupabaseResponse<{ user: MockUser; session: null }>>, [any]>(),
      signInWithPassword: jest.fn<Promise<MockSupabaseResponse<{ user: MockUser; session: null }>>, [any]>()
    }
  }
}));

describe('Inscription Standard - Flux Nominal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait créer un compte et un profil avec succès', async () => {
    const mockUser = createMockUser();
    const mockSupabaseQuery = createMockSupabaseQuery({
      maybeSingleData: null,
      singleData: { id: mockUser.id }
    });

    (supabase.from as jest.Mock).mockImplementation(mockSupabaseQuery);
    (supabase.auth.signUp as jest.Mock<Promise<MockSupabaseResponse<{ user: MockUser; session: null }>>>).mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null
    });
    (supabase.auth.signInWithPassword as jest.Mock<Promise<MockSupabaseResponse<{ user: MockUser; session: null }>>>).mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null
    });

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
    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test_standard@exemple.com',
      password: 'MotDePasse123!',
      options: {
        data: {
          pseudo: 'utilisateur_standard'
        }
      }
    });
  });
});
