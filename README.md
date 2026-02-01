# Word Helper Backend API

Backend service for Simple Word Helper Chrome Extension using Gemini AI.

## Setup

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create `.env` file:
```bash
cp env.example .env
```

Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_key_here
PORT=3000
NODE_ENV=development
```

### 3. Get Gemini API Key
1. Visit https://ai.google.dev/
2. Click "Get API Key"
3. Create new project or use existing
4. Copy API key
5. Paste in `.env` file

### 4. Run Development Server
```bash
npm run dev
```

Server will start on http://localhost:3000

## API Endpoints

### GET /
Health check
```bash
curl http://localhost:3000/
```

Response:
```json
{
  "status": "running",
  "message": "Word Helper API",
  "version": "1.0.0"
}
```

### POST /api/define
Get word meaning
```bash
curl -X POST http://localhost:3000/api/define \
  -H "Content-Type: application/json" \
  -d '{"word":"magnificent"}'
```

Response:
```json
{
  "success": true,
  "word": "magnificent",
  "meaning": "Grand impressive beautiful"
}
```

## Features

- ✅ Gemini AI integration
- ✅ 7-day caching
- ✅ Rate limiting (100 requests per 15 mins)
- ✅ CORS enabled
- ✅ Error handling
- ✅ Input validation

## Deployment (You'll handle this)

You have `vercel.json` ready for Vercel deployment.

## Rate Limits

- 100 requests per 15 minutes per IP
- Adjust in `server.js` if needed

## Cache

- Meanings cached for 7 days
- Reduces API calls
- Faster responses

## Security

- API key in environment variables
- Rate limiting enabled
- Input validation
- CORS configured

## Testing

Test the API:
```bash
npm start
```

In another terminal:
```bash
curl -X POST http://localhost:3000/api/define \
  -H "Content-Type: application/json" \
  -d '{"word":"ephemeral"}'
```

## Project Structure

```
backend/
├── server.js           # Main server file
├── routes/
│   └── define.js      # Define endpoint
├── utils/
│   └── gemini.js      # Gemini AI integration
├── package.json       # Dependencies
├── vercel.json        # Vercel config
└── env.example        # Environment template
```

## Environment Variables

- `GEMINI_API_KEY` - Your Gemini API key (required)
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (development/production)

