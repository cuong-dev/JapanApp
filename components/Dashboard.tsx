import React from 'react';
import { AppSection } from '../types';
import { Sparkles, Trophy, Target, ArrowRight } from 'lucide-react';

interface DashboardProps {
  onNavigate: (section: AppSection) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Konnichiwa, Student-san! 👋</h2>
        <p className="text-slate-500 text-lg">Ready to continue your Japanese journey today?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-lg shadow-red-200">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-white/20 rounded-lg">
              <Trophy size={24} className="text-white" />
            </div>
            <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Level N5</span>
          </div>
          <div className="mb-2">
            <h3 className="text-2xl font-bold">450 XP</h3>
            <p className="text-red-100 text-sm">Total Experience</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Sparkles size={24} className="text-blue-500" />
            </div>
            <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">Active</span>
          </div>
          <div className="mb-2">
            <h3 className="text-2xl font-bold">5 Day</h3>
            <p className="text-slate-500 text-sm">Current Streak</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg">
              <Target size={24} className="text-purple-500" />
            </div>
          </div>
          <div className="mb-2">
            <h3 className="text-2xl font-bold">12 / 20</h3>
            <p className="text-slate-500 text-sm">Words Learned Today</p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-800 mb-4">Suggested Actions</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={() => onNavigate(AppSection.LESSONS)}
          className="group flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-md transition-all text-left"
        >
          <div>
            <h4 className="font-bold text-slate-800 mb-1 group-hover:text-red-600 transition-colors">Generate New Lesson</h4>
            <p className="text-sm text-slate-500">Learn a new grammar point or topic.</p>
          </div>
          <ArrowRight className="text-slate-300 group-hover:text-red-500 transition-colors" />
        </button>

        <button 
           onClick={() => onNavigate(AppSection.QUIZ)}
          className="group flex items-center justify-between p-6 bg-white rounded-2xl border border-slate-200 hover:border-red-300 hover:shadow-md transition-all text-left"
        >
          <div>
            <h4 className="font-bold text-slate-800 mb-1 group-hover:text-red-600 transition-colors">Take a Quick Quiz</h4>
            <p className="text-sm text-slate-500">Test your knowledge with 5 AI questions.</p>
          </div>
          <ArrowRight className="text-slate-300 group-hover:text-red-500 transition-colors" />
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
