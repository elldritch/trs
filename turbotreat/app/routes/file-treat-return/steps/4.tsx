import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";
import { QuestionHeader, Select, StepPagination, TextInput } from "./components.client";

export type Step4State = {
  multipleStreets: boolean;
  streetNames: string | null;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (treatReturnState.step4?.multipleStreets === undefined) {
    const initialState = {
      ...treatReturnState,
      step4: { 
        multipleStreets: false,
        streetNames: null,
      } as Step4State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export function isStep4Complete(step4: Step4State) {
  if (step4.multipleStreets === false) return true;
  if (step4.multipleStreets === true) return !!step4.streetNames?.trim();
  return true;
}

export default function Step4() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [multipleStreets, setMultipleStreets] = useState<boolean>(
    treatReturnState.step4.multipleStreets
  );
  const [streetNames, setStreetNames] = useState<string | null>(
    treatReturnState.step4.streetNames
  );

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step4: { 
        multipleStreets,
        streetNames,
      },
    });
  }, [multipleStreets, streetNames, treatReturnState]);

  const isComplete = () => isStep4Complete({ multipleStreets, streetNames });

  return (
    <div className="flex flex-col gap-4">
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

      <StepPagination 
        disabled={!isComplete()} 
        currentStep={4} 
      />
    </div>
  );
}
