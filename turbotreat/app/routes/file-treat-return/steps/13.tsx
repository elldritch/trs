import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

export type Step13State = {
  willStudyNextYear: string;
  candyForStudyActivities: string;
  studyCandyPercentage: string;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step13) {
    const initialState = {
      ...treatReturnState,
      step13: { 
        willStudyNextYear: "",
        candyForStudyActivities: "",
        studyCandyPercentage: ""
      } as Step13State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step13() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [willStudyNextYear, setWillStudyNextYear] = useState(
    treatReturnState.step13?.willStudyNextYear || ""
  );
  const [candyForStudyActivities, setCandyForStudyActivities] = useState(
    treatReturnState.step13?.candyForStudyActivities || ""
  );
  const [studyCandyPercentage, setStudyCandyPercentage] = useState(
    treatReturnState.step13?.studyCandyPercentage || ""
  );

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step13: { 
        willStudyNextYear,
        candyForStudyActivities,
        studyCandyPercentage
      },
    });
  }, [willStudyNextYear, candyForStudyActivities, studyCandyPercentage, treatReturnState]);

  const isFormValid = () => {
    if (willStudyNextYear === "") {
      return false;
    }
    if (willStudyNextYear === "yes" && candyForStudyActivities === "") {
      return false;
    }
    if (candyForStudyActivities === "yes" && studyCandyPercentage === "") {
      return false;
    }
    return true;
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <fieldset className="mb-6">
          <legend className="text-xl font-bold mb-4">
            Will you be studying, reading, doing homework, learning new things, or spending time in a library ("study-oriented activities") over the upcoming year?
          </legend>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="will-study"
                value="yes"
                checked={willStudyNextYear === "yes"}
                onChange={() => setWillStudyNextYear("yes")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="will-study"
                value="no"
                checked={willStudyNextYear === "no"}
                onChange={() => setWillStudyNextYear("no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </fieldset>

        {willStudyNextYear === "yes" && (
          <fieldset className="mb-6">
            <legend className="text-xl font-bold mb-4">
              Will your candy collected over the past year be consumed during or before study-oriented activities in the upcoming year?
            </legend>
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="candy-for-study"
                  value="yes"
                  checked={candyForStudyActivities === "yes"}
                  onChange={() => setCandyForStudyActivities("yes")}
                  className="h-4 w-4 text-orange-500"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="candy-for-study"
                  value="no"
                  checked={candyForStudyActivities === "no"}
                  onChange={() => setCandyForStudyActivities("no")}
                  className="h-4 w-4 text-orange-500"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
            
            {candyForStudyActivities === "yes" && (
              <div className="mt-4">
                <label className="block text-lg font-medium mb-2">
                  About what percentage of the candy you've collected over the past year do you estimate will be consumed in support of these study-oriented activities?
                </label>
                <div className="w-32">
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={studyCandyPercentage}
                      onChange={(e) => setStudyCandyPercentage(e.target.value)}
                      className="w-full p-2 border rounded pr-12"
                      placeholder="0-100"
                    />
                    <span className="absolute right-3 top-2 text-gray-500">%</span>
                  </div>
                </div>
              </div>
            )}
          </fieldset>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/file/step/12")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            disabled={!isFormValid()}
            onClick={() => {
              setTreatReturnState({
                ...treatReturnState,
                step13: { 
                  willStudyNextYear,
                  candyForStudyActivities,
                  studyCandyPercentage: candyForStudyActivities === "yes" ? studyCandyPercentage : ""
                },
              });
              navigate("/file/step/14");
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
