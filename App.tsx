
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import LessonGenerator from './components/LessonGenerator';
import QuizView from './components/QuizView';
import TranslatorView from './components/TranslatorView';
import VocabularyNotebook from './components/VocabularyNotebook';
import { AppSection } from './types';

const App: React.FC = () => {
  const [currentSection, setCurrentSection] = useState<AppSection>(AppSection.DASHBOARD);
  // Optional: State to pre-fill translator input if navigating from notebook
  // This example just switches view, but in a real app you might pass this state down
  const [searchQuery, setSearchQuery] = useState('');

  const renderSection = () => {
    switch (currentSection) {
      case AppSection.DASHBOARD:
        return <Dashboard onNavigate={setCurrentSection} />;
      case AppSection.LESSONS:
        return <LessonGenerator />;
      case AppSection.QUIZ:
        return <QuizView />;
      case AppSection.TRANSLATOR:
        return <TranslatorView />;
      case AppSection.NOTEBOOK:
        return <VocabularyNotebook onSearchWord={(word) => {
            // Very simple logic: We probably want to switch to Translator and run the search
            // But since TranslatorView manages its own state, we'll just switch section for now.
            // A more complex app would lift the search state up to App.tsx
            setCurrentSection(AppSection.TRANSLATOR);
        }} />;
      default:
        return <Dashboard onNavigate={setCurrentSection} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      <Sidebar currentSection={currentSection} onSectionChange={setCurrentSection} />
      
      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {renderSection()}
      </main>
    </div>
  );
};

export default App;
