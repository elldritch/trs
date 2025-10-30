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
  const [showHelp, setShowHelp] = useState(false);
  
  useEffect(() => {
    setTreatReturnState({ ...treatReturnState, step1: { firstName } });
  }, [firstName, treatReturnState]);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-6">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold">What is your first name?</h1>
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="ml-2 w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
            aria-label="Help with first name"
          >
            ?
          </button>
        </div>
        
        {showHelp && (
          <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
            <h4 className="font-bold mb-2">How do I know my first name?</h4>
            <p className="text-sm">
              Your first name is likely on forms you've previously filled out. You can also ask a parent or guardian for assistance when trying to determine your first name, or pick one yourself.
            </p>
          </div>
        )}
        
        <div>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter your first name"
          />
        </div>

        <div className="flex justify-end mt-8">
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
            className={`px-4 py-2 rounded ${
              firstName.length === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </main>
  );
}
