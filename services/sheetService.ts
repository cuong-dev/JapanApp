
import { SavedWord, VocabAnalysis } from "../types";

// QUAN TRỌNG: Bạn hãy thay thế URL này bằng Web App URL bạn nhận được khi Deploy Google Apps Script
// Ví dụ: "https://script.google.com/macros/s/AKfycbx.../exec"
const GAS_API_URL = "YOUR_GAS_WEB_APP_URL_HERE"; 

export const saveWordToSheet = async (data: VocabAnalysis, level: string): Promise<{ success: boolean; message: string }> => {
  if (GAS_API_URL === "YOUR_GAS_WEB_APP_URL_HERE") {
     return { success: false, message: "Chưa cấu hình API URL trong code!" };
  }

  try {
    const payload = {
      word: data.word,
      meaning: data.meaning,
      romaji: data.romaji,
      partOfSpeech: data.partOfSpeech,
      level: level // N5, N4, etc.
    };

    const response = await fetch(`${GAS_API_URL}?action=save`, {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Save error:", error);
    return { success: false, message: "Lỗi kết nối đến Google Sheet." };
  }
};

export const getWordsFromSheet = async (level: string): Promise<SavedWord[]> => {
  if (GAS_API_URL === "YOUR_GAS_WEB_APP_URL_HERE") {
     console.warn("Chưa cấu hình API URL");
     return [];
  }

  try {
    const response = await fetch(`${GAS_API_URL}?action=get&level=${level}`);
    const result = await response.json();
    if (result.success) {
      return result.data;
    }
    return [];
  } catch (error) {
    console.error("Get words error:", error);
    return [];
  }
};
