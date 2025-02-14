
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
export function createMockSupabaseMethod<T = unknown>() {
  return jest.fn<Promise<MockSupabaseResponse<T>>, unknown[]>(() => 
    Promise.resolve({
      data: null,
      error: null
    })
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

// Création d'un mock Supabase query
export const createMockSupabaseQuery = <T>(options: {
  maybeSingleData?: T;
  singleData?: T;
  maybeSingleError?: Error | null;
  singleError?: Error | null;
}) => {
  const mockQuery = createMockSupabaseMethod<T>();

  mockQuery.mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        maybeSingle: jest.fn().mockResolvedValue(
          mockSuccessfulResponse(options.maybeSingleData)
        ),
        single: jest.fn().mockImplementation(() => {
          if (options.singleError) {
            return Promise.reject(options.singleError);
          }
          return Promise.resolve(mockSuccessfulResponse(options.singleData));
        })
      })
    })
  });

  return mockQuery;
};

// Créateur de mock pour les méthodes d'authentification
export const createMockAuthMethod = () => {
  const mockAuth = createMockSupabaseMethod<AuthMethodResponse>();
  mockAuth.mockResolvedValue(mockSuccessfulResponse({
    user: createMockUser(),
    session: null
  }));
  return mockAuth;
};
