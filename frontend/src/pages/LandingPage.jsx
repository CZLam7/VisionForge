import React from 'react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white py-4 shadow-md">
        <div className="container mx-auto px-2 md:px-4 ">
          <h1 className="text-2xl font-bold text-gray-800">Vision Forge</h1>
        </div>
      </header>

      {/* Hero */}
      <section className="relative bg-yellow-50 py-24 overflow-hidden">
        <div className="relative max-w-4xl mx-auto px-2 md:px-4">
          {/* Decorative side panels */}
          <div className="absolute top-0 left-0 -ml-36 -mt-12 w-80 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Image</span>
          </div>
          <div className="absolute bottom-0 right-0 -mr-36 -mb-12 w-80 h-96 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Image</span>
          </div>

          {/* Centered card */}
          <div className="relative bg-white rounded-2xl shadow-xl p-12 text-center mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Make complex edits simple with our AI photo editor
            </h2>
            <p className="text-gray-700 mb-6">
              Take control of your image’s look and feel. Remove distractions, add elements, or transform details—all with a few clicks.
            </p>

            {/* Dashed drop-zone */}
            <label className="mx-auto w-full max-w-xs border-2 border-dashed border-gray-300 rounded-lg py-8 flex flex-col items-center cursor-pointer hover:border-gray-400">
              {/* Cloud icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V8m0 0L3 12m4-4l4 4m6 4v-8m0 0l4 4m-4-4l-4 4" />
              </svg>
              <span className="text-gray-600 font-medium mb-2">Upload your image</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
            <p className="text-gray-500 mt-3">or drop it here</p>
          </div>
        </div>
      </section>

      {/* Info Sections */}
      <section className="container mx-auto px-2 md:px-4 py-16 space-y-16">
        {/* Section 1: Image Left */}
        <div className="flex flex-col md:flex-row items-center md:space-x-12">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Image Placeholder</span>
            </div>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold mb-4">Powerful AI Tools</h3>
            <p className="text-gray-700 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p className="text-gray-700">Vivamus luctus urna sed urna ultricies ac tempor dui sagittis.</p>
          </div>
        </div>
        
        {/* Section 2: Image Right */}
        <div className="flex flex-col md:flex-row items-center md:space-x-12 md:flex-row-reverse">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Image Placeholder</span>
            </div>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-2xl font-semibold mb-4">Seamless Workflow</h3>
            <p className="text-gray-700 mb-2">Praesent convallis tortor et enim feugiat gravida.</p>
            <p className="text-gray-700">Integer feugiat scelerisque varius morbi enim nunc faucibus.</p>
          </div>
        </div>
      </section>

      {/* How to Edit Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-2 md:px-4">
          <h3 className="text-3xl font-bold text-center mb-12">How to Edit an Image with AI</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
            {['Upload Photo','Select Area','Enter Instruction','Choose Ratio','Generate'].map((step, i) => (
              <div key={i} className="md:col-span-1">
                <div className="w-16 h-16 mx-auto bg-purple-600 text-white rounded-full flex items-center justify-center mb-4">
                  {i+1}
                </div>
                <h4 className="font-semibold mb-2">{step}</h4>
                <p className="text-gray-600">{step === 'Upload Photo' ? 'Choose an image to get started.' :
                  step === 'Select Area' ? 'Use the brush to target parts (optional).' :
                  step === 'Enter Instruction' ? 'Describe the edits you want.' :
                  step === 'Choose Ratio' ? 'Select your desired aspect ratio.' :
                  'Click generate to see results.'}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-6 mt-auto">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Vision Forge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
