import { useEffect, useState } from 'react';
import { getToken, getUser, isAuthenticated } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);

  // Only runs once on mount
  useEffect(() => {
    const token = getToken();
    const user = getUser();
    
    setToken(token);
    setUser(user);
    setIsAuth(isAuthenticated());
    setIsLoading(false);
  }, []); 

  return { user, token, isAuth, isLoading };
}
