import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

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
    <main className="p-4">
      <h1 className="text-2xl font-light text-gray-900">
        What is your first name?
        <button
          onClick={() => setShowHelp(!showHelp)}
          className="inline text-xl ml-2 align-top h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
        >
          ?
        </button>
      </h1>

      {showHelp && (
        <div className="bg-yellow-50 p-4 mb-4 mt-2 rounded border border-yellow-200">
          <h4 className="font-bold mb-2">How do I know my first name?</h4>
          <p className="text-sm">
            Your first name is likely on forms you've previously filled out. You
            can also ask a parent or guardian for assistance when trying to
            determine your first name, or pick one yourself.
          </p>
        </div>
      )}
      <input
        type="text"
        className="w-full px-2 py-4 border block border-gray-300 rounded-md mt-2"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
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
    </main>
  );
}
