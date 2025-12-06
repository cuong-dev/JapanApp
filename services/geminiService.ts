
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { JLPTLevel, QuizQuestion, VocabAnalysis } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_NAME = "gemini-2.5-flash";

export const generateLesson = async (topic: string, level: JLPTLevel): Promise<string> => {
  try {
    const prompt = `
      Bạn là một giáo viên tiếng Nhật chuyên nghiệp (Sensei).
      Hãy tạo một bài học toàn diện cho học viên trình độ ${level}.
      Chủ đề là: "${topic}".
      
      Cấu trúc bài học chặt chẽ bằng định dạng Markdown với các phần sau:
      1. **Giới thiệu (Introduction)**: Tổng quan ngắn gọn.
      2. **Từ vựng (Vocabulary)**: Các từ khóa liên quan (Kanji, Furigana, Nghĩa tiếng Việt).
      3. **Ngữ pháp (Grammar Point)**: Giải thích chi tiết ngữ pháp và quy tắc sử dụng.
      4. **Ví dụ (Example Sentences)**: 3-5 câu ví dụ minh họa ngữ cảnh.
      5. **Góc văn hóa (Cultural Note)**: Một sự thật thú vị hoặc bối cảnh văn hóa liên quan.
      
      Giọng văn khích lệ, dễ hiểu, giải thích bằng Tiếng Việt.
    `;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Không thể tạo bài học lúc này.";
  } catch (error) {
    console.error("Error generating lesson:", error);
    return "Đã xảy ra lỗi khi liên hệ với AI Sensei. Vui lòng thử lại.";
  }
};

export const generateQuiz = async (level: JLPTLevel): Promise<QuizQuestion[]> => {
  try {
    const prompt = `Tạo 5 câu hỏi trắc nghiệm tiếng Nhật cho trình độ ${level}. 
    Tập trung vào từ vựng và ngữ pháp phù hợp với cấp độ này.
    Giải thích bằng Tiếng Việt.`;

    const responseSchema: Schema = {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "Câu hỏi tiếng Nhật (dùng Kanji/Kana).",
          },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Mảng gồm 4 phương án trả lời.",
          },
          correctAnswerIndex: {
            type: Type.INTEGER,
            description: "Chỉ số (index bắt đầu từ 0) của đáp án đúng.",
          },
          explanation: {
            type: Type.STRING,
            description: "Giải thích ngắn gọn tại sao đáp án đó đúng (bằng Tiếng Việt).",
          },
        },
        required: ["question", "options", "correctAnswerIndex", "explanation"],
      },
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");

    return JSON.parse(jsonText) as QuizQuestion[];
  } catch (error) {
    console.error("Error generating quiz:", error);
    return [];
  }
};

export const analyzeVocabulary = async (text: string): Promise<VocabAnalysis | null> => {
  try {
    // Prompt được tối ưu để đảm bảo đủ 16 mục nhưng không thừa lời dẫn
    const prompt = `
      Phân tích từ vựng tiếng Nhật: "${text}" sang tiếng Việt.
      Yêu cầu nghiêm ngặt: Trả về JSON theo đúng 16 mục sau.
      1. Từ vựng & Kanji (Katakana thì để trống kanjiDetails)
      2. Âm Hán (Liệt kê On/Kun, viết hoa âm phổ biến nhất)
      3. Cách ghi nhớ (Mnemonic) dễ nhớ, liên hệ thực tế.
      4. Nghĩa tiếng Việt.
      6. Loại từ (Cụ thể: Động từ nhóm 1/2/3, Tính từ i/na, v.v)
      7. Trợ từ đi kèm (nếu có)
      8. Tự/Tha động từ (nếu là động từ)
      9. Các thể quan trọng (NẾU LÀ ĐỘNG TỪ, PHẢI CÓ ĐỦ 12 THỂ: Lịch sự, Từ điển, Phủ định, Te, Quá khứ, Ý chí, Mệnh lệnh, Cấm chỉ, Khả năng, Sai khiến, Bị động, Bị động sai khiến).
      10. Collocation (Cụm từ cố định)
      11. Từ đồng nghĩa / Trái nghĩa
      12. Ví dụ (BẮT BUỘC 5 CÂU ngắn gọn, bao quát ngữ cảnh).
      13. Sắc thái (Văn viết/nói) & Phạm vi sử dụng.
      14. Văn phong (Cứng/Mềm), Kính ngữ.
      15. Từ gia đình & Từ ghép (Jukugo).
      16. Lỗi sai thường gặp.
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        word: { type: Type.STRING },
        kanji: { type: Type.STRING },
        romaji: { type: Type.STRING },
        meaning: { type: Type.STRING },
        partOfSpeech: { type: Type.STRING },
        kanjiDetails: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              character: { type: Type.STRING },
              hanViet: { type: Type.STRING },
              onYomi: { type: Type.ARRAY, items: { type: Type.STRING } },
              kunYomi: { type: Type.ARRAY, items: { type: Type.STRING } },
              mnemonic: { type: Type.STRING },
              meaning: { type: Type.STRING }
            }
          }
        },
        transitivity: {
          type: Type.OBJECT,
          properties: {
            type: { type: Type.STRING, enum: ['Jidoushi', 'Tadoushi', 'Both', 'None'] },
            pairWord: { type: Type.STRING },
            explanation: { type: Type.STRING }
          }
        },
        associatedParticles: { type: Type.ARRAY, items: { type: Type.STRING } },
        conjugations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              formName: { type: Type.STRING, description: "Tên thể (VD: Thể Te, Thể Bị động...)" },
              japanese: { type: Type.STRING },
              romanji: { type: Type.STRING }
            }
          }
        },
        collocations: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              phrase: { type: Type.STRING },
              meaning: { type: Type.STRING }
            }
          }
        },
        synonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
        antonyms: { type: Type.ARRAY, items: { type: Type.STRING } },
        examples: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              japanese: { type: Type.STRING },
              vietnamese: { type: Type.STRING },
              explanation: { type: Type.STRING }
            }
          }
        },
        nuance: {
          type: Type.OBJECT,
          properties: {
            register: { type: Type.STRING },
            style: { type: Type.STRING },
            keigo: {
              type: Type.OBJECT,
              properties: {
                sonkeigo: { type: Type.STRING },
                kenjougo: { type: Type.STRING }
              }
            }
          }
        },
        wordFamily: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING },
              hanViet: { type: Type.STRING },
              meaning: { type: Type.STRING },
              type: { type: Type.STRING }
            }
          }
        },
        commonMistakes: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              mistake: { type: Type.STRING },
              correction: { type: Type.STRING },
              explanation: { type: Type.STRING }
            }
          }
        }
      },
      required: ["word", "meaning", "partOfSpeech", "examples"]
    };

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const textResponse = response.text;
    if (!textResponse) return null;
    return JSON.parse(textResponse) as VocabAnalysis;
  } catch (error) {
    console.error("Analysis error:", error);
    return null;
  }
};
