import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";
import { ProgressBar, QuestionHeader, Select, StepPagination, TextInput, NumberInput } from "./components.client";

export type Step4State = {
  multipleStreets: boolean | null;
  streetNames: string | null;
  allFromArborAve: boolean | null;
  nonArborPercent: number | null;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (treatReturnState.step4?.multipleStreets === undefined) {
    const initialState = {
      ...treatReturnState,
      step4: {
        multipleStreets: null,
        streetNames: null,
        allFromArborAve: null,
        nonArborPercent: null,
      } as Step4State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export function isCompleted(step4: Step4State) {
  if (step4.multipleStreets === null) return false;
  if (step4.multipleStreets === true) {
    if (!step4.streetNames?.trim()) return false;
    if (step4.nonArborPercent === null) return false;
  } else {
    if (step4.allFromArborAve === null) return false;
    if (step4.allFromArborAve === false && step4.nonArborPercent === null) return false;
  }
  return true;
}

export default function Step4() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [multipleStreets, setMultipleStreets] = useState<boolean | null>(
    treatReturnState.step4.multipleStreets
  );
  const [streetNames, setStreetNames] = useState<string | null>(
    treatReturnState.step4.streetNames
  );
  const [allFromArborAve, setAllFromArborAve] = useState<boolean | null>(
    treatReturnState.step4.allFromArborAve
  );
  const [nonArborPercent, setNonArborPercent] = useState<number | null>(
    treatReturnState.step4.nonArborPercent
  );

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step4: {
        multipleStreets,
        streetNames,
        allFromArborAve,
        nonArborPercent,
      },
    });
  }, [multipleStreets, streetNames, allFromArborAve, nonArborPercent, treatReturnState]);

  const shouldDisableNext = () => !isCompleted({ multipleStreets, streetNames, allFromArborAve, nonArborPercent });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <ProgressBar currentStep={4} />
        <div>
          <QuestionHeader>
            Did you collect candy from multiple streets this year?
          </QuestionHeader>
          <Select
            value={multipleStreets}
            onChange={setMultipleStreets}
            options={[
              { value: true, display: "Yes" },
              { value: false, display: "No" },
            ]}
          />
        </div>

        {multipleStreets && (
          <div className="animate-fade-in">
            <QuestionHeader>
              List the streets you collected candy from this year.
            </QuestionHeader>
            <TextInput
              value={streetNames || ''}
              onChange={setStreetNames}
              placeholderText="Separate street names by commas"
            />
          </div>
        )}

        {!multipleStreets && (
          <div className="animate-fade-in">
            <QuestionHeader>
              Is all the candy you collected this year from Arbor Ave?
            </QuestionHeader>
            <Select
              value={allFromArborAve}
              onChange={setAllFromArborAve}
              options={[
                { value: true, display: "Yes" },
                { value: false, display: "No" },
              ]}
            />
          </div>
        )}

        {(multipleStreets || (!multipleStreets && allFromArborAve === false)) && (
          <div className="animate-fade-in">
            <QuestionHeader>
              What percentage of your candy came from a street other than Arbor?
            </QuestionHeader>
            <NumberInput
              value={nonArborPercent}
              onChange={setNonArborPercent}
              minValue={0}
              maxValue={100}
              step={1}
              placeholderText="Enter percentage (0-100)"
            />
          </div>
        )}

        <StepPagination
          disabled={shouldDisableNext()}
          currentStep={4}
        />
      </div>
    </main>
  );
}
