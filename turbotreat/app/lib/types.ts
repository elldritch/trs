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
      readyToSubmit: false
    }
  | {
      state: "in_progress";
      currentStep: number;
      readyToSubmit: boolean

      step1: QuestionAnswer[];
    }
  