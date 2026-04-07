import express from 'express';
import {
  chatWithAI,
  healthCheck,
  getChatbotInfo
} from '../controllers/chatbotController.js';

const router = express.Router();

/**
 * POST /chat
 * Main endpoint for chat interactions
 * Body: { message: string, conversationHistory: Array (optional) }
 * Response: { success: boolean, reply: string, context: object, timestamp: string }
 */
router.post('/chat', chatWithAI);

/**
 * GET /health
 * Health check endpoint
 */
router.get('/health', healthCheck);

/**
 * GET /info
 * Get chatbot information and capabilities
 */
router.get('/info', getChatbotInfo);

export default router;
