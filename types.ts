
export interface Question {
  id: number;
  topic: string;
  prompt: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  answer: 'A' | 'B' | 'C' | 'D';
}

export interface QuizScore {
  id?: string;
  player_name: string;
  topic: string;
  score: number;
  total_questions: number;
  time_remaining_ms: number;
  created_at?: string;
}

export interface PlayerBest {
  player_name: string;
  best_by_topic: Record<string, number>;
  total_points: number;
  updated_at?: string;
}

export enum QuizState {
  STARTING = 'STARTING',
  COUNTDOWN = 'COUNTDOWN',
  ACTIVE = 'ACTIVE',
  FINISHED = 'FINISHED',
  FAILED = 'FAILED'
}
