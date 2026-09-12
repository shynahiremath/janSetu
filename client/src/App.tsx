import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";
import { DashboardShell } from "./components/Layout/DashboardShell";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import MandiPrices from "./modules/agriculture/MandiPrices";
import DiseaseDetection from "./modules/agriculture/DiseaseDetection";
import SymptomChecker from "./modules/health/SymptomChecker";
import Khatabook from "./modules/finance/Khatabook";
import FinanceHealthScore from "./modules/finance/FinanceHealthScore";
import SmartIrrigation from "./modules/agriculture/SmartIrrigation";
import YieldPrediction from "./modules/agriculture/YieldPrediction";

function ProtectedRoute({ children }: { children: JSX.Element }) {
  const token = useAuthStore((s) => s.accessToken);
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        element={
          <ProtectedRoute>
            <DashboardShell />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/agriculture" element={<MandiPrices />} />
        <Route path="/agriculture/disease" element={<DiseaseDetection />} />
        <Route path="/health" element={<SymptomChecker />} />
        <Route path="/finance" element={<Khatabook />} />
        <Route path="/finance/score" element={<FinanceHealthScore />} />
        <Route path="/agriculture/irrigation" element={<SmartIrrigation />} />
        <Route path="/agriculture/yield" element={<YieldPrediction />} />
      </Route>
    </Routes>
  );
}