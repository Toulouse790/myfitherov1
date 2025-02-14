
import { jest } from '@jest/globals';
import { AuthError } from '@supabase/supabase-js';

// Types standard
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

export type MockAuthResponse = {
  data: {
    user: MockUser;
    session: null;
  } | null;
  error: AuthError | null;
};

export type DatabaseResult<T> = {
  data: T | null;
  error: Error | null;
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

// Création d'un mock Supabase query avec des types génériques
export const createMockSupabaseQuery = <T>(options: {
  maybeSingleData?: T;
  singleData?: T;
  maybeSingleError?: Error | null;
  singleError?: Error | null;
}) => {
  return jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
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
    })
  });
};

// Créateur de mock pour les méthodes d'authentification
export const createMockAuthMethod = () => {
  return jest.fn(() => Promise.resolve({ data: { user: null, session: null }, error: null }));
};
