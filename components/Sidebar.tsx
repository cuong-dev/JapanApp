
import React from 'react';
import { AppSection } from '../types';
import { Home, BookOpen, GraduationCap, Languages, Flower2, NotebookPen } from 'lucide-react';

interface SidebarProps {
  currentSection: AppSection;
  onSectionChange: (section: AppSection) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, onSectionChange }) => {
  const navItems = [
    { id: AppSection.DASHBOARD, label: 'Dashboard', icon: Home },
    { id: AppSection.LESSONS, label: 'AI Lessons', icon: BookOpen },
    { id: AppSection.QUIZ, label: 'Practice Quiz', icon: GraduationCap },
    { id: AppSection.TRANSLATOR, label: 'Translator', icon: Languages },
    { id: AppSection.NOTEBOOK, label: 'My Notebook', icon: NotebookPen },
  ];

  return (
    <aside className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-slate-200 flex flex-col shadow-sm z-10">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="bg-red-500 p-2 rounded-lg text-white">
          <Flower2 size={24} />
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-800 tracking-tight">Nihongo Sensei</h1>
          <p className="text-xs text-slate-500 font-medium">AI Learning Assistant</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? 'bg-red-50 text-red-600 shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-red-500' : 'text-slate-400'} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
