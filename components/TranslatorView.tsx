
import React, { useState } from 'react';
import { analyzeVocabulary } from '../services/geminiService';
import { saveWordToSheet } from '../services/sheetService';
import { VocabAnalysis } from '../types';
import { Search, Loader2, Volume2, ArrowRight, BookOpen, Layers, GitBranch, Sparkles, AlertCircle, Quote, Anchor, Type, Zap, BookMarked, MessageCircle, Save, Check } from 'lucide-react';

const TranslatorView: React.FC = () => {
  const [inputText, setInputText] = useState('');
  const [data, setData] = useState<VocabAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Saving State
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [showLevelSelect, setShowLevelSelect] = useState(false);

  const handleAnalyze = async () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setData(null);
    setSaveStatus('idle');
    setShowLevelSelect(false);
    
    const result = await analyzeVocabulary(inputText);
    setData(result);
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAnalyze();
  };

  const playAudio = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ja-JP';
    window.speechSynthesis.speak(utterance);
  };

  const handleSaveClick = () => {
    setShowLevelSelect(true);
  };

  const handleConfirmSave = async (level: string) => {
    if (!data) return;
    setShowLevelSelect(false);
    setIsSaving(true);
    const result = await saveWordToSheet(data, level);
    setIsSaving(false);
    
    if (result.success) {
       setSaveStatus('success');
       // Reset status after 3 seconds
       setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
       alert("Lỗi: " + result.message);
       setSaveStatus('error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto pb-12 px-2 md:px-4">
      {/* Search Area */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm mb-6 sticky top-0 z-20">
        <div className="relative flex items-center gap-4">
          <div className="flex-1 relative">
             <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập từ vựng (VD: 食べる, 勉強, 暑い)..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || !inputText.trim()}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Tra cứu</>}
          </button>
        </div>
      </div>

      {!data && !loading && (
        <div className="text-center py-20 text-slate-400">
          <BookOpen size={64} className="mx-auto mb-4 opacity-10" />
          <p className="text-lg">Nhập từ vựng để xem phân tích chi tiết 16 điểm chuyên sâu.</p>
        </div>
      )}

      {loading && (
         <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 size={40} className="animate-spin mb-4 text-red-500" />
          <p>Đang phân tích 16 điểm dữ liệu...</p>
        </div>
      )}

      {data && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
          
          {/* Items 1, 4, 5, 6: Header Word Info */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
             <div className="absolute -top-10 -right-10 p-10 bg-red-50 rounded-full opacity-50 z-0 w-64 h-64 blur-3xl"></div>
             
             {/* Header Content */}
             <div className="flex flex-col md:flex-row justify-between items-start gap-4 relative z-10">
                <div className="flex-1">
                   <div className="flex items-baseline gap-4 mb-2">
                      <h1 className="text-5xl font-bold font-jp text-slate-800">{data.word}</h1>
                      <div className="flex flex-col">
                        <span className="text-xl text-slate-500 font-light">{data.romaji}</span>
                        <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded mt-1 inline-block w-fit">
                          {data.partOfSpeech}
                        </span>
                      </div>
                      <button onClick={() => playAudio(data.word)} className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-full transition-colors ml-2">
                         <Volume2 size={24} />
                      </button>
                   </div>
                </div>

                {/* Right side: Meaning + Save Button */}
                <div className="flex flex-col items-end gap-3">
                    <p className="text-3xl font-bold text-slate-800 leading-tight text-right">{data.meaning}</p>
                    
                    <div className="flex items-center gap-2 mt-2">
                         {/* Save Button Group */}
                         {saveStatus === 'success' ? (
                             <span className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg font-medium">
                                 <Check size={18} /> Đã lưu
                             </span>
                         ) : !showLevelSelect ? (
                             <button 
                                onClick={handleSaveClick}
                                disabled={isSaving}
                                className="flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-sm"
                             >
                                 {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                 Lưu từ
                             </button>
                         ) : (
                             <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-300 shadow-lg animate-in fade-in slide-in-from-right-5">
                                 <span className="text-xs font-bold text-slate-500 px-2">Chọn Level:</span>
                                 {['N5','N4','N3','N2','N1'].map(lvl => (
                                     <button
                                        key={lvl}
                                        onClick={() => handleConfirmSave(lvl)}
                                        className="px-3 py-1 bg-slate-100 hover:bg-red-500 hover:text-white rounded text-sm font-medium transition-colors"
                                     >
                                        {lvl}
                                     </button>
                                 ))}
                                 <button onClick={() => setShowLevelSelect(false)} className="px-2 text-slate-400 hover:text-slate-600">✕</button>
                             </div>
                         )}
                    </div>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* COLUMN 1: KANJI & GRAMMAR */}
            <div className="xl:col-span-1 space-y-6">
               
               {/* Items 1, 2, 3: Kanji Details */}
               {data.kanjiDetails && data.kanjiDetails.length > 0 && (
                 <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="bg-slate-800 text-white px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                       <Type size={18} />
                       <h3 className="font-bold text-sm uppercase tracking-wider">Phân tích Hán Tự</h3>
                    </div>
                    <div className="divide-y divide-slate-100">
                       {data.kanjiDetails.map((k, idx) => (
                          <div key={idx} className="p-4">
                             <div className="flex gap-4 mb-3">
                                <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center text-3xl font-bold font-jp text-red-600 border border-red-100 shrink-0 shadow-sm">
                                   {k.character}
                                </div>
                                <div>
                                   <div className="text-lg font-bold text-slate-800">{k.hanViet}</div>
                                   <div className="text-slate-500 text-sm italic">{k.meaning}</div>
                                </div>
                             </div>
                             
                             <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                   <span className="text-xs text-slate-400 font-bold block mb-1">ÂM ON</span>
                                   <span className="font-jp font-medium text-blue-600">{k.onYomi.join(', ') || '-'}</span>
                                </div>
                                <div className="bg-slate-50 p-2 rounded border border-slate-100">
                                   <span className="text-xs text-slate-400 font-bold block mb-1">ÂM KUN</span>
                                   <span className="font-jp font-medium text-green-600">{k.kunYomi.join(', ') || '-'}</span>
                                </div>
                             </div>
                             
                             <div className="flex gap-2 bg-yellow-50 p-3 rounded-lg border border-yellow-100 items-start">
                                <span className="text-yellow-600 mt-0.5">💡</span>
                                <p className="text-sm text-yellow-800 leading-snug">{k.mnemonic}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                 </div>
               )}

               {/* Items 7 & 8: Particles & Transitivity */}
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 space-y-4">
                  {/* Transitivity */}
                  {data.transitivity?.type !== 'None' && (
                     <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2 text-slate-600 font-medium">
                           <ArrowRight size={16} className="text-orange-500" />
                           <span>Tự/Tha động từ</span>
                        </div>
                        <div className="text-right">
                           <div className="font-bold text-slate-800">{data.transitivity.type}</div>
                           {data.transitivity.pairWord && (
                             <div className="text-xs text-slate-500">Đối: <span className="font-jp">{data.transitivity.pairWord}</span></div>
                           )}
                        </div>
                     </div>
                  )}

                  {/* Particles */}
                  {data.associatedParticles && data.associatedParticles.length > 0 && (
                     <div>
                        <div className="flex items-center gap-2 text-slate-600 font-medium mb-2">
                           <Anchor size={16} className="text-blue-500" />
                           <span>Trợ từ đi kèm</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {data.associatedParticles.map(p => (
                              <span key={p} className="w-8 h-8 flex items-center justify-center bg-blue-50 rounded-full text-blue-600 font-jp font-bold text-sm border border-blue-100">
                                 {p}
                              </span>
                           ))}
                        </div>
                     </div>
                  )}
               </div>

               {/* Item 9: Conjugations - Full 12 Forms */}
               {data.conjugations && data.conjugations.length > 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                     <div className="bg-slate-800 text-white px-4 py-3 border-b border-slate-700 flex items-center gap-2">
                        <Layers size={18} />
                        <h3 className="font-bold text-sm uppercase tracking-wider">Chia động từ (12 Thể)</h3>
                     </div>
                     <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 border-b border-slate-100">
                        {data.conjugations.map((c, i) => (
                           <div key={i} className="p-2.5 hover:bg-slate-50 transition-colors">
                              <p className="text-[10px] text-slate-400 font-bold uppercase mb-0.5">{c.formName}</p>
                              <p className="font-jp font-medium text-slate-800 text-sm truncate">{c.japanese}</p>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>

            {/* COLUMN 2 & 3 Combined for Content */}
            <div className="xl:col-span-2 space-y-6">
               
               {/* Item 12: Examples (5 Sentences) */}
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-red-50 px-4 py-3 border-b border-red-100 flex items-center gap-2">
                     <Quote size={18} className="text-red-500" />
                     <h3 className="font-bold text-red-700 text-sm uppercase tracking-wider">Ví dụ minh họa (5 Câu)</h3>
                  </div>
                  <div className="divide-y divide-slate-50">
                     {data.examples.map((ex, i) => (
                        <div key={i} className="p-4 hover:bg-red-50/10 transition-colors group">
                           <div className="flex justify-between items-start mb-1">
                              <p className="font-jp text-lg font-medium text-slate-800">{ex.japanese}</p>
                              <button 
                                onClick={() => playAudio(ex.japanese)} 
                                className="text-slate-300 hover:text-red-500 transition-colors"
                                title="Nghe câu này"
                              >
                                 <Volume2 size={16} />
                              </button>
                           </div>
                           <p className="text-slate-600">{ex.vietnamese}</p>
                           {ex.explanation && <p className="text-xs text-slate-400 mt-1 italic">{ex.explanation}</p>}
                        </div>
                     ))}
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Item 10: Collocations */}
                  {data.collocations && data.collocations.length > 0 && (
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
                        <div className="bg-purple-50 px-4 py-3 border-b border-purple-100 flex items-center gap-2">
                           <Zap size={18} className="text-purple-600" />
                           <h3 className="font-bold text-purple-800 text-sm uppercase tracking-wider">Cụm từ (Collocation)</h3>
                        </div>
                        <div className="p-0">
                           {data.collocations.map((c, i) => (
                              <div key={i} className="flex flex-col p-3 border-b border-slate-50 last:border-0 hover:bg-purple-50/20">
                                 <span className="font-jp font-bold text-slate-800">{c.phrase}</span>
                                 <span className="text-sm text-slate-500">{c.meaning}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {/* Item 16: Common Mistakes */}
                  {data.commonMistakes && data.commonMistakes.length > 0 && (
                     <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
                        <div className="bg-orange-50 px-4 py-3 border-b border-orange-100 flex items-center gap-2">
                           <AlertCircle size={18} className="text-orange-600" />
                           <h3 className="font-bold text-orange-800 text-sm uppercase tracking-wider">Lỗi thường gặp</h3>
                        </div>
                        <div className="p-4 space-y-4">
                           {data.commonMistakes.map((m, i) => (
                              <div key={i} className="bg-orange-50/50 p-3 rounded-lg border border-orange-100">
                                 <div className="flex items-center gap-2 text-sm mb-2">
                                    <span className="text-red-400 line-through font-jp">{m.mistake}</span>
                                    <ArrowRight size={14} className="text-slate-300" />
                                    <span className="text-green-600 font-bold font-jp">{m.correction}</span>
                                 </div>
                                 <p className="text-xs text-slate-600 leading-relaxed">{m.explanation}</p>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>

               {/* Item 11 & 15: Related Words & Word Family */}
               <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center gap-2">
                     <GitBranch size={18} className="text-slate-500" />
                     <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Mở rộng từ vựng</h3>
                  </div>
                  <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                     {/* Synonyms/Antonyms */}
                     <div className="space-y-4">
                        <div>
                           <span className="text-xs font-bold text-green-600 uppercase block mb-2">Đồng nghĩa (Synonyms)</span>
                           <div className="flex flex-wrap gap-2">
                              {data.synonyms?.map(s => (
                                 <span key={s} className="px-2 py-1 bg-green-50 text-green-700 rounded text-sm border border-green-100 font-jp font-medium">{s}</span>
                              ))}
                           </div>
                        </div>
                        <div>
                           <span className="text-xs font-bold text-red-500 uppercase block mb-2">Trái nghĩa (Antonyms)</span>
                           <div className="flex flex-wrap gap-2">
                              {data.antonyms?.map(s => (
                                 <span key={s} className="px-2 py-1 bg-red-50 text-red-700 rounded text-sm border border-red-100 font-jp font-medium">{s}</span>
                              ))}
                           </div>
                        </div>
                     </div>

                     {/* Word Family */}
                     <div>
                        <span className="text-xs font-bold text-blue-600 uppercase block mb-2">Từ gia đình & Jukugo</span>
                        <div className="space-y-2">
                           {data.wordFamily?.slice(0, 4).map((wf, i) => (
                              <div key={i} className="flex justify-between items-center text-sm p-1.5 hover:bg-slate-50 rounded">
                                 <div>
                                    <span className="font-jp font-bold text-slate-800 mr-2">{wf.word}</span>
                                    <span className="text-slate-500 text-xs">{wf.meaning}</span>
                                 </div>
                                 <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">{wf.type}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
               
               {/* Item 14: Keigo */}
               {data.nuance?.keigo && (data.nuance.keigo.sonkeigo || data.nuance.keigo.kenjougo) && (
                   <div className="bg-gradient-to-r from-slate-800 to-slate-700 rounded-xl shadow-sm p-4 text-white">
                      <div className="flex items-center gap-2 mb-3">
                         <MessageCircle size={18} className="text-purple-300" />
                         <h3 className="font-bold text-sm uppercase tracking-wider">Kính ngữ (Keigo)</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         {data.nuance.keigo.sonkeigo && (
                            <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                               <span className="text-purple-200 text-xs font-bold uppercase block mb-1">Tôn kính ngữ (Sonkeigo)</span>
                               <span className="font-jp font-medium text-lg">{data.nuance.keigo.sonkeigo}</span>
                            </div>
                         )}
                         {data.nuance.keigo.kenjougo && (
                            <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                               <span className="text-purple-200 text-xs font-bold uppercase block mb-1">Khiêm nhường ngữ (Kenjougo)</span>
                               <span className="font-jp font-medium text-lg">{data.nuance.keigo.kenjougo}</span>
                            </div>
                         )}
                      </div>
                   </div>
               )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TranslatorView;
