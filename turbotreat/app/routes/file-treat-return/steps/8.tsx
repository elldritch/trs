import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";


export type Step8State = {
  californiaFilm: "" | "yes" | "no";
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step8) {
    const initialState = {
      ...treatReturnState,
      step8: { californiaFilm: "" } as Step8State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step8() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [californiaFilm, setCaliforniaFilm] = useState(treatReturnState.step8.californiaFilm);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step8: { californiaFilm },
    });
  }, [californiaFilm]);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <fieldset className="mb-6">
          <legend className="text-xl font-bold mb-4">
            Will any of this candy be used to feed actors or actresses in a film or television 
            production in the state of California?
          </legend>
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="california-film"
                value="yes"
                checked={californiaFilm === "yes"}
                onChange={(e) => setCaliforniaFilm(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="california-film"
                value="no"
                checked={californiaFilm === "no"}
                onChange={(e) => setCaliforniaFilm(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </fieldset>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/file/step/7")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => navigate("/file/step/9")}
            disabled={!californiaFilm}
            className={`px-4 py-2 rounded ${
              !californiaFilm
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
