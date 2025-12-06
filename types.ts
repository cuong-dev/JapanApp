
export enum AppSection {
  DASHBOARD = 'DASHBOARD',
  LESSONS = 'LESSONS',
  QUIZ = 'QUIZ',
  TRANSLATOR = 'TRANSLATOR',
  NOTEBOOK = 'NOTEBOOK'
}

export enum JLPTLevel {
  N5 = 'N5 (Beginner)',
  N4 = 'N4 (Basic)',
  N3 = 'N3 (Intermediate)',
  N2 = 'N2 (Pre-Advanced)',
  N1 = 'N1 (Advanced)'
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface LessonContent {
  title: string;
  markdownContent: string;
}

// Google Sheet Saved Word Interface
export interface SavedWord {
  word: string;
  meaning: string;
  romaji: string;
  partOfSpeech: string;
  level: string; // N1, N2...
  date?: string;
}

// 16-Point Smart Dictionary Interfaces

export interface Conjugation {
  formName: string; // e.g., "Thể Masu", "Thể Te", "Bị động"
  japanese: string;
  romanji?: string;
}

export interface KanjiDetail {
  character: string;
  hanViet: string; // 2. Âm Hán Việt
  onYomi: string[]; // 2. Âm On
  kunYomi: string[]; // 2. Âm Kun (with highlight info implied by order or logic)
  mnemonic: string; // 3. Cách ghi nhớ
  meaning: string; 
}

export interface WordFamily {
  word: string;
  hanViet: string;
  meaning: string;
  type: string; // 15. Từ loại chuyển đổi / Jukugo
}

export interface VocabAnalysis {
  // 1. Từ vựng & Kanji
  word: string;
  kanji: string;
  romaji: string;
  
  // 4. Nghĩa
  meaning: string; 
  
  // 6. Loại từ
  partOfSpeech: string; // Danh từ, Động từ Nhóm 1/2/3, Tính từ i/na...
  
  // 1. & 2. & 3. Chi tiết Kanji
  kanjiDetails: KanjiDetail[];
  
  // 8. Tự động từ / Tha động từ
  transitivity: {
    type: 'Jidoushi' | 'Tadoushi' | 'Both' | 'None';
    pairWord?: string;
    explanation?: string; // Giải thích ngắn gọn
  };
  
  // 7. Trợ từ đi kèm
  associatedParticles: string[]; 
  
  // 9. Các thể quan trọng (Full 12 forms requested)
  conjugations: Conjugation[]; 
  
  // 10. Collocation
  collocations: { phrase: string; meaning: string }[];
  
  // 11. Từ đồng nghĩa / Trái nghĩa
  synonyms: string[];
  antonyms: string[];
  
  // 12. Ví dụ (Exactly 5 sentences)
  examples: { japanese: string; vietnamese: string; explanation?: string }[];
  
  // 13. & 14. Sắc thái, Văn phong, Kính ngữ
  nuance: {
    register: string; // Văn viết/Văn nói, Sắc thái chung
    style: string; // Cứng/Mềm
    keigo?: {
      sonkeigo?: string; // Tôn kính ngữ
      kenjougo?: string; // Khiêm nhường ngữ
    };
  };
  
  // 15. Từ gia đình & Jukugo
  wordFamily: WordFamily[];
  
  // 16. Lỗi sai thường gặp
  commonMistakes: {
    mistake: string;
    correction: string;
    explanation: string;
  }[];
}