import { Link, useLocation } from 'wouter';
import { Home, PlusCircle, Calculator, Settings } from 'lucide-react';
import styles from './BottomNav.module.css';

export function BottomNav() {
  const [location] = useLocation();

  const navItems = [
    { path: '/', label: '首页', Icon: Home },
    { path: '/add', label: '记酒', Icon: PlusCircle },
    { path: '/calculator', label: '计算', Icon: Calculator },
    { path: '/settings', label: '设置', Icon: Settings },
  ];

  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          href={item.path}
          className={`${styles.navItem} ${location === item.path ? styles.active : ''}`}
        >
          <item.Icon size={22} className={styles.icon} />
          <span className={styles.label}>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
