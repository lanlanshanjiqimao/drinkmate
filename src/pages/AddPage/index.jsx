import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ChevronLeft, Plus, Minus } from 'lucide-react';
import { useDrinkStore, useUserStore } from '../../stores';
import { calculatePureAlcohol } from '../../utils/calculator';
import styles from './AddPage.module.css';

const DRINK_TYPES = [
  { type: 'wine', name: '葡萄酒', icon: '🍷', defaultVolume: 150, defaultAbv: 12 },
  { type: 'beer', name: '啤酒', icon: '🍺', defaultVolume: 500, defaultAbv: 4 },
  { type: 'spirit', name: '白酒', icon: '🥃', defaultVolume: 50, defaultAbv: 52 },
  { type: 'cocktail', name: '鸡尾酒', icon: '🍸', defaultVolume: 100, defaultAbv: 15 },
  { type: 'sake', name: '清酒', icon: '🍶', defaultVolume: 100, defaultAbv: 15 },
  { type: 'whiskey', name: '威士忌', icon: '🥃', defaultVolume: 45, defaultAbv: 40 },
];

export function AddPage() {
  const [, navigate] = useLocation();
  const addRecord = useDrinkStore((state) => state.addRecord);
  const defaultDrinkType = useUserStore(
    (state) => state.preferences.defaultDrinkType
  );

  const [selectedType, setSelectedType] = useState(
    DRINK_TYPES.find((t) => t.type === defaultDrinkType) || DRINK_TYPES[1]
  );
  const [name, setName] = useState(selectedType.name);
  const [volume, setVolume] = useState(selectedType.defaultVolume);
  const [abv, setAbv] = useState(selectedType.defaultAbv);

  const pureAlcohol = calculatePureAlcohol(volume, abv);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setName(type.name);
    setVolume(type.defaultVolume);
    setAbv(type.defaultAbv);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addRecord({
      type: selectedType.type,
      name,
      volume,
      abv,
      timestamp: new Date().toISOString(),
    });
    navigate('/');
  };

  const adjustVolume = (delta) => {
    setVolume((prev) => Math.max(10, prev + delta));
  };

  const adjustAbv = (delta) => {
    setAbv((prev) => Math.max(0, Math.min(100, prev + delta)));
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ChevronLeft size={24} />
        </Link>
        <h1 className={styles.title}>添加记录</h1>
        <div className={styles.placeholder} />
      </header>

      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Drink Type Selector */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>选择饮品类型</h2>
          <div className={styles.typeGrid}>
            {DRINK_TYPES.map((type) => (
              <button
                key={type.type}
                type="button"
                className={`${styles.typeButton} ${
                  selectedType.type === type.type ? styles.active : ''
                }`}
                onClick={() => handleTypeSelect(type)}
              >
                <span className={styles.typeIcon}>{type.icon}</span>
                <span className={styles.typeName}>{type.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Drink Name */}
        <section className={styles.section}>
          <label className={styles.label}>
            饮品名称
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              placeholder="例如：青岛啤酒"
              required
            />
          </label>
        </section>

        {/* Volume and ABV */}
        <section className={styles.section}>
          <div className={styles.inputRow}>
            {/* Volume */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>容量 (ml)</label>
              <div className={styles.numberInput}>
                <button
                  type="button"
                  className={styles.adjustBtn}
                  onClick={() => adjustVolume(-50)}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className={styles.numberField}
                  min="10"
                  required
                />
                <button
                  type="button"
                  className={styles.adjustBtn}
                  onClick={() => adjustVolume(50)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* ABV */}
            <div className={styles.inputGroup}>
              <label className={styles.label}>酒精度 (%)</label>
              <div className={styles.numberInput}>
                <button
                  type="button"
                  className={styles.adjustBtn}
                  onClick={() => adjustAbv(-0.5)}
                >
                  <Minus size={16} />
                </button>
                <input
                  type="number"
                  value={abv}
                  onChange={(e) => setAbv(Number(e.target.value))}
                  className={styles.numberField}
                  min="0"
                  max="100"
                  step="0.1"
                  required
                />
                <button
                  type="button"
                  className={styles.adjustBtn}
                  onClick={() => adjustAbv(0.5)}
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Preview */}
        <section className={styles.preview}>
          <div className={styles.previewLabel}>预计摄入</div>
          <div className={styles.previewValue}>
            {pureAlcohol.toFixed(1)}g
            <span className={styles.previewUnit}>纯酒精</span>
          </div>
        </section>

        {/* Submit Button */}
        <button type="submit" className={styles.submitBtn}>
          添加记录
        </button>
      </form>
    </div>
  );
}
