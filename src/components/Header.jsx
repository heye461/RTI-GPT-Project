import React, { useState } from 'react';
import { Scale, Key, ShieldCheck, ShieldAlert, Check } from 'lucide-react';

export default function Header({ activeTab, setActiveTab, apiKey, setApiKey }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tempKey, setTempKey] = useState(apiKey || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setApiKey(tempKey);
    localStorage.setItem('rti_gemini_api_key', tempKey);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      setIsModalOpen(false);
    }, 1200);
  };

  const handleClear = () => {
    setTempKey('');
    setApiKey('');
    localStorage.removeItem('rti_gemini_api_key');
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('wizard')}>
            <div className="bg-indigo-600 text-white p-2 rounded-lg flex items-center justify-center">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">RTI-GPT</span>
              <span className="ml-2 px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-700 rounded border border-indigo-100">
                AI Drafter
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex space-x-8">
            <button
              onClick={() => setActiveTab('wizard')}
              className={`text-sm font-medium border-b-2 px-1 py-5 -mb-px transition-colors duration-150 ${
                activeTab === 'wizard'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              Draft Application
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`text-sm font-medium border-b-2 px-1 py-5 -mb-px transition-colors duration-150 ${
                activeTab === 'guide'
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              RTI Citizens Guide
            </button>
          </nav>

          {/* Action Button: API Config */}
          <div className="flex items-center space-x-4">
            {/* Mobile Nav Button */}
            <button
              onClick={() => setActiveTab(activeTab === 'wizard' ? 'guide' : 'wizard')}
              className="md:hidden text-xs bg-slate-100 text-slate-700 px-3 py-2 rounded-md hover:bg-slate-200"
            >
              {activeTab === 'wizard' ? 'View Guide' : 'Draft RTI'}
            </button>

            <button
              onClick={() => {
                setTempKey(apiKey);
                setIsModalOpen(true);
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                apiKey
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-indigo-50 text-indigo-700 border border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              <Key className="h-4 w-4" />
              <span>{apiKey ? 'AI Active (Key Set)' : 'Configure AI Key'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* API Key Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-md w-full p-6 relative overflow-hidden">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 text-xl font-bold"
            >
              &times;
            </button>
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Key className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Gemini AI Key Setup</h3>
            </div>
            
            <p className="text-slate-600 text-sm mb-4 leading-relaxed">
              Enter your Google Gemini API Key to enable <strong>AI-assisted drafting</strong>. 
              The application translates your simple request into legally precise PIO questions.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Gemini API Key
                </label>
                <input
                  type="password"
                  placeholder="AIzaSy..."
                  value={tempKey}
                  onChange={(e) => setTempKey(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-start space-x-2">
                {tempKey ? (
                  <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                )}
                <span className="text-xs text-slate-500 leading-snug">
                  {tempKey
                    ? "Stored securely in your local web browser. Your key will only be used to communicate directly with Google's Gemini API server."
                    : "No key entered. RTI-GPT will run in fallback mode, generating drafts using built-in high-quality local templates."
                  }
                </span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={!tempKey}
                  className="text-xs text-rose-600 hover:text-rose-800 disabled:opacity-50 font-medium"
                >
                  Remove Key
                </button>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1"
                  >
                    {saveSuccess ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Saved!</span>
                      </>
                    ) : (
                      <span>Save Config</span>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
}
