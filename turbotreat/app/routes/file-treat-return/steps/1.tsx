import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  loadStepStateOrRedirect,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

export type Step1State = {
  firstName: string;
};

export function clientLoader() {
  const treatReturnState = loadStepStateOrRedirect(1);

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
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [firstName, setFirstName] = useState(treatReturnState.step1.firstName);
  useEffect(() => {
    setTreatReturnState({ ...treatReturnState, step1: { firstName } });
  }, [firstName]);

  return (
    <main>
      <h1>What is your first name?</h1>
      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
      />
      <button
        disabled={firstName.length === 0}
        onClick={() => {
          setTreatReturnState({
            ...treatReturnState,
            step1: { firstName },
            currentStep: 2,
          });
          navigate("/file/step/2");
        }}
      >
        Next
      </button>
    </main>
  );
}
