/**
 * 60-Second Setup Wizard
 * Quickly onboard users with a streamlined setup process
 */

export interface SetupStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

export class SetupWizard {
  private steps: SetupStep[];
  private currentStep: number;
  private startTime: number;

  constructor() {
    this.steps = [
      {
        id: 'welcome',
        title: 'Welcome to Ticru.io',
        description: 'Let\'s get you started in under 60 seconds',
        completed: false
      },
      {
        id: 'profile',
        title: 'Create Your Profile',
        description: 'Tell us a bit about yourself',
        completed: false
      },
      {
        id: 'preferences',
        title: 'Set Preferences',
        description: 'Customize your experience',
        completed: false
      },
      {
        id: 'complete',
        title: 'All Set!',
        description: 'You\'re ready to go',
        completed: false
      }
    ];
    this.currentStep = 0;
    this.startTime = Date.now();
  }

  public getCurrentStep(): SetupStep {
    return this.steps[this.currentStep];
  }

  public nextStep(): boolean {
    if (this.currentStep < this.steps.length - 1) {
      this.steps[this.currentStep].completed = true;
      this.currentStep++;
      return true;
    }
    return false;
  }

  public previousStep(): boolean {
    if (this.currentStep > 0) {
      this.currentStep--;
      return true;
    }
    return false;
  }

  public getProgress(): number {
    const completed = this.steps.filter(step => step.completed).length;
    return (completed / this.steps.length) * 100;
  }

  public getElapsedTime(): number {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  public isComplete(): boolean {
    return this.steps.every(step => step.completed);
  }

  public reset(): void {
    this.currentStep = 0;
    this.startTime = Date.now();
    this.steps.forEach(step => step.completed = false);
  }
}

export default SetupWizard;
