import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore } from '../../stores';

export function AuthGuard({ children }) {
  const currentUser = useAuthStore((s) => s.currentUser);
  const [, navigate] = useLocation();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  return children;
}
