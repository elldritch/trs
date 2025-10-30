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
  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step2: { wearingCostume, costumeCategory, costumeName },
    });
  }, [wearingCostume, costumeCategory, costumeName]);

  return (
    <main>
      <fieldset>
        <legend>
          <h1>Are you wearing a costume this Halloween season?</h1>
        </legend>
        <input
          type="radio"
          name="wearing-costume"
          value="yes"
          checked={wearingCostume === "yes"}
          onChange={(e) => setWearingCostume(e.target.value as Step2State["wearingCostume"])}
        />
        <label htmlFor="wearing-costume">Yes</label>
        <input
          type="radio"
          name="wearing-costume"
          value="no"
          checked={wearingCostume === "no"}
          onChange={(e) => setWearingCostume(e.target.value as Step2State["wearingCostume"])}
        />
        <label htmlFor="wearing-costume">No</label>
      </fieldset>
      {wearingCostume === "yes" && (
        <div className="animate-fade-in">
          <fieldset>
            <legend>
              <h1>
                Which, if any, of the following categories does your costume fall
                into?
              </h1>
            </legend>
            <input
              type="radio"
              name="costume-category"
              value="animal"
              checked={costumeCategory === "animal"}
              onChange={(e) => setCostumeCategory(e.target.value)}
            />
            <label htmlFor="costume-category">Animal</label>
            <input
              type="radio"
              name="costume-category"
              value="vegetable"
              checked={costumeCategory === "vegetable"}
              onChange={(e) => setCostumeCategory(e.target.value)}
            />
            <label htmlFor="costume-category">Vegetable</label>
            <input
              type="radio"
              name="costume-category"
              value="spirit"
              checked={costumeCategory === "spirit"}
              onChange={(e) => setCostumeCategory(e.target.value)}
            />
            <label htmlFor="costume-category">Spirit</label>
            <input
              type="radio"
              name="costume-category"
              value="mineral"
              checked={costumeCategory === "mineral"}
              onChange={(e) => setCostumeCategory(e.target.value)}
            />
            <label htmlFor="costume-category">Mineral</label>
            <input
              type="radio"
              name="costume-category"
              value="none"
              checked={costumeCategory === "none"}
              onChange={(e) => setCostumeCategory(e.target.value)}
            />
            <label htmlFor="costume-category">None of these</label>
          </fieldset>
        </div>
      )}

      {wearingCostume === "yes" && (
        <div className="animate-fade-in mt-4">
          <label htmlFor="costume-name" className="block text-lg font-medium mb-2">
            <h1>What is the name of your costume?</h1>
          </label>
          <input
            type="text"
            id="costume-name"
            name="costume-name"
            value={costumeName}
            onChange={(e) => setCostumeName(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            placeholder="Enter costume name"
          />
        </div>
      )}
      <div className="mt-8 flex justify-between gap-4">
        <button
          // className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          onClick={() => navigate("/file/step/1")}
        >
          Previous
        </button>
        <button
          // className="flex-1 px-6 py-3 text-white rounded-md disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed transition-colors"
          disabled={!wearingCostume || (wearingCostume === "yes" && (!costumeCategory || !costumeName))}
          onClick={() => navigate("/file/step/3")}
        >
          Next
        </button>
      </div>
    </main>
  );
}
