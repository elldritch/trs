import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";
import {
  ProgressBar,
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
  leftoverCandy: boolean | null;
  leftoverCandyPercent: number | null;
  smartiesReceived: boolean | null;
  smartiesPercent: number | null;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step13 || treatReturnState.step13.yearsTrickOrTreating === undefined) {
    const initialState = {
      ...treatReturnState,
      step13: {
        yearsTrickOrTreating: null,
        flewSweetwest: null,
        leftoverCandy: null,
        leftoverCandyPercent: null,
        smartiesReceived: null,
        smartiesPercent: null,
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
  if (step13.leftoverCandy === null) return false;
  if (step13.leftoverCandy === true && step13.leftoverCandyPercent === null) return false;
  if (step13.smartiesReceived === null) return false;
  if (step13.smartiesReceived === true && step13.smartiesPercent === null) return false;
  return true;
}

export default function Step13() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [yearsTrickOrTreating, setYearsTrickOrTreating] = useState(treatReturnState.step13.yearsTrickOrTreating);
  const [flewSweetwest, setFlewSweetwest] = useState(treatReturnState.step13.flewSweetwest);
  const [showSweetwestHelp, setShowSweetwestHelp] = useState(false);
  const [leftoverCandy, setLeftoverCandy] = useState(treatReturnState.step13.leftoverCandy);
  const [leftoverCandyPercent, setLeftoverCandyPercent] = useState(treatReturnState.step13.leftoverCandyPercent);
  const [smartiesReceived, setSmartiesReceived] = useState(treatReturnState.step13.smartiesReceived);
  const [smartiesPercent, setSmartiesPercent] = useState(treatReturnState.step13.smartiesPercent);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step13: {
        yearsTrickOrTreating,
        flewSweetwest,
        leftoverCandy,
        leftoverCandyPercent,
        smartiesReceived,
        smartiesPercent,
      },
    });
  }, [yearsTrickOrTreating, flewSweetwest, leftoverCandy, leftoverCandyPercent, smartiesReceived, smartiesPercent, treatReturnState]);

  const shouldDisableNext = () => !isCompleted({
    yearsTrickOrTreating,
    flewSweetwest,
    leftoverCandy,
    leftoverCandyPercent,
    smartiesReceived,
    smartiesPercent,
  });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <ProgressBar currentStep={13} />
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

         <QuestionHeader>
            Will any of your candy be left by the end of this calendar year (December 2025)?
        </QuestionHeader>
        <Select
          value={leftoverCandy}
          onChange={setLeftoverCandy}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        {leftoverCandy && (
          <div className="animate-fade-in">
            <QuestionHeader>
              What percentage of your candy will remain at the end of this calendar year?
            </QuestionHeader>
            <NumberInput
              value={leftoverCandyPercent}
              onChange={setLeftoverCandyPercent}
              minValue={0}
              maxValue={100}
              step={1}
              placeholderText="Enter percentage (0-100)"
            />
          </div>
        )}

        <QuestionHeader>
            Did you receive any Smarties during your trick-or-treating this year?
        </QuestionHeader>
        <Select
          value={smartiesReceived}
          onChange={setSmartiesReceived}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        {smartiesReceived && (
          <div className="animate-fade-in">
            <QuestionHeader>
              What percentage of your candy is Smarties?
            </QuestionHeader>
            <NumberInput
              value={smartiesPercent}
              onChange={setSmartiesPercent}
              minValue={0}
              maxValue={100}
              step={1}
              placeholderText="Enter percentage (0-100)"
            />
          </div>
        )}

        <StepPagination disabled={shouldDisableNext()} currentStep={13} />
      </div>
    </main>
  );
}
