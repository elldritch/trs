import { useEffect, useState } from "react";
import { Link } from "react-router";
import type { Route } from "./+types/1";

import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";
import {
  HelpButton,
  HelpText,
  QuestionHeader,
  TextInput,
} from "./components.client";

export type Step1State = {
  firstName: string | null;
  favoriteCandy: string | null;
};

export function isCompleted(state: Step1State) {
  return state.firstName != null && state.firstName.length > 0 && state.favoriteCandy != null && state.favoriteCandy.length > 0;
}

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  // Validate state. If state fails validation, reset it to initial state.
  if (treatReturnState.step1.firstName === undefined) {
    const initialState = {
      ...treatReturnState,
      step1: { firstName: null, favoriteCandy: null },
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step1({ loaderData }: Route.ComponentProps) {
  const treatReturnState = loaderData;
  const [firstName, setFirstName] = useState(treatReturnState.step1.firstName);
  const [favoriteCandy, setFavoriteCandy] = useState(treatReturnState.step1.favoriteCandy);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setTreatReturnState({ ...treatReturnState, step1: { firstName, favoriteCandy } });
  }, [firstName, favoriteCandy]);

  const shouldDisableNext = () => !isCompleted({ firstName, favoriteCandy });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <QuestionHeader>
          What is your first name?
          <HelpButton onClick={() => setShowHelp(!showHelp)} />
        </QuestionHeader>

        {showHelp && (
          <HelpText title="How do I know my first name?">
            Your first name is likely on forms you've previously filled out. You
            can also ask a parent or guardian for assistance when trying to
            determine your first name, or pick one yourself.
          </HelpText>
        )}
        <TextInput value={firstName ?? ""} onChange={(value) => setFirstName(value)} />

        <QuestionHeader>
          What is your favorite candy?
        </QuestionHeader>
        <TextInput
          value={favoriteCandy ?? ""}
          onChange={(value) => setFavoriteCandy(value)}
          placeholderText="e.g., Snickers, Reese's, Kit Kat"
        />

        <Link
          to="/file/step/2"
          className={
            "block text-center mt-4 rounded-md font-medium text-white w-full py-2" +
            (shouldDisableNext()
              ? " bg-gray-300 cursor-not-allowed pointer-events-none"
              : " bg-sky-700 cursor-pointer")
          }
        >
          Next
        </Link>
      </div>
    </main>
  );
}
