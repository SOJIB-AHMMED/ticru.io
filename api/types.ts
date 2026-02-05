/**
 * Type definitions for Ticru.io API
 */

import { z } from 'zod';

// Contact Message Schema
export const ContactMessageSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(1, 'Message is required'),
});

export type ContactMessage = z.infer<typeof ContactMessageSchema>;

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: Date;
  status: string;
}

// Campaign Schema
export const CampaignSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Campaign name is required'),
  status: z.string(),
  start_date: z.string().datetime(),
  end_date: z.string().datetime(),
  budget: z.number().nonnegative(),
});

export type Campaign = z.infer<typeof CampaignSchema>;

export interface CampaignResponse {
  id: string;
  name: string;
  status: string;
  start_date: Date;
  end_date: Date;
  budget: number;
}

// Sentiment Analysis Schema
export const SentimentRequestSchema = z.object({
  text: z.string().min(1, 'Text is required for analysis'),
});

export type SentimentRequest = z.infer<typeof SentimentRequestSchema>;

export interface SentimentResponse {
  score: number;
  label: string;
  confidence: number;
}

// Health Check Response
export interface HealthCheckResponse {
  status: string;
  version: string;
  message: string;
}

export interface DetailedHealthCheckResponse {
  status: string;
  timestamp: string;
  endpoints: {
    contacts: string;
    campaigns: string;
    sentiment: string;
  };
}
