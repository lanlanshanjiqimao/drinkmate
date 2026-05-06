import { useState } from 'react';
import { useLocation } from 'wouter';
import { useAuthStore, useDrinkStore, useUserStore } from '../../stores';
import styles from './LoginPage.module.css';

export function LoginPage() {
  const [, navigate] = useLocation();
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login = useAuthStore((s) => s.login);
  const register = useAuthStore((s) => s.register);
  const migratePreAccountData = useAuthStore((s) => s.migratePreAccountData);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const result = mode === 'login'
      ? login(username, password)
      : register(username, password);

    if (!result.success) {
      setError(result.error);
      return;
    }

    if (mode === 'register') {
      migratePreAccountData(username);
    }

    useDrinkStore.persist.rehydrate();
    useUserStore.persist.rehydrate();

    navigate('/');
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <svg className={styles.ring} viewBox="0 0 100 100">
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="rgba(212, 168, 83, 0.2)"
              strokeWidth="6"
            />
            <circle
              cx="50" cy="50" r="40"
              fill="none"
              stroke="url(#goldGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 40 * 0.3} ${2 * Math.PI * 40}`}
              transform="rotate(-90 50 50)"
            />
            <defs>
              <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="var(--ring-gold)" />
                <stop offset="100%" stopColor="var(--ring-amber)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <h1 className={styles.title}>DrinkMate</h1>
        <p className={styles.subtitle}>
          {mode === 'login' ? '登录您的账户' : '创建新账户'}
        </p>

        <div className={styles.modeToggle}>
          <button
            className={`${styles.modeBtn} ${mode === 'login' ? styles.active : ''}`}
            onClick={() => { setMode('login'); setError(''); }}
          >
            登录
          </button>
          <button
            className={`${styles.modeBtn} ${mode === 'register' ? styles.active : ''}`}
            onClick={() => { setMode('register'); setError(''); }}
          >
            注册
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="用户名"
            className={styles.input}
            autoComplete="username"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="密码"
            className={styles.input}
            autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
            required
          />

          {error && <p className={styles.error}>{error}</p>}

          <button type="submit" className={styles.submitBtn}>
            {mode === 'login' ? '登录' : '注册'}
          </button>
        </form>
      </div>
    </div>
  );
}
