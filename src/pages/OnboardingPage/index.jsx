import { useState } from 'react';
import { useUserStore } from '../../stores';
import styles from './OnboardingPage.module.css';

export function OnboardingPage() {
  const [selectedGender, setSelectedGender] = useState(null);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);
  const setGender = useUserStore((state) => state.setGender);

  const handleStart = () => {
    if (selectedGender) {
      setGender(selectedGender);
      completeOnboarding();
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Logo / Icon */}
        <div className={styles.logo}>
          <div className={styles.ring}>
            <svg viewBox="0 0 100 100" className={styles.ringSvg}>
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#onboardingGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray="200 283"
                transform="rotate(-90 50 50)"
              />
              <defs>
                <linearGradient id="onboardingGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#d4a853" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Title */}
        <h1 className={styles.title}>DrinkMate</h1>
        <p className={styles.subtitle}>合上圆环 · 科学饮酒</p>

        {/* Description */}
        <p className={styles.description}>
          记录您的饮酒量，帮助您了解酒精摄入，养成健康的饮酒习惯。
        </p>

        {/* Gender Selection */}
        <div className={styles.genderSection}>
          <h2 className={styles.genderTitle}>选择您的性别</h2>
          <p className={styles.genderSubtitle}>用于计算每日安全饮酒上限</p>

          <div className={styles.genderOptions}>
            <button
              className={`${styles.genderBtn} ${
                selectedGender === 'male' ? styles.selected : ''
              }`}
              onClick={() => setSelectedGender('male')}
            >
              <span className={styles.genderIcon}>👨</span>
              <span className={styles.genderLabel}>男性</span>
              <span className={styles.genderLimit}>每日上限 25g</span>
            </button>

            <button
              className={`${styles.genderBtn} ${
                selectedGender === 'female' ? styles.selected : ''
              }`}
              onClick={() => setSelectedGender('female')}
            >
              <span className={styles.genderIcon}>👩</span>
              <span className={styles.genderLabel}>女性</span>
              <span className={styles.genderLimit}>每日上限 15g</span>
            </button>
          </div>
        </div>

        {/* Start Button */}
        <button
          className={`${styles.startBtn} ${
            selectedGender ? styles.active : ''
          }`}
          onClick={handleStart}
          disabled={!selectedGender}
        >
          开始使用
        </button>

        {/* Tips */}
        <div className={styles.tips}>
          <p>💡 提示：您可以随时在设置中更改性别</p>
        </div>
      </div>
    </div>
  );
}
