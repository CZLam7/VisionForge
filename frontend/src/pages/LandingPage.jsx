import React from 'react';
import { useState } from 'react';
import { useNavigate  } from 'react-router-dom';

export default function LandingPage() {
  const steps = [
    {
      title: 'Upload your photo',
      desc: 'Supported formats: PNG, WebP, JPG. Click the button to upload or drag & drop into the layout. File size must be under 25 MB.'
    },
    {
      title: 'Select area',
      desc: 'Use the brush tool to mark your target region. Adjust brush size by dragging the slider to get pixel-perfect control.'
    },
    {
      title: 'Enter instruction',
      desc: 'Type your edit request—up to 32 000 characters of freedom to describe exactly what you want!'
    },
    {
      title: 'Choose aspect ratio',
      desc: 'Pick Square (1:1), Landscape (3:2), or Portrait (2:3). The preview pane will resize to match so you can see exactly how your result will look.'
    },
    {
      title: 'Generate image',
      desc: 'Hit “Generate” and wait ~40 seconds. If you’re not happy with the result, tweak your instruction or click “Reupload” to start over.'
    },
    {
      title: 'Download your edit',
      desc: 'Once satisfied, click the download button in the generated-image panel. Your file will be saved in the aspect ratio you selected.'
    }
  ];
  
  const [openIndex, setOpenIndex] = useState(0);

  const navigate = useNavigate()

  function handleLandingUpload(ev) {
    const file = ev.target.files?.[0]
    if (!file) return
    navigate('/edit', { state: { file } })
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Main content wrapper: uniform padding + max-width */}
      <div className="flex-1 w-full px-8 md:px-20 2xl:px-50">

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
                src="/left-decorative.jpg"
                alt="Left decorative"
                className="pl-10 absolute top-0 left-0 w-80 h-96 object-cover rounded-lg transform -translate-x-1/4 -translate-y-1/4"
            />
            <img
                src="/right-decorative.jpg"
                alt="Right decorative"
                className="absolute bottom-0 right-0 w-80 h-96 object-cover rounded-lg transform translate-x-1/4 translate-y-1/4"
            />
            {/* Card wrapper – centered & constrained */}
            <div className="relative mx-auto max-w-5xl px-4 md:px-6">
                {/* White card */}
                <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                      Simplify every photo edit with AI and a single prompt
                    </h2>
                    <p className="text-gray-700 mb-6">
                      Tell Vision Forge exactly what you need and watch our AI transform your image in seconds.  
                      From removing distractions to swapping backgrounds and boosting colors, our editor follows your prompt to deliver professional-quality results automatically.
                    </p>


                    <div className="self-start mt-8">
                      <input
                        id="landing-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleLandingUpload}
                      />
                      <label
                        htmlFor="landing-upload"
                        className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700"
                      >
                        {/* Circle + up-arrow icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16v-8m0 0l-4 4m4-4l4 4"
                          />
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        Upload your image
                      </label>
                    </div>
                <p className="text-gray-500 mt-3">or drop it here</p>
                </div>
            </div>
        </section>


        {/* Info Sections */}
        <section className="py-16 space-y-16">
          {/* 1: Image Left */}
          <div className="flex flex-col md:flex-row items-center md:space-x-12">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <img
                src="image/info-image1.png"
                alt="Info section illustration"
                className="w-full h-100 object-cover rounded-2xl"
              />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">
                Harness AI for Effortless Image Editing
              </h3>
              <p className="text-gray-700">
                Vision Forge enables instant edits - swap or blur backgrounds, adjust facial expressions, enhance lighting and color balance, remove unwanted objects or people, apply realistic texture smoothing, and even transform the overall style of your image all with a single click, so you can refine and perfect photos faster than ever.
              </p>
            </div>

          </div>

          {/* 2: Image Right */}
          <div className="flex flex-col md:flex-row-reverse items-center md:gap-x-12">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <img
                src="image/info-image2.png"
                alt="Example of single-prompt edit"
                className="w-full h-auto rounded-lg"
              />
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">
                Transform Photos with a Single Command
              </h3>
              <p className="text-gray-700">
                With a single natural language instruction such as “turn this scene into a moonlit night”, “brighten her smile” or “remove background distractions”, Vision Forge’s NLP immediately understands your intent, performs all the edits behind the scenes including masking, color correction, object removal and relighting, and delivers a polished high quality image in seconds without the need for layers or sliders.
              </p>
            </div>
          </div>

          {/* 3: Image Left */}
          <div className="flex flex-col md:flex-row items-center md:space-x-12">
            <div className="md:w-1/2 mb-6 md:mb-0">
              <div className="bg-gray-200 h-64 rounded-lg flex items-center justify-center">
                <span className="text-gray-500">Image Placeholder</span>
              </div>
            </div>
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">Talk about Brush </h3>
              <p className="text-gray-700 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-gray-700 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-gray-700 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className="text-gray-700">Vivamus luctus urna sed urna ultricies ac tempor dui sagittis.</p>
            </div>
          </div>
        </section>

      </div> 


      <section className="py-16 bg-gray-100">
          <div className="max-w-8xl mx-auto px-8 md:px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Instruction Image */}
            <img
              src="image/instruction.png"
              alt="Instruction preview"
              className="w-full h-auto max-h-[600px] object-cover rounded-lg"
            />


            {/* Right: Accordion list with just vertical lines */}
            <div className="flex flex-col">
              <h3 className="text-3xl font-bold mb-8">How to edit a photo in AI</h3>
                {steps.map((step, i) => {
                  const isOpen = i === openIndex;
                  return (
                    <div key={i} className="mb-6">
                      <div
                        onClick={() => setOpenIndex(i)}
                        className="flex cursor-pointer"
                      >
                        {/* Full‐height strip */}
                        <div
                          className={`self-stretch w-1 mr-4 rounded ${
                            isOpen
                              ? 'bg-gradient-to-b from-[#FF8F00] via-[#EE66A6] to-[#640D5F]'
                              : 'bg-gray-300'
                          } transition-colors duration-200`}
                        />
                        <div className="flex-1">
                          <h4 className={`font-semibold ${isOpen ? 'text-gray-900' : 'text-gray-700'}`}>
                            {step.title}
                          </h4>
                          {isOpen && (
                            <p className="mt-2 text-gray-600">
                              {step.desc}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              <div className="self-start mt-8">
                <input
                  id="landing-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLandingUpload}
                />
                <label
                  htmlFor="landing-upload"
                  className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg cursor-pointer hover:bg-purple-700"
                >
                  {/* Circle + up-arrow icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16v-8m0 0l-4 4m4-4l4 4"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Upload your image
                </label>
              </div>


            </div>
          </div>
        </section>
      {/* Full-width Footer */}
      <footer className="bg-gray-800 py-6">
        <div className="container mx-auto max-w-4xl px-4 md:px-6 text-center">
          <p className="text-gray-400">© {new Date().getFullYear()} Vision Forge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
