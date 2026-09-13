import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/apiClient";
import { useAuthStore } from "../store/authStore";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { phone, password });
      setAuth(data.accessToken, data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not sign in. Check phone and password.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm" padding="lg">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Jan Setu</h1>
        <p className="text-gray-500 text-sm mt-1 mb-6">Sign in to continue</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required autoComplete="tel" inputMode="tel" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <Button type="submit" fullWidth disabled={loading}>{loading ? "Signing in\u2026" : "Sign in"}</Button>
        </form>
        <p className="text-sm text-gray-500 mt-5 text-center">No account? <Link to="/register" className="text-gray-900 font-medium underline-offset-2 hover:underline">Register</Link></p>
      </Card>
    </div>
  );
}
