export type Question = {
    id: string;
    text: string;
}

export type QuestionAnswer = {
    questionId: string;
    answer: string;
}

export type ApplicationState =
  | {
      state: "unstarted";
    }
  | {
      state: "in_progress";
      currentStep: number;

      step1: QuestionAnswer[];
    }
