import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-100 p-6 selection:bg-amber-500/30">
      <div className="relative">
        <div className="absolute inset-0 bg-amber-500 blur-[100px] opacity-10 rounded-full animate-pulse" />
        <Sparkles className="w-16 h-16 text-amber-500 mb-8 relative" />
      </div>
      <h1 className="text-5xl font-black mb-4 text-center tracking-tighter bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">GenApp Architect</h1>
      <p className="text-zinc-400 text-center max-w-md text-lg font-medium leading-relaxed mb-8">
        Describe your project, configure your storage, and go live instantly.
      </p>
      <div className="flex items-center gap-3 px-6 py-3 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-500 text-sm font-bold animate-in fade-in">
        <span>Waiting for instructions</span>
        <ArrowRight size={14} className="animate-bounce-x" />
      </div>
    </div>
  );
}