
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

// Types pour les réponses d'authentification
export type AuthSignUpResponse = {
  user: MockUser | null;
  session: null;
};

// Type pour les fonctions mock
export type SupabaseMockFunction<T = unknown> = jest.Mock<Promise<MockSupabaseResponse<T>>>;

// Création de méthode mock générique
export function createMockSupabaseMethod<T>(): SupabaseMockFunction<T> {
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
export type SupabaseQueryResponse<T> = {
  data: T | null;
  error: Error | null;
};

export type SupabaseQueryOptions<T> = {
  maybeSingleData?: T;
  singleData?: T;
  maybeSingleError?: Error | null;
  singleError?: Error | null;
};

// Type pour la chaîne de requête Supabase
export type SupabaseQueryChain<T> = {
  select: () => {
    eq: () => {
      maybeSingle: () => Promise<SupabaseQueryResponse<T>>;
      single: () => Promise<SupabaseQueryResponse<T>>;
    };
  };
};

// Création de mock query Supabase
export const createMockSupabaseQuery = <T>(options: SupabaseQueryOptions<T>): jest.Mock => {
  const queryChain = {
    select: jest.fn().mockReturnValue({
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
    })
  };

  return jest.fn().mockReturnValue(queryChain);
};
