
import { jest } from '@jest/globals';
import { AuthError } from '@supabase/supabase-js';

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

export type MockSupabaseResponse<T = any> = {
  data: T | null;
  error: AuthError | null;
};

export type AuthSignUpResponse = {
  user: MockUser | null;
  session: null;
};

export type SupabaseMockFunction = jest.Mock;

export function createMockSupabaseMethod(): jest.Mock {
  return jest.fn().mockImplementation(() => ({
    data: null,
    error: null
  }));
}

export function mockSuccessfulResponse<T>(data: T): MockSupabaseResponse<T> {
  return {
    data,
    error: null
  };
}

export function mockErrorResponse(message: string): MockSupabaseResponse<null> {
  return {
    data: null,
    error: new AuthError(message)
  };
}

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

export const mockSuccessfulSignup = (user: MockUser): MockSupabaseResponse<AuthSignUpResponse> => ({
  data: { user, session: null },
  error: null
});

export const mockSignupError = (message: string): MockSupabaseResponse<AuthSignUpResponse> => ({
  data: null,
  error: new AuthError(message)
});

export type SupabaseQueryOptions<T> = {
  maybeSingleData?: T | null;
  singleData?: T | null;
  maybeSingleError?: AuthError | null;
  singleError?: AuthError | null;
};

export const createMockSupabaseQuery = <T>(options: SupabaseQueryOptions<T>) => {
  const single = jest.fn().mockImplementation(() => ({
    data: options.singleData ?? null,
    error: options.singleError ?? null
  }));

  const maybeSingle = jest.fn().mockImplementation(() => ({
    data: options.maybeSingleData ?? null,
    error: options.maybeSingleError ?? null
  }));

  const eq = jest.fn().mockReturnValue({ single, maybeSingle });
  const select = jest.fn().mockReturnValue({ eq });

  return jest.fn().mockReturnValue({ select });
};
