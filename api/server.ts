/**
 * Ticru.io API Server
 * Fastify-based REST API server for the Ticru.io application
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Fastify instance
const app = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  },
});

// Zod Schemas for validation
const ContactMessageSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

const ContactResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  message: z.string(),
  created_at: z.string(),
  status: z.string(),
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

const SentimentResponseSchema = z.object({
  score: z.number(),
  label: z.string(),
  confidence: z.number(),
});

// Types
type ContactMessage = z.infer<typeof ContactMessageSchema>;
type ContactResponse = z.infer<typeof ContactResponseSchema>;
type Campaign = z.infer<typeof CampaignSchema>;
type SentimentRequest = z.infer<typeof SentimentRequestSchema>;
type SentimentResponse = z.infer<typeof SentimentResponseSchema>;

// In-memory storage (replace with database in production)
const contacts: ContactResponse[] = [];
const campaigns: (Campaign & { id: string })[] = [];

// Register plugins
await app.register(cors, {
  origin: [
    'http://localhost:8080',
    'http://localhost:5173',
    'https://ticru.io',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

await app.register(formbody);

// Routes
app.get('/', async (request, reply) => {
  return {
    status: 'healthy',
    version: '1.0.0',
    message: 'Ticru.io API is running',
  };
});

app.get('/api/health', async (request, reply) => {
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    endpoints: {
      contacts: '/api/contacts',
      campaigns: '/api/campaigns',
      sentiment: '/api/sentiment',
    },
  };
});

app.post<{ Body: ContactMessage }>('/api/contacts', async (request, reply) => {
  try {
    const contactData = ContactMessageSchema.parse(request.body);
    
    const contactId = `contact_${contacts.length + 1}`;
    const contact: ContactResponse = {
      id: contactId,
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
      reply.status(400).send({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }
    throw error;
  }
});

app.get('/api/contacts', async (request, reply) => {
  return contacts;
});

app.post<{ Body: Campaign }>('/api/campaigns', async (request, reply) => {
  try {
    const campaignData = CampaignSchema.parse(request.body);
    
    const campaignId = `campaign_${campaigns.length + 1}`;
    const campaign = {
      ...campaignData,
      id: campaignId,
    };
    
    campaigns.push(campaign);
    
    return campaign;
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply.status(400).send({
        error: 'Validation error',
        details: error.errors,
      });
      return;
    }
    throw error;
  }
});

app.get('/api/campaigns', async (request, reply) => {
  return campaigns;
});

app.get<{ Params: { campaign_id: string } }>(
  '/api/campaigns/:campaign_id',
  async (request, reply) => {
    const { campaign_id } = request.params;
    
    const campaign = campaigns.find((c) => c.id === campaign_id);
    
    if (!campaign) {
      reply.status(404).send({
        error: 'Campaign not found',
      });
      return;
    }
    
    return campaign;
  }
);

app.post<{ Body: SentimentRequest }>(
  '/api/sentiment',
  async (request, reply) => {
    try {
      const { text } = SentimentRequestSchema.parse(request.body);
      
      // Simple sentiment analysis (replace with actual NLP in production)
      const textLower = text.toLowerCase();
      const positiveWords = [
        'good',
        'great',
        'excellent',
        'amazing',
        'love',
        'wonderful',
      ];
      const negativeWords = [
        'bad',
        'terrible',
        'awful',
        'hate',
        'poor',
        'worst',
      ];
      
      const posCount = positiveWords.filter((word) =>
        textLower.includes(word)
      ).length;
      const negCount = negativeWords.filter((word) =>
        textLower.includes(word)
      ).length;
      
      const total = posCount + negCount;
      let score = 0.0;
      let label = 'neutral';
      let confidence = 0.5;
      
      if (total > 0) {
        score = (posCount - negCount) / total;
        if (score > 0.2) {
          label = 'positive';
        } else if (score < -0.2) {
          label = 'negative';
        } else {
          label = 'neutral';
        }
        confidence = Math.min(Math.abs(score) + 0.5, 1.0);
      }
      
      const response: SentimentResponse = {
        score,
        label,
        confidence,
      };
      
      return response;
    } catch (error) {
      if (error instanceof z.ZodError) {
        reply.status(400).send({
          error: 'Validation error',
          details: error.errors,
        });
        return;
      }
      throw error;
    }
  }
);

// Start server
const start = async () => {
  try {
    const host = process.env.HOST || '0.0.0.0';
    const port = parseInt(process.env.PORT || '8000', 10);
    
    await app.listen({ port, host });
    
    console.log(`🚀 Ticru.io API server running at http://${host}:${port}`);
    console.log(`📚 Health check: http://${host}:${port}/api/health`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// Only start server if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  start();
}

export default app;
