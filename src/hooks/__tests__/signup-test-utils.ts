
import { jest } from '@jest/globals';
import { AuthError } from '@supabase/supabase-js';

// Type Utilisateur Mock Complet
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

// Types de réponse pour l'authentification
export type AuthMethodResponse = {
  user: MockUser | null;
  session: null;
};

export type MockSupabaseResponse<T = any> = {
  data: T | null;
  error: AuthError | null;
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

// Helper functions pour les réponses d'authentification
export const mockSuccessfulSignup = (mockUser: MockUser): MockSupabaseResponse<AuthMethodResponse> => ({
  data: { 
    user: mockUser, 
    session: null 
  },
  error: null
});

export const mockSignupError = (error: AuthError): MockSupabaseResponse<AuthMethodResponse> => ({
  data: null,
  error: error
});

// Création d'un mock Supabase query
export const createMockSupabaseQuery = <T>(options: {
  maybeSingleData?: T;
  singleData?: T;
  maybeSingleError?: Error | null;
  singleError?: Error | null;
}) => {
  const mockFn = jest.fn();
  
  const selectFn = jest.fn().mockReturnValue({
    eq: jest.fn().mockReturnValue({
      maybeSingle: jest.fn().mockResolvedValue({
        data: options.maybeSingleData,
        error: options.maybeSingleError ?? null
      }),
      single: jest.fn().mockImplementation(() => {
        if (options.singleError) {
          return Promise.reject(options.singleError);
        }
        return Promise.resolve({
          data: options.singleData,
          error: null
        });
      })
    })
  });

  mockFn.mockReturnValue({ select: selectFn });
  return mockFn;
};

// Créateur de mock pour les méthodes d'authentification
export const createMockAuthMethod = () => {
  return jest.fn().mockImplementation(() => 
    Promise.resolve(mockSuccessfulSignup(createMockUser()))
  );
};
