import { useLocalStorage } from '@/hooks/use-local-storage';

export function useAdminAuth() {
  const [isAuthenticated, setIsAuthenticated] = useLocalStorage('admin-auth', false);
  
  const login = (password: string): boolean => {
    // The password could be moved to environment variables in a real app
    const ADMIN_PASSWORD = 'jalwa-admin-2023';
    
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setIsAuthenticated(false);
  };
  
  return {
    isAuthenticated,
    login,
    logout
  };
}