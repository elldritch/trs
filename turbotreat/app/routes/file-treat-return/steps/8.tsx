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

export type Sibling = PersonItem & {
  favoriteCandy: string;
};

export type Step8State = {
  hasSiblings: boolean | null;
  siblings: Sibling[];
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step8 || treatReturnState.step8.hasSiblings === undefined) {
    const initialState = {
      ...treatReturnState,
      step8: {
        hasSiblings: null,
        siblings: [] as Sibling[],
      } as Step8State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export function isCompleted(step8: Step8State) {
  if (step8.hasSiblings === null) return false;
  if (step8.hasSiblings === false) return true;
  if (!step8.siblings || step8.siblings.length === 0) return false;
  return step8.siblings.every(
    (s) =>
      s.name.trim() !== "" &&
      s.costume.trim() !== "" &&
      s.favoriteCandy.trim() !== "" &&
      s.willEatCandy !== null
  );
}

export default function Step8() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [hasSiblings, setHasSiblings] = useState(
    treatReturnState.step8.hasSiblings
  );
  const [siblings, setSiblings] = useState<Sibling[]>(
    treatReturnState.step8.siblings || []
  );

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step8: {
        hasSiblings,
        siblings,
      },
    });
  }, [hasSiblings, siblings, treatReturnState]);

  const shouldDisableNext = () =>
    !isCompleted({ hasSiblings, siblings: siblings || [] });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <QuestionHeader>Do you have any siblings?</QuestionHeader>
        <Select
          value={hasSiblings}
          onChange={setHasSiblings}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        {hasSiblings === true && (
          <PersonList
            items={siblings}
            onChange={setSiblings as (items: PersonItem[]) => void}
            personType="Sibling"
            headerText="Please list each sibling's first name, costume, and favorite candy."
            extraFields={[
              {
                key: "favoriteCandy",
                label: "Favorite candy",
                placeholder: "Sibling's favorite candy",
              },
            ]}
          />
        )}

        <StepPagination disabled={shouldDisableNext()} currentStep={8} />
      </div>
    </main>
  );
}
