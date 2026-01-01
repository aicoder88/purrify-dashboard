import { renderHook, act } from '@testing-library/react';
import { useAuthStore, getAuthToken, isAuthenticated } from '@/store/auth-store';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

// Mock sessionStorage
const sessionStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock });

// Mock fetch
global.fetch = jest.fn();

describe('Auth Store', () => {
  beforeEach(() => {
    localStorageMock.clear();
    sessionStorageMock.clear();
    jest.clearAllMocks();

    // Reset the store to initial state
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });
  });

  describe('setUser', () => {
    it('should set user and update isAuthenticated', () => {
      const { result } = renderHook(() => useAuthStore());
      const mockUser = {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'admin' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      act(() => {
        result.current.setUser(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.isAuthenticated).toBe(true);
    });

    it('should set user to null and update isAuthenticated to false', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setUser(null);
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should set loading state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setLoading(true);
      });

      expect(result.current.isLoading).toBe(true);
    });
  });

  describe('setError', () => {
    it('should set error state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');
    });
  });

  describe('clearError', () => {
    it('should clear error state', () => {
      const { result } = renderHook(() => useAuthStore());

      act(() => {
        result.current.setError('Test error');
      });

      expect(result.current.error).toBe('Test error');

      act(() => {
        result.current.clearError();
      });

      expect(result.current.error).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear user and tokens', () => {
      const { result } = renderHook(() => useAuthStore());

      // Set up initial state
      localStorageMock.setItem('auth-token', 'test-token');

      act(() => {
        result.current.setUser({
          id: '1',
          email: 'test@example.com',
          name: 'Test User',
          role: 'admin' as const,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      });

      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(localStorageMock.getItem('auth-token')).toBeNull();
    });
  });

  describe('Helper functions', () => {
    describe('getAuthToken', () => {
      it('should return token from localStorage', () => {
        localStorageMock.setItem('auth-token', 'test-token');
        expect(getAuthToken()).toBe('test-token');
      });

      it('should return token from sessionStorage if not in localStorage', () => {
        sessionStorageMock.setItem('auth-token', 'session-token');
        expect(getAuthToken()).toBe('session-token');
      });

      it('should return null if no token exists', () => {
        expect(getAuthToken()).toBeNull();
      });
    });

    describe('isAuthenticated', () => {
      it('should return true if token exists', () => {
        localStorageMock.setItem('auth-token', 'test-token');
        expect(isAuthenticated()).toBe(true);
      });

      it('should return false if no token exists', () => {
        expect(isAuthenticated()).toBe(false);
      });
    });
  });
});
