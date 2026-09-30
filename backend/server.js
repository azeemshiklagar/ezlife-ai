import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const tools = [
  {
    type: 'function',
    name: 'prepare_email',
    description: 'Prepare an email draft. Do not actually send it until the application confirms the action.',
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        recipient: { type: 'string' },
        subject: { type: 'string' },
        body: { type: 'string' }
      },
      required: ['recipient', 'subject', 'body'],
      additionalProperties: false
    }
  },
  {
    type: 'function',
    name: 'prepare_meeting',
    description: 'Prepare a meeting request for later execution through Google Meet, Zoom, or Teams.',
    strict: true,
    parameters: {
      type: 'object',
      properties: {
        platform: { type: 'string', enum: ['google_meet', 'zoom', 'teams'] },
        title: { type: 'string' },
        date: { type: 'string' },
        time: { type: 'string' },
        duration_minutes: { type: 'number' },
        attendee: { type: 'string' }
      },
      required: ['platform', 'title', 'date', 'time', 'duration_minutes', 'attendee'],
      additionalProperties: false
    }
  }
];

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'ezlife-backend' });
});

app.post('/api/ai/command', async (req, res) => {
  const command = String(req.body?.command || '').trim();

  if (!command) return res.status(400).json({ message: 'Please enter a command.' });

  if (!client) {
    return res.json({
      message: 'Demo mode is active. Add OPENAI_API_KEY to backend/.env to turn on the AI. Your command was: ' + command
    });
  }

  try {
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
      instructions: `You are ezLIfe AI, a concise executive AI assistant. Understand natural language commands and help users prepare real actions. For email or meeting requests, use the appropriate tool. Never claim an external action was completed when it was only prepared. Keep responses concise.`,
      tools,
      input: command
    });

    const toolCalls = response.output.filter(item => item.type === 'function_call');
    if (toolCalls.length) {
      const call = toolCalls[0];
      return res.json({
        message: `I understood that as ${call.name.replaceAll('_', ' ')}. I prepared the action and it is ready for confirmation.`,
        action: { name: call.name, arguments: JSON.parse(call.arguments) }
      });
    }

    res.json({ message: response.output_text || 'I’m ready. Tell me what you want done.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'AI request failed. Check your API key and backend configuration.' });
  }
});

const mongoUri = process.env.MONGO_URI;

async function start() {
  const localFallback = 'mongodb://localhost:27017/ezlife';

  if (mongoUri) {
    try {
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
      console.log('Connected to MongoDB (primary)');
    } catch (err) {
      console.error('MongoDB connection error:', err.message || err);
      console.warn('Hint: For Atlas, ensure your IP is allowed and credentials are correct. Trying local fallback...');
      try {
        await mongoose.connect(localFallback, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected to MongoDB (local fallback)');
      } catch (err2) {
        console.error('Local MongoDB fallback failed:', err2.message || err2);
        console.error('Unable to connect to any MongoDB instance. Exiting.');
        process.exit(1);
      }
    }
  } else {
    console.warn('MONGO_URI not set. Attempting local MongoDB at', localFallback);
    try {
      await mongoose.connect(localFallback, { serverSelectionTimeoutMS: 5000 });
      console.log('Connected to local MongoDB');
    } catch (err) {
      console.warn('Local MongoDB not available. Continuing without database.');
    }
  }

  app.listen(port, () => {
    console.log(`ezLIfe AI backend running on http://localhost:${port}`);
  });
}

start();
