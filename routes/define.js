import express from 'express';
import { getWordMeaning } from '../utils/gemini.js';

const router = express.Router();

router.post('/define', async (req, res) => {
  try {
    const { word } = req.body;
    
    if (!word || typeof word !== 'string') {
      return res.status(400).json({ 
        error: 'Invalid request',
        message: 'Word is required' 
      });
    }
    
    if (word.length < 2 || word.length > 50) {
      return res.status(400).json({ 
        error: 'Invalid word length',
        message: 'Word must be between 2 and 50 characters' 
      });
    }
    
    const cleanWord = word.trim();
    
    const meaning = await getWordMeaning(cleanWord);
    
    return res.json({ 
      success: true,
      word: cleanWord,
      meaning: meaning
    });
    
  } catch (error) {
    console.error('Define route error:', error);
    return res.status(500).json({ 
      error: 'Failed to get meaning',
      message: error.message 
    });
  }
});

export default router;

