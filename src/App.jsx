import { Route, Router } from 'wouter';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { AddPage } from './pages/AddPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { GuidePage } from './pages/GuidePage';
import { SettingsPage } from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <AppShell>
        <Route path="/" component={HomePage} />
        <Route path="/add" component={AddPage} />
        <Route path="/calculator" component={CalculatorPage} />
        <Route path="/guide" component={GuidePage} />
        <Route path="/settings" component={SettingsPage} />
      </AppShell>
    </Router>
  );
}

export default App;
