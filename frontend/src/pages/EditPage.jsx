import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function App() {
  // --- Existing States ---
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [brushSize, setBrushSize] = useState(50);
  const [loading, setLoading] = useState(false);
  const [editedUrl, setEditedUrl] = useState('');
  const [size, setSize] = useState('1024x1024');

  // --- Masking States ---
  const [brushActive, setBrushActive] = useState(false);
  const [maskData, setMaskData] = useState(null); // optional: store final mask blob
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [hovering, setHovering] = useState(false);
  const [painting, setPainting] = useState(false);

  // --- Refs ---
  const imgRef = useRef(null);
  const uiCanvasRef = useRef(null);  // for on-screen blue overlay
  const maskCanvasRef = useRef(null); // for the hidden mask
  const { state } = useLocation();
  const initialFile = state?.file ?? null;

  useEffect(() => {
    if (initialFile) {
      setFile(initialFile);
      setPreviewUrl(URL.createObjectURL(initialFile));
    }
  }, [initialFile]);

  // --- Handlers ---
  const toggleBrush = () => setBrushActive(active => !active);
  const clearSelection = () => {
    setMaskData(null);
    // Remove old mask from canvas
    const ctx = uiCanvasRef.current?.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, uiCanvasRef.current.width, uiCanvasRef.current.height);
  };
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

  const handleFileChange = e => {
    const img = e.target.files?.[0] ?? null;
    if (img) {
      setFile(img);
      setPreviewUrl(URL.createObjectURL(img));
      setBrushActive(false);
      setMaskData(null);
    }
  };

  const handleEdit = async () => {
    if (!file || !prompt) return;
    console.log('🔄 Starting edit…', { file, prompt, size });
    setLoading(true);

    // first, make sure the mask canvas ref is there
    const maskCanvas = maskCanvasRef.current;
    const uiCanvas   = uiCanvasRef.current;
    console.log('UI Canvas:', uiCanvas, 'Mask Canvas:', maskCanvas);
    if (!maskCanvas) {
      console.error('❌ maskCanvasRef is null!');
      setLoading(false);
      return;
    }

    try {
      // generate mask blob
      console.log('🖌️  Generating mask blob from mask canvas…');
      const maskBlob = await new Promise(resolve => maskCanvas.toBlob(resolve, 'image/png'));
      console.log('✅ Mask blob ready:', maskBlob);

      // download it locally so you can inspect it
      // const maskURL = URL.createObjectURL(maskBlob);
      // console.log('📥 Mask URL:', maskURL);
      // const a = document.createElement('a');
      // a.href = maskURL;
      // a.download = 'mask.png';
      // document.body.appendChild(a);
      // a.click();
      // document.body.removeChild(a);
      // URL.revokeObjectURL(maskURL);

      // now build your form
      const form = new FormData();
      form.append('image', file);
      form.append('mask', maskBlob, 'mask.png');
      form.append('prompt', prompt);
      form.append('size', size);
      console.log('📦 FormData prepared:', { image: file, mask: maskBlob, prompt, size });

      // send it off
      console.log('🚀 Sending POST to', `${import.meta.env.VITE_API_URL}/api/edit`);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/edit`, {
        method: 'POST',
        body: form
      });
      console.log('📶 Response status:', res.status, res.statusText);
      if (!res.ok) {
        const text = await res.text();
        console.error('❌ Edit error response body:', text);
        throw new Error(text);
      }

      const { b64_json } = await res.json();
      console.log('🎉 Edit succeeded, b64 length:', b64_json.length);
      setEditedUrl(`data:image/png;base64,${b64_json}`);
    } catch (err) {
      console.error('⚠️ handleEdit caught error:', err);
      alert(`Edit error: ${err.message}`);
    } finally {
      console.log('⏹️ handleEdit complete, loading false');
      setLoading(false);
    }
  };

  // --- Canvas Setup & Painting ---
  const displaySize = 10 + (brushSize / 100) * 20;

  function updateCanvasSize() {
    const img = imgRef.current;
    if (!img) return;
    [uiCanvasRef, maskCanvasRef].forEach(ref => {
      const c = ref.current;
      c.width  = img.naturalWidth;
      c.height = img.naturalHeight;
      c.style.width  = img.clientWidth + 'px';
      c.style.height = img.clientHeight + 'px';
    });

    const mc = maskCanvasRef.current.getContext('2d');
    mc.clearRect(0, 0, mc.canvas.width, mc.canvas.height);
    mc.fillStyle = '#ffffff';
    mc.drawImage(img, 0, 0, mc.canvas.width, mc.canvas.height);
  }

  useEffect(() => {
    updateCanvasSize();
  }, [previewUrl]);


  useEffect(() => {
    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  },);

  function getCanvasCoords(e) {
    const c    = uiCanvasRef.current;
    const rect = c.getBoundingClientRect();
    return {
      x: (e.clientX - rect.left) * (c.width  / rect.width),
      y: (e.clientY - rect.top ) * (c.height / rect.height),
    };
  }

  // 2) Handle painting on both canvases:
  function startPaint(e) {
    setPainting(true);
    const { x, y } = getCanvasCoords(e);

    const uiCtx = uiCanvasRef.current.getContext('2d');
    uiCtx.globalCompositeOperation = 'source-over';
    uiCtx.strokeStyle = 'rgba(0,200,255,0.4)';
    uiCtx.lineWidth = brushSize * 2;
    uiCtx.lineCap   = 'round';
    uiCtx.beginPath();
    uiCtx.moveTo(x, y);

    const mCtx = maskCanvasRef.current.getContext('2d');
    mCtx.globalCompositeOperation = 'destination-out';
    mCtx.lineWidth = brushSize * 2;
    mCtx.lineCap   = 'round';
    mCtx.beginPath();
    mCtx.moveTo(x, y);
  }

  function paint(e) {
    if (!painting) return;
    const { x, y } = getCanvasCoords(e);

    const uiCtx = uiCanvasRef.current.getContext('2d');
    uiCtx.lineTo(x, y);
    uiCtx.stroke();

    const mCtx = maskCanvasRef.current.getContext('2d');
    mCtx.lineTo(x, y);
    mCtx.stroke();
  }

  function endPaint() {
    setPainting(false);
    setMaskData(maskCanvasRef.current.toDataURL('image/png'));
  }



  const [pw, ph] = size.split('x').map(Number);

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

          {/* Row 2: Brush Button + Brush Size Slider + Live Preview */}
          <div className="flex items-center space-x-4">
            {/* Brush Button */}
            <button
              onClick={toggleBrush}
              className={`
                flex items-center space-x-2 px-4 py-2 border rounded
                ${brushActive ? 'bg-gray-300' : 'bg-gray-100'}
              `}
            >
              {/* SVG omitted for brevity */}
              <span className="font-medium text-sm">Brush</span>
            </button>

            {/* Slider */}
            <input
              type="range"
              min="5"
              max="100"
              value={brushSize}
              onChange={e => setBrushSize(Number(e.target.value))}
              disabled={!brushActive}
              title={!brushActive ? 'Activate Brush to adjust size' : ''}
              className={`flex-1 ${brushActive ? 'cursor-pointer' : 'opacity-50 cursor-not-allowed'}`}
            />

            {/* Live size preview */}
            <div
              className="rounded-full bg-purple-600 opacity-50"
              style={{
                width:  `${displaySize}px`,
                height: `${displaySize}px`,
                transition: 'width 0.1s, height 0.1s'
              }}
            />
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
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Target Image</h2>
            <button
              onClick={resetAll}
              disabled={!file}
              className={`p-2 rounded-full ${!file ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-100 active:bg-indigo-200'}`}
            >↻</button>
          </div>

          <div className="flex-1">
            {!file ? (
              <label className="flex flex-col items-center justify-center h-full border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-gray-400">
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={loading} />
                <span className="text-gray-600">Click or drag &amp; drop to upload</span>
              </label>
            ) : (
              <div className="relative h-full overflow-hidden rounded-lg">
                {/* your real image */}
                <img
                  ref={imgRef}
                  src={previewUrl}
                  alt="Original"
                  className="w-full h-full object-contain"
                  onLoad={updateCanvasSize}
                />

                {/* 1) UI Canvas (visible) */}
                <canvas
                  ref={uiCanvasRef}
                  className="absolute inset-0 z-10"
                  onPointerDown={startPaint}
                  onPointerMove={e => {
                    paint(e)
                    const rect = e.currentTarget.getBoundingClientRect()
                    setPointer({ x: e.clientX - rect.left, y: e.clientY - rect.top })
                  }}
                  onPointerUp={endPaint}
                  onPointerLeave={e => { endPaint(); setHovering(false) }}
                  onPointerEnter={e => setHovering(true)}
                  style={{ pointerEvents: brushActive ? 'auto' : 'none' }}
                />

                {/* 2) Mask Canvas (hidden) */}
                <canvas
                  ref={maskCanvasRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ opacity: 0, pointerEvents: 'none' }}
                />

                {/* Live brush cursor preview (optional) */}
                {brushActive && hovering && (() => {
                  const c = uiCanvasRef.current
                  const scale  = c.clientWidth / c.width
                  const radius = brushSize * scale

                  return (
                    <div
                      className="absolute"
                      style={{
                        left:  pointer.x - radius,
                        top:   pointer.y - radius,
                        width: radius * 2,
                        height: radius * 2,
                        border:       '2px solid rgba(156,163,175,0.8)',
                        borderRadius: '50%',
                        pointerEvents:'none',
                        mixBlendMode: 'difference',
                      }}
                    />
                  )
                })()}
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
