import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../lib/apiClient";
import { useAuthStore } from "../store/authStore";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";

export default function Register() {
  const [form, setForm] = useState({ name: "", phone: "", password: "", farmLat: "", farmLng: "" });
  const [error, setError] = useState("");
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/register", form);
      setAuth(data.accessToken, data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">Create your account</h1>
        <p className="text-gray-500 text-sm mb-6">Join Jan Setu</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input placeholder="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <Input placeholder="Farm latitude" value={form.farmLat} onChange={(e) => setForm({ ...form, farmLat: e.target.value })} />
            <Input placeholder="Farm longitude" value={form.farmLng} onChange={(e) => setForm({ ...form, farmLng: e.target.value })} />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <Button type="submit" className="w-full">Create account</Button>
        </form>
        <p className="text-sm text-gray-500 mt-4">
          Already have an account? <Link to="/login" className="text-gray-900 font-medium">Sign in</Link>
        </p>
      </Card>
    </div>
  );
}