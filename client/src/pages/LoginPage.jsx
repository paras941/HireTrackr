import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import http from "../api/http";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const { data } = await http.post("/auth/login", { email, password });
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="mx-auto mt-20 max-w-md rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-2xl font-semibold">Login to HireTrackr</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input className="w-full rounded border p-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded border p-2" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded bg-slate-900 p-2 text-white">Login</button>
      </form>
      <p className="mt-3 text-sm">
        New user? <Link className="text-blue-600" to="/register">Create account</Link>
      </p>
    </div>
  );
};

export default LoginPage;
