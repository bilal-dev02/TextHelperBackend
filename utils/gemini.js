import { GoogleGenerativeAI } from '@google/generative-ai';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 604800 });
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function getWordMeaning(word) {
  const normalizedWord = word.toLowerCase().trim();
  
  const cached = cache.get(normalizedWord);
  if (cached) {
    return cached;
  }
  
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `Define the word "${word}" in exactly 3-4 simple words. 
No sentences, no punctuation, just the core meaning.
Examples:
- "magnificent" → "grand impressive beautiful"
- "ephemeral" → "lasting very short"
- "serendipity" → "fortunate discovery accidentally"
- "ambiguous" → "unclear multiple meanings"

Only respond with 3-4 words, nothing else.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let meaning = response.text().trim();
    
    meaning = meaning.replace(/[.,;!?'"]/g, '');
    meaning = meaning.replace(/\n/g, ' ');
    
    const words = meaning.split(/\s+/).filter(w => w.length > 0);
    if (words.length > 4) {
      meaning = words.slice(0, 4).join(' ');
    }
    
    meaning = meaning.charAt(0).toUpperCase() + meaning.slice(1);
    
    cache.set(normalizedWord, meaning);
    
    return meaning;
    
  } catch (error) {
    console.error('Gemini API error:', error.message);
    throw new Error('Failed to get meaning from AI');
  }
}

export function clearCache() {
  cache.flushAll();
  return true;
}

