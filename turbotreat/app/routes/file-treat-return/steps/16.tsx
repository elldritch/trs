import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

export type Step16State = {
  yearsTrickOrTreating: string;
  flewSweetwest: string;
  nonArborPercentage: string;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step16) {
    const initialState = {
      ...treatReturnState,
      step16: { 
        yearsTrickOrTreating: "",
        flewSweetwest: "",
        nonArborPercentage: ""
      } as Step16State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step16() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [yearsTrickOrTreating, setYearsTrickOrTreating] = useState(
    treatReturnState.step16?.yearsTrickOrTreating || ""
  );
  const [flewSweetwest, setFlewSweetwest] = useState(
    treatReturnState.step16?.flewSweetwest || ""
  );
  const [nonArborPercentage, setNonArborPercentage] = useState(
    treatReturnState.step16?.nonArborPercentage || ""
  );
  
  const [showYearsHelp, setShowYearsHelp] = useState(false);
  const [showSweetwestHelp, setShowSweetwestHelp] = useState(false);
  const [showNonArborHelp, setShowNonArborHelp] = useState(false);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step16: { 
        yearsTrickOrTreating,
        flewSweetwest,
        nonArborPercentage
      },
    });
  }, [yearsTrickOrTreating, flewSweetwest, nonArborPercentage, treatReturnState]);

  const isFormValid = () => {
    if (yearsTrickOrTreating === "") return false;
    if (flewSweetwest === "") return false;
    if (nonArborPercentage === "") return false;
    return true;
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <h1 className="text-2xl font-bold mb-6">Step 16: Additional Information</h1>
        
        <fieldset className="mb-6">
          <div className="flex items-center mb-2">
            <legend className="text-lg font-bold">
              How many years have you trick-or-treated at Arbor Ave on Halloween?
            </legend>
            <button 
              onClick={() => setShowYearsHelp(!showYearsHelp)}
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-lg"
              aria-label="Help with years trick-or-treating"
            >
              ?
            </button>
          </div>
          {showYearsHelp && (
            <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
              <h4 className="font-bold mb-2">How many years have you trick-or-treated at Arbor Ave on Halloween?</h4>
              <p className="text-sm">
                Enter the total number of years you've been trick-or-treating on Arbor Ave. If this is your first year, enter 0.
              </p>
            </div>
          )}
          <input
            type="number"
            min="0"
            value={yearsTrickOrTreating}
            onChange={(e) => setYearsTrickOrTreating(e.target.value)}
            className="w-full p-2 border rounded"
            placeholder="Enter number of years"
          />
        </fieldset>

        <fieldset className="mb-6">
          <div className="flex items-center mb-2">
            <legend className="text-lg font-bold">
              Did you fly on Sweetwest Airlines, departing from the Arbor Aveport, last year?
            </legend>
            <button 
              onClick={() => setShowSweetwestHelp(!showSweetwestHelp)}
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-lg"
              aria-label="Help with Sweetwest Airlines"
            >
              ?
            </button>
          </div>
          {showSweetwestHelp && (
            <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
              <h4 className="font-bold mb-2">What is the Sweetwest Airlines treat income tax credit?</h4>
              <p className="text-sm">
                Sweetwest Airlines offers a treat income tax credit for travelers who fly from Arbor Ave. If you flew with Sweetwest Airlines from Arbor Ave in the past year, you may be eligible for this credit on your treat tax return.
              </p>
            </div>
          )}
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="flew-sweetwest"
                value="yes"
                checked={flewSweetwest === "yes"}
                onChange={() => setFlewSweetwest("yes")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="flew-sweetwest"
                value="no"
                checked={flewSweetwest === "no"}
                onChange={() => setFlewSweetwest("no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <div className="flex items-center mb-2">
            <legend className="text-lg font-bold">
              What percentage of your candy came from a street other than Arbor?
            </legend>
            <button 
              onClick={() => setShowNonArborHelp(!showNonArborHelp)}
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-lg"
              aria-label="Help with non-Arbor candy percentage"
            >
              ?
            </button>
          </div>
          {showNonArborHelp && (
            <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
              <h4 className="font-bold mb-2">What percentage of your candy came from a street other than Arbor?</h4>
              <p className="text-sm">
                Enter the percentage of your total candy collection that was obtained from streets other than Arbor Ave. This helps us calculate any applicable non-Arbor candy adjustments to your treat tax.
              </p>
            </div>
          )}
          <div className="flex items-center">
            <input
              type="number"
              min="0"
              max="100"
              value={nonArborPercentage}
              onChange={(e) => setNonArborPercentage(e.target.value)}
              className="w-32 p-2 border rounded mr-2"
              placeholder="0-100"
            />
            <span className="text-gray-600">%</span>
          </div>
        </fieldset>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/file/step/15")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            disabled={!isFormValid()}
            onClick={() => {
              setTreatReturnState({
                ...treatReturnState,
                step16: { 
                  yearsTrickOrTreating,
                  flewSweetwest,
                  nonArborPercentage
                },
              });
              navigate("/file/step/17");
            }}
            className={`px-4 py-2 rounded ${
              !isFormValid()
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
