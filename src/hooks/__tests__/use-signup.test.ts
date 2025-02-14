
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { useSignUp } from '../use-signup';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AuthError } from "@supabase/supabase-js";

// Mock des dépendances
jest.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          maybeSingle: jest.fn()
        })),
        single: jest.fn()
      }))
    })),
    auth: {
      signUp: jest.fn(),
      signInWithPassword: jest.fn()
    }
  }
}));

jest.mock('@/hooks/use-toast', () => ({
  useToast: jest.fn(() => ({
    toast: jest.fn()
  }))
}));

describe('useSignUp Hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Inscription Standard - Flux Nominal', () => {
    it('devrait créer un compte et un profil avec succès', async () => {
      // Configuration des mocks pour un succès
      const mockUser = { 
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
        updated_at: '2024-03-20T12:00:00Z'
      };

      const mockSupabaseQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null }),
        single: jest.fn().mockResolvedValue({ data: { id: mockUser.id } })
      };

      (supabase.from as jest.Mock).mockImplementation(() => mockSupabaseQuery);

      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      const { result } = renderHook(() => useSignUp());

      let success;
      await act(async () => {
        success = await result.current.handleSignUp(
          'test_standard@exemple.com',
          'MotDePasse123!',
          'utilisateur_standard'
        );
      });

      expect(success).toBe(true);
      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: 'test_standard@exemple.com',
        password: 'MotDePasse123!',
        options: {
          data: {
            pseudo: 'utilisateur_standard'
          }
        }
      });
    });
  });

  describe('Email Existant', () => {
    it('devrait bloquer l\'inscription avec un email existant', async () => {
      // Mock pour simuler un email existant
      const mockSupabaseQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: { email: 'existant@exemple.com' } })
      };

      (supabase.from as jest.Mock).mockImplementation(() => mockSupabaseQuery);

      const { result } = renderHook(() => useSignUp());

      let success;
      await act(async () => {
        success = await result.current.handleSignUp(
          'existant@exemple.com',
          'MotDePasse123!',
          'test_user'
        );
      });

      expect(success).toBe(false);
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Erreur',
          description: 'Cet email est déjà utilisé'
        })
      );
    });
  });

  describe('Gestion des Erreurs', () => {
    it('devrait gérer une erreur de création de profil', async () => {
      // Mock pour simuler une erreur lors de la création du profil
      const mockUser = { 
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
        updated_at: '2024-03-20T12:00:00Z'
      };

      const mockSupabaseQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null }),
        single: jest.fn().mockRejectedValue(new Error('Erreur de création de profil'))
      };

      (supabase.from as jest.Mock).mockImplementation(() => mockSupabaseQuery);

      (supabase.auth.signUp as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
        error: null
      });

      (supabase.auth.signInWithPassword as jest.Mock).mockResolvedValue({
        data: { user: mockUser },
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
      // Mock pour simuler une erreur d'authentification
      const mockSupabaseQuery = {
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        maybeSingle: jest.fn().mockResolvedValue({ data: null })
      };

      (supabase.from as jest.Mock).mockImplementation(() => mockSupabaseQuery);

      (supabase.auth.signUp as jest.Mock).mockRejectedValue(
        new Error('Invalid password')
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
});
