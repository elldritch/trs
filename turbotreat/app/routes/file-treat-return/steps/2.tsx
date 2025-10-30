import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import {
  loadStepStateOrRedirect,
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

export type Step2State = {
  wearingCostume: "" | "yes" | "no";
  costumeCategory: string;
  costumeName: string;
};

export function clientLoader() {
  const treatReturnState = loadStepStateOrRedirect(2);

  if (typeof treatReturnState.step2.wearingCostume !== "string") {
    const initialState = {
      ...treatReturnState,
      step2: { wearingCostume: "", costumeCategory: "", costumeName: "" } as Step2State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step2() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [wearingCostume, setWearingCostume] = useState(
    treatReturnState.step2.wearingCostume
  );
  const [costumeCategory, setCostumeCategory] = useState(
    treatReturnState.step2.costumeCategory
  );
  const [costumeName, setCostumeName] = useState(
    treatReturnState.step2.costumeName || ""
  );
  const [showCostumeHelp, setShowCostumeHelp] = useState(false);
  const [showCategoryHelp, setShowCategoryHelp] = useState(false);
  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step2: { wearingCostume, costumeCategory, costumeName },
    });
  }, [wearingCostume, costumeCategory, costumeName, treatReturnState]);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <fieldset>
          <div className="flex items-center mb-2">
            <legend className="text-xl font-bold">
              Are you wearing a costume this Halloween season?
            </legend>
            <button 
              onClick={() => setShowCostumeHelp(!showCostumeHelp)}
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-lg"
              aria-label="Help with costume question"
            >
              ?
            </button>
          </div>
          {showCostumeHelp && (
            <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
              <h4 className="font-bold mb-2">How do I know if I am wearing a costume?</h4>
              <p className="text-sm">
                A costume consists of article(s) of clothing that you are wearing for a special occasion. If you are dressed in clothes that you don't typically wear every day, you are probably wearing a costume.
              </p>
            </div>
          )}
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="wearing-costume"
                value="yes"
                checked={wearingCostume === "yes"}
                onChange={(e) => setWearingCostume(e.target.value as Step2State["wearingCostume"])}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="wearing-costume"
                value="no"
                checked={wearingCostume === "no"}
                onChange={(e) => setWearingCostume(e.target.value as Step2State["wearingCostume"])}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </fieldset>
        
        {wearingCostume === "yes" && (
          <div className="animate-fade-in space-y-6">
            <fieldset>
              <div className="flex items-center mb-2">
                <legend className="text-lg font-medium">
                  Which, if any, of the following categories does your costume fall into?
                </legend>
                <button 
                  onClick={() => setShowCategoryHelp(!showCategoryHelp)}
                  className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-lg"
                  aria-label="Help with costume category"
                >
                  ?
                </button>
              </div>
              {showCategoryHelp && (
                <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
                  <h4 className="font-bold mb-2">About Costume Categories</h4>
                  <p className="text-sm">
                    Select the category that best describes your costume. If none of these categories fit, select 'None of these'.
                  </p>
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="costume-category"
                    id="costume-animal"
                    value="animal"
                    checked={costumeCategory === "animal"}
                    onChange={(e) => setCostumeCategory(e.target.value)}
                    className="h-4 w-4 text-orange-500"
                  />
                  <label htmlFor="costume-animal" className="ml-2">Animal</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="costume-category"
                    id="costume-vegetable"
                    value="vegetable"
                    checked={costumeCategory === "vegetable"}
                    onChange={(e) => setCostumeCategory(e.target.value)}
                    className="h-4 w-4 text-orange-500"
                  />
                  <label htmlFor="costume-vegetable" className="ml-2">Vegetable</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="costume-category"
                    id="costume-spirit"
                    value="spirit"
                    checked={costumeCategory === "spirit"}
                    onChange={(e) => setCostumeCategory(e.target.value)}
                    className="h-4 w-4 text-orange-500"
                  />
                  <label htmlFor="costume-spirit" className="ml-2">Spirit</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="costume-category"
                    id="costume-mineral"
                    value="mineral"
                    checked={costumeCategory === "mineral"}
                    onChange={(e) => setCostumeCategory(e.target.value)}
                    className="h-4 w-4 text-orange-500"
                  />
                  <label htmlFor="costume-mineral" className="ml-2">Mineral</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="costume-category"
                    id="costume-none"
                    value="none"
                    checked={costumeCategory === "none"}
                    onChange={(e) => setCostumeCategory(e.target.value)}
                    className="h-4 w-4 text-orange-500"
                  />
                  <label htmlFor="costume-none" className="ml-2">None of these</label>
                </div>
              </div>
            </fieldset>
            
            <div>
              <div className="flex items-center mb-2">
                <label htmlFor="costume-name" className="block text-lg font-medium">
                  What is the name of your costume?
                </label>
              </div>
              <input
                type="text"
                id="costume-name"
                value={costumeName}
                onChange={(e) => setCostumeName(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter costume name"
              />
            </div>
          </div>
        )}
        
        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/file/step/1")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => {
              setTreatReturnState({
                ...treatReturnState,
                step2: { wearingCostume, costumeCategory, costumeName },
                currentStep: 3,
              });
              navigate("/file/step/3");
            }}
            disabled={!wearingCostume || (wearingCostume === "yes" && (!costumeCategory || !costumeName))}
            className={`px-4 py-2 rounded ${
              !wearingCostume || (wearingCostume === "yes" && (!costumeCategory || !costumeName))
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
