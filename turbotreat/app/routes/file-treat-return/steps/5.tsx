import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";
import { ProgressBar, QuestionHeader, Select, StepPagination, NumberInput } from "./components.client";

export type Step5State = {
  candyWeight: number | null;
  receivedTips: boolean | null;
  tipsPercent: number | null;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step5 || treatReturnState.step5 === undefined) {
    const initialState = {
      ...treatReturnState,
      step5: { 
        candyWeight: null, 
        receivedTips: null,
        tipsPercent: null
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
  if (step5.receivedTips && (step5.tipsPercent === null)) return false;
  return true;
}

export default function Step5() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [candyWeight, setCandyWeight] = useState(treatReturnState.step5.candyWeight);
  const [receivedTips, setReceivedTips] = useState(treatReturnState.step5.receivedTips);
  const [tipsPercent, setTipsPercent] = useState(treatReturnState.step5.tipsPercent);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step5: { 
        candyWeight, 
        receivedTips,
        tipsPercent
      },
    });
  }, [candyWeight, receivedTips, tipsPercent, treatReturnState]);

  const shouldDisableNext = () => !isCompleted({ candyWeight, receivedTips, tipsPercent });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <ProgressBar currentStep={5} />
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
        { receivedTips && (
           <div className="animate-fade-in">
          <QuestionHeader>
            What percentage of your total candy weight was received as tips?
            </QuestionHeader>
            <NumberInput
              value={tipsPercent}
              onChange={setTipsPercent}
              minValue={0}
              maxValue={100}
              step={1}
              placeholderText="Enter percentage"
            />
        </div>
        ) } 

        <StepPagination 
          disabled={shouldDisableNext()} 
          currentStep={5} 
        />
      </div>
    </main>
  );
}
