import { useState } from 'react';
import { Link } from 'wouter';
import { ChevronLeft, User, Bell, Database, Trash2, Download, Upload, Info } from 'lucide-react';
import { useUserStore, useDrinkStore } from '../../stores';
import { exportData, importData } from '../../utils/storage';
import styles from './SettingsPage.module.css';

export function SettingsPage() {
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [importStatus, setImportStatus] = useState(null);

  const user = useUserStore();
  const records = useDrinkStore((state) => state.records);
  const clearAllRecords = useDrinkStore((state) => state.clearTodayRecords);

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `drinkmate-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const success = importData(event.target.result);
        if (success) {
          setImportStatus({ type: 'success', message: '数据导入成功！' });
        } else {
          setImportStatus({ type: 'error', message: '数据格式错误，导入失败。' });
        }
      } catch {
        setImportStatus({ type: 'error', message: '文件读取失败。' });
      }
      setTimeout(() => setImportStatus(null), 3000);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (showResetConfirm) {
      localStorage.clear();
      window.location.reload();
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <Link href="/" className={styles.backButton}>
          <ChevronLeft size={24} />
        </Link>
        <h1 className={styles.title}>设置</h1>
        <div className={styles.placeholder} />
      </header>

      {/* Profile Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <User size={18} />
          个人资料
        </h2>

        <div className={styles.card}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>每日上限</span>
            <span className={styles.infoValue}>{user.dailyLimit}g 纯酒精</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>记录总数</span>
            <span className={styles.infoValue}>{records.length} 条</span>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Bell size={18} />
          偏好设置
        </h2>

        <div className={styles.card}>
          <label className={styles.toggleRow}>
            <span>显示热量</span>
            <input
              type="checkbox"
              checked={user.preferences.showCalories}
              onChange={(e) =>
                user.updatePreferences({ showCalories: e.target.checked })
              }
              className={styles.toggle}
            />
          </label>
          <label className={styles.toggleRow}>
            <span>显示标准杯</span>
            <input
              type="checkbox"
              checked={user.preferences.showStandardDrinks}
              onChange={(e) =>
                user.updatePreferences({ showStandardDrinks: e.target.checked })
              }
              className={styles.toggle}
            />
          </label>
        </div>
      </section>

      {/* Data Management Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>
          <Database size={18} />
          数据管理
        </h2>

        <div className={styles.card}>
          <button className={styles.actionRow} onClick={handleExport}>
            <Download size={20} />
            <span>导出数据</span>
          </button>

          <label className={styles.actionRow}>
            <Upload size={20} />
            <span>导入数据</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className={styles.hiddenInput}
            />
          </label>

          {importStatus && (
            <div
              className={`${styles.statusMessage} ${
                importStatus.type === 'success'
                  ? styles.success
                  : styles.error
              }`}
            >
              {importStatus.message}
            </div>
          )}
        </div>
      </section>

      {/* Danger Zone */}
      <section className={styles.dangerSection}>
        <h2 className={styles.dangerTitle}>
          <Trash2 size={18} />
          危险区域
        </h2>

        <button
          className={`${styles.dangerBtn} ${
            showResetConfirm ? styles.confirming : ''
          }`}
          onClick={handleReset}
        >
          {showResetConfirm ? '确认清除所有数据？' : '清除所有数据'}
        </button>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <Info size={16} />
        <p>DrinkMate v1.0.0 · 健康饮酒，快乐生活</p>
      </footer>
    </div>
  );
}
