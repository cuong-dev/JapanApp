import React, { useState } from 'react';
import { JLPTLevel, QuizQuestion } from '../types';
import { generateQuiz } from '../services/geminiService';
import { Loader2, CheckCircle, XCircle, RefreshCw, Trophy } from 'lucide-react';

const QuizView: React.FC = () => {
  const [level, setLevel] = useState<JLPTLevel>(JLPTLevel.N5);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    setQuestions([]);
    setScore(0);
    setCurrentQIndex(0);
    setQuizFinished(false);
    setSelectedAnswer(null);
    setShowExplanation(false);
    
    const data = await generateQuiz(level);
    setQuestions(data);
    setLoading(false);
  };

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return; // Prevent changing answer
    setSelectedAnswer(index);
    setShowExplanation(true);
    
    if (index === questions[currentQIndex].correctAnswerIndex) {
      setScore(s => s + 1);
    }
  };

  const nextQuestion = () => {
    if (currentQIndex < questions.length - 1) {
      setCurrentQIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <header className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-800">JLPT Practice Quiz</h2>
        <p className="text-slate-500">Test your skills with AI-generated questions</p>
      </header>

      {!loading && questions.length === 0 && !quizFinished && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
          <label className="block text-sm font-medium text-slate-700 mb-2">Select Difficulty</label>
          <div className="flex justify-center gap-2 mb-6">
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as JLPTLevel)}
              className="px-4 py-2 rounded-lg border border-slate-300 outline-none focus:ring-2 focus:ring-red-500"
            >
              {Object.values(JLPTLevel).map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <button
            onClick={startQuiz}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Start Quiz
          </button>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <Loader2 className="animate-spin mx-auto text-red-500 mb-4" size={48} />
          <p className="text-slate-600 font-medium">Generating questions...</p>
        </div>
      )}

      {questions.length > 0 && !quizFinished && !loading && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
          {/* Progress Bar */}
          <div className="bg-slate-100 h-2 w-full">
            <div 
              className="bg-red-500 h-full transition-all duration-300" 
              style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold text-slate-400 tracking-wider">QUESTION {currentQIndex + 1}/{questions.length}</span>
              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded">{level.split(' ')[0]}</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-8 font-jp leading-relaxed">
              {questions[currentQIndex].question}
            </h3>

            <div className="space-y-3">
              {questions[currentQIndex].options.map((option, idx) => {
                let btnClass = "w-full text-left p-4 rounded-xl border-2 transition-all font-jp text-lg relative ";
                
                if (selectedAnswer === null) {
                  btnClass += "border-slate-100 hover:border-red-200 hover:bg-slate-50 text-slate-700";
                } else {
                   if (idx === questions[currentQIndex].correctAnswerIndex) {
                     btnClass += "border-green-500 bg-green-50 text-green-700";
                   } else if (idx === selectedAnswer) {
                     btnClass += "border-red-500 bg-red-50 text-red-700";
                   } else {
                     btnClass += "border-slate-100 text-slate-400 opacity-50";
                   }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(idx)}
                    disabled={selectedAnswer !== null}
                    className={btnClass}
                  >
                    {option}
                    {selectedAnswer !== null && idx === questions[currentQIndex].correctAnswerIndex && (
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500" size={20} />
                    )}
                    {selectedAnswer === idx && idx !== questions[currentQIndex].correctAnswerIndex && (
                        <XCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" size={20} />
                    )}
                  </button>
                );
              })}
            </div>

            {showExplanation && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl text-blue-800 animate-in fade-in slide-in-from-bottom-2">
                <p className="font-bold text-sm mb-1">Explanation:</p>
                <p className="text-sm">{questions[currentQIndex].explanation}</p>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={nextQuestion}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    {currentQIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {quizFinished && (
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-lg text-center animate-in zoom-in-95">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="text-yellow-600" size={40} />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Complete!</h2>
          <p className="text-slate-500 mb-8">You scored</p>
          <div className="text-6xl font-bold text-slate-900 mb-8">
            {score} <span className="text-2xl text-slate-400 font-normal">/ {questions.length}</span>
          </div>
          
          <button
            onClick={startQuiz}
            className="flex items-center justify-center gap-2 mx-auto text-slate-600 hover:text-red-500 font-medium transition-colors"
          >
            <RefreshCw size={18} /> Try Another Quiz
          </button>
        </div>
      )}
    </div>
  );
};

export default QuizView;
