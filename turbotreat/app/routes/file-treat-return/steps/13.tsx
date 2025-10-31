import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";
import {
  QuestionHeader,
  HelpButton,
  HelpText,
  Select,
  NumberInput,
  StepPagination,
} from "./components.client";

export type Step13State = {
  yearsTrickOrTreating: number | null;
  flewSweetwest: boolean | null;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step13 || treatReturnState.step13.yearsTrickOrTreating === undefined) {
    const initialState = {
      ...treatReturnState,
      step13: {
        yearsTrickOrTreating: null,
        flewSweetwest: null,
      } as Step13State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export function isCompleted(step13: Step13State) {
  if (step13.yearsTrickOrTreating === null) return false;
  if (step13.flewSweetwest === null) return false;
  return true;
}

export default function Step13() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [yearsTrickOrTreating, setYearsTrickOrTreating] = useState(treatReturnState.step13.yearsTrickOrTreating);
  const [flewSweetwest, setFlewSweetwest] = useState(treatReturnState.step13.flewSweetwest);
  const [showSweetwestHelp, setShowSweetwestHelp] = useState(false);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step13: {
        yearsTrickOrTreating,
        flewSweetwest,
      },
    });
  }, [yearsTrickOrTreating, flewSweetwest, treatReturnState]);

  const shouldDisableNext = () => !isCompleted({
    yearsTrickOrTreating,
    flewSweetwest,
  });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <QuestionHeader>
          How many years have you trick-or-treated at Arbor Ave on Halloween?
        </QuestionHeader>
        <NumberInput
          value={yearsTrickOrTreating}
          onChange={setYearsTrickOrTreating}
          minValue={0}
          step={1}
          placeholderText="Enter number of years"
        />

        <QuestionHeader>
          Did you fly on Sweetwest Airlines, departing from the Arbor Aveport, last year?
          <HelpButton onClick={() => setShowSweetwestHelp(!showSweetwestHelp)} />
        </QuestionHeader>
        {showSweetwestHelp && (
          <HelpText title="What is the Sweetwest Airlines treat income tax credit?">
            The treat income tax credit is a tax credit that allows you to claim a credit for the candy you spent on Sweetwest Airlines.
          </HelpText>
        )}
        <Select
          value={flewSweetwest}
          onChange={setFlewSweetwest}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        <StepPagination disabled={shouldDisableNext()} currentStep={13} />
      </div>
    </main>
  );
}
