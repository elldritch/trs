import { useEffect, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";


type Sibling = {
  name: string;
  costume: string;
  willEatCandy: boolean;
};

type Step10State = {
  hasSiblings: "" | "yes" | "no";
  siblings: Sibling[];
  newSiblingName: string;
  newSiblingCostume: string;
};

export type { Step10State };

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step10) {
    const initialState = {
      ...treatReturnState,
      step10: { 
        hasSiblings: "", 
        siblings: [],
        newSiblingName: "",
        newSiblingCostume: ""
      } as Step10State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step10() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [hasSiblings, setHasSiblings] = useState(treatReturnState.step10.hasSiblings);
  const [siblings, setSiblings] = useState<Sibling[]>(treatReturnState.step10.siblings || []);
  const [newSiblingName, setNewSiblingName] = useState(treatReturnState.step10.newSiblingName || "");
  const [newSiblingCostume, setNewSiblingCostume] = useState(treatReturnState.step10.newSiblingCostume || "");

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step10: { 
        hasSiblings, 
        siblings,
        newSiblingName,
        newSiblingCostume
      },
    });
  }, [hasSiblings, siblings, newSiblingName, newSiblingCostume]);

  const addSibling = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSiblingName.trim() && newSiblingCostume.trim()) {
      const newSibling: Sibling = {
        name: newSiblingName.trim(),
        costume: newSiblingCostume.trim(),
        willEatCandy: false,
      };
      setSiblings([...siblings, newSibling]);
      setNewSiblingName("");
      setNewSiblingCostume("");
    }
  };

  const removeSibling = (index: number) => {
    const updatedSiblings = [...siblings];
    updatedSiblings.splice(index, 1);
    setSiblings(updatedSiblings);
  };

  const toggleWillEatCandy = (index: number) => {
    const updatedSiblings = [...siblings];
    updatedSiblings[index].willEatCandy = !updatedSiblings[index].willEatCandy;
    setSiblings(updatedSiblings);
  };

  const isFormValid = hasSiblings === "no" || (hasSiblings === "yes" && siblings.length > 0);

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <fieldset className="mb-6">
          <legend className="text-xl font-bold mb-4">
            Do you have any siblings?
          </legend>
          <div className="space-x-4 mb-6">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="has-siblings"
                value="yes"
                checked={hasSiblings === "yes"}
                onChange={(e) => setHasSiblings(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="has-siblings"
                value="no"
                checked={hasSiblings === "no"}
                onChange={(e) => setHasSiblings(e.target.value as "yes" | "no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>

          {hasSiblings === "yes" && (
            <div className="space-y-6 pl-6 border-l-2 border-gray-200">
              <div className="space-y-4">
                {siblings.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Siblings:</h3>
                    <ul className="space-y-4">
                      {siblings.map((sibling, index) => (
                        <li key={index} className="p-4 border rounded-lg bg-gray-50">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium">{sibling.name}</p>
                              <p className="text-sm text-gray-600">Costume: {sibling.costume}</p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeSibling(index)}
                              className="text-red-500 hover:text-red-700"
                              aria-label="Remove sibling"
                            >
                              ×
                            </button>
                          </div>
                          <div className="mt-2 flex items-center">
                            <input
                              type="checkbox"
                              id={`sibling-${index}-eat`}
                              checked={sibling.willEatCandy}
                              onChange={() => toggleWillEatCandy(index)}
                              className="h-4 w-4 text-orange-500 rounded"
                            />
                            <label htmlFor={`sibling-${index}-eat`} className="ml-2 text-sm">
                              Will {sibling.name} be eating any of your candy this year?
                            </label>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium mb-3">Add a Sibling</h3>
                  <form onSubmit={addSibling} className="space-y-4">
                    <div>
                      <label htmlFor="sibling-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Sibling's Name
                      </label>
                      <input
                        type="text"
                        id="sibling-name"
                        value={newSiblingName}
                        onChange={(e) => setNewSiblingName(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter name"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="sibling-costume" className="block text-sm font-medium text-gray-700 mb-1">
                        Sibling's Costume
                      </label>
                      <input
                        type="text"
                        id="sibling-costume"
                        value={newSiblingCostume}
                        onChange={(e) => setNewSiblingCostume(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter costume"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200"
                      disabled={!newSiblingName.trim() || !newSiblingCostume.trim()}
                    >
                      Add Sibling
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </fieldset>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/file/step/10")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            onClick={() => navigate("/file/step/12")}
            disabled={!hasSiblings || (hasSiblings === "yes" && siblings.length === 0)}
            className={`px-4 py-2 rounded ${
              !hasSiblings || (hasSiblings === "yes" && siblings.length === 0)
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
