import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";
import {
  QuestionHeader,
  Select,
  PersonList,
  StepPagination,
  type PersonItem,
} from "./components.client";

export type Parent = PersonItem;

export type Step11State = {
  livesWithParents: boolean | null;
  parents: Parent[];
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step11 || typeof treatReturnState.step11.parents !== "object" || treatReturnState.step11.livesWithParents === undefined) {
    const initialState = {
      ...treatReturnState,
      step11: {
        livesWithParents: null,
        parents: [],
      } as Step11State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export function isCompleted(step11: Step11State) {
  if (step11.livesWithParents === null) return false;
  if (step11.livesWithParents === false) return true;
  if (step11.parents.length === 0) return false;
  return step11.parents.every(
    (p) =>
      p.name.trim() !== "" &&
      p.costume.trim() !== "" &&
      p.willEatCandy !== null
  );
}

export default function Step11() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [livesWithParents, setLivesWithParents] = useState(
    treatReturnState.step11.livesWithParents
  );
  const [parents, setParents] = useState<Parent[]>(
    treatReturnState.step11.parents
  );

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step11: {
        livesWithParents,
        parents,
      },
    });
  }, [livesWithParents, parents, treatReturnState]);

  const shouldDisableNext = () =>
    !isCompleted({ livesWithParents, parents });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <QuestionHeader>
          Do you currently live with any parent or guardian?
        </QuestionHeader>
        <Select
          value={livesWithParents}
          onChange={setLivesWithParents}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        {livesWithParents === true && (
          <PersonList
            items={parents}
            onChange={setParents}
            personType="Parent or guardian"
            headerText="Please list each parent and/or guardian's first name and costume."
          />
        )}

        <StepPagination disabled={shouldDisableNext()} currentStep={11} />
      </div>
    </main>
  );
}
