import { useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function AuthPanel({ onAuth }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [tenantName, setTenantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const url = mode === "login" ? "/auth/login" : "/auth/register";
      const body = mode === "login"
        ? { email, password }
        : { email, password, name, tenant_name: tenantName };
      const res = await fetch(API + url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Request failed");
      const token = data.access_token;
      onAuth(token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setMode("login")} className={`px-3 py-1 rounded ${mode==='login' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-blue-200/80'}`}>Login</button>
        <button onClick={() => setMode("register")} className={`px-3 py-1 rounded ${mode==='register' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-blue-200/80'}`}>Register</button>
      </div>
      <form onSubmit={submit} className="grid gap-3">
        {mode === "register" && (
          <>
            <input placeholder="Your name" value={name} onChange={e=>setName(e.target.value)} className="px-3 py-2 rounded bg-slate-900/60 border border-slate-700 text-white"/>
            <input placeholder="Workspace name" value={tenantName} onChange={e=>setTenantName(e.target.value)} className="px-3 py-2 rounded bg-slate-900/60 border border-slate-700 text-white"/>
          </>
        )}
        <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="px-3 py-2 rounded bg-slate-900/60 border border-slate-700 text-white"/>
        <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="px-3 py-2 rounded bg-slate-900/60 border border-slate-700 text-white"/>
        {error && <div className="text-red-400 text-sm">{error}</div>}
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-500 transition text-white px-4 py-2 rounded">
          {loading ? 'Please wait...' : (mode === 'login' ? 'Login' : 'Create account')}
        </button>
      </form>
    </div>
  );
}
