const { pipeline } = require('@huggingface/inference');
const winston = require('winston');

const logger = winston.createLogger({ level: 'info', transports: [new winston.transports.Console()] });

class NLPEngine {
  constructor() {
    this.sentimentPipeline = null;
    this.loadModels();
  }

  async loadModels() {
    try {
      this.sentimentPipeline = await pipeline('sentiment-analysis', 'cardiffnlp/twitter-roberta-base-sentiment');
      logger.info('NLP sentiment model loaded');
    } catch (error) {
      logger.error('Failed to load NLP model:', error);
    }
  }

  async analyzeSentiment(text) {
    if (!this.sentimentPipeline) await this.loadModels();
    try {
      const result = await this.sentimentPipeline(text);
      const sentiment = result[0].label; // POSITIVE, NEGATIVE, NEUTRAL
      const score = result[0].score;
      logger.info(`Sentiment analysis for "${text}": ${sentiment} (${score})`);
      return { sentiment, score };
    } catch (error) {
      logger.error('Sentiment analysis failed:', error);
      return { sentiment: 'NEUTRAL', score: 0.5 };
    }
  }

  async extractKeywords(text) {
    // Simple keyword extraction (can integrate with more advanced models)
    const keywords = text.toLowerCase().split(/\s+/).filter(word => word.length > 3);
    return [...new Set(keywords)]; // Unique keywords
  }

  async summarizeContent(text) {
    // Use OpenAI for summarization
    const { Configuration, OpenAIApi } = require('openai');
    const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
    const openai = new OpenAIApi(configuration);
    try {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Summarize this tweet in 20 words: ${text}`,
        max_tokens: 50
      });
      return response.data.choices[0].text.trim();
    } catch (error) {
      logger.error('Content summarization failed:', error);
      return text.substring(0, 50) + '...';
    }
  }
}

module.exports = NLPEngine;
