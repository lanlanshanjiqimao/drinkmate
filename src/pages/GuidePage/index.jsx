import { BookOpen, AlertCircle, CheckCircle, Clock, Heart } from 'lucide-react';
import styles from './GuidePage.module.css';

export function GuidePage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>科学饮酒指南</h1>
        <p className={styles.subtitle}>了解安全饮酒知识，养成健康习惯</p>
      </header>

      {/* Safety Standards */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <CheckCircle className={styles.sectionIcon} size={20} />
          <h2 className={styles.sectionTitle}>适度标准</h2>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>👨</div>
            <div className={styles.cardContent}>
              <h3>男性</h3>
              <p className={styles.limit}>≤ 25g / 天</p>
              <p className={styles.detail}>约 2.5 标准杯</p>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardIcon}>👩</div>
            <div className={styles.cardContent}>
              <h3>女性</h3>
              <p className={styles.limit}>≤ 15g / 天</p>
              <p className={styles.detail}>约 1.5 标准杯</p>
            </div>
          </div>
        </div>

        <div className={styles.tip}>
          <Clock size={16} />
          <p>每周建议至少 2-3 天完全不饮酒，给肝脏足够的代谢和恢复时间。</p>
        </div>
      </section>

      {/* Drinking Tips */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <Heart className={styles.sectionIcon} size={20} />
          <h2 className={styles.sectionTitle}>健康饮酒建议</h2>
        </div>

        <div className={styles.tipsList}>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}>✓</span>
            <p>饮酒前先吃些食物，减缓酒精吸收</p>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}>✓</span>
            <p>边吃边喝，控制饮酒速度</p>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}>✓</span>
            <p>饮酒后多喝水，促进代谢</p>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}>✗</span>
            <p>避免空腹饮酒</p>
          </div>
          <div className={styles.tipItem}>
            <span className={styles.tipIcon}>✗</span>
            <p>不与碳酸饮料混饮（加速吸收）</p>
          </div>
        </div>
      </section>

      {/* Safety Warnings */}
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <AlertCircle className={styles.sectionIcon} size={20} />
          <h2 className={styles.sectionTitle}>安全提醒</h2>
        </div>

        <div className={styles.warnings}>
          <div className={styles.warning}>
            <span className={styles.warningIcon}>⚠️</span>
            <div>
              <h4>服用药物期间禁酒</h4>
              <p>尤其抗生素、镇静剂、降糖药等</p>
            </div>
          </div>

          <div className={styles.warning}>
            <span className={styles.warningIcon}>🤰</span>
            <div>
              <h4>特殊时期禁酒</h4>
              <p>备孕、怀孕、哺乳期完全禁酒</p>
            </div>
          </div>

          <div className={styles.warning}>
            <span className={styles.warningIcon}>🚫</span>
            <div>
              <h4>酒后禁止驾车</h4>
              <p>即使"感觉清醒"也可能超标</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <BookOpen size={16} />
        <p>数据来源：世界卫生组织（WHO）及中国居民膳食指南</p>
      </footer>
    </div>
  );
}
