import { Route, Router, useLocation } from 'wouter';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { AddPage } from './pages/AddPage';
import { CalculatorPage } from './pages/CalculatorPage';
import { GuidePage } from './pages/GuidePage';
import { SettingsPage } from './pages/SettingsPage';
import { useUserStore } from './stores';

// 首页路由组件，处理 onboarding 逻辑
function HomeRoute() {
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  const [, navigate] = useLocation();

  if (!hasCompletedOnboarding) {
    // 使用 useEffect 来避免渲染时导航的警告
    // 这里使用 setTimeout 确保在当前渲染周期完成后导航
    setTimeout(() => navigate('/onboarding'), 0);
    return null;
  }

  return <HomePage />;
}

// 根路径组件，根据 onboarding 状态决定显示哪个页面
function RootRoute() {
  const hasCompletedOnboarding = useUserStore((state) => state.hasCompletedOnboarding);
  return hasCompletedOnboarding ? <HomePage /> : <OnboardingPage />;
}

function App() {
  return (
    <Router>
      <AppShell>
        <Route path="/" component={RootRoute} />
        <Route path="/onboarding" component={OnboardingPage} />
        <Route path="/add" component={AddPage} />
        <Route path="/calculator" component={CalculatorPage} />
        <Route path="/guide" component={GuidePage} />
        <Route path="/settings" component={SettingsPage} />
      </AppShell>
    </Router>
  );
}

export default App;
