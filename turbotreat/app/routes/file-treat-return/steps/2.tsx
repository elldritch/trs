import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

export type Step2State = {
  wearingCostume: boolean;
  costumeCategory: CostumeCategory | null;
  costumeName: string | null;
};

export type CostumeCategory =
  | "animal"
  | "vegetable"
  | "spirit"
  | "mineral"
  | "none";

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (typeof treatReturnState.step2.wearingCostume !== "boolean") {
    const initialState = {
      ...treatReturnState,
      step2: {
        wearingCostume: false,
        costumeCategory: null,
        costumeName: null,
      },
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step2() {
  const treatReturnState = useLoaderData<typeof clientLoader>();

  const [wearingCostume, setWearingCostume] = useState(
    treatReturnState.step2.wearingCostume
  );
  const [costumeCategory, setCostumeCategory] = useState(
    treatReturnState.step2.costumeCategory
  );
  const [costumeName, setCostumeName] = useState(
    treatReturnState.step2.costumeName
  );
  const [showCostumeHelp, setShowCostumeHelp] = useState(false);
  const [showCategoryHelp, setShowCategoryHelp] = useState(false);

  const disabled =
    wearingCostume &&
    (costumeCategory == null ||
      costumeName == null ||
      costumeName.length === 0);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step2: { wearingCostume, costumeCategory, costumeName },
    });
  }, [wearingCostume, costumeCategory, costumeName, treatReturnState]);

  return (
    <main className="p-4 flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-light text-gray-900">
          Are you wearing a costume this Halloween season?
          <button
            onClick={() => setShowCostumeHelp(!showCostumeHelp)}
            className="inline text-xl ml-2 align-top h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
          >
            ?
          </button>
        </h1>
        {showCostumeHelp && (
          <div className="bg-yellow-50 p-4 mb-4 mt-2 rounded border border-yellow-200">
            <h4 className="font-bold mb-2">
              How do I know if I am wearing a costume?
            </h4>
            <p className="text-sm">
              A costume consists of article(s) of clothing that you are wearing
              for a special occasion. If you are dressed in clothes that you
              don't typically wear every day, you are probably wearing a
              costume.
            </p>
          </div>
        )}
        <div className="flex gap-2 flex-col py-2">
          <div
            onClick={() => setWearingCostume(true)}
            className={
              "rounded-md w-full py-4 text-center text-md font-light border border-gray-400" +
              (wearingCostume ? " bg-sky-200" : "")
            }
          >
            Yes
          </div>
          <div
            onClick={() => setWearingCostume(false)}
            className={
              "rounded-md w-full py-4 text-center text-md font-light border border-gray-400" +
              (!wearingCostume ? " bg-sky-200" : "")
            }
          >
            No
          </div>
        </div>
      </div>

      {wearingCostume && (
        <div className="animate-fade-in">
          <h1 className="text-2xl font-light text-gray-900">
            Which, if any, of the following categories does your costume fall
            into?
            <button
              onClick={() => setShowCategoryHelp(!showCategoryHelp)}
              className="inline text-xl ml-2 align-top h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
            >
              ?
            </button>
          </h1>
          {showCategoryHelp && (
            <div className="bg-yellow-50 p-4 mb-4 mt-2 rounded border border-yellow-200">
              <h4 className="font-bold mb-2">About Costume Categories</h4>
              <p className="text-sm">
                Select the category that best describes your costume. If none of
                these categories fit, select 'None of these'.
              </p>
            </div>
          )}
          <div className="flex gap-2 flex-col py-2">
            <div
              onClick={() => setCostumeCategory("animal")}
              className={
                "rounded-md w-full py-4 text-center text-md font-light border border-gray-400" +
                (costumeCategory === "animal" ? " bg-sky-200" : "")
              }
            >
              Animal
            </div>
            <div
              onClick={() => setCostumeCategory("vegetable")}
              className={
                "rounded-md w-full py-4 text-center text-md font-light border border-gray-400" +
                (costumeCategory === "vegetable" ? " bg-sky-200" : "")
              }
            >
              Vegetable
            </div>
            <div
              onClick={() => setCostumeCategory("spirit")}
              className={
                "rounded-md w-full py-4 text-center text-md font-light border border-gray-400" +
                (costumeCategory === "spirit" ? " bg-sky-200" : "")
              }
            >
              Spirit
            </div>
            <div
              onClick={() => setCostumeCategory("mineral")}
              className={
                "rounded-md w-full py-4 text-center text-md font-light border border-gray-400" +
                (costumeCategory === "mineral" ? " bg-sky-200" : "")
              }
            >
              Mineral
            </div>
            <div
              onClick={() => setCostumeCategory("none")}
              className={
                "rounded-md w-full py-4 text-center text-md font-light border border-gray-400" +
                (costumeCategory === "none" ? " bg-sky-200" : "")
              }
            >
              None of these
            </div>
          </div>
        </div>
      )}

      {wearingCostume && (
        <div className="animate-fade-in mt-4">
          <h1 className="text-2xl font-light text-gray-900">
            What is the name of your costume?
          </h1>
          <input
            type="text"
            id="costume-name"
            name="costume-name"
            value={costumeName ?? ""}
            onChange={(e) => setCostumeName(e.target.value)}
            className="w-full px-2 py-4 border block border-gray-300 rounded-md mt-2"
            placeholder="Enter costume name"
          />
        </div>
      )}

      <div>
        <Link
          to="/file/step/1"
          className={
            "block text-center mt-4 rounded-md font-medium text-white w-full py-2" +
            (disabled
              ? " bg-gray-300 cursor-not-allowed pointer-events-none"
              : " bg-sky-700 cursor-pointer")
          }
        >
          Previous
        </Link>
        <Link
          to="/file/step/3"
          className={
            "block text-center mt-4 rounded-md font-medium text-white w-full py-2" +
            (disabled
              ? " bg-gray-300 cursor-not-allowed pointer-events-none"
              : " bg-sky-700 cursor-pointer")
          }
        >
          Next
        </Link>
      </div>
    </main>
  );
}
