import type { ApplicationState, QuestionAnswer } from "~/lib/types";

// Load application state from localStorage
export function loadAppState(): ApplicationState {
  const state = localStorage.getItem("applicationState");
  if (!state) {
    return { state: "unstarted" };
  }
  const parsedState = JSON.parse(state);
  return parsedState as ApplicationState;
}

// Save application state to localStorage
export function setAppState(state: ApplicationState) {
  localStorage.setItem("applicationState", JSON.stringify(state));
}

export function getCurrentQuestionAnswers(state: ApplicationState): QuestionAnswer[] {
  if (state.state !== "in_progress") {
    return [];
  }
  const currentStepKey = `step${state.currentStep}` as keyof ApplicationState;
  const currentAnswers = (state[currentStepKey] as unknown as QuestionAnswer[]) || [];
  return currentAnswers;
}
