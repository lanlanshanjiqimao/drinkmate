import { useState } from 'react';
import { Link } from 'wouter';
import { Plus, Trash2 } from 'lucide-react';
import { DrinkRing } from '../../components/features/DrinkRing';
import { useDrinkStore, useUserStore } from '../../stores';
import { getDrinkIcon, formatPureAlcohol, formatTime } from '../../utils/formatter';
import styles from './HomePage.module.css';

export function HomePage() {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const records = useDrinkStore((state) => state.records);
  const removeRecord = useDrinkStore((state) => state.removeRecord);
  const addRecord = useDrinkStore((state) => state.addRecord);
  const dailyLimit = useUserStore((state) => state.dailyLimit);
  const preferences = useUserStore((state) => state.preferences);

  // 计算今日统计，基于 records 派生
  const todayStats = (() => {
    const totalAlcohol = records.reduce(
      (sum, record) => sum + record.pureAlcohol,
      0
    );
    const percentage = Math.min((totalAlcohol / dailyLimit) * 100, 100);
    let color = 'var(--ring-gold)', status = 'safe';
    if (percentage > 80) { color = 'var(--ring-red)'; status = 'danger'; }
    else if (percentage > 60) { color = 'var(--ring-orange)'; status = 'critical'; }
    else if (percentage > 40) { color = 'var(--ring-amber)'; status = 'warning'; }
    return {
      totalAlcohol,
      standardDrinks: totalAlcohol / 14,
      calories: totalAlcohol * 7,
      percentage,
      recordCount: records.length,
      isOverLimit: percentage > 100,
      ringColor: color,
      status,
    };
  })();

  const handleDelete = (id) => {
    if (showDeleteConfirm === id) {
      removeRecord(id);
      setShowDeleteConfirm(null);
    } else {
      setShowDeleteConfirm(id);
      setTimeout(() => setShowDeleteConfirm(null), 2000);
    }
  };

  // 快速添加处理
  const handleQuickAdd = (type) => {
    const presets = {
      wine: { defaultName: '葡萄酒', defaultVolume: 150, defaultAbv: 12 },
      beer: { defaultName: '啤酒', defaultVolume: 500, defaultAbv: 4 },
      spirit: { defaultName: '白酒', defaultVolume: 50, defaultAbv: 52 },
      cocktail: { defaultName: '鸡尾酒', defaultVolume: 100, defaultAbv: 15 },
    };
    const preset = presets[type];
    addRecord({
      type,
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

      {/* Stats Cards */}
      <section className={styles.statsSection}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>
            {todayStats.totalAlcohol.toFixed(1)}
          </div>
          <div className={styles.statLabel}>克纯酒精</div>
        </div>

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
          <button
            className={styles.actionBtn}
            onClick={() => handleQuickAdd('wine')}
            aria-label="快速添加葡萄酒"
          >
            <span className={styles.actionIcon}>🍷</span>
            <span className={styles.actionLabel}>葡萄酒</span>
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => handleQuickAdd('beer')}
            aria-label="快速添加啤酒"
          >
            <span className={styles.actionIcon}>🍺</span>
            <span className={styles.actionLabel}>啤酒</span>
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => handleQuickAdd('spirit')}
            aria-label="快速添加白酒"
          >
            <span className={styles.actionIcon}>🥃</span>
            <span className={styles.actionLabel}>白酒</span>
          </button>
          <button
            className={styles.actionBtn}
            onClick={() => handleQuickAdd('cocktail')}
            aria-label="快速添加鸡尾酒"
          >
            <span className={styles.actionIcon}>🍸</span>
            <span className={styles.actionLabel}>鸡尾酒</span>
          </button>
        </div>
      </section>

      {/* Records List */}
      <section className={styles.recordsSection}>
        <div className={styles.recordsHeader}>
          <h3 className={styles.sectionTitle}>今日记录</h3>
          <span className={styles.recordCount}>{records.length} 条</span>
        </div>

        {records.length === 0 ? (
          <div className={styles.emptyState}>
            <p>还没有饮酒记录</p>
            <p className={styles.emptyHint}>点击右下角 + 开始记录</p>
          </div>
        ) : (
          <div className={styles.recordsList}>
            {[...records].reverse().map((record) => (
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
                  <span className={styles.alcoholAmount}>
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
