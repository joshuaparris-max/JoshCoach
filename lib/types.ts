export type QuestionType = "mcq" | "short_answer";

export interface QuestionPayload {
  id: string;
  type: QuestionType;
  question: string;
  options: string[] | null;
  correctAnswer: string;
  explanation: string;
}

export interface AnswerPayload {
  questionId: string;
  answer: string;
  correct: boolean;
  quality: number;
}
