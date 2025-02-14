
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useSignUp } from '../use-signup';
import { supabase } from '@/integrations/supabase/client';
import { AuthError } from "@supabase/supabase-js";
import { createMockUser, createMockSupabaseQuery, MockSupabaseResponse, MockUser } from './signup-test-utils';

jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(),
    auth: {
      signUp: jest.fn().mockImplementation(() => Promise.resolve({
        data: null,
        error: null
      })),
      signInWithPassword: jest.fn().mockImplementation(() => Promise.resolve({
        data: null,
        error: null
      }))
    }
  }
}));

describe('Gestion des Erreurs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('devrait gérer une erreur de création de profil', async () => {
    const mockUser = createMockUser();
    const mockSupabaseQuery = createMockSupabaseQuery({
      maybeSingleData: null,
      singleError: new Error('Erreur de création de profil')
    });

    (supabase.from as jest.Mock).mockImplementation(mockSupabaseQuery);
    (supabase.auth.signUp as jest.Mock).mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null
    });
    (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null
    });

    const { result } = renderHook(() => useSignUp());

    await expect(
      act(async () => {
        await result.current.handleSignUp(
          'test@exemple.com',
          'MotDePasse123!',
          'test_user'
        );
      })
    ).rejects.toThrow('Une erreur est survenue lors de l\'inscription');
  });

  it('devrait gérer une erreur d\'authentification', async () => {
    const mockSupabaseQuery = createMockSupabaseQuery({
      maybeSingleData: null
    });

    (supabase.from as jest.Mock).mockImplementation(mockSupabaseQuery);
    (supabase.auth.signUp as jest.Mock).mockRejectedValue(
      new AuthError('Invalid password')
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
