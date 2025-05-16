import React from 'react';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Main content wrapper: uniform padding + max-width */}
      <div className="flex-1 w-full px-8 md:px-10">

        {/* Header */}
        <header className="h-20 flex items-center px-6 mb-8">
            <h1
                className="text-4xl font-bold bg-gradient-to-r from-[#FF8F00] via-[#EE66A6] to-[#640D5F] bg-clip-text text-transparent h-15 mt-5"
                style={{ fontFamily: 'Sacramento, cursive' }}
            >
                Vision Forge
            </h1>
            </header>



        {/* Hero – full-width yellow bg */}
        <section className="relative bg-yellow-50 py-24 overflow-hidden rounded-xl">
            {/* Decorative side images */}
            <img
                src="image/left-decorative.jpg"
                alt="Left decorative"
                className="pl-10 absolute top-0 left-0 w-80 h-96 object-cover rounded-lg transform -translate-x-1/4 -translate-y-1/4"
            />
            <img
                src="image/right-decorative.jpg"
                alt="Right decorative"
                className="absolute bottom-0 right-0 w-80 h-96 object-cover rounded-lg transform translate-x-1/4 translate-y-1/4"
            />
            {/* Card wrapper – centered & constrained */}
            <div className="relative mx-auto max-w-5xl px-4 md:px-6">
                {/* White card */}
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Make complex edits simple with our AI photo editor
                </h2>
                <p className="text-gray-700 mb-6">
                    Take control of your image’s look and feel. Remove distractions, add elements, or transform details—all with a few clicks.
                    Take control of your image’s look and feel. Remove distractions, add elements, or transform details—all with a few clicks.
                    Take control of your image’s look and feel. Remove distractions, add elements, or transform details—all with a few clicks.
                </p>

                {/* Dashed drop-zone */}
                <label className="mx-auto w-full max-w-xs border-2 border-dashed border-gray-300 rounded-lg py-8 flex flex-col items-center cursor-pointer hover:border-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M7 16V8m0 0L3 12m4-4l4 4m6 4v-8m0 0l4 4m-4-4l-4 4" />
                    </svg>
                    <span className="text-gray-600 font-medium mb-2">Upload your image</span>
                    <input type="file" accept="image/*" className="hidden" />
                </label>
                <p className="text-gray-500 mt-3">or drop it here</p>
                </div>
            </div>
        </section>


        {/* Info Sections */}
        <section className="py-16 space-y-16">
          {/* 1: Image Left */}
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
          {/* 2: Image Right */}
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
        <section className="py-16">
          <h3 className="text-3xl font-bold text-center mb-12">How to Edit an Image with AI</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-center">
            {['Upload','Select Area','Enter Instruction','Choose Ratio','Generate'].map((step, i) => (
              <div key={i} className="md:col-span-1">
                <div className="w-16 h-16 mx-auto bg-purple-600 text-white rounded-full flex items-center justify-center mb-4">
                  {i+1}
                </div>
                <h4 className="font-semibold mb-2">{step}</h4>
                <p className="text-gray-600">
                  {step === 'Upload' ? 'Choose your photo.' :
                   step === 'Select Area' ? 'Brush over the part (optional).' :
                   step === 'Enter Instruction' ? 'Type your edit.' :
                   step === 'Choose Ratio' ? 'Pick aspect ratio.' :
                   'Click generate to see magic.'}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div> {/* end of container */}

      {/* Full-width Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Vision Forge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
