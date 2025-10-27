import type { Step1State } from "~/routes/steps/1";

export type ApplicationState =
  | {
      state: "unstarted";
    }
  | {
      state: "in_progress";
      currentStep: number;

      step1: Step1State;
    };

// TODO: Load application state from localStorage.
export function loadAppState(): ApplicationState {
  throw "unimplemented";
}

// TODO: Save application state to localStorage.
export function setAppState(state: ApplicationState) {}
