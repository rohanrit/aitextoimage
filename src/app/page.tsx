'use client';

import { useState } from 'react';

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function generateImage(prompt) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const json = await res.json();
      if (!res.ok) throw new Error(json?.error || 'Generation failed');

      setImages(json.images || []);
    } catch (err) {
      setError(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  function handleGenerate(e) {
    e.preventDefault();
    if (prompt.trim()) {
      generateImage(prompt);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-semibold mb-4">Next.js AI Image Generator</h1>
      <form onSubmit={handleGenerate} className="w-full max-w-2xl">
        <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={3}
          className="w-full rounded-md border p-3 mb-3"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-indigo-600 text-white disabled:opacity-60"
            disabled={loading}
          >
            {loading ? 'Generating…' : 'Generate Image'}
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded border"
            onClick={() => {
              setPrompt('');
              setImages([]);
              setError('');
            }}
          >
            Reset
          </button>
        </div>
        {error && <p className="mt-3 text-red-600">{error}</p>}
      </form>

      <section className="w-full max-w-4xl mt-8">
        {images.length === 0 && !loading && (
          <p className="text-gray-500">No images yet — try a prompt and press Generate.</p>
        )}

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((img, i) => (
            <div key={i} className="rounded shadow p-2 bg-white">
              {img.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={img.url}
                  alt={`generated-${i}`}
                  className="w-full h-64 object-cover rounded"
                />
              ) : img.b64 ? (
                <img
                  src={`data:image/png;base64,${img.b64}`}
                  alt={`generated-${i}`}
                  className="w-full h-64 object-cover rounded"
                />
              ) : (
                <div className="h-64 flex items-center justify-center text-sm text-gray-500">
                  No preview
                </div>
              )}
              <div className="mt-2 text-xs text-gray-600">Image #{i + 1}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
