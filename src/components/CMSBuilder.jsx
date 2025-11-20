import { useEffect, useState } from "react";

const API = import.meta.env.VITE_BACKEND_URL || "";

export default function CMSBuilder({ token, tenantId }) {
  const [pages, setPages] = useState([]);
  const [path, setPath] = useState("/");
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [preview, setPreview] = useState(false);

  const headers = token ? { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } : {"Content-Type":"application/json"};

  const load = async () => {
    const res = await fetch(`${API}/cms/pages?tenant_id=${tenantId}`);
    const data = await res.json();
    setPages(data || []);
  };

  useEffect(() => { if (tenantId) load(); }, [tenantId]);

  const addBlock = () => {
    setBlocks([...blocks, { type: "text", props: { text: "New block" } }]);
  };

  const save = async () => {
    const res = await fetch(`${API}/cms/pages?tenant_id=${tenantId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ path, title, blocks, published: true })
    });
    if (res.ok) load();
  };

  return (
    <div className="bg-slate-800/50 border border-blue-500/20 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">CMS Builder</h3>
        <div className="flex gap-2">
          <button onClick={()=>setPreview(!preview)} className="px-3 py-1 rounded bg-slate-700 text-blue-200/80">{preview? 'Edit' : 'Preview'}</button>
          <button onClick={save} className="px-3 py-1 rounded bg-blue-600 text-white">Save</button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <input placeholder="Path e.g. /, /about" value={path} onChange={e=>setPath(e.target.value)} className="mb-2 w-full px-3 py-2 rounded bg-slate-900/60 border border-slate-700 text-white"/>
          <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="mb-2 w-full px-3 py-2 rounded bg-slate-900/60 border border-slate-700 text-white"/>
          <div className="space-y-2">
            {blocks.map((b, i) => (
              <div key={i} className="p-3 bg-slate-900/60 border border-slate-700 rounded">
                <input value={b.props.text} onChange={e=>{
                  const clone = [...blocks];
                  clone[i].props.text = e.target.value;
                  setBlocks(clone);
                }} className="w-full px-2 py-1 rounded bg-slate-800 border border-slate-700 text-white"/>
              </div>
            ))}
          </div>
          <button onClick={addBlock} className="mt-3 px-3 py-1 rounded bg-slate-700 text-blue-200/80">Add text block</button>
        </div>

        <div className="p-4 bg-slate-900/60 border border-slate-700 rounded">
          <h4 className="text-white font-semibold mb-2">Preview</h4>
          <div className="prose prose-invert">
            <h2>{title}</h2>
            {blocks.map((b, i) => (
              <p key={i}>{b.props.text}</p>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h4 className="text-white font-semibold mb-2">Existing Pages</h4>
        <ul className="space-y-2">
          {pages.map((p)=> (
            <li key={p.id} className="text-blue-200/90">{p.path} — {p.title}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
