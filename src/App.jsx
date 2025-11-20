import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import AuthPanel from "./components/AuthPanel";
import CMSBuilder from "./components/CMSBuilder";
import AIPlayground from "./components/AIPlayground";

const API = import.meta.env.VITE_BACKEND_URL || "";

function App() {
  const [token, setToken] = useState("");
  const [tenants, setTenants] = useState([]);
  const [tenantId, setTenantId] = useState("");

  useEffect(() => {
    const loadTenants = async () => {
      if (!token) return;
      const res = await fetch(`${API}/tenants/my`, { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      setTenants(data || []);
      if (data && data.length) setTenantId(data[0].id || data[0]._id);
    };
    loadTenants();
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.05),transparent_50%)]"></div>
      <div className="relative max-w-6xl mx-auto px-6 py-10">
        <Hero />

        {!token ? (
          <div className="grid md:grid-cols-2 gap-6">
            <AuthPanel onAuth={setToken} />
            <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6 text-blue-200/90">
              <h3 className="text-white font-semibold mb-2">What you get</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Register/login and JWT auth</li>
                <li>Create a workspace during registration</li>
                <li>CMS page builder with blocks</li>
                <li>AI services catalog + token metering</li>
                <li>Plans, subscriptions, usage</li>
              </ul>
              <div className="mt-4 text-xs opacity-70">Connect Stripe, email, and real AI providers later.</div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-6">
              <select value={tenantId} onChange={(e)=>setTenantId(e.target.value)} className="px-3 py-2 rounded bg-slate-900/60 border border-slate-700 text-white">
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              <button onClick={()=>{ setToken(""); setTenantId(""); }} className="px-3 py-1 rounded bg-slate-700 text-blue-200/80">Logout</button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <CMSBuilder token={token} tenantId={tenantId} />
              <AIPlayground token={token} tenantId={tenantId} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
