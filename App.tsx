
import React, { useState, useCallback, useRef } from 'react';
import Fireworks from './components/Fireworks';
import { analyzeImage } from './services/gemini';
import { AnalysisResult } from './types';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [isFireworksActive, setIsFireworksActive] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Default image is the Saint Sebastian one if not provided, but we'll start empty or with a placeholder
  // Since the user provided an image in the prompt, we assume they will upload it or similar.
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setAnalysis(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const runAnalysis = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    try {
      const resultText = await analyzeImage(image);
      setAnalysis({
        text: resultText || "No analysis generated.",
        timestamp: new Date()
      });
    } catch (err) {
      console.error(err);
      alert("Failed to analyze image. Ensure your API key is valid.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden">
      {/* Dynamic Background Firework Animation */}
      {isFireworksActive && <Fireworks />}

      {/* Main UI Overlay */}
      <div className="relative z-20 w-full max-w-6xl px-4 md:px-8 py-10 flex flex-col md:flex-row gap-8 h-full">
        
        {/* Left Side: Image Viewer */}
        <div className="flex-1 flex flex-col items-center justify-center space-y-6">
          <div className={`relative w-full aspect-[2/3] max-h-[80vh] bg-neutral-900 rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 border border-neutral-800 ${!image ? 'flex items-center justify-center border-dashed' : ''}`}>
            {image ? (
              <img 
                src={image} 
                alt="Uploaded Content" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-6">
                <i className="fa-solid fa-cloud-arrow-up text-5xl text-neutral-600 mb-4"></i>
                <p className="text-neutral-400 font-medium">Upload an image to animate</p>
                <p className="text-neutral-600 text-sm mt-2">Try the Saint Sebastian image for the best effect</p>
              </div>
            )}
            
            {/* Control Badges */}
            <div className="absolute top-4 right-4 flex flex-col gap-2">
              <button 
                onClick={() => setIsFireworksActive(!isFireworksActive)}
                className={`p-3 rounded-full backdrop-blur-md transition-all ${isFireworksActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-black/40 text-neutral-400 hover:bg-black/60'}`}
                title={isFireworksActive ? "Disable Fireworks" : "Enable Fireworks"}
              >
                <i className={`fa-solid ${isFireworksActive ? 'fa-fire-burner' : 'fa-fire'}`}></i>
              </button>
            </div>
          </div>

          <div className="flex gap-4 w-full justify-center">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors flex items-center gap-2"
            >
              <i className="fa-solid fa-plus"></i>
              Choose Image
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload}
            />
            
            {image && (
              <button 
                onClick={runAnalysis}
                disabled={isAnalyzing}
                className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <i className="fa-solid fa-circle-notch animate-spin"></i>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    Analyze with Gemini 3 Pro
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Analysis Panel */}
        {analysis && (
          <div className="w-full md:w-96 bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 rounded-3xl p-6 flex flex-col shadow-2xl animate-fade-in-left">
            <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <i className="fa-solid fa-brain text-indigo-400"></i>
                AI Insights
              </h2>
              <button 
                onClick={() => setAnalysis(null)}
                className="text-neutral-500 hover:text-white"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 text-neutral-300 leading-relaxed text-sm">
              <p className="whitespace-pre-wrap">{analysis.text}</p>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-800 text-[10px] text-neutral-500 uppercase tracking-widest text-center">
              Powered by Gemini 3 Pro • {analysis.timestamp.toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      {/* Decorative gradients */}
      <div className="fixed -bottom-40 -left-40 w-96 h-96 bg-indigo-900/20 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="fixed -top-40 -right-40 w-96 h-96 bg-pink-900/20 blur-[100px] rounded-full pointer-events-none"></div>

      <style>{`
        @keyframes fade-in-left {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-fade-in-left {
          animation: fade-in-left 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
