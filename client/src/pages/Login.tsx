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
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { phone, password });
      setAuth(data.accessToken, data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">🌉 Jan Setu</h1>
        <p className="text-gray-500 text-sm mb-6">Sign in to continue</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Phone number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          <Input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
        <p className="text-sm text-gray-500 mt-4">
          No account? <Link to="/register" className="text-gray-900 font-medium">Register</Link>
        </p>
      </Card>
    </div>
  );
}