import { useState } from 'react';
import { getRingColor } from '../../utils/calculator';
import styles from './CalculatorPage.module.css';

const DRINK_TYPES = [
  { name: '葡萄酒', icon: '🍷', defaultAbv: 12 },
  { name: '啤酒', icon: '🍺', defaultAbv: 4 },
  { name: '白酒', icon: '🥃', defaultAbv: 52 },
  { name: '鸡尾酒', icon: '🍸', defaultAbv: 15 },
  { name: '清酒', icon: '🍶', defaultAbv: 15 },
  { name: '威士忌', icon: '🥃', defaultAbv: 40 },
];

export function CalculatorPage() {
  const [volume, setVolume] = useState(150);
  const [abv, setAbv] = useState(12);

  const pureAlcohol = volume * (abv / 100) * 0.8;
  const standardDrinks = pureAlcohol / 10;
  const calories = pureAlcohol * 7;

  const percentage = Math.min((pureAlcohol / 25) * 100, 100);
  const ringColor = getRingColor(percentage);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>酒精计算器</h1>
        <p className={styles.subtitle}>快速计算饮品酒精含量</p>
      </header>

      {/* Quick Select */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>快速选择</h2>
        <div className={styles.typeGrid}>
          {DRINK_TYPES.map((type) => (
            <button
              key={type.name}
              type="button"
              className={styles.typeButton}
              onClick={() => setAbv(type.defaultAbv)}
            >
              <span className={styles.typeIcon}>{type.icon}</span>
              <span className={styles.typeName}>{type.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Input Section */}
      <section className={styles.section}>
        <div className={styles.inputGroup}>
          <label className={styles.label}>
            容量
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.inputValue}>{volume} ml</div>
          </label>
        </div>

        <div className={styles.inputGroup}>
          <label className={styles.label}>
            酒精度
            <input
              type="range"
              min="0"
              max="100"
              step="0.5"
              value={abv}
              onChange={(e) => setAbv(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.inputValue}>{abv}%</div>
          </label>
        </div>
      </section>

      {/* Result Card */}
      <section className={styles.resultCard}>
        <div className={styles.resultRing}>
          <svg viewBox="0 0 100 100" className={styles.ringSvg}>
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="var(--ring-bg)"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={ringColor}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 2.83} 283`}
              transform="rotate(-90 50 50)"
              style={{
                filter: `drop-shadow(0 0 4px ${ringColor})`,
              }}
            />
          </svg>
        </div>

        <div className={styles.results}>
          <div className={styles.resultItem}>
            <span className={styles.resultValue}>{pureAlcohol.toFixed(1)}g</span>
            <span className={styles.resultLabel}>纯酒精</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultValue}>{standardDrinks.toFixed(1)}杯</span>
            <span className={styles.resultLabel}>标准杯</span>
          </div>
          <div className={styles.resultItem}>
            <span className={styles.resultValue}>{Math.round(calories)}kcal</span>
            <span className={styles.resultLabel}>热量</span>
          </div>
        </div>
      </section>

      {/* Reference Table */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>参考标准</h2>
        <div className={styles.referenceTable}>
          {DRINK_TYPES.map((type) => (
            <div key={type.name} className={styles.referenceItem}>
              <span className={styles.refIcon}>{type.icon}</span>
              <span className={styles.refName}>{type.name}</span>
              <span className={styles.refAbv}>{type.defaultAbv}%</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
