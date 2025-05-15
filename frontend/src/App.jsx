import { useState } from 'react';

export default function App() {
  const [file,       setFile]       = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [prompt,     setPrompt]     = useState('');
  const [ratio,      setRatio]      = useState('1:1');
  const [brushSize,  setBrushSize]  = useState('M');
  const [loading,    setLoading]    = useState(false);
  const [editedUrl,  setEditedUrl]  = useState('');

  const resetAll = () => {
    setFile(null);
    setPreviewUrl('');
    setPrompt('');
    setRatio('1:1');
    setBrushSize('M');
    setEditedUrl('');
  };

  const handleFileChange = (e) => {
    const img = e.target.files?.[0] ?? null;
    if (img) {
      setFile(img);
      setPreviewUrl(URL.createObjectURL(img));
      setEditedUrl('');
    }
  };

  const handleEdit = async () => {
    if (!file || !prompt) return;
    setLoading(true);
    const form = new FormData();
    form.append('image', file);
    form.append('prompt', prompt);
    form.append('ratio', ratio);
    form.append('brush_size', brushSize);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/edit`,
        { method: 'POST', body: form }
      );
      if (!res.ok) throw new Error(await res.text());
      const { b64_json } = await res.json();
      setEditedUrl(`data:image/png;base64,${b64_json}`);
    } catch (err) {
      console.error(err);
      alert(`Edit error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header
        className="h-16 flex items-center px-6 mb-8"  // removed `bg-white shadow mb-8`
        style={{
          background: 'linear-gradient(to right,#FF8F00, #EE66A6, #640D5F)'
        }}
      >
        <h1
          className="text-3xl font-bold text-white"
          style={{ fontFamily: 'Sacramento,cursive' }}
        >
          Vision Forge
        </h1>
      </header>

      <div className="max-w-7xl mx-auto flex gap-6">
        {/* Col 1: Controls */}
        <section className="w-1/4 bg-white rounded-2xl shadow p-6 space-y-6">
          {/* Brush selector */}
          <div>
            <label className="block font-medium mb-2">Select Area</label>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-1 border rounded bg-gray-50">Brush</button>
              {['S','M','L'].map(sz => (
                <button
                  key={sz}
                  onClick={() => setBrushSize(sz)}
                  className={`
                    px-2 py-1 border rounded-full text-sm
                    ${brushSize === sz ? 'bg-blue-600 text-white' : 'bg-gray-100'}
                  `}
                  aria-label={`Brush size ${sz}`}
                >
                  {sz}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="block font-medium mb-2">Prompt</label>
            <input
              type="text"
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe your edit…"
              disabled={!file || loading}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            />
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block font-medium mb-2">Aspect Ratio</label>
            <select
              value={ratio}
              onChange={e => setRatio(e.target.value)}
              disabled={!file || loading}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none disabled:opacity-50"
            >
              {['1:1','16:9','4:5','9:16'].map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          {/* Generate / Regenerate */}
          <button
            onClick={handleEdit}
            disabled={!file || !prompt || loading}
            className="w-full flex justify-center items-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"/>
                  <path fill="currentColor" className="opacity-75" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
                </svg>
              : (editedUrl ? 'Regenerate' : 'Generate')
            }
          </button>
        </section>

        {/* Col 2: Original Image */}
        <section className="w-3/8 bg-white rounded-2xl shadow p-6 relative">
          {file && (
            <button
              onClick={resetAll}
              className="absolute top-4 right-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300"
              title="Reupload Image (resets prompt & ratio)"
            >
              ↻
            </button>
          )}

          {!file ? (
            <label className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={loading}
              />
              <span className="text-gray-600">Click or drag & drop to upload</span>
            </label>
          ) : (
            <div className="h-64 overflow-hidden rounded-lg">
              <img
                src={previewUrl}
                alt="Original"
                className="w-full h-full object-contain"
              />
              {/* TODO: mask canvas overlay here */}
            </div>
          )}
        </section>

        {/* Col 3: Generated Image */}
        <section className="w-3/8 bg-white rounded-2xl shadow p-6 relative flex flex-col items-center">
          {editedUrl && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <button className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300">
                Save Draft
              </button>
              <a
                href={editedUrl}
                download="vision-forge-edit.png"
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Download
              </a>
            </div>
          )}

          {!editedUrl ? (
            <div className="mt-12 text-gray-400">No preview yet</div>
          ) : (
            <img
              src={editedUrl}
              alt="Edited"
              className="max-h-64 object-contain rounded-lg"
            />
          )}
        </section>
      </div>
    </div>
  );
}
