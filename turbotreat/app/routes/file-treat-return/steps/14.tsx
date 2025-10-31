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
  StepPagination,
} from "./components.client";

export type Step14State = {
  donateSEF: boolean | null;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step14 || treatReturnState.step14.donateSEF === undefined) {
    const initialState = {
      ...treatReturnState,
      step14: {
        donateSEF: null,
      } as Step14State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export function isCompleted(step14: Step14State) {
  if (step14.donateSEF === null) return false;
  return true;
}

export default function Step14() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [donateSEF, setDonateSEF] = useState(treatReturnState.step14.donateSEF);
  const [showSEFHelp, setShowSEFHelp] = useState(false);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step14: {
        donateSEF,
      },
    });
  }, [donateSEF, treatReturnState]);

  const shouldDisableNext = () => !isCompleted({ donateSEF });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <QuestionHeader>
          Would you like to donate 1 candy of your treat tax to the SEF (Superintendent Election Fund)?
          <HelpButton onClick={() => setShowSEFHelp(!showSEFHelp)} />
        </QuestionHeader>
        {showSEFHelp && (
          <HelpText title="What is the SEF?">
            The SEF is a fund that helps support the superintendent of candy in your district. Selecting yes will not change your treat tax or refund.
          </HelpText>
        )}
        <Select
          value={donateSEF}
          onChange={setDonateSEF}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        <StepPagination disabled={shouldDisableNext()} currentStep={14} />
      </div>
    </main>
  );
}
