import { Link, useLocation } from 'wouter';
import styles from './BottomNav.module.css';

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: '首页', icon: '🏠' },
    { path: '/add', label: '记酒', icon: '➕' },
    { path: '/calculator', label: '计算', icon: '📊' },
    { path: '/settings', label: '设置', icon: '⚙️' },
  ];

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`${styles.navItem} ${location === item.path ? styles.active : ''}`}
        >
          <span className={styles.icon}>{item.icon}</span>
          <span className={styles.label}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
