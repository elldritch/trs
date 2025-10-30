import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

export type Step5State = {
  allFromArborAve: "" | "yes" | "no";};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (typeof treatReturnState.step5?.allFromArborAve !== "string") {
    const initialState = {
      ...treatReturnState,
      step5: { allFromArborAve: "" } as Step5State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step5() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [allFromArborAve, setAllFromArborAve] = useState(
    treatReturnState.step5.allFromArborAve
  );

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step5: { allFromArborAve },
    });
  }, [allFromArborAve]);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <fieldset className="mb-6">
        <legend className="text-xl font-bold mb-4">
          Is all the candy you collected this year from Arbor Ave?
        </legend>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="arbor-ave"
              value="yes"
              checked={allFromArborAve === "yes"}
              onChange={(e) => setAllFromArborAve(e.target.value as "yes" | "no")}
              className="h-4 w-4 text-orange-500"
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="arbor-ave"
              value="no"
              checked={allFromArborAve === "no"}
              onChange={(e) => setAllFromArborAve(e.target.value as "yes" | "no")}
              className="h-4 w-4 text-orange-500"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
      </fieldset>

      <div className="mt-8 flex justify-between gap-4">
        <button
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          onClick={() => navigate("/file/step/4")}
        >
          Previous
        </button>
        <button
          className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          disabled={!allFromArborAve}
          onClick={() => navigate("/file/step/6")}
        >
          Next
        </button>
      </div>
    </main>
  );
}
