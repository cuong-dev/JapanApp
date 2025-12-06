import React, { useState } from 'react';
import { JLPTLevel } from '../types';
import { generateLesson } from '../services/geminiService';
import { Loader2, BookOpen, Send } from 'lucide-react';

const LessonGenerator: React.FC = () => {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<JLPTLevel>(JLPTLevel.N5);
  const [loading, setLoading] = useState(false);
  const [lessonContent, setLessonContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setLoading(true);
    setLessonContent(null);
    const content = await generateLesson(topic, level);
    setLessonContent(content);
    setLoading(false);
  };

  // Helper function to render bold text within strings
  const renderFormattedText = (text: string) => {
    // Split by bold markers
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-6">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <BookOpen className="text-red-500" />
          AI Lesson Generator
        </h2>
        <p className="text-slate-500">Enter a topic and let the AI create a custom lesson for you.</p>
      </header>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Topic</label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Ordering at a restaurant, Particles 'wa' vs 'ga'"
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">JLPT Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as JLPTLevel)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none bg-white"
            >
              {Object.values(JLPTLevel).map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !topic.trim()}
            className="md:col-span-1 bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Generate</>}
          </button>
        </div>
      </div>

      {/* Content Display */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[400px]">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-4 text-red-500" size={40} />
            <p>Sensei is writing your lesson...</p>
          </div>
        ) : lessonContent ? (
          <div className="p-8 overflow-y-auto font-jp leading-relaxed">
            <div className="prose prose-slate max-w-none">
                {lessonContent.split('\n').map((line, idx) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <div key={idx} className="h-4"></div>;
                    
                    if (trimmed.startsWith('### ')) return <h3 key={idx} className="text-lg font-bold text-slate-800 mt-6 mb-3 border-b border-red-100 pb-1">{renderFormattedText(trimmed.replace('### ', ''))}</h3>;
                    if (trimmed.startsWith('## ')) return <h2 key={idx} className="text-xl font-bold text-slate-800 mt-8 mb-4 flex items-center gap-2"><span className="w-2 h-6 bg-red-500 rounded-full inline-block"></span>{renderFormattedText(trimmed.replace('## ', ''))}</h2>;
                    if (trimmed.startsWith('# ')) return <h1 key={idx} className="text-3xl font-bold text-slate-900 mb-6">{renderFormattedText(trimmed.replace('# ', ''))}</h1>;
                    
                    if (trimmed.startsWith('- ')) return <li key={idx} className="ml-4 list-disc text-slate-700 mb-1 pl-1">{renderFormattedText(trimmed.replace('- ', ''))}</li>;
                    if (trimmed.match(/^\d+\./)) return <div key={idx} className="ml-4 text-slate-700 mb-2 font-medium">{renderFormattedText(trimmed)}</div>;
                    
                    return <p key={idx} className="mb-3 text-slate-700 whitespace-pre-wrap">{renderFormattedText(trimmed)}</p>;
                })}
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <BookOpen size={48} className="mb-4 opacity-20" />
            <p>Your lesson content will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonGenerator;