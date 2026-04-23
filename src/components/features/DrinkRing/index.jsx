import { useEffect, useState } from 'react';
import { getRingColor } from '../../../utils/calculator.ts';
import styles from './DrinkRing.module.css';

const RADIUS = 94;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function DrinkRing({ percentage, currentAmount, dailyLimit, size = 220 }) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  const { color, glow, status } = getRingColor(percentage);
  const offset = CIRCUMFERENCE - (Math.min(animatedPercentage, 100) / 100) * CIRCUMFERENCE;

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const scale = size / 220;

  const getStatusText = () => {
    switch (status) {
      case 'safe':
        return '适量范围';
      case 'warning':
        return '接近上限';
      case 'critical':
        return '即将超量';
      case 'danger':
        return '已超量';
      default:
        return '今日进度';
    }
  };

  return (
    <div
      className={styles.container}
      style={{
        width: size,
        height: size,
        transform: `scale(${scale})`,
      }}
    >
      <div
        className={styles.glow}
        style={{
          background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
        }}
      />

      <svg className={styles.ring} viewBox="0 0 220 220">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: color }} />
            <stop offset="100%" style={{ stopColor: color }} />
          </linearGradient>
        </defs>

        <circle
          className={styles.bgRing}
          cx="110"
          cy="110"
          r={RADIUS}
        />

        <circle
          className={styles.progressRing}
          cx="110"
          cy="110"
          r={RADIUS}
          style={{
            strokeDasharray: CIRCUMFERENCE,
            strokeDashoffset: offset,
            stroke: percentage > 0 ? 'url(#ringGradient)' : 'transparent',
            filter: `drop-shadow(0 0 8px ${glow})`,
          }}
        />
      </svg>

      <div className={styles.content}>
        <div
          className={styles.percentage}
          style={{ color }}
        >
          {Math.round(percentage)}%
        </div>
        <div className={styles.label}>
          {getStatusText()}
        </div>
        <div className={styles.amount}>
          {currentAmount.toFixed(1)}g / {dailyLimit}g
        </div>
      </div>
    </div>
  );
}
