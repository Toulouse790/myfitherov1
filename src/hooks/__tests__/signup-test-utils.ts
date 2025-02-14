
import { jest } from '@jest/globals';
import { AuthError, AuthResponse } from '@supabase/supabase-js';

// Types pour les mocks
export type SupabaseQueryResult<T> = Promise<{
  data: T | null;
  error: null | Error;
}>;

// Type générique pour les réponses Supabase
export type MockSupabaseResponse<T = any> = {
  data: T | null;
  error: AuthError | null;
};

export type MockUser = {
  id: string;
  app_metadata: Record<string, any>;
  user_metadata: Record<string, any>;
  aud: string;
  created_at: string;
  email: string;
  phone: string;
  confirmed_at: string;
  last_sign_in_at: string;
  role: string;
  updated_at: string;
};

// Type pour les méthodes d'authentification mockées
export type MockAuthMethodResponse = {
  user: MockUser;
  session: null;
};

// Mock utilisateur de base
export const createMockUser = (overrides: Partial<MockUser> = {}): MockUser => ({
  id: 'test-user-id',
  app_metadata: {},
  user_metadata: {},
  aud: 'authenticated',
  created_at: '2024-03-20T12:00:00Z',
  email: 'test@example.com',
  phone: '',
  confirmed_at: '2024-03-20T12:00:00Z',
  last_sign_in_at: '2024-03-20T12:00:00Z',
  role: 'authenticated',
  updated_at: '2024-03-20T12:00:00Z',
  ...overrides
});

// Type de retour pour les requêtes Supabase
type SupabaseQueryResponse = {
  data: any;
  error: Error | null;
};

// Création d'un mock Supabase query
export const createMockSupabaseQuery = (options: {
  maybeSingleData?: any;
  singleData?: any;
  maybeSingleError?: Error | null;
  singleError?: Error | null;
}) => {
  const maybeSingleMock = jest.fn().mockResolvedValue({
    data: options.maybeSingleData,
    error: options.maybeSingleError ?? null
  });

  const singleMock = options.singleError
    ? jest.fn().mockRejectedValue(options.singleError)
    : jest.fn().mockResolvedValue({
        data: options.singleData,
        error: null
      });

  return jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        maybeSingle: maybeSingleMock,
        single: singleMock
      })
    })
  });
};

// Créateur de mock pour les méthodes d'authentification
export const createMockAuthMethod = () => {
  return jest.fn<Promise<MockSupabaseResponse<MockAuthMethodResponse>>, [any]>();
};
