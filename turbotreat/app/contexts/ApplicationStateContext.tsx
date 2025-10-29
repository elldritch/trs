import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { ApplicationState, QuestionAnswer } from "~/lib/types";
import { loadAppState, setAppState } from "~/lib/state.client";

type ApplicationStateContextType = {
  state: ApplicationState;
  setAnswer: (questionId: string, answer: string) => void;
};

const ApplicationStateContext = createContext<ApplicationStateContextType | null>(null);

export function ApplicationStateProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ApplicationState>({ state: "unstarted" });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loadedState = loadAppState();
    setState(loadedState);
  }, []);

  useEffect(() => {
    if (isClient) {
      setAppState(state);
    }
  }, [state, isClient]);

  const setAnswer = (questionId: string, answer: string) => {
    setState((prevState) => {
      if (prevState.state === "unstarted") {
        // Assume we are starting at step 1 with this answer
        // TODO: Maybe tighten this up? Could potentially have a weird edge case
        return {
          state: "in_progress",
          currentStep: 1,
          step1: [{ questionId, answer }],
        };
      }

      if (prevState.state === "in_progress") {
        const currentStepKey = `step${prevState.currentStep}` as keyof typeof prevState;
        const currentAnswers = (prevState[currentStepKey] as QuestionAnswer[]) || [];

        const existingIndex = currentAnswers.findIndex((entry) => entry.questionId === questionId);
        const newAnswers = existingIndex >= 0
          ? currentAnswers.map((entry, i) => i === existingIndex ? { questionId, answer } : entry)
          : [...currentAnswers, { questionId, answer }];

        return {
          ...prevState,
          [currentStepKey]: newAnswers,
        };
      }
      return prevState;
    });
  };

  return (
    <ApplicationStateContext.Provider value={{ state, setAnswer }}>
      {children}
    </ApplicationStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(ApplicationStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an ApplicationStateProvider");
  }
  return context;
}
