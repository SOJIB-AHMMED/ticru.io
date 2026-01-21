/**
 * Ticru.io API Server
 * Fastify-based REST API server for the Ticru.io application
 */

import Fastify from 'fastify';
import cors from '@fastify/cors';
import formbody from '@fastify/formbody';
import { config } from 'dotenv';
import {
  ContactMessageSchema,
  CampaignSchema,
  SentimentRequestSchema,
  ContactResponse,
  CampaignResponse,
  SentimentResponse,
  HealthCheckResponse,
  DetailedHealthCheckResponse,
} from './types.js';

// Load environment variables
config();

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
  },
});

// Register plugins
await fastify.register(cors, {
  origin: [
    'http://localhost:8080',
    'http://localhost:5173',
    'https://ticru.io',
    /\.vercel\.app$/,
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});

await fastify.register(formbody);

// In-memory storage (replace with database in production)
const contacts: ContactResponse[] = [];
const campaigns: CampaignResponse[] = [];

// Routes

/**
 * Health check endpoint
 */
fastify.get<{ Reply: HealthCheckResponse }>('/', async (request, reply) => {
  return {
    status: 'healthy',
    version: '1.0.0',
    message: 'Ticru.io API is running',
  };
});

/**
 * Detailed health check
 */
fastify.get<{ Reply: DetailedHealthCheckResponse }>(
  '/api/health',
  async (request, reply) => {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      endpoints: {
        contacts: '/api/contacts',
        campaigns: '/api/campaigns',
        sentiment: '/api/sentiment',
      },
    };
  }
);

/**
 * Submit a contact form message
 */
fastify.post<{
  Body: unknown;
  Reply: ContactResponse;
}>('/api/contacts', async (request, reply) => {
  try {
    const validatedData = ContactMessageSchema.parse(request.body);

    const contact: ContactResponse = {
      id: `contact_${contacts.length + 1}`,
      name: validatedData.name,
      email: validatedData.email,
      message: validatedData.message,
      created_at: new Date(),
      status: 'new',
    };

    contacts.push(contact);

    reply.status(201);
    return contact;
  } catch (error) {
    reply.status(400);
    return reply.send({
      error: 'Validation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Get all contact messages
 */
fastify.get<{ Reply: ContactResponse[] }>(
  '/api/contacts',
  async (request, reply) => {
    return contacts;
  }
);

/**
 * Create a new campaign
 */
fastify.post<{
  Body: unknown;
  Reply: CampaignResponse;
}>('/api/campaigns', async (request, reply) => {
  try {
    const validatedData = CampaignSchema.parse(request.body);

    const campaign: CampaignResponse = {
      id: validatedData.id || `campaign_${campaigns.length + 1}`,
      name: validatedData.name,
      status: validatedData.status,
      start_date: new Date(validatedData.start_date),
      end_date: new Date(validatedData.end_date),
      budget: validatedData.budget,
    };

    campaigns.push(campaign);

    reply.status(201);
    return campaign;
  } catch (error) {
    reply.status(400);
    return reply.send({
      error: 'Validation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

/**
 * Get all campaigns
 */
fastify.get<{ Reply: CampaignResponse[] }>(
  '/api/campaigns',
  async (request, reply) => {
    return campaigns;
  }
);

/**
 * Get a specific campaign
 */
fastify.get<{
  Params: { campaign_id: string };
  Reply: CampaignResponse;
}>('/api/campaigns/:campaign_id', async (request, reply) => {
  const { campaign_id } = request.params;

  const campaign = campaigns.find((c) => c.id === campaign_id);

  if (!campaign) {
    reply.status(404);
    return reply.send({ error: 'Campaign not found' });
  }

  return campaign;
});

/**
 * Analyze sentiment of text
 */
fastify.post<{
  Body: unknown;
  Reply: SentimentResponse;
}>('/api/sentiment', async (request, reply) => {
  try {
    const validatedData = SentimentRequestSchema.parse(request.body);
    const text = validatedData.text.toLowerCase();

    // Simple sentiment analysis (replace with actual NLP in production)
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

    const posCount = positiveWords.reduce(
      (count, word) => count + (text.includes(word) ? 1 : 0),
      0
    );
    const negCount = negativeWords.reduce(
      (count, word) => count + (text.includes(word) ? 1 : 0),
      0
    );

    const total = posCount + negCount;

    let score: number;
    let label: string;
    let confidence: number;

    if (total === 0) {
      score = 0.0;
      label = 'neutral';
      confidence = 0.5;
    } else {
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

    return {
      score,
      label,
      confidence,
    };
  } catch (error) {
    reply.status(400);
    return reply.send({
      error: 'Validation failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Start server
const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '8000', 10);
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });

    console.log(`
╔═══════════════════════════════════════════════╗
║   🚀 Ticru.io API Server Running              ║
║                                               ║
║   URL: http://${host}:${port.toString().padEnd(29)}║
║   Environment: ${(process.env.NODE_ENV || 'development').padEnd(30)}║
║   Version: 1.0.0                              ║
╚═══════════════════════════════════════════════╝
    `);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

// Handle shutdown gracefully
const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await fastify.close();
  console.log('✅ Server closed');
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Only start if this file is run directly
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1]);
if (isMainModule) {
  start();
}

export default fastify;
