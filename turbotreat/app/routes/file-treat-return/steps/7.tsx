import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  loadStepStateOrRedirect,
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

export type Step7State = {
  investedPTP: "" | "yes" | "no";
  investedREIT: "" | "yes" | "no";
};

export function clientLoader() {
  const treatReturnState = loadStepStateOrRedirect(7);

  if (!treatReturnState.step7) {
    const initialState = {
      ...treatReturnState,
      step7: { investedPTP: "", investedREIT: "" } as Step7State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step7() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [investedPTP, setInvestedPTP] = useState(treatReturnState.step7.investedPTP);
  const [investedREIT, setInvestedREIT] = useState(treatReturnState.step7.investedREIT);
  const [showPTPHelp, setShowPTPHelp] = useState(false);
  const [showREITHelp, setShowREITHelp] = useState(false);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step7: { investedPTP, investedREIT },
    });
  }, [investedPTP, investedREIT]);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <fieldset className="mb-6">
          <div className="flex items-center mb-2">
            <legend className="text-xl font-bold">
              Did you invest candy in a Publicly Treatable Partnership (PTP) this year?
            </legend>
            <button 
              onClick={() => setShowPTPHelp(!showPTPHelp)}
              className="ml-2 text-orange-500 hover:text-orange-700"
              aria-label="What is a PTP?"
            >
              ?
            </button>
          </div>
          {showPTPHelp && (
            <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
              <h4 className="font-bold mb-2">What is a Publicly Treatable Partnership (PTP)?</h4>
              <p className="text-sm">
                Some trick or treaters pool their candy with other trick or treaters to form a shared pool of candy. 
                If this candy pool is registered as a Publicly Treatable Partnership (PTP), ownership shares in the 
                PTP can be sold or traded on established securities exchanges, much like shares of a corporation, 
                but the PTP is still subject to similar tax treatment as a standard limited treat partnership.
              </p>
            </div>
          )}
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="ptp"
                value="yes"
                checked={investedPTP === "yes"}
                onChange={(e) => setInvestedPTP(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="ptp"
                value="no"
                checked={investedPTP === "no"}
                onChange={(e) => setInvestedPTP(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </fieldset>

        <fieldset className="mb-6">
          <div className="flex items-center mb-2">
            <legend className="text-xl font-bold">
              Did you invest candy in a Real Estate Investment Treat (REIT) this year?
            </legend>
            <button 
              onClick={() => setShowREITHelp(!showREITHelp)}
              className="ml-2 text-orange-500 hover:text-orange-700"
              aria-label="What is a REIT?"
            >
              ?
            </button>
          </div>
          {showREITHelp && (
            <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
              <h4 className="font-bold mb-2">What is a Real Estate Investment Treat (REIT)?</h4>
              <p className="text-sm">
                Sometimes, while investing in commercial or residential property, you deserve a treat. 
                This food item (can be either savory or sweet) is considered a "Real Estate Investment Treat".
              </p>
            </div>
          )}
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="reit"
                value="yes"
                checked={investedREIT === "yes"}
                onChange={(e) => setInvestedREIT(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="reit"
                value="no"
                checked={investedREIT === "no"}
                onChange={(e) => setInvestedREIT(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </fieldset>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/file/step/6")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => navigate("/file/step/8")}
            disabled={!investedPTP || !investedREIT}
            className={`px-4 py-2 rounded ${
              !investedPTP || !investedREIT
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
