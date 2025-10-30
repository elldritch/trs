import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router";
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
  firstName: string;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  // Validate state. If state fails validation, reset it to initial state.
  if (typeof treatReturnState.step1.firstName !== "string") {
    const initialState = {
      ...treatReturnState,
      step1: { firstName: "" },
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step1() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [firstName, setFirstName] = useState(treatReturnState.step1.firstName);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setTreatReturnState({ ...treatReturnState, step1: { firstName } });
  }, [firstName]);
  const disabled = firstName.length === 0;

  return (
    <>
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
      <TextInput value={firstName} onChange={(value) => setFirstName(value)} />
      <Link
        to="/file/step/2"
        className={
          "block text-center mt-4 rounded-md font-medium text-white w-full py-2" +
          (disabled
            ? " bg-gray-300 cursor-not-allowed pointer-events-none"
            : " bg-sky-700 cursor-pointer")
        }
      >
        Next
      </Link>
    </>
  );
}
