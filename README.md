# ezLIfe AI AI Assistant

A premium one-page React website with an AI command center, Node/Express backend, and MongoDB-ready structure.

## Stack
- React + Vite
- JavaScript
- CSS
- Node.js + Express
- MongoDB/Mongoose-ready
- OpenAI Responses API-ready

## Run

1. Open this folder in VS Code.
2. In the terminal:
   npm install
   npm run install:all
   npm run dev

Frontend: http://localhost:5173
Backend: http://localhost:5000

## AI setup

Copy `backend/.env.example` to `backend/.env` and add your OpenAI API key.

The backend uses the OpenAI Responses API. Keep API keys on the server, never in React.

The current starter includes a safe demo action layer. Real Gmail/Google Calendar/Zoom/Teams OAuth integrations should be added after the UI and AI command flow are working.

## Important
Do not commit `.env`.
