import { useState, useMemo } from 'react';
import { Link } from 'wouter';
import { Plus, Trash2 } from 'lucide-react';
import { DrinkRing } from '../../components/features/DrinkRing';
import { useDrinkStore, useUserStore } from '../../stores';
import { DRINK_PRESETS, DYNAMIC_TIPS } from '../../utils/constants';
import { getDrinkIcon, formatPureAlcohol, formatTime } from '../../utils/formatter';
import { getRingColor } from '../../utils/calculator';
import styles from './HomePage.module.css';

export function HomePage() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const records = useDrinkStore((state) => state.records);
  const removeRecord = useDrinkStore((state) => state.removeRecord);
  const addRecord = useDrinkStore((state) => state.addRecord);
  const dailyLimit = useUserStore((state) => state.dailyLimit);
  const preferences = useUserStore((state) => state.preferences);

  const todayRecords = useMemo(() => {
    const now = new Date();
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const endOfDay = startOfDay + 86400000;
    return records.filter((r) => {
      const ts = new Date(r.timestamp).getTime();
      return ts >= startOfDay && ts < endOfDay;
    });
  }, [records]);

  const todayStats = useMemo(() => {
    const totalAlcohol = todayRecords.reduce((sum, r) => sum + r.pureAlcohol, 0);
    const percentage = (totalAlcohol / dailyLimit) * 100;
    const { color, glow, status } = getRingColor(percentage);
    return {
      totalAlcohol,
      standardDrinks: totalAlcohol / 10,
      calories: totalAlcohol * 7,
      percentage,
      recordCount: todayRecords.length,
      isOverLimit: percentage > 100,
      ringColor: color,
      ringGlow: glow,
      status,
    };
  }, [todayRecords, dailyLimit]);

  const dynamicTip = DYNAMIC_TIPS.find((tip) => todayStats.percentage <= tip.max);
  const remaining = Math.max(0, dailyLimit - todayStats.totalAlcohol);

  const getAlcoholLevel = (pureAlcohol) => {
    if (pureAlcohol >= 25) return styles.alcoholExtreme;
    if (pureAlcohol >= 15) return styles.alcoholHeavy;
    if (pureAlcohol >= 8) return styles.alcoholMedium;
    return styles.alcoholLight;
  };

  const handleDelete = (id) => {
    if (showDeleteConfirm === id) {
      removeRecord(id);
      setShowDeleteConfirm(null);
    } else {
      setShowDeleteConfirm(id);
      setTimeout(() => setShowDeleteConfirm(null), 2000);
    }
  };

  const handleQuickAdd = (preset) => {
    addRecord({
      type: preset.type,
      name: preset.defaultName,
      volume: preset.defaultVolume,
      abv: preset.defaultAbv,
      timestamp: new Date().toISOString(),
    });
  };

  const today = new Date();
  const dateStr = today.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>DrinkMate</h1>
        <p className={styles.date}>{dateStr}</p>
      </header>

      {/* Ring Section */}
      <section className={styles.ringSection}>
        <DrinkRing
          percentage={todayStats.percentage}
          currentAmount={todayStats.totalAlcohol}
          dailyLimit={dailyLimit}
          size={240}
        />
      </section>

      {/* Dynamic Tip */}
      <section className={`${styles.tipCard} ${styles[todayStats.status]}`}>
        <p className={styles.tipText}>{dynamicTip?.message}</p>
        {remaining > 0 && !todayStats.isOverLimit && (
          <p className={styles.tipRemaining}>还可摄入 {remaining.toFixed(1)}g 纯酒精</p>
        )}
      </section>

      {/* Stats Cards */}
      <section className={styles.statsSection}>
        {preferences.showStandardDrinks && (
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {todayStats.standardDrinks.toFixed(1)}
            </div>
            <div className={styles.statLabel}>标准杯</div>
          </div>
        )}

        {preferences.showCalories && (
          <div className={styles.statCard}>
            <div className={styles.statValue}>
              {Math.round(todayStats.calories)}
            </div>
            <div className={styles.statLabel}>千卡</div>
          </div>
        )}
      </section>

      {/* Quick Actions */}
      <section className={styles.quickActions}>
        <h3 className={styles.sectionTitle}>快速录入</h3>
        <div className={styles.actionGrid}>
          {DRINK_PRESETS.map((preset) => (
            <button
              key={preset.type}
              className={styles.actionBtn}
              onClick={() => handleQuickAdd(preset)}
              aria-label={`快速添加${preset.defaultName}`}
            >
              <span className={styles.actionIcon}>{preset.icon}</span>
              <span className={styles.actionLabel}>{preset.defaultName} {preset.defaultVolume}ml</span>
            </button>
          ))}
        </div>
      </section>

      {/* Records List */}
      <section className={styles.recordsSection}>
        <div className={styles.recordsHeader}>
          <h3 className={styles.sectionTitle}>今日记录</h3>
          <span className={styles.recordCount}>{todayRecords.length} 条</span>
        </div>

        {todayRecords.length === 0 ? (
          <div className={styles.emptyState}>
            <p>还没有饮酒记录</p>
            <p className={styles.emptyHint}>点击右下角 + 开始记录</p>
          </div>
        ) : (
          <div className={styles.recordsList}>
            {[...todayRecords].reverse().map((record) => (
              <div key={record.id} className={styles.recordItem}>
                <div className={styles.recordIcon}>
                  {getDrinkIcon(record.type)}
                </div>
                <div className={styles.recordInfo}>
                  <div className={styles.recordName}>{record.name}</div>
                  <div className={styles.recordDetail}>
                    {record.volume}ml · {formatTime(record.timestamp)}
                  </div>
                </div>
                <div className={styles.recordAlcohol}>
                  <span className={`${styles.alcoholAmount} ${getAlcoholLevel(record.pureAlcohol)}`}>
                    {formatPureAlcohol(record.pureAlcohol)}
                  </span>
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(record.id)}
                    aria-label="删除记录"
                  >
                    {showDeleteConfirm === record.id ? (
                      <span className={styles.confirmText}>确认</span>
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* FAB Button */}
      <Link href="/add" className={styles.fabButton} aria-label="添加记录">
        <Plus size={28} />
      </Link>
    </div>
  );
}
