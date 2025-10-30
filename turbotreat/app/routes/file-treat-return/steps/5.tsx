import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";
import { QuestionHeader, Select, StepPagination, NumberInput } from "./components.client";

export type Step5State = {
  candyWeight: number | null;
  receivedTips: boolean | null;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step5) {
    const initialState = {
      ...treatReturnState,
      step5: { 
        candyWeight: null, 
        receivedTips: null,
      } as Step5State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export function isCompleted(step5: Step5State) {
  if (step5.candyWeight === null) return false;
  if (step5.receivedTips === null) return false;
  return true;
}

export default function Step5() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [candyWeight, setCandyWeight] = useState(treatReturnState.step5.candyWeight);
  const [receivedTips, setReceivedTips] = useState(treatReturnState.step5.receivedTips);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step5: { 
        candyWeight, 
        receivedTips 
      },
    });
  }, [candyWeight, receivedTips, treatReturnState]);

  const shouldDisableNext = () => !isCompleted({ candyWeight, receivedTips });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <QuestionHeader>
          Enter the total weight, in pounds, of the candy you have collected this year.
        </QuestionHeader>
        <NumberInput
          value={candyWeight}
          onChange={setCandyWeight}
          minValue={0}
          step={0.1}
          placeholderText="Enter weight in pounds"
        />
        <QuestionHeader>
          Did you receive any candy as tips for services rendered this year?
        </QuestionHeader>
        <Select
          value={receivedTips}
          onChange={setReceivedTips}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        <StepPagination 
          disabled={shouldDisableNext()} 
          currentStep={5} 
        />
      </div>
    </main>
  );
}
