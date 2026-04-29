import { useEffect, useState, useMemo } from 'react';
import { getRingColor } from '../../../utils/calculator.ts';
import styles from './DrinkRing.module.css';

const BASE_RADIUS = 90;
const RING_GAP = 18;
const STROKE_WIDTH = 14;
const MAX_RINGS = 4;

const LOOP_COLORS = [
  { stroke: 'var(--ring-loop-1)', glow: 'var(--ring-loop-1-glow)' },
  { stroke: 'var(--ring-loop-2)', glow: 'var(--ring-loop-2-glow)' },
  { stroke: 'var(--ring-loop-3)', glow: 'var(--ring-loop-3-glow)' },
  { stroke: 'var(--ring-loop-4)', glow: 'var(--ring-loop-4-glow)' },
];

function getLoopColor(index) {
  return LOOP_COLORS[Math.min(index, LOOP_COLORS.length - 1)];
}

function getRadius(loopIndex) {
  return BASE_RADIUS - loopIndex * RING_GAP;
}

function getCircumference(loopIndex) {
  return 2 * Math.PI * getRadius(loopIndex);
}

export function DrinkRing({ percentage, currentAmount, dailyLimit, size = 220 }) {
  const [animatedPercentage, setAnimatedPercentage] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedPercentage(percentage);
    }, 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  const { color, glow, status } = getRingColor(animatedPercentage);
  const scale = size / 220;

  const rings = useMemo(() => {
    if (animatedPercentage <= 0) return [];

    const totalLoops = Math.ceil(animatedPercentage / 100);
    const result = [];

    for (let i = 0; i < Math.min(totalLoops, MAX_RINGS); i++) {
      const loopStart = i * 100;
      const loopEnd = Math.min(animatedPercentage, (i + 1) * 100);
      const progress = loopEnd - loopStart;
      const radius = getRadius(i);
      const circumference = getCircumference(i);
      const offset = circumference - (progress / 100) * circumference;
      const loopColor = getLoopColor(i);

      result.push({
        index: i,
        radius,
        circumference,
        offset,
        progress,
        ...loopColor,
      });
    }

    return result;
  }, [animatedPercentage]);

  const getStatusText = () => {
    switch (status) {
      case 'safe':
        return '微醺刚好';
      case 'warning':
        return '渐入佳境';
      case 'critical':
        return '接近上限';
      case 'danger':
        return '已超量';
      default:
        return '今日进度';
    }
  };

  return (
    <div className={styles.wrapper} style={{ width: size }}>
      <div
        className={styles.ringArea}
        style={{
          width: size,
          height: size,
          transform: `scale(${scale})`,
        }}
      >
        <div className={styles.backdrop} />

        <div
          className={styles.glow}
          style={{
            background: `radial-gradient(circle, ${glow} 0%, transparent 70%)`,
          }}
        />

        <svg className={styles.ring} viewBox="0 0 220 220">
          {rings.map((ring) => (
            <circle
              key={`bg-${ring.index}`}
              className={styles.bgRing}
              cx="110"
              cy="110"
              r={ring.radius}
              style={{ strokeWidth: STROKE_WIDTH }}
            />
          ))}

          {rings.map((ring) => (
            <circle
              key={`progress-${ring.index}`}
              className={styles.progressRing}
              cx="110"
              cy="110"
              r={ring.radius}
              style={{
                strokeWidth: STROKE_WIDTH,
                strokeDasharray: ring.circumference,
                strokeDashoffset: ring.offset,
                stroke: ring.stroke,
                filter: `drop-shadow(0 0 6px ${ring.glow})`,
              }}
            />
          ))}
        </svg>
      </div>

      <div className={styles.info}>
        <div className={styles.infoRow}>
          <span
            className={styles.percentage}
            style={{ color }}
          >
            {Math.round(animatedPercentage)}%
          </span>
          <span className={styles.label}>{getStatusText()}</span>
        </div>
        <div className={styles.amount}>
          {currentAmount.toFixed(1)}g / {dailyLimit}g
        </div>
      </div>
    </div>
  );
}
