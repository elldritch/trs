import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";


type Step8State = {
  filled1040TRES: "" | "yes" | "no";
  candiesPaid: string;
};

export type { Step8State };

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step8) {
    const initialState = {
      ...treatReturnState,
      step8: { filled1040TRES: "", candiesPaid: "" } as Step8State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step8() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [filled1040TRES, setFilled1040TRES] = useState(treatReturnState.step8.filled1040TRES);
  const [candiesPaid, setCandiesPaid] = useState(treatReturnState.step8.candiesPaid);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step8: { filled1040TRES, candiesPaid },
    });
  }, [filled1040TRES, candiesPaid]);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <fieldset className="mb-6">
          <div className="flex items-center mb-2">
            <legend className="text-xl font-bold">
              Have you already filled out a form 1040-TR-ES earlier this year?
            </legend>
            <button 
              onClick={() => setShowHelp(!showHelp)}
              className="ml-2 text-orange-500 hover:text-orange-700"
              aria-label="What is form 1040-TR-ES?"
            >
              ?
            </button>
          </div>
          
          {showHelp && (
            <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
              <h4 className="font-bold mb-2">What is form 1040-TR-ES?</h4>
              <p className="text-sm">
                Form 1040-TR-ES is used to submit estimated treat tax payments for treat income that is not subject to withholding. 
                For instance, if you made treats yourself (self-employed treat income), or received treats from a house that did not 
                issue you a form W-2-TR, that treat income might not have been subject to withholding. The TRS collects candy in a 
                pay-as-you-go system, so estimated taxes on non-withheld treat income must be paid quarterly using Form 1040-TR-ES.
              </p>
            </div>
          )}
          
          <div className="space-x-4 mb-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="1040tres"
                value="yes"
                checked={filled1040TRES === "yes"}
                onChange={(e) => setFilled1040TRES(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="1040tres"
                value="no"
                checked={filled1040TRES === "no"}
                onChange={(e) => setFilled1040TRES(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>

          {filled1040TRES === "yes" && (
            <div className="mt-4">
              <label className="block text-lg font-medium mb-2">
                How many pieces of candy did you pay via form 1040-TR-ES?
              </label>
              <div className="text-sm text-gray-600 mb-2">
                <p className="mb-2">
                  <strong>Note:</strong> Estimated treat payments are made by weight, but deductions for estimated treat 
                  payments are determined by converting estimated treat payment weights to a number of Standard Candies (SCs).
                </p>
                <p>
                  To determine how many SCs you paid, take the total weight of the candy you paid in each quarter by consulting 
                  box 13 of form 1040-TR-ES, and dividing by the Standard Candy weight to candy pieces conversion ratio for the given tax year. 
                  The Standard Candy weight to candy pieces conversion schedule is available as form SCTR-2. The standard conversion ratio 
                  for chocolate type candies for the 2025 tax year is 16.21g/pc.
                </p>
              </div>
              <input
                type="number"
                min="0"
                step="1"
                value={candiesPaid}
                onChange={(e) => setCandiesPaid(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter number of candies"
              />
            </div>
          )}
        </fieldset>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/file/step/8")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => navigate("/file/step/10")}
            disabled={!filled1040TRES || (filled1040TRES === "yes" && !candiesPaid)}
            className={`px-4 py-2 rounded ${
              !filled1040TRES || (filled1040TRES === "yes" && !candiesPaid)
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
