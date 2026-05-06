import { useState, useEffect } from 'react';
import { Route, Router } from 'wouter';
import { useAuthStore, useDrinkStore, useUserStore } from './stores';
import { AppShell } from './components/layout/AppShell';
import { AuthGuard } from './components/auth/AuthGuard';
import { HomePage } from './pages/HomePage';
import { AddPage } from './pages/AddPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { GuidePage } from './pages/GuidePage';
import { SettingsPage } from './pages/SettingsPage';
import { LoginPage } from './pages/LoginPage';

function App() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    useDrinkStore.persist.rehydrate();
    useUserStore.persist.rehydrate();
    setReady(true);
  }, []);

  if (!ready) return null;

  return (
    <Router>
      <Route path="/login" component={LoginPage} />
      <AuthGuard>
        <AppShell>
          <Route path="/" component={HomePage} />
          <Route path="/add" component={AddPage} />
          <Route path="/calculator" component={CalculatorPage} />
          <Route path="/guide" component={GuidePage} />
          <Route path="/settings" component={SettingsPage} />
        </AppShell>
      </AuthGuard>
    </Router>
  );
}

export default App;
