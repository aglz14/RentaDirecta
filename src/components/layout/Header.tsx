import { useAuth } from '@/contexts/AuthContext';
import { LoggedInHeader } from './header/LoggedInHeader';
import { LoggedOutHeader } from './header/LoggedOutHeader';

export function Header() {
  const { user } = useAuth();
  return user ? <LoggedInHeader /> : <LoggedOutHeader />;
}