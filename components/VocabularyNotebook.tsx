
import React, { useState, useEffect } from 'react';
import { getWordsFromSheet } from '../services/sheetService';
import { SavedWord, AppSection } from '../types';
import { BookMarked, Loader2, Search, ArrowRight, Calendar } from 'lucide-react';

interface VocabularyNotebookProps {
  onSearchWord: (word: string) => void;
}

const VocabularyNotebook: React.FC<VocabularyNotebookProps> = ({ onSearchWord }) => {
  const [activeTab, setActiveTab] = useState('N5');
  const [words, setWords] = useState<SavedWord[]>([]);
  const [loading, setLoading] = useState(false);
  const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];

  useEffect(() => {
    const fetchWords = async () => {
      setLoading(true);
      const data = await getWordsFromSheet(activeTab);
      setWords(data);
      setLoading(false);
    };

    fetchWords();
  }, [activeTab]);

  return (
    <div className="max-w-6xl mx-auto h-full flex flex-col">
      <header className="mb-6 flex justify-between items-center">
        <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <BookMarked className="text-red-500" />
            Sổ tay từ vựng (My Notebook)
            </h2>
            <p className="text-slate-500">Danh sách các từ bạn đã lưu vào Google Sheet.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 pb-1 overflow-x-auto">
        {levels.map(level => (
          <button
            key={level}
            onClick={() => setActiveTab(level)}
            className={`px-6 py-2 rounded-t-lg font-bold text-sm transition-all relative top-px ${
              activeTab === level
                ? 'bg-white text-red-600 border border-slate-200 border-b-white z-10'
                : 'bg-slate-50 text-slate-500 hover:text-slate-800 border-transparent hover:bg-slate-100'
            }`}
          >
            Level {level}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex-1 overflow-hidden flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mb-4 text-red-500" size={32} />
            <p>Đang tải dữ liệu từ Google Sheet...</p>
          </div>
        ) : words.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                 <Search size={24} className="opacity-20" />
            </div>
            <p className="text-lg font-medium text-slate-600">Chưa có từ nào ở cấp độ {activeTab}</p>
            <p className="text-sm mt-2">Hãy vào mục "Translator" và lưu thêm từ mới nhé!</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-0">
             <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 sticky top-0 z-10 text-xs font-bold uppercase text-slate-500">
                   <tr>
                      <th className="px-6 py-4 border-b border-slate-100">Từ vựng</th>
                      <th className="px-6 py-4 border-b border-slate-100">Ý nghĩa</th>
                      <th className="px-6 py-4 border-b border-slate-100 hidden md:table-cell">Loại từ</th>
                      <th className="px-6 py-4 border-b border-slate-100 hidden lg:table-cell">Ngày thêm</th>
                      <th className="px-6 py-4 border-b border-slate-100 text-right">Hành động</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                   {words.map((word, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                         <td className="px-6 py-4">
                            <div className="font-bold text-lg font-jp text-slate-800">{word.word}</div>
                            <div className="text-xs text-slate-500 font-medium">{word.romaji}</div>
                         </td>
                         <td className="px-6 py-4 text-slate-700 font-medium">
                            {word.meaning}
                         </td>
                         <td className="px-6 py-4 text-slate-500 text-sm hidden md:table-cell">
                            <span className="bg-slate-100 px-2 py-1 rounded text-xs">{word.partOfSpeech}</span>
                         </td>
                         <td className="px-6 py-4 text-slate-400 text-sm hidden lg:table-cell">
                            <div className="flex items-center gap-1.5">
                               <Calendar size={14} />
                               {word.date ? new Date(word.date).toLocaleDateString() : '-'}
                            </div>
                         </td>
                         <td className="px-6 py-4 text-right">
                            <button 
                               onClick={() => onSearchWord(word.word)}
                               className="text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium text-sm inline-flex items-center gap-1 transition-colors"
                            >
                               Chi tiết <ArrowRight size={14} />
                            </button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default VocabularyNotebook;
