/**
 * Role-Play Simulator
 * Interactive role-playing scenarios for training and practice
 */

export interface RolePlayScenario {
  id: string;
  title: string;
  description: string;
  roles: Role[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
}

export interface Role {
  id: string;
  name: string;
  description: string;
  objectives: string[];
}

export interface ScenarioMessage {
  roleId: string;
  message: string;
  timestamp: Date;
}

export interface ScenarioFeedback {
  score: number;
  strengths: string[];
  improvements: string[];
  overallComment: string;
}

export class RolePlaySimulator {
  private currentScenario: RolePlayScenario | null;
  private messages: ScenarioMessage[];
  private startTime: Date | null;
  private userRoleId: string | null;

  constructor() {
    this.currentScenario = null;
    this.messages = [];
    this.startTime = null;
    this.userRoleId = null;
  }

  /**
   * Start a new role-play scenario
   */
  public startScenario(scenario: RolePlayScenario, userRoleId: string): void {
    this.currentScenario = scenario;
    this.userRoleId = userRoleId;
    this.messages = [];
    this.startTime = new Date();

    // Initialize scenario
    const userRole = scenario.roles.find(r => r.id === userRoleId);
    if (userRole) {
      this.addSystemMessage(`Welcome to the role-play scenario: ${scenario.title}`);
      this.addSystemMessage(`You are playing as: ${userRole.name}`);
      this.addSystemMessage(`Objectives: ${userRole.objectives.join(', ')}`);
    }
  }

  /**
   * Send a message as the user
   */
  public sendMessage(message: string): void {
    if (!this.currentScenario || !this.userRoleId) {
      throw new Error('No active scenario');
    }

    this.messages.push({
      roleId: this.userRoleId,
      message,
      timestamp: new Date()
    });

    // Simulate NPC response
    this.generateNPCResponse();
  }

  /**
   * Generate NPC (Non-Player Character) response
   */
  private generateNPCResponse(): void {
    if (!this.currentScenario || !this.userRoleId) {
      return;
    }

    // Find other roles (NPCs)
    const npcRoles = this.currentScenario.roles.filter(r => r.id !== this.userRoleId);
    if (npcRoles.length === 0) {
      return;
    }

    // Select random NPC
    const npc = npcRoles[Math.floor(Math.random() * npcRoles.length)];

    // Generate contextual response
    const lastMessage = this.messages[this.messages.length - 1];
    const response = this.generateContextualResponse(npc, lastMessage.message);

    this.messages.push({
      roleId: npc.id,
      message: response,
      timestamp: new Date()
    });
  }

  /**
   * Generate contextual NPC response
   */
  private generateContextualResponse(npc: Role, userMessage: string): string {
    // Simple response generation based on keywords
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return `Hello! I'm ${npc.name}. How can I help you today?`;
    } else if (lowerMessage.includes('help') || lowerMessage.includes('assist')) {
      return `Of course, I'd be happy to help. ${npc.objectives[0]}`;
    } else if (lowerMessage.includes('question') || lowerMessage.includes('?')) {
      return `That's a great question. Let me explain...`;
    } else {
      return `I understand. ${npc.description}`;
    }
  }

  /**
   * Add system message
   */
  private addSystemMessage(message: string): void {
    this.messages.push({
      roleId: 'system',
      message,
      timestamp: new Date()
    });
  }

  /**
   * End the scenario and get feedback
   */
  public endScenario(): ScenarioFeedback {
    if (!this.currentScenario || !this.startTime) {
      throw new Error('No active scenario');
    }

    const duration = (new Date().getTime() - this.startTime.getTime()) / 1000 / 60; // minutes
    const userMessages = this.messages.filter(m => m.roleId === this.userRoleId);

    // Calculate score based on participation
    let score = 0;
    if (userMessages.length >= 5) score += 30;
    if (duration >= this.currentScenario.duration * 0.5) score += 30;
    if (this.checkObjectivesCompletion()) score += 40;

    const feedback: ScenarioFeedback = {
      score,
      strengths: this.identifyStrengths(userMessages),
      improvements: this.identifyImprovements(userMessages),
      overallComment: this.generateOverallComment(score)
    };

    // Reset state
    this.currentScenario = null;
    this.messages = [];
    this.startTime = null;
    this.userRoleId = null;

    return feedback;
  }

  /**
   * Check if objectives were completed
   */
  private checkObjectivesCompletion(): boolean {
    // Simplified check - in real implementation, would be more sophisticated
    const userMessages = this.messages.filter(m => m.roleId === this.userRoleId);
    return userMessages.length >= 3;
  }

  /**
   * Identify strengths based on user performance
   */
  private identifyStrengths(userMessages: ScenarioMessage[]): string[] {
    const strengths: string[] = [];

    if (userMessages.length >= 5) {
      strengths.push('Active participation and engagement');
    }

    if (userMessages.some(m => m.message.includes('?'))) {
      strengths.push('Asking clarifying questions');
    }

    if (userMessages.some(m => m.message.length > 100)) {
      strengths.push('Providing detailed responses');
    }

    return strengths;
  }

  /**
   * Identify areas for improvement
   */
  private identifyImprovements(userMessages: ScenarioMessage[]): string[] {
    const improvements: string[] = [];

    if (userMessages.length < 5) {
      improvements.push('Increase participation and interaction');
    }

    if (!userMessages.some(m => m.message.includes('?'))) {
      improvements.push('Ask more questions to clarify understanding');
    }

    return improvements;
  }

  /**
   * Generate overall comment based on score
   */
  private generateOverallComment(score: number): string {
    if (score >= 80) {
      return 'Excellent performance! You demonstrated strong role-playing skills.';
    } else if (score >= 60) {
      return 'Good job! With a bit more practice, you\'ll master this scenario.';
    } else if (score >= 40) {
      return 'Fair attempt. Focus on the objectives and engage more actively.';
    } else {
      return 'Keep practicing! Review the objectives and try again.';
    }
  }

  /**
   * Get current messages
   */
  public getMessages(): ScenarioMessage[] {
    return this.messages;
  }

  /**
   * Get current scenario
   */
  public getCurrentScenario(): RolePlayScenario | null {
    return this.currentScenario;
  }

  /**
   * Get predefined scenarios
   */
  public static getPresetScenarios(): RolePlayScenario[] {
    return [
      {
        id: 'customer-service',
        title: 'Customer Service Interaction',
        description: 'Handle a customer complaint professionally',
        roles: [
          {
            id: 'agent',
            name: 'Customer Service Agent',
            description: 'Help resolve customer issues',
            objectives: ['Understand the problem', 'Provide solution', 'Ensure satisfaction']
          },
          {
            id: 'customer',
            name: 'Customer',
            description: 'You have a complaint about a product',
            objectives: ['Explain the issue', 'Get resolution']
          }
        ],
        difficulty: 'beginner',
        duration: 10
      },
      {
        id: 'sales-pitch',
        title: 'Sales Pitch',
        description: 'Present a product to a potential client',
        roles: [
          {
            id: 'salesperson',
            name: 'Sales Representative',
            description: 'Sell the product effectively',
            objectives: ['Present value proposition', 'Handle objections', 'Close the deal']
          },
          {
            id: 'client',
            name: 'Potential Client',
            description: 'Evaluate the product offering',
            objectives: ['Understand the product', 'Ask relevant questions']
          }
        ],
        difficulty: 'intermediate',
        duration: 15
      }
    ];
  }
}

export default RolePlaySimulator;
