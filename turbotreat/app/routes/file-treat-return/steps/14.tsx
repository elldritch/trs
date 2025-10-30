import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  loadStepStateOrRedirect,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

type ParentInfo = {
  name: string;
  costume: string;
  willEatCandy: string;
};

export type Step14State = {
  livesWithParents: string;
  parents: ParentInfo[];
};

export function clientLoader() {
  const treatReturnState = loadStepStateOrRedirect(16);

  if (!treatReturnState.step14) {
    const initialState = {
      ...treatReturnState,
      step14: { 
        livesWithParents: "",
        parents: [],
      } as Step14State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step14() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [livesWithParents, setLivesWithParents] = useState(
    treatReturnState.step14?.livesWithParents || ""
  );
  const [parents, setParents] = useState<ParentInfo[]>(
    treatReturnState.step14?.parents || []
  );
  const [showParentsHelp, setShowParentsHelp] = useState(false);
  const [newParent, setNewParent] = useState<Omit<ParentInfo, 'willEatCandy'> & { willEatCandy: string }>({ 
    name: "", 
    costume: "",
    willEatCandy: ""
  });

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step14: { 
        livesWithParents,
        parents,
      },
    });
  }, [livesWithParents, parents, treatReturnState]);

  const addParent = () => {
    if (newParent.name.trim() && newParent.costume.trim() && newParent.willEatCandy) {
      setParents([...parents, {
        ...newParent,
        willEatCandy: newParent.willEatCandy
      }]);
      setNewParent({ name: "", costume: "", willEatCandy: "" });
    }
  };

  const removeParent = (index: number) => {
    const updatedParents = [...parents];
    updatedParents.splice(index, 1);
    setParents(updatedParents);
  };

  const isFormValid = () => {
    if (livesWithParents === "") return false;
    if (livesWithParents === "yes" && parents.length === 0) return false;
    return true;
  };
  
  // Always show the form, but validate based on selection
  const shouldShowParentForm = livesWithParents === "yes";

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <fieldset className="mb-6">
          <div className="flex items-center mb-2">
            <legend className="text-xl font-bold">
              Do you currently live with any parent or guardian?
            </legend>
            <button 
              onClick={() => setShowParentsHelp(!showParentsHelp)}
              className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100 text-lg"
              aria-label="Help with living situation"
            >
              ?
            </button>
          </div>
          {showParentsHelp && (
            <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
              <h4 className="font-bold mb-2">About Parents/Guardians</h4>
              <p className="text-sm">
                This includes any parent or legal guardian you live with, even if only part-time. Select 'No' only if you don't live with any parents or guardians.
              </p>
            </div>
          )}
          <div className="space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="lives-with-parents"
                value="yes"
                checked={livesWithParents === "yes"}
                onChange={() => setLivesWithParents("yes")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">Yes</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                name="lives-with-parents"
                value="no"
                checked={livesWithParents === "no"}
                onChange={() => setLivesWithParents("no")}
                className="h-4 w-4 text-orange-500"
              />
              <span className="ml-2">No</span>
            </label>
          </div>
        </fieldset>

        {shouldShowParentForm && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-3">Add Parent/Guardian</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={newParent.name}
                    onChange={(e) => setNewParent({...newParent, name: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Costume
                  </label>
                  <input
                    type="text"
                    value={newParent.costume}
                    onChange={(e) => setNewParent({...newParent, costume: e.target.value})}
                    className="w-full p-2 border rounded"
                    placeholder="Costume description"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Will eat your candy?
                  </label>
                  <div className="flex space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="will-eat-candy"
                        value="yes"
                        checked={newParent.willEatCandy === "yes"}
                        onChange={() => setNewParent({...newParent, willEatCandy: "yes"})}
                        className="h-4 w-4 text-orange-500"
                      />
                      <span className="ml-2">Yes</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="will-eat-candy"
                        value="no"
                        checked={newParent.willEatCandy === "no"}
                        onChange={() => setNewParent({...newParent, willEatCandy: "no"})}
                        className="h-4 w-4 text-orange-500"
                      />
                      <span className="ml-2">No</span>
                    </label>
                  </div>
                </div>
              </div>
              <button
                onClick={addParent}
                disabled={!newParent.name || !newParent.costume || !newParent.willEatCandy}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400"
              >
                Add Parent/Guardian
              </button>
            </div>

            {parents.length > 0 && (
              <div>
                <h3 className="text-lg font-medium mb-3">Parents/Guardians</h3>
                <div className="space-y-4">
                  {parents.map((parent, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-gray-50 flex justify-between items-center">
                      <div>
                        <p className="font-medium">{parent.name}</p>
                        <p className="text-sm text-gray-600">Costume: {parent.costume}</p>
                        <p className="text-sm text-gray-600">Will eat your candy: {parent.willEatCandy === "yes" ? "Yes" : "No"}</p>
                      </div>
                      <button
                        onClick={() => removeParent(index)}
                        className="text-red-500 hover:text-red-700"
                        aria-label="Remove parent"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between mt-8">
          <button
            onClick={() => navigate("/file/step/13")}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Previous
          </button>
          <button
            disabled={!isFormValid()}
            onClick={() => {
              setTreatReturnState({
                ...treatReturnState,
                step14: { 
                  livesWithParents,
                  parents: livesWithParents === "yes" ? parents : []
                },
                currentStep: 15,
              });
              navigate("/file/step/15");
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
