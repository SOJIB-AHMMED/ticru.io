/**
 * Multi-Mode Agent
 * Intelligent agent that can operate in different modes based on context
 */

export type AgentMode = 'assistant' | 'analyst' | 'creator' | 'advisor';

export interface AgentContext {
  userId: string;
  sessionId: string;
  mode: AgentMode;
  history: AgentMessage[];
}

export interface AgentMessage {
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  mode: AgentMode;
}

export interface AgentCapability {
  name: string;
  description: string;
  supportedModes: AgentMode[];
}

export class MultiModeAgent {
  private context: AgentContext;
  private capabilities: AgentCapability[];

  constructor(userId: string) {
    this.context = {
      userId,
      sessionId: this.generateSessionId(),
      mode: 'assistant',
      history: []
    };

    this.capabilities = [
      {
        name: 'Answer Questions',
        description: 'Provide helpful answers to user questions',
        supportedModes: ['assistant', 'advisor']
      },
      {
        name: 'Analyze Data',
        description: 'Perform data analysis and provide insights',
        supportedModes: ['analyst']
      },
      {
        name: 'Generate Content',
        description: 'Create text, code, or other content',
        supportedModes: ['creator']
      },
      {
        name: 'Provide Recommendations',
        description: 'Suggest best practices and solutions',
        supportedModes: ['advisor', 'analyst']
      }
    ];
  }

  /**
   * Switch agent mode
   */
  public switchMode(mode: AgentMode): void {
    this.context.mode = mode;
    this.addMessage('agent', `Switched to ${mode} mode`);
  }

  /**
   * Process user input
   */
  public processInput(input: string): string {
    this.addMessage('user', input);

    const response = this.generateResponse(input);
    this.addMessage('agent', response);

    return response;
  }

  /**
   * Generate response based on current mode
   */
  private generateResponse(input: string): string {
    switch (this.context.mode) {
      case 'assistant':
        return this.assistantResponse(input);
      case 'analyst':
        return this.analystResponse(input);
      case 'creator':
        return this.creatorResponse(input);
      case 'advisor':
        return this.advisorResponse(input);
      default:
        return 'I\'m not sure how to help with that.';
    }
  }

  /**
   * Assistant mode response
   */
  private assistantResponse(input: string): string {
    return `As your assistant, I understand you need help with: "${input}". How can I assist you further?`;
  }

  /**
   * Analyst mode response
   */
  private analystResponse(input: string): string {
    return `Analyzing: "${input}". Based on the data patterns, here are my insights...`;
  }

  /**
   * Creator mode response
   */
  private creatorResponse(input: string): string {
    return `Creating content based on: "${input}". Here's what I've generated...`;
  }

  /**
   * Advisor mode response
   */
  private advisorResponse(input: string): string {
    return `Regarding: "${input}", I recommend considering the following best practices...`;
  }

  /**
   * Add message to history
   */
  private addMessage(role: 'user' | 'agent', content: string): void {
    this.context.history.push({
      role,
      content,
      timestamp: new Date(),
      mode: this.context.mode
    });
  }

  /**
   * Get conversation history
   */
  public getHistory(): AgentMessage[] {
    return this.context.history;
  }

  /**
   * Get current mode
   */
  public getCurrentMode(): AgentMode {
    return this.context.mode;
  }

  /**
   * Get available capabilities for current mode
   */
  public getAvailableCapabilities(): AgentCapability[] {
    return this.capabilities.filter(cap =>
      cap.supportedModes.includes(this.context.mode)
    );
  }

  /**
   * Clear conversation history
   */
  public clearHistory(): void {
    this.context.history = [];
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get agent status
   */
  public getStatus(): {
    mode: AgentMode;
    messageCount: number;
    sessionDuration: number;
  } {
    const firstMessage = this.context.history[0];
    const sessionDuration = firstMessage
      ? Date.now() - firstMessage.timestamp.getTime()
      : 0;

    return {
      mode: this.context.mode,
      messageCount: this.context.history.length,
      sessionDuration
    };
  }
}

export default MultiModeAgent;
