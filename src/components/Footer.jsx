import React from 'react';
import { Scale } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-12 print:hidden border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left sm:flex sm:justify-between sm:items-center">
        <div className="flex justify-center sm:justify-start items-center space-x-2 text-white mb-4 sm:mb-0">
          <Scale className="h-5 w-5 text-indigo-400" />
          <span className="font-bold text-slate-100">RTI-GPT</span>
          <span className="text-xs text-slate-500">v1.0.0</span>
        </div>
        
        <p className="text-xs text-slate-500 max-w-md mx-auto sm:mx-0 sm:text-right leading-relaxed">
          Disclaimer: RTI-GPT is an open-source citizen utility tool. It generates formats and draft letters using template heuristics and AI interfaces. 
          It does not provide professional legal counsel or guarantee response success from public authorities.
        </p>
      </div>
    </footer>
  );
}
