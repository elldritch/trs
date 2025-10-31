import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";
import {
  ProgressBar,
  QuestionHeader,
  Select,
  NumberInput,
  StepPagination,
} from "./components.client";

export type Step10State = {
  willStudy: boolean | null;
  candyForStudy: boolean | null;
  studyCandyPercent: number | null;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step10 || treatReturnState.step10.willStudy === undefined) {
    const initialState = {
      ...treatReturnState,
      step10: {
        willStudy: null,
        candyForStudy: null,
        studyCandyPercent: null,
      } as Step10State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }
  return treatReturnState;
}

export function isCompleted(step10: Step10State) {
  if (step10.willStudy === null) return false;
  if (step10.candyForStudy === null) return false;
  if (step10.candyForStudy === true && step10.studyCandyPercent === null) return false;
  return true;
}

export default function Step10() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [willStudy, setWillStudy] = useState(treatReturnState.step10.willStudy);
  const [candyForStudy, setCandyForStudy] = useState(treatReturnState.step10.candyForStudy);
  const [studyCandyPercent, setStudyCandyPercent] = useState(treatReturnState.step10.studyCandyPercent);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step10: {
        willStudy,
        candyForStudy,
        studyCandyPercent,
      },
    });
  }, [willStudy, candyForStudy, studyCandyPercent, treatReturnState]);

  const shouldDisableNext = () => !isCompleted({
    willStudy,
    candyForStudy,
    studyCandyPercent,
  });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <ProgressBar currentStep={10} />
        <QuestionHeader>
          Will you be studying, reading, doing homework, learning new things, or spending time in a library ("study-oriented activities") over the upcoming year?
        </QuestionHeader>
        <Select
          value={willStudy}
          onChange={setWillStudy}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        <QuestionHeader>
          Will your candy collected over the past year be consumed during or before study-oriented activities in the upcoming year?
        </QuestionHeader>
        <Select
          value={candyForStudy}
          onChange={setCandyForStudy}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        {candyForStudy === true && (
          <div className="animate-fade-in">
            <QuestionHeader>
              About what percentage of the candy you've collected over the past year do you estimate will be consumed in support of these study-oriented activities?
            </QuestionHeader>
            <NumberInput
              value={studyCandyPercent}
              onChange={setStudyCandyPercent}
              minValue={0}
              maxValue={100}
              step={1}
              placeholderText="Enter percentage (0-100)"
            />
          </div>
        )}

        <StepPagination disabled={shouldDisableNext()} currentStep={10} />
      </div>
    </main>
  );
}
