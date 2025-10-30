import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

export type Step15State = {
  beenToDentist: string;
  dentalWorkFromCandy: string;
  reimbursedForDental: string;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step15) {
    const initialState = {
      ...treatReturnState,
      step15: { 
        beenToDentist: "",
        dentalWorkFromCandy: "",
        reimbursedForDental: ""
      } as Step15State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step15() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [beenToDentist, setBeenToDentist] = useState(
    treatReturnState.step15?.beenToDentist || ""
  );
  const [dentalWorkFromCandy, setDentalWorkFromCandy] = useState(
    treatReturnState.step15?.dentalWorkFromCandy || ""
  );
  const [reimbursedForDental, setReimbursedForDental] = useState(
    treatReturnState.step15?.reimbursedForDental || ""
  );
  
  const [showDentistHelp, setShowDentistHelp] = useState(false);
  const [showDentalWorkHelp, setShowDentalWorkHelp] = useState(false);
  const [showReimbursementHelp, setShowReimbursementHelp] = useState(false);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step15: { 
        beenToDentist,
        dentalWorkFromCandy: beenToDentist === "yes" ? dentalWorkFromCandy : "",
        reimbursedForDental: (beenToDentist === "yes" && dentalWorkFromCandy === "yes") ? reimbursedForDental : ""
      },
    });
  }, [beenToDentist, dentalWorkFromCandy, reimbursedForDental, treatReturnState]);

  const isFormValid = () => {
    if (beenToDentist === "") return false;
    if (beenToDentist === "yes" && dentalWorkFromCandy === "") return false;
    if (beenToDentist === "yes" && dentalWorkFromCandy === "yes" && reimbursedForDental === "") return false;
    return true;
  };

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <fieldset className="mb-6">
          <div className="flex items-center mb-2">
            <legend className="text-xl font-bold">
              Have you been to the dentist in the past year?
            </legend>
            <button 
              onClick={() => setShowDentistHelp(!showDentistHelp)}
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-lg"
              aria-label="Help with dentist question"
            >
              ?
            </button>
          </div>
          {showDentistHelp && (
            <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
              <h4 className="font-bold mb-2">About Dental Visits</h4>
              <p className="text-sm">
                Regular dental check-ups are important for maintaining good oral health. This includes any visits to the dentist for cleanings, exams, or procedures in the past year.
              </p>
            </div>
          )}
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="been-to-dentist"
                value="yes"
                checked={beenToDentist === "yes"}
                onChange={() => {
                  setBeenToDentist("yes");
                  if (dentalWorkFromCandy === "yes") {
                    setReimbursedForDental("");
                  }
                }}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="been-to-dentist"
                value="no"
                checked={beenToDentist === "no"}
                onChange={() => {
                  setBeenToDentist("no");
                  setDentalWorkFromCandy("");
                  setReimbursedForDental("");
                }}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </fieldset>

        {beenToDentist === "yes" && (
          <fieldset className="mb-6">
            <div className="flex items-center mb-2">
              <legend className="text-lg font-medium">
                Was any dental work you received performed as a result of eating candy over the last year?
              </legend>
              <button 
                onClick={() => setShowDentalWorkHelp(!showDentalWorkHelp)}
                className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-lg"
                aria-label="Help with dental work question"
              >
                ?
              </button>
            </div>
            {showDentalWorkHelp && (
              <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
                <h4 className="font-bold mb-2">What is teeth?</h4>
                <p className="text-sm">
                  Teeth are bones, but in your face. If you ate so much candy that it hurt your face bones, you may have received treatment from a face bone doctor (dentist). Visits to the face bone doctor would be considered appointments for "dental work".
                </p>
              </div>
            )}
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="dental-work-from-candy"
                  value="yes"
                  checked={dentalWorkFromCandy === "yes"}
                  onChange={() => {
                    setDentalWorkFromCandy("yes");
                    setReimbursedForDental("");
                  }}
                  className="h-4 w-4 text-orange-500"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="dental-work-from-candy"
                  value="no"
                  checked={dentalWorkFromCandy === "no"}
                  onChange={() => {
                    setDentalWorkFromCandy("no");
                    setReimbursedForDental("");
                  }}
                  className="h-4 w-4 text-orange-500"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </fieldset>
        )}

        {beenToDentist === "yes" && dentalWorkFromCandy === "yes" && (
          <fieldset className="mb-6">
            <div className="flex items-center mb-2">
              <legend className="text-lg font-medium">
                Were you already reimbursed for this dental work?
              </legend>
              <button 
                onClick={() => setShowReimbursementHelp(!showReimbursementHelp)}
                className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-lg"
                aria-label="Help with reimbursement question"
              >
                ?
              </button>
            </div>
            {showReimbursementHelp && (
              <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
                <h4 className="font-bold mb-2">How do I know if a dental visit was reimbursed?</h4>
                <p className="text-sm">
                  Trick or treaters who go to the dentist are usually entitled to compensation in the form of a toy or other small delightful object (like a new toothbrush). If you visited the dentist but did not receive compensation, you are eligible for a tax credit from the TRS.
                </p>
              </div>
            )}
            <div className="space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="reimbursed-for-dental"
                  value="yes"
                  checked={reimbursedForDental === "yes"}
                  onChange={() => setReimbursedForDental("yes")}
                  className="h-4 w-4 text-orange-500"
                />
                <span className="ml-2">Yes</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="reimbursed-for-dental"
                  value="no"
                  checked={reimbursedForDental === "no"}
                  onChange={() => setReimbursedForDental("no")}
                  className="h-4 w-4 text-orange-500"
                />
                <span className="ml-2">No</span>
              </label>
            </div>
          </fieldset>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/file/step/14")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            disabled={!isFormValid()}
            onClick={() => {
              setTreatReturnState({
                ...treatReturnState,
                step15: { 
                  beenToDentist,
                  dentalWorkFromCandy: beenToDentist === "yes" ? dentalWorkFromCandy : "",
                  reimbursedForDental: (beenToDentist === "yes" && dentalWorkFromCandy === "yes") ? reimbursedForDental : ""
                },
              });
              navigate("/file/step/16");
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
