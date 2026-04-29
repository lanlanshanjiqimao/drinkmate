import { useLocation } from 'wouter';
import { BottomNav } from '../BottomNav';
import styles from './AppShell.module.css';

export function AppShell({ children }) {
  const [location] = useLocation();

  // 这些页面隐藏底部导航
  const hideNavPaths = ['/add'];
  const showNav = !hideNavPaths.some(path => location.startsWith(path));

  return (
    <div className={styles.shell}>
      <main className={styles.main}>
        {children}
      </main>
      {showNav && <BottomNav />}
    </div>
  );
}
