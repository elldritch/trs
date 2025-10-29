import { redirect } from "react-router";
import type { Step1State } from "../routes/file-treat-return/steps/1";
import type { Step2State } from "../routes/file-treat-return/steps/2";

export type TreatReturnState =
  | { state: "unstarted" }
  | {
      state: "in_progress";
      currentStep: number;
      readyToSubmit: boolean;

      step1: Step1State;
      step2: Step2State;
    };

export const treatReturnStartState: TreatReturnState = {
  state: "in_progress",
  currentStep: 1,
  readyToSubmit: false,
  step1: { firstName: "" },
  step2: {},
};

const treatReturnStateLocalStorageKey = "treatReturnState";

// Load treat return state from localStorage.
export function loadTreatReturnState(): TreatReturnState {
  const state = localStorage.getItem(treatReturnStateLocalStorageKey);
  if (!state) {
    return { state: "unstarted" };
  }
  try {
    return JSON.parse(state);
  } catch (e) {
    console.error("Failed to parse treat return state", e);
    return { state: "unstarted" };
  }
}

export function loadStepStateOrRedirect(step: number) {
  const state = loadTreatReturnState();
  if (state.state === "unstarted") {
    throw redirect("/file");
  }
  if (state.state === "in_progress" && state.currentStep !== step) {
    throw redirect(`/file/step/${state.currentStep}`);
  }
  return state;
}

// Save treat return state to localStorage.
export function setTreatReturnState(state: TreatReturnState) {
  localStorage.setItem(treatReturnStateLocalStorageKey, JSON.stringify(state));
}
