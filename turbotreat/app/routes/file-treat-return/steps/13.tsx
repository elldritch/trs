import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  loadStepStateOrRedirect,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

export type Step13State = {
  willStudyNextYear: string;
  candyForStudyActivities: string;
  studyCandyPercentage: string;
};

export function clientLoader() {
  const treatReturnState = loadStepStateOrRedirect(15);

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
  const [showStudyHelp, setShowStudyHelp] = useState(false);
  const [showCandyStudyHelp, setShowCandyStudyHelp] = useState(false);
  const [willStudyNextYear, setWillStudyNextYear] = useState(
    treatReturnState.step13?.willStudyNextYear || ""
  );
  const [candyForStudyActivities, setCandyForStudyActivities] = useState(
    treatReturnState.step13?.candyForStudyActivities || ""
  );
  const [studyCandyPercentage, setStudyCandyPercentage] = useState(
    treatReturnState.step13?.studyCandyPercentage || ""
  );
  const [showStudyPercentageHelp, setShowStudyPercentageHelp] = useState(false);

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
          <div className="flex items-center mb-2">
            <legend className="text-xl font-bold">
              Will you be studying, reading, doing homework, learning new things, or spending time in a library ("study-oriented activities") over the upcoming year?
            </legend>
            <button 
              onClick={() => setShowStudyHelp(!showStudyHelp)}
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-lg"
              aria-label="Help with study activities"
            >
              ?
            </button>
          </div>
          {showStudyHelp && (
            <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
              <h4 className="font-bold mb-2">About Study Activities</h4>
              <p className="text-sm">
                This includes any educational activities you plan to engage in during the next year, whether formal or informal.
              </p>
            </div>
          )}
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
            <div className="flex items-center mb-2">
              <legend className="text-xl font-bold">
                Will your candy collected over the past year be consumed during or before study-oriented activities in the upcoming year?
              </legend>
              <button 
                onClick={() => setShowCandyStudyHelp(!showCandyStudyHelp)}
                className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-lg"
                aria-label="Help with candy for study"
              >
                ?
              </button>
            </div>
            {showCandyStudyHelp && (
              <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
                <h4 className="font-bold mb-2">Candy for Study</h4>
                <p className="text-sm">
                  This includes any candy you plan to eat while studying, reading, or doing homework to help you focus or stay energized.
                </p>
              </div>
            )}
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
                <div className="flex items-center mb-2">
                  <label className="block text-lg font-medium">
                    About what percentage of the candy you've collected over the past year do you estimate will be consumed in support of these study-oriented activities?
                  </label>
                  <button 
                    onClick={() => setShowStudyPercentageHelp(!showStudyPercentageHelp)}
                    className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-lg"
                    aria-label="Help with study candy percentage"
                  >
                    ?
                  </button>
                </div>
                {showStudyPercentageHelp && (
                  <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
                    <h4 className="font-bold mb-2">Estimating Study Candy Usage</h4>
                    <p className="text-sm">
                      Please provide your best estimate of what percentage of your total candy collection will be used to support your study activities. This includes candy consumed while studying, reading, or doing homework.
                    </p>
                  </div>
                )}
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
                currentStep: 14,
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
