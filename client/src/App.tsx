import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { DashboardShell } from "./components/Layout/DashboardShell";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Activity from "./pages/Activity";
import Help from "./pages/Help";
import AgricultureOverview from "./pages/agriculture/AgricultureOverview";
import HealthcareOverview from "./pages/healthcare/HealthcareOverview";
import FinanceOverview from "./pages/finance/FinanceOverview";
import MandiPrices from "./modules/agriculture/MandiPrices";
import DiseaseDetection from "./modules/agriculture/DiseaseDetection";
import SmartIrrigation from "./modules/agriculture/SmartIrrigation";
import YieldPrediction from "./modules/agriculture/YieldPrediction";
import SymptomChecker from "./modules/health/SymptomChecker";
import Khatabook from "./modules/finance/Khatabook";
import FinanceHealthScore from "./modules/finance/FinanceHealthScore";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.accessToken);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route element={<ProtectedRoute><DashboardShell /></ProtectedRoute>}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/activity" element={<Activity />} />
        <Route path="/help" element={<Help />} />
        <Route path="/agriculture" element={<AgricultureOverview />} />
        <Route path="/agriculture/irrigation" element={<SmartIrrigation />} />
        <Route path="/agriculture/yield" element={<YieldPrediction />} />
        <Route path="/agriculture/market" element={<MandiPrices />} />
        <Route path="/agriculture/disease" element={<DiseaseDetection />} />
        <Route path="/health" element={<HealthcareOverview />} />
        <Route path="/health/check" element={<SymptomChecker />} />
        <Route path="/finance" element={<FinanceOverview />} />
        <Route path="/finance/khatabook" element={<Khatabook />} />
        <Route path="/finance/score" element={<FinanceHealthScore />} />
      </Route>
    </Routes>
  );
}
