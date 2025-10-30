import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";


type Step9State = {
  homeworkCompleted: "" | "yes" | "no";
  totalHomework: string;
  homeworkAtHome: string;
};

export type { Step9State };

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step9) {
    const initialState = {
      ...treatReturnState,
      step9: { homeworkCompleted: "", totalHomework: "", homeworkAtHome: "" } as Step9State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step9() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [homeworkCompleted, setHomeworkCompleted] = useState(treatReturnState.step9.homeworkCompleted);
  const [totalHomework, setTotalHomework] = useState(treatReturnState.step9.totalHomework);
  const [homeworkAtHome, setHomeworkAtHome] = useState(treatReturnState.step9.homeworkAtHome);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step9: { homeworkCompleted, totalHomework, homeworkAtHome },
    });
  }, [homeworkCompleted, totalHomework, homeworkAtHome]);

  const isFormValid = homeworkCompleted === "no" || 
                     (homeworkCompleted === "yes" && totalHomework && homeworkAtHome);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <fieldset className="mb-6">
          <legend className="text-xl font-bold mb-4">
            Over the past year, have you completed at least three homework assignments?
          </legend>
          <div className="space-x-4 mb-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="homework-completed"
                value="yes"
                checked={homeworkCompleted === "yes"}
                onChange={(e) => setHomeworkCompleted(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="homework-completed"
                value="no"
                checked={homeworkCompleted === "no"}
                onChange={(e) => setHomeworkCompleted(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>

          {homeworkCompleted === "yes" && (
            <div className="space-y-6 pl-6 border-l-2 border-gray-200">
              <div>
                <label className="block text-lg font-medium mb-2">
                  How many homework assignments have you completed in total over the past year?
                </label>
                <input
                  type="number"
                  min="3"
                  step="1"
                  value={totalHomework}
                  onChange={(e) => setTotalHomework(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter number of assignments"
                />
              </div>

              <div>
                <label className="block text-lg font-medium mb-2">
                  Of the homework assignments you've completed, how many of them were completed at your home 
                  (rather than at school, at a library, or somewhere else)?
                </label>
                <input
                  type="number"
                  min="0"
                  max={totalHomework || ""}
                  step="1"
                  value={homeworkAtHome}
                  onChange={(e) => setHomeworkAtHome(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder={`Enter number (max ${totalHomework || "—"})`}
                  disabled={!totalHomework}
                />
              </div>
            </div>
          )}
        </fieldset>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/file/step/9")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => navigate("/file/step/11")}
            disabled={!homeworkCompleted || (homeworkCompleted === "yes" && (!totalHomework || !homeworkAtHome))}
            className={`px-4 py-2 rounded ${
              !homeworkCompleted || (homeworkCompleted === "yes" && (!totalHomework || !homeworkAtHome))
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
