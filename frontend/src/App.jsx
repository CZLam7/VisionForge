import { useState } from 'react';

export default function App() {
  const [file,       setFile]       = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [prompt,     setPrompt]     = useState('');
  const [editedUrl,  setEditedUrl]  = useState('');
  const [loading,    setLoading]    = useState(false); // ← new

  const handleFileChange = (e) => {
    const img = e.target.files[0];
    if (img) {
      setFile(img);
      setPreviewUrl(URL.createObjectURL(img));
      setEditedUrl('');
    }
  };

  const handleEdit = async () => {
    if (!file || !prompt) return;
    setLoading(true); // ← start spinner
    const form = new FormData();
    form.append('image', file);
    form.append('prompt', prompt);

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
      setLoading(false); // ← stop spinner
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-8">
      <div className="w-full max-w-2xl space-y-8">

        {/* 1. Upload & Preview */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">1. Upload Image</h2>
          <div className="flex items-center space-x-4">
            <label className="flex-1 border-2 border-dashed border-gray-300 rounded p-6 text-center cursor-pointer hover:border-gray-400">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <span className="text-gray-600">Click to upload an image</span>
            </label>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Local Preview"
                className="w-64 h-64 object-contain rounded-lg shadow"
              />
            )}
          </div>
        </section>

        {/* 2. Edit Prompt & Button */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">2. Edit Image</h2>
          <div className="flex space-x-3 mb-4">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter edit prompt…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={!file || loading}
            />
            <button
              onClick={handleEdit}
              disabled={!file || !prompt || loading}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading
                ? <svg
                    className="h-5 w-5 animate-spin"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12" cy="12" r="10"
                      stroke="currentColor" strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                : 'Edit Image'
              }
            </button>
          </div>

          {/* 3. Display Edited Image */}
          {editedUrl && (
            <div className="flex justify-center">
              <img
                src={editedUrl}
                alt="Edited"
                className="w-64 h-64 object-contain rounded-lg border"
              />
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
