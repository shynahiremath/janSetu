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
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/auth/register", {
        name: form.name, phone: form.phone, password: form.password,
        farmLat: form.farmLat ? Number(form.farmLat) : undefined,
        farmLng: form.farmLng ? Number(form.farmLng) : undefined,
      });
      setAuth(data.accessToken, data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not create account.");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-10">
      <Card className="w-full max-w-sm" padding="lg">
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Create account</h1>
        <p className="text-gray-500 text-sm mt-1 mb-6">Join Jan Setu</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required autoComplete="name" />
          <Input label="Phone number" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required autoComplete="tel" inputMode="tel" />
          <Input label="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required autoComplete="new-password" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Latitude" value={form.farmLat} onChange={(e) => setForm({ ...form, farmLat: e.target.value })} placeholder="Optional" inputMode="decimal" />
            <Input label="Longitude" value={form.farmLng} onChange={(e) => setForm({ ...form, farmLng: e.target.value })} placeholder="Optional" inputMode="decimal" />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <Button type="submit" fullWidth disabled={loading}>{loading ? "Creating\u2026" : "Create account"}</Button>
        </form>
        <p className="text-sm text-gray-500 mt-5 text-center">Already registered? <Link to="/login" className="text-gray-900 font-medium underline-offset-2 hover:underline">Sign in</Link></p>
      </Card>
    </div>
  );
}
