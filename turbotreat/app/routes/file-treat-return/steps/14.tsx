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
  purchasePremium: boolean | null;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step14) {
    const initialState = {
      ...treatReturnState,
      step14: {
        donateSEF: null,
        purchasePremium: null,
      } as Step14State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export function isStep14Complete(step14: Step14State) {
  if (step14.donateSEF === null) return false;
  if (step14.purchasePremium === null) return false;
  return true;
}

export default function Step14() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [donateSEF, setDonateSEF] = useState(treatReturnState.step14.donateSEF);
  const [purchasePremium, setPurchasePremium] = useState(treatReturnState.step14.purchasePremium);
  const [showSEFHelp, setShowSEFHelp] = useState(false);
  const [showPremiumHelp, setShowPremiumHelp] = useState(false);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step14: {
        donateSEF,
        purchasePremium,
      },
    });
  }, [donateSEF, purchasePremium, treatReturnState]);

  const shouldDisableNext = () => !isStep14Complete({ donateSEF, purchasePremium });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <QuestionHeader>
          Would you like to donate 1 candy of your treat tax to the SEF (Superintendent Election Fund)? Selecting yes will not change your treat tax or refund.
          <HelpButton onClick={() => setShowSEFHelp(!showSEFHelp)} />
        </QuestionHeader>
        {showSEFHelp && (
          <HelpText title="What is the SEF?">
            The SEF is a fund that helps support the superintendent of candy in your district.
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

        <QuestionHeader>
          Would you like to pay for TurboTreat Premium with 1 candy from your tax refund?
          <HelpButton onClick={() => setShowPremiumHelp(!showPremiumHelp)} />
        </QuestionHeader>
        {showPremiumHelp && (
          <HelpText title="What additional benefits does TurboTreat Premium offer?">
            TurboTreat Premium offers additional benefits such as help with tax auditing, more advanced tax preparation, and access to TurboTreat tax professionals.
          </HelpText>
        )}
        <Select
          value={purchasePremium}
          onChange={setPurchasePremium}
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
