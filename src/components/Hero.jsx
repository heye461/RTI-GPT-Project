import React from 'react';
import { PenTool, Compass, HelpCircle } from 'lucide-react';

export default function Hero({ onStartDrafting, onViewGuide }) {
  return (
    <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white py-16 px-4 sm:px-6 lg:px-8 print:hidden">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-6">
          Empower Your Voice with <span className="text-indigo-400">RTI-GPT</span>
        </h1>
        <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          Draft professional, legally structured Right to Information (RTI) applications in India in five simple steps. 
          Use smart local templates or set up AI to frame evasion-proof queries.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <button
            onClick={onStartDrafting}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/20 transition-all text-base"
          >
            <PenTool className="h-5 w-5" />
            <span>Start Drafting RTI</span>
          </button>
          
          <button
            onClick={onViewGuide}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3 bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/60 hover:text-white font-semibold rounded-lg transition-all text-base"
          >
            <Compass className="h-5 w-5" />
            <span>Read Citizens Guide</span>
          </button>
        </div>

        {/* Feature quick details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 text-left border-t border-slate-800/80 pt-12">
          <div className="flex space-x-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/40">
            <div className="text-indigo-400 p-2 bg-indigo-500/10 rounded-lg h-fit">
              ⚖️
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1">Evasion-Resistant Framing</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Asks for files, vouchers, records, and reports. Avoids generic or speculative questions that officials easily reject.
              </p>
            </div>
          </div>

          <div className="flex space-x-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/40">
            <div className="text-indigo-400 p-2 bg-indigo-500/10 rounded-lg h-fit">
              🔒
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1">Local & Private</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                All drafts and personal information are processed in your web browser. No databases are used, and no personal data is saved.
              </p>
            </div>
          </div>

          <div className="flex space-x-4 bg-slate-900/40 p-4 rounded-xl border border-slate-800/40">
            <div className="text-indigo-400 p-2 bg-indigo-500/10 rounded-lg h-fit">
              🖨️
            </div>
            <div>
              <h4 className="font-bold text-slate-100 text-sm mb-1">Ready to Post or Upload</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Export to an optimized print preview or PDF. Submit physically via Speed Post or paste details into the online RTI portal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
