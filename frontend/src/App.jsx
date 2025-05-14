import { useState } from 'react'

export default function App() {
  const [prompt, setPrompt] = useState('')
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">AI Image Editor</h1>
      <input
        className="mt-4 p-2 border"
        placeholder="Enter prompt…"
        value={prompt}
        onChange={e => setPrompt(e.target.value)}
      />
      <button className="ml-2 px-4 py-2 bg-blue-500 text-white">Generate</button>
    </div>
  )
}
