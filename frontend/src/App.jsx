import { useState } from 'react';

export default function App() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');

  const handleFileChange = (e) => {
    const img = e.target.files[0];
    if (img) {
      setFile(img);
      setPreviewUrl(URL.createObjectURL(img));
      setUploadUrl('');
    }
  };

  const uploadToS3 = async () => {
    if (!file) return;
    const form = new FormData();
    form.append('file', file);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/upload`,
        { method: 'POST', mode: 'cors', body: form }
      );
      if (!res.ok) throw new Error(await res.text());
      const { url } = await res.json();
      setUploadUrl(url);
    } catch (err) {
      console.error(err);
      alert(`Upload error: ${err.message}`);
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen w-screen bg-gray-100 p-8">
      <div className="w-full max-w-2xl space-y-8">

        {/* Section 1: Upload & Local Preview */}
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

        {/* Section 2: Upload to S3 & Display */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">2. Upload to S3</h2>
          <div className="flex items-center space-x-4">
            <button
              onClick={uploadToS3}
              disabled={!file}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              Upload to S3
            </button>
            {uploadUrl && (
              <a href={uploadUrl} target="_blank" rel="noreferrer">
                <img
                  src={uploadUrl}
                  alt="Uploaded to S3"
                  className="w-64 h-64 object-contain rounded-lg border"
                />
              </a>
            )}
          </div>
        </section>

        {/* Section 3: Prompt & Edit */}
        <section className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">3. Edit Prompt</h2>
          <div className="flex space-x-3">
            <input
              type="text"
              className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter edit prompt…"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={!uploadUrl}
            />
            <button
              disabled={!uploadUrl || !prompt}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              onClick={() => {/* TODO: call edit API */}}
            >
              Edit Image
            </button>
          </div>
        </section>

      </div>
    </div>
  );
}
