import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";


type Step12State = {
  hasCommute: "" | "yes" | "no";
  transportMethod: string;
};

const transportOptions = [
  "Walking",
  "Bicycle",
  "Skateboard/Scooter",
  "Car (driven by someone else)",
  "Public Transportation",
  "Other"
];

export type { Step12State };

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step12) {
    const initialState = {
      ...treatReturnState,
      step12: { hasCommute: "", transportMethod: "" } as Step12State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step12() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [hasCommute, setHasCommute] = useState(treatReturnState.step12.hasCommute);
  const [transportMethod, setTransportMethod] = useState(treatReturnState.step12.transportMethod);
  const [showOtherInput, setShowOtherInput] = useState(
    transportMethod && !transportOptions.includes(transportMethod)
  );

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step12: { hasCommute, transportMethod },
    });
  }, [hasCommute, transportMethod]);

  const handleTransportChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setTransportMethod(value);
    setShowOtherInput(value === "Other");
    if (value !== "Other") {
      setTransportMethod(value);
    } else {
      setTransportMethod("");
    }
  };

  const isFormValid = hasCommute === "no" || (hasCommute === "yes" && transportMethod);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <fieldset className="mb-6">
          <legend className="text-xl font-bold mb-4">
            Do you regularly commute to school or work?
          </legend>
          <div className="space-x-4 mb-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="has-commute"
                value="yes"
                checked={hasCommute === "yes"}
                onChange={(e) => setHasCommute(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="has-commute"
                value="no"
                checked={hasCommute === "no"}
                onChange={(e) => setHasCommute(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>

          {hasCommute === "yes" && (
            <div className="pl-6 border-l-2 border-gray-200 space-y-4">
              <div>
                <label htmlFor="transport-method" className="block text-lg font-medium mb-2">
                  Which of the following means of transportation do you most frequently use to commute to school or work?
                </label>
                <select
                  id="transport-method"
                  value={showOtherInput ? "Other" : transportMethod}
                  onChange={handleTransportChange}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select an option</option>
                  {transportOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {showOtherInput && (
                <div>
                  <label htmlFor="other-transport" className="block text-sm font-medium text-gray-700 mb-1">
                    Please specify:
                  </label>
                  <input
                    type="text"
                    id="other-transport"
                    value={transportMethod}
                    onChange={(e) => setTransportMethod(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter your transportation method"
                  />
                </div>
              )}
            </div>
          )}
        </fieldset>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/file/step/11")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => navigate("/file/step/13")}
            disabled={!hasCommute || (hasCommute === "yes" && !transportMethod)}
            className={`px-4 py-2 rounded ${
              !hasCommute || (hasCommute === "yes" && !transportMethod)
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
