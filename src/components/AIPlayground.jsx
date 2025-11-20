import { useEffect, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function AIPlayground({ token, tenantId }) {
  const [services, setServices] = useState([]);
  const [serviceKey, setServiceKey] = useState("");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const headers = token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {"Content-Type":"application/json"};

  const load = async () => {
    const res = await fetch(`${API}/ai/services`);
    const data = await res.json();
    setServices(data || []);
    if (data && data.length) setServiceKey(data[0].key);
  };

  useEffect(() => { load(); }, []);

  const seed = async () => {
    const defaults = [
      { key: 'openai-gpt4o', display_name: 'OpenAI GPT-4o', pricing_per_1k_tokens_cents: 500, input_multiplier: 1.0, output_multiplier: 1.0, enabled: true },
      { key: 'anthropic-claude', display_name: 'Anthropic Claude', pricing_per_1k_tokens_cents: 480, input_multiplier: 1.0, output_multiplier: 1.0, enabled: true },
      { key: 'google-gemini', display_name: 'Google Gemini', pricing_per_1k_tokens_cents: 320, input_multiplier: 1.0, output_multiplier: 1.0, enabled: true },
      { key: 'deepseek-chat', display_name: 'DeepSeek Chat', pricing_per_1k_tokens_cents: 100, input_multiplier: 1.0, output_multiplier: 1.0, enabled: true },
      { key: 'meta-llama', display_name: 'Meta LLaMA', pricing_per_1k_tokens_cents: 80, input_multiplier: 1.0, output_multiplier: 1.0, enabled: true },
    ];
    for (const d of defaults) {
      await fetch(`${API}/ai/services`, { method: 'POST', headers, body: JSON.stringify(d) });
    }
    load();
  };

  const run = async () => {
    setLoading(true);
    setResponse(null);
    const res = await fetch(`${API}/ai/complete`, { method: 'POST', headers, body: JSON.stringify({ tenant_id: tenantId, service_key: serviceKey, prompt }) });
    const data = await res.json();
    setResponse(data);
    setLoading(false);
  };

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">AI Playground</h3>
        <button onClick={seed} className="px-3 py-1 rounded bg-slate-700 text-blue-200/80">Seed services</button>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        <select value={serviceKey} onChange={e=>setServiceKey(e.target.value)} className="px-3 py-2 rounded bg-slate-900/60 border border-slate-700 text-white">
          {services.map(s => (
            <option key={s.key} value={s.key}>{s.display_name}</option>
          ))}
        </select>
        <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Ask something..." className="md:col-span-2 px-3 py-2 rounded bg-slate-900/60 border border-slate-700 text-white"/>
      </div>
      <button onClick={run} disabled={loading || !tenantId || !token} className="mt-3 px-4 py-2 rounded bg-blue-600 text-white">
        {loading ? 'Running...' : 'Run'}
      </button>
      {response && (
        <div className="mt-4 p-4 bg-slate-900/60 border border-slate-700 rounded text-blue-200/90">
          <div className="font-semibold mb-2">Response</div>
          <pre className="whitespace-pre-wrap text-sm">{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
