
import { jest } from '@jest/globals';
import { AuthError } from '@supabase/supabase-js';

// Type Utilisateur Mock Complet
export type MockUser = {
  id: string;
  email: string;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  aud: string;
  created_at: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  role: string;
  updated_at: string;
};

export type AuthMethodResponse = {
  user: MockUser;
  session: null;
};

export type MockSupabaseResponse<T = unknown> = {
  data: T | null;
  error: AuthError | null;
};

// Créateur de méthode mock Supabase générique
export function createMockSupabaseMethod<T>() {
  return jest.fn(() => 
    Promise.resolve({
      data: null,
      error: null
    } as MockSupabaseResponse<T>)
  );
}

// Helper functions pour les réponses
export function mockSuccessfulResponse<T>(data: T): MockSupabaseResponse<T> {
  return {
    data,
    error: null
  };
}

export function mockErrorResponse(error: AuthError): MockSupabaseResponse<unknown> {
  return {
    data: null,
    error
  };
}

// Mock utilisateur de base
export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  id: 'test-user-id',
  email: 'test@example.com',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2024-03-20T12:00:00Z',
  phone: '',
  confirmed_at: '2024-03-20T12:00:00Z',
  last_sign_in_at: '2024-03-20T12:00:00Z',
  role: 'authenticated',
  updated_at: '2024-03-20T12:00:00Z',
  ...overrides
});

// Mock pour signup réussi
export const mockSuccessfulSignup = (user: MockUser) => ({
  data: { user, session: null },
  error: null
});

// Mock pour signup échoué
export const mockSignupError = (message: string) => ({
  data: { user: null, session: null },
  error: new AuthError(message)
});

// Création d'un mock Supabase query
export const createMockSupabaseQuery = <T>(options: {
  maybeSingleData?: T;
  singleData?: T;
  maybeSingleError?: Error | null;
  singleError?: Error | null;
}) => {
  return jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        maybeSingle: jest.fn().mockReturnValue({
          data: options.maybeSingleData,
          error: options.maybeSingleError
        }),
        single: jest.fn().mockReturnValue(
          Promise.resolve({
            data: options.singleData,
            error: options.singleError
          })
        )
      })
    })
  });
};
