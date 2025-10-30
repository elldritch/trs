import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

export type Step4State = {
  multipleStreets: "" | "yes" | "no";
  streetNames: string;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (typeof treatReturnState.step4?.multipleStreets !== "string") {
    const initialState = {
      ...treatReturnState,
      step4: { multipleStreets: "", streetNames: "" } as Step4State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step4() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [multipleStreets, setMultipleStreets] = useState(
    treatReturnState.step4.multipleStreets
  );
  const [streetNames, setStreetNames] = useState(
    treatReturnState.step4.streetNames
  );

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step4: { multipleStreets, streetNames },
    });
  }, [multipleStreets, streetNames]);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <fieldset className="mb-6">
        <legend className="text-xl font-bold mb-4">
          Did you collect candy from multiple streets this year?
        </legend>
        <div className="space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="multiple-streets"
              value="yes"
              checked={multipleStreets === "yes"}
              onChange={(e) => setMultipleStreets(e.target.value as "yes" | "no")}
              className="h-4 w-4 text-orange-500"
            />
            <span className="ml-2">Yes</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="multiple-streets"
              value="no"
              checked={multipleStreets === "no"}
              onChange={(e) => setMultipleStreets(e.target.value as "yes" | "no")}
              className="h-4 w-4 text-orange-500"
            />
            <span className="ml-2">No</span>
          </label>
        </div>
      </fieldset>

      {multipleStreets === "yes" && (
        <div className="animate-fade-in mb-6">
          <label
            htmlFor="street-names"
            className="block text-lg font-medium mb-2"
          >
            List the streets you collected candy from this year.
          </label>
          <textarea
            id="street-names"
            name="street-names"
            value={streetNames}
            onChange={(e) => setStreetNames(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500 min-h-[100px]"
            placeholder="Enter street names, one per line"
          />
        </div>
      )}

      <div className="mt-8 flex justify-between gap-4">
        <button
          className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
          onClick={() => navigate("/file/step/3")}
        >
          Previous
        </button>
        <button
          className="flex-1 px-6 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          disabled={!multipleStreets || (multipleStreets === "yes" && !streetNames)}
          onClick={() => navigate("/file/step/5")}
        >
          Next
        </button>
      </div>
    </main>
  );
}
