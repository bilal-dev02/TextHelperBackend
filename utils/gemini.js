import NodeCache from 'node-cache';
import dotenv from 'dotenv';

dotenv.config();

const cache = new NodeCache({ stdTTL: 604800 });

export async function getWordMeaning(word) {
  const normalizedWord = word.toLowerCase().trim();
  
  const cached = cache.get(normalizedWord);
  if (cached) {
    return cached;
  }
  
  try {
    const meaning = await getFromGroq(word);
    
    if (meaning) {
      cache.set(normalizedWord, meaning);
      return meaning;
    }
    
    throw new Error('Groq returned empty');
    
  } catch (error) {
    
    try {
      const meaning = await getFromDictionary(word);
      if (meaning) {
        cache.set(normalizedWord, meaning);
        return meaning;
      }
    } catch (dictError) {
      
    }
    
    throw new Error('All APIs failed');
  }
}

async function getFromGroq(word) {
  try {
    const prompt = `Define "${word}" in 3-4 simple words only. No punctuation.`;
    
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 20,
        temperature: 0.3
      })
    });
    
    if (!response.ok) {
      throw new Error('Groq API failed: ' + response.status);
    }
    
    const data = await response.json();
    let meaning = data.choices[0].message.content.trim();
    
    meaning = meaning.replace(/[.,;!?'"]/g, '');
    meaning = meaning.replace(/\n/g, ' ');
    
    const words = meaning.split(/\s+/).filter(w => w.length > 0);
    if (words.length > 4) {
      meaning = words.slice(0, 4).join(' ');
    }
    
    meaning = meaning.charAt(0).toUpperCase() + meaning.slice(1);
    
    return meaning;
    
  } catch (error) {
    throw error;
  }
}

async function getFromDictionary(word) {
  try {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    
    if (!response.ok) {
      throw new Error('Dictionary API failed');
    }
    
    const data = await response.json();
    const definition = data[0].meanings[0].definitions[0].definition;
    
    let meaning = definition.toLowerCase();
    meaning = meaning.replace(/^(the|a|an)\s+/gi, '');
    meaning = meaning.replace(/^(act|state|quality|process) of\s+/gi, '');
    meaning = meaning.split(/[.;]/)[0];
    
    const words = meaning.split(/\s+/).filter(w => w.length > 0);
    meaning = words.slice(0, 4).join(' ');
    
    meaning = meaning.charAt(0).toUpperCase() + meaning.slice(1);
    
    return meaning;
    
  } catch (error) {
    throw error;
  }
}

export function clearCache() {
  cache.flushAll();
  return true;
}
