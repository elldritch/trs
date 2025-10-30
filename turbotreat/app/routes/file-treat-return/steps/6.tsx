import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";


export type Step6State = {
  candyWeight: string;
  receivedTips: "" | "yes" | "no";
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step6) {
    const initialState = {
      ...treatReturnState,
      step6: { candyWeight: "", receivedTips: "" } as Step6State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step6() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [candyWeight, setCandyWeight] = useState(treatReturnState.step6.candyWeight);
  const [receivedTips, setReceivedTips] = useState(treatReturnState.step6.receivedTips);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step6: { candyWeight, receivedTips },
    });
  }, [candyWeight, receivedTips]);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <fieldset className="mb-6">
          <legend className="text-xl font-bold mb-4">
            Enter the total weight, in pounds, of the candy you have collected this year.
          </legend>
          <input
            type="number"
            min="0"
            step="0.01"
            value={candyWeight}
            onChange={(e) => setCandyWeight(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter weight in pounds"
          />
        </fieldset>

        <fieldset className="mb-6">
          <legend className="text-xl font-bold mb-4">
            Did you receive any candy as tips for services rendered this year?
          </legend>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tips"
                value="yes"
                checked={receivedTips === "yes"}
                onChange={(e) => setReceivedTips(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="tips"
                value="no"
                checked={receivedTips === "no"}
                onChange={(e) => setReceivedTips(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </fieldset>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/file/step/5")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => navigate("/file/step/7")}
            disabled={!candyWeight || !receivedTips}
            className={`px-4 py-2 rounded ${
              !candyWeight || !receivedTips
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
