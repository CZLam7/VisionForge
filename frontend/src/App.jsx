import { useState } from 'react';

export default function App() {
  const [file,       setFile]       = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [prompt,     setPrompt]     = useState('');
  const [ratio,      setRatio]      = useState('1:1');
  const [brushSize,  setBrushSize]  = useState('M');
  const [loading,    setLoading]    = useState(false);
  const [editedUrl,  setEditedUrl]  = useState('');;

  // —— New state for brush mode & mask data ——
  const [brushActive, setBrushActive] = useState(false);
  const [maskData,    setMaskData]    = useState(null);

  // —— Handler to toggle brush on/off ——  
  const toggleBrush = () => {
    if (!file) {
      // optionally show tooltip or toast: "Upload an image first"
      return;
    }
    setBrushActive(!brushActive);
  };

  // —— Handler to clear the current selection mask ——
  const clearSelection = () => {
    if (!maskData) {
      // optionally show tooltip: "Nothing to clear"
      return;
    }
    setMaskData(null);
    // also clear any canvas overlay if you have one
  };

  // —— Your existing handlers ——  
  const resetAll = () => {
    setFile(null);
    setPreviewUrl('');
    setPrompt('');
    setRatio('1:1');
    setBrushSize(50);
    setBrushActive(false);
    setMaskData(null);
    setEditedUrl('');
  };


  const handleFileChange = (e) => {
    const img = e.target.files?.[0] ?? null;
    if (img) {
      setFile(img);
      setPreviewUrl(URL.createObjectURL(img));
      setEditedUrl('');
      setBrushActive(false);
      setMaskData(null);
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
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header
        className="h-16 flex items-center px-6 mb-8" 
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

      <div className="flex-1 w-full mx-auto flex flex-col lg:flex-row gap-6 px-4 lg:px-8  mb-6 overflow-auto pb-4">
        {/* Col 1: Controls */}
        <section className="w-full lg:w-1/4 bg-white rounded-2xl shadow p-6 space-y-8">
          
          {/* Row 1: Select Area + Clear Selection */}
          <div className="flex items-center justify-between">
            <label className="font-medium text-lg">Select Area</label>
            <span
              onClick={clearSelection}
              disabled={!maskData}
              title={!maskData ? 'Nothing to clear' : ''}
              className="text-purple-600 text-sm cursor-pointer disabled:opacity-50"
            >
              Clear Selection
            </span>
          </div>

          {/* Row 2: Brush Button + Brush Size Slider */}
          <div className="flex items-center space-x-4">
            {/* Brush Button with SVG icon & active styling */}
            <button
              onClick={toggleBrush}
              disabled={!file}
              title={!file ? 'Upload an image first' : ''}
              className={`
                flex items-center space-x-2 px-4 py-2 border rounded
                ${ !file 
                    ? 'bg-gray-50 opacity-50 cursor-not-allowed' 
                    : brushActive 
                      ? 'bg-gray-300'    // darker when active
                      : 'bg-gray-100'    // lighter when inactive
                }
              `}
            >
              {/* Simple inline “paint brush” SVG */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7.05 17.67l-3.72 3.72a1 1 0 0 0 1.42 1.42l3.72-3.72-1.42-1.42zM20.71 5.63a1 1 0 0 0-1.42 0l-2.83 2.83 1.42 1.42 2.83-2.83a1 1 0 0 0 0-1.42zM3 21h6v-2H5v-4H3v6zm18-18h-6v2h4v4h2V3zM8.5 15.5l7-7 1.5 1.5-7 7H8.5v-1.5z"/>
              </svg>

              <span className="font-medium text-sm">Brush</span>
            </button>

            <input
              type="range"
              min="5"
              max="100"
              value={brushSize}
              onChange={e => setBrushSize(Number(e.target.value))}
              disabled={!file || !brushActive}
              title={
                !file
                  ? 'Upload an image first'
                  : !brushActive
                  ? 'Activate Brush to adjust size'
                  : ''
              }
              className="flex-1 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
          {/* Prompt with Clear text */}
          <div className="relative">
            <label className="block font-medium mb-2 text-lg">Prompt</label>
            <textarea
              rows={4}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe your edit…"
              disabled={loading}
              className="w-full border rounded-lg px-3 py-2 h-32 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            />
            {/* Clear prompt as plain black text */}
            <span
              onClick={() => setPrompt('')}
              disabled={!prompt}
              title={!prompt ? 'Nothing to clear' : ''}
              className="absolute bottom-2 right-2 pr-1 pb-1 text-sm font-bold text-black cursor-pointer disabled:opacity-50"
            >
              Clear
            </span>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block font-medium mb-2 text-lg">Aspect Ratio</label>
            <select
              value={ratio}
              onChange={e => setRatio(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none"
              title="Select your desired output aspect ratio"
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
            title={!file ? 'Upload an image first' : !prompt ? 'Enter a prompt' : ''}
            className="w-full flex justify-center items-center bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? <SpinnerIcon />
              : (editedUrl ? 'Regenerate' : 'Generate')
            }
          </button>
        </section>


        {/* Col 2: Original Image */}
        <section className="w-full lg:w-[37.5%] bg-white rounded-2xl shadow p-6 relative">
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
        <section className="w-full lg:w-[37.5%] bg-white rounded-2xl shadow p-6 relative flex flex-col items-center">
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
