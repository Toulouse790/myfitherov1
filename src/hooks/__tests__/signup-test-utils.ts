
import { jest } from '@jest/globals';
import { AuthError } from '@supabase/supabase-js';

// Types de base
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

export type MockSupabaseResponse<T = unknown> = {
  data: T | null;
  error: AuthError | null;
};

export type UnknownFunction = (...args: any[]) => any;

export type MockSupabaseMethod<T = unknown> = jest.Mock<Promise<MockSupabaseResponse<T>>>;

// Création de méthode mock générique
export function createMockSupabaseMethod<T>(): MockSupabaseMethod<T> {
  return jest.fn().mockResolvedValue({
    data: null,
    error: null
  });
}

// Helpers pour les réponses
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

// Mock utilisateur
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

// Types pour les résultats d'authentification
export type AuthSignUpResponse = {
  user: MockUser | null;
  session: null;
};

// Mock pour les opérations d'authentification
export const mockSuccessfulSignup = (user: MockUser): MockSupabaseResponse<AuthSignUpResponse> => ({
  data: { user, session: null },
  error: null
});

export const mockSignupError = (message: string): MockSupabaseResponse<AuthSignUpResponse> => ({
  data: { user: null, session: null },
  error: new AuthError(message)
});

// Type pour les requêtes Supabase
export type SupabaseQueryOptions<T> = {
  maybeSingleData?: T;
  singleData?: T;
  maybeSingleError?: Error | null;
  singleError?: Error | null;
};

// Types pour les réponses de query
export type QueryResponse<T> = {
  data: T | null;
  error: Error | null;
};

// Création de mock query Supabase
export const createMockSupabaseQuery = <T>(options: SupabaseQueryOptions<T>) => {
  const selectMock = jest.fn().mockReturnValue({
    eq: jest.fn().mockReturnValue({
      maybeSingle: jest.fn().mockResolvedValue({
        data: options.maybeSingleData ?? null,
        error: options.maybeSingleError ?? null
      }),
      single: jest.fn().mockResolvedValue({
        data: options.singleData ?? null,
        error: options.singleError ?? null
      })
    })
  });

  const mockFn = jest.fn().mockReturnValue({
    select: selectMock
  });

  return mockFn;
};
