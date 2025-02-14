
import { jest } from '@jest/globals';

// Types pour les mocks
export type SupabaseQueryResult<T> = Promise<{
  data: T | null;
  error: null | Error;
}>;

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

// Création d'un mock Supabase query
export const createMockSupabaseQuery = (options: {
  maybeSingleData?: any;
  singleData?: any;
  maybeSingleError?: Error | null;
  singleError?: Error | null;
}) => {
  return jest.fn().mockReturnValue({
    select: jest.fn().mockReturnValue({
      eq: jest.fn().mockReturnValue({
        maybeSingle: jest.fn().mockResolvedValue({ 
          data: options.maybeSingleData, 
          error: options.maybeSingleError 
        }),
        single: options.singleError 
          ? jest.fn().mockRejectedValue(options.singleError)
          : jest.fn().mockResolvedValue({ 
              data: options.singleData, 
              error: null 
            })
      })
    })
  });
};
