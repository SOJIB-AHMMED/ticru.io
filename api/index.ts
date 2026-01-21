/**
 * Vercel Serverless Function for Fastify API
 * This wraps the Fastify server for deployment on Vercel
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import { z } from 'zod';

// Create Fastify instance (without logger for serverless)
const app = Fastify({
  logger: false,
});

// Zod Schemas for validation
const ContactMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

const CampaignSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  status: z.string(),
  start_date: z.string(),
  end_date: z.string(),
  budget: z.number(),
});

const SentimentRequestSchema = z.object({
  text: z.string().min(1),
});

// Types
type ContactResponse = {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  status: string;
};

type Campaign = {
  id?: string;
  name: string;
  status: string;
  start_date: string;
  end_date: string;
  budget: number;
};

type SentimentResponse = {
  score: number;
  label: string;
  confidence: number;
};

// In-memory storage (in serverless, this resets on cold start)
const contacts: ContactResponse[] = [];
const campaigns: (Campaign & { id: string })[] = [];

// Register plugins
await app.register(cors, {
  origin: true, // Allow all origins in serverless
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

await app.register(formbody);

// Routes
app.get('/', async () => ({
  status: 'healthy',
  version: '1.0.0',
  message: 'Ticru.io API is running',
}));

app.get('/api/health', async () => ({
  status: 'ok',
  timestamp: new Date().toISOString(),
  endpoints: {
    contacts: '/api/contacts',
    campaigns: '/api/campaigns',
    sentiment: '/api/sentiment',
  },
}));

app.post('/api/contacts', async (request, reply) => {
  try {
    const contactData = ContactMessageSchema.parse(request.body);
    
    const contact: ContactResponse = {
      id: `contact_${contacts.length + 1}`,
      name: contactData.name,
      email: contactData.email,
      message: contactData.message,
      created_at: new Date().toISOString(),
      status: 'new',
    };
    
    contacts.push(contact);
    return contact;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: 'Validation error',
        details: error.errors,
      });
    }
    throw error;
  }
});

app.get('/api/contacts', async () => contacts);

app.post('/api/campaigns', async (request, reply) => {
  try {
    const campaignData = CampaignSchema.parse(request.body);
    
    const campaign = {
      ...campaignData,
      id: `campaign_${campaigns.length + 1}`,
    };
    
    campaigns.push(campaign);
    return campaign;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: 'Validation error',
        details: error.errors,
      });
    }
    throw error;
  }
});

app.get('/api/campaigns', async () => campaigns);

app.get<{ Params: { campaign_id: string } }>(
  '/api/campaigns/:campaign_id',
  async (request, reply) => {
    const campaign = campaigns.find((c) => c.id === request.params.campaign_id);
    
    if (!campaign) {
      return reply.status(404).send({ error: 'Campaign not found' });
    }
    
    return campaign;
  }
);

app.post('/api/sentiment', async (request, reply) => {
  try {
    const { text } = SentimentRequestSchema.parse(request.body);
    
    const textLower = text.toLowerCase();
    const positiveWords = ['good', 'great', 'excellent', 'amazing', 'love', 'wonderful'];
    const negativeWords = ['bad', 'terrible', 'awful', 'hate', 'poor', 'worst'];
    
    const posCount = positiveWords.filter((word) => textLower.includes(word)).length;
    const negCount = negativeWords.filter((word) => textLower.includes(word)).length;
    
    const total = posCount + negCount;
    let score = 0.0;
    let label = 'neutral';
    let confidence = 0.5;
    
    if (total > 0) {
      score = (posCount - negCount) / total;
      label = score > 0.2 ? 'positive' : score < -0.2 ? 'negative' : 'neutral';
      confidence = Math.min(Math.abs(score) + 0.5, 1.0);
    }
    
    return { score, label, confidence };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return reply.status(400).send({
        error: 'Validation error',
        details: error.errors,
      });
    }
    throw error;
  }
});

// Export handler for Vercel
export default async function handler(req, res) {
  await app.ready();
  app.server.emit('request', req, res);
}
