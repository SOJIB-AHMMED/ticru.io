/**
 * Sentiment Analysis Module
 * Analyze text sentiment using natural language processing
 */

export interface SentimentResult {
  score: number; // -1 to 1 (negative to positive)
  magnitude: number; // 0 to infinity
  label: 'positive' | 'negative' | 'neutral';
  confidence: number; // 0 to 1
}

export interface SentimentAnalysisOptions {
  language?: string;
  enableEmotionDetection?: boolean;
  threshold?: number;
}

export class SentimentAnalyzer {
  private positiveWords: Set<string>;
  private negativeWords: Set<string>;
  private options: SentimentAnalysisOptions;

  constructor(options: SentimentAnalysisOptions = {}) {
    this.options = {
      language: 'en',
      enableEmotionDetection: true,
      threshold: 0.1,
      ...options
    };

    // Basic sentiment word lists
    this.positiveWords = new Set([
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
      'love', 'best', 'perfect', 'awesome', 'happy', 'joy', 'pleased',
      'delighted', 'satisfied', 'brilliant', 'outstanding', 'superb'
    ]);

    this.negativeWords = new Set([
      'bad', 'terrible', 'awful', 'horrible', 'worst', 'hate', 'poor',
      'disappointing', 'sad', 'angry', 'frustrated', 'annoyed', 'upset',
      'disgusting', 'pathetic', 'useless', 'waste', 'fail'
    ]);
  }

  /**
   * Analyze sentiment of given text
   */
  public analyze(text: string): SentimentResult {
    if (!text || text.trim().length === 0) {
      return {
        score: 0,
        magnitude: 0,
        label: 'neutral',
        confidence: 0
      };
    }

    const words = this.tokenize(text);
    let positiveCount = 0;
    let negativeCount = 0;

    words.forEach(word => {
      const lowerWord = word.toLowerCase();
      if (this.positiveWords.has(lowerWord)) {
        positiveCount++;
      } else if (this.negativeWords.has(lowerWord)) {
        negativeCount++;
      }
    });

    const totalSentimentWords = positiveCount + negativeCount;
    const score = totalSentimentWords === 0 
      ? 0 
      : (positiveCount - negativeCount) / totalSentimentWords;

    const magnitude = totalSentimentWords / words.length;
    const confidence = Math.min(magnitude * 2, 1);

    let label: 'positive' | 'negative' | 'neutral';
    if (score > this.options.threshold!) {
      label = 'positive';
    } else if (score < -this.options.threshold!) {
      label = 'negative';
    } else {
      label = 'neutral';
    }

    return {
      score,
      magnitude,
      label,
      confidence
    };
  }

  /**
   * Batch analyze multiple texts
   */
  public analyzeBatch(texts: string[]): SentimentResult[] {
    return texts.map(text => this.analyze(text));
  }

  /**
   * Get sentiment trend over time
   */
  public analyzeTrend(texts: string[]): {
    average: number;
    trend: 'improving' | 'declining' | 'stable';
    data: SentimentResult[];
  } {
    const results = this.analyzeBatch(texts);
    const scores = results.map(r => r.score);
    const average = scores.reduce((a, b) => a + b, 0) / scores.length;

    // Calculate trend
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));
    const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    let trend: 'improving' | 'declining' | 'stable';
    const trendDiff = secondAvg - firstAvg;
    if (trendDiff > 0.1) {
      trend = 'improving';
    } else if (trendDiff < -0.1) {
      trend = 'declining';
    } else {
      trend = 'stable';
    }

    return {
      average,
      trend,
      data: results
    };
  }

  /**
   * Tokenize text into words
   */
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 0);
  }

  /**
   * Add custom positive words
   */
  public addPositiveWords(words: string[]): void {
    words.forEach(word => this.positiveWords.add(word.toLowerCase()));
  }

  /**
   * Add custom negative words
   */
  public addNegativeWords(words: string[]): void {
    words.forEach(word => this.negativeWords.add(word.toLowerCase()));
  }
}

export default SentimentAnalyzer;
