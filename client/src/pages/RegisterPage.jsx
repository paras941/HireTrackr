import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../api/http";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await http.post("/auth/register", form);
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-2xl font-semibold">Create your account</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full rounded border p-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full rounded border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded border p-2" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-slate-900 p-2 text-white">Register</button>
      </form>
      <p className="mt-3 text-sm">
        Have an account? <Link className="text-blue-600" to="/login">Login</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
