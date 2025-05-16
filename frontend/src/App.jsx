import { useState } from 'react';

export default function App() {
  const [file,       setFile]       = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [prompt,     setPrompt]     = useState('');
  const [brushSize,  setBrushSize]  = useState('M');
  const [loading,    setLoading]    = useState(false);
  const [editedUrl,  setEditedUrl]  = useState('');
  const [size, setSize] = useState('1024x1024');

  // —— New state for brush mode & mask data ——
  const [brushActive, setBrushActive] = useState(false);
  const [maskData,    setMaskData]    = useState(null);

  // —— Handler to toggle brush on/off ——  
  const toggleBrush = () => {
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
    setSize('1024x1024');
    setBrushSize(50);
    setBrushActive(false);
    setMaskData(null);
    setEditedUrl('');
  };

  const saveDraft = () => {};


  const handleFileChange = (e) => {
    const img = e.target.files?.[0] ?? null;
    if (img) {
      // create a stable preview URL
      const url = URL.createObjectURL(img);
  
      // set file & preview; we don’t need origRatio any more
      setFile(img);
      setPreviewUrl(url);
      setEditedUrl('');
      setBrushActive(false);
      setMaskData(null);
  
      // NOTE: if you want to free memory later, you can revoke this URL
      // when the component unmounts or when a new file is chosen.
      // e.g. URL.revokeObjectURL(previousUrl);
    }
  };
  
  const [pw, ph] = size.split('x').map(Number);
  const handleEdit = async () => {
    if (!file || !prompt) return;
    setLoading(true);
    try {
      const form = new FormData();
      form.append('image', file);
      form.append('prompt', prompt);
      form.append('size', size);    
  
      console.log(`Calling API with size=${size}…`);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/edit`, {
        method: 'POST',
        body: form
      });
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
              className={`
                flex items-center space-x-2 px-4 py-2 border rounded
                ${ brushActive 
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
              disabled={!brushActive}
              title={!brushActive
                  ? 'Activate Brush to adjust size'
                  : ''
              }
              className={`flex-1 ${brushActive ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}            />
          </div>
          
          {/* Prompt with inline “Clear Text” */}
          <div className="space-y-2">
            {/* Row: Label + Clear */}
            <div className="flex items-center justify-between">
              <label className="font-medium text-lg">Instruction</label>
              <span
                onClick={() => setPrompt('')}
                className={`text-purple-600 text-sm cursor-pointer disabled:opacity-50"` }
                title={!prompt ? 'Nothing to clear' : ''}
              >
                Clear Text
              </span>
            </div>

            {/* Textarea */}
            <textarea
              rows={4}
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              placeholder="Describe your edit…"
              disabled={loading}
              className="w-full border rounded-lg px-3 py-2 h-32 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50"
            />
          </div>


          {/* Aspect Ratio */}
          <div>
            <label className="block font-medium mb-2 text-lg">Size / Ratio</label>
            <select
              value={size}
              onChange={e => setSize(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none"
              title="Choose output size/ratio"
            >
              <option value="1024x1024">Square (1:1)</option>
              <option value="1536x1024">Landscape (3:2)</option>
              <option value="1024x1536">Portrait (2:3)</option>
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
            ? (
              // Inline spinner SVG instead of SpinnerIcon
              <svg
                className="h-5 w-5 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) 
            : (editedUrl ? 'Regenerate' : 'Generate')
          }
          </button>
        </section>


        {/* Col 2: Original Image */}
        <section className="w-full lg:w-[37.5%] bg-white rounded-2xl shadow p-6 flex flex-col">
          {/* Title + Reupload */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Target Image</h2>
            <button
              type="button"
              onClick={resetAll}
              disabled={!file}
              title={!file ? 'Nothing to reupload' : 'Reupload Image (resets prompt & ratio)'}
              className={`p-2 rounded-full dark:bg-indigo-100   ${
                !file ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-100 active:bg-indigo-200'}
              }`}
            >
              ↻
            </button>
          </div>

          {/* Upload / Preview – fill remaining space */}
          <div className="flex-1">
            {!file ? (
              <label
                className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
              >
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <span className="text-gray-600">Click or drag &amp; drop to upload</span>
              </label>
            ) : (
              <div className="h-full overflow-hidden rounded-lg">
                <img
                  src={previewUrl}
                  alt="Original"
                  className="w-full h-full object-contain"
                />
                {/* TODO: mask canvas overlay here */}
              </div>
            )}
          </div>
        </section>


        {/* Col 3: Generated Image */}
        <section className="w-full lg:w-[37.5%] bg-white rounded-2xl shadow p-6 flex flex-col">
          {/* Title + Actions */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Generated Image</h2>
            <div className="flex space-x-2">
              {/* Save Draft icon button */}
              <button
                type="button"
                onClick={saveDraft}
                disabled={!editedUrl}
                title={!editedUrl ? 'No image to save' : 'Save Draft'}
                className={`
                  p-2 rounded-full  dark:bg-indigo-100   
                  ${!editedUrl
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-100 active:bg-indigo-200'}
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 448 512"
                  className="h-5 w-5 text-indigo-600"
                  fill="currentColor"
                >
                  <path d="M433.9 129.9l-83.9-83.9A48 48 0 0 0 316.1 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V163.9a48 48 0 0 0 -14.1-33.9zM224 416c-35.3 0-64-28.7-64-64 0-35.3 28.7-64 64-64s64 28.7 64 64c0 35.3-28.7 64-64 64zm96-304.5V212c0 6.6-5.4 12-12 12H76c-6.6 0-12-5.4-12-12V108c0-6.6 5.4-12 12-12h228.5c3.2 0 6.2 1.3 8.5 3.5l3.5 3.5A12 12 0 0 1 320 111.5z"/>
                </svg>
              </button>
              {/* Download icon button */}
              <a
                href={editedUrl || '#'}
                download="vision-forge-edit.png"
                title={!editedUrl ? 'No image to download' : 'Download Image'}
                className={`
                  p-2 rounded-full dark:bg-indigo-100   
                  ${!editedUrl
                    ? 'bg-gray-200 opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-100 active:bg-indigo-200'}
                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="h-5 w-5 text-indigo-600"
                  fill="currentColor"
                >
                  <path d="M144 480C64.5 480 0 415.5 0 336c0-62.8 40.2-116.2 96.2-135.9c-.1-2.7-.2-5.4-.2-8.1c0-88.4 71.6-160 160-160c59.3 0 111 32.2 138.7 80.2C409.9 102 428.3 96 448 96c53 0 96 43 96 96c0 12.2-2.3 23.8-6.4 34.6C596 238.4 640 290.1 640 352c0 70.7-57.3 128-128 128l-368 0zm79-167l80 80c9.4 9.4 24.6 9.4 33.9 0l80-80c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-39 39L344 184c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 134.1-39-39c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Preview / Placeholder */}
          <div
            className="w-full overflow-hidden rounded-lg"
            style={{ aspectRatio: `${pw} / ${ph}` }}
          >
            {editedUrl ? ( 
              <img
                src={editedUrl}
                alt="Edited"
                className="w-full h-full object-contain"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center
                          border-2 border-dashed border-gray-300 rounded-lg"
              >
                <span className="text-gray-600">
                  No generated image to preview
                </span>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
