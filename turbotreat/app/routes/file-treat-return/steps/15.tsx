import { useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";
import {
  QuestionHeader,
  HelpButton,
  HelpText,
  Select,
} from "./components.client";

export type Step15State = {
  purchasePremium: boolean | null;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step15 || treatReturnState.step15.purchasePremium === undefined) {
    const initialState = {
      ...treatReturnState,
      step15: {
        purchasePremium: null,
      } as Step15State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export function isCompleted(step15: Step15State) {
  if (step15.purchasePremium === null) return false;
  return true;
}

export default function Step15() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [purchasePremium, setPurchasePremium] = useState(treatReturnState.step15.purchasePremium);
  const [showPremiumHelp, setShowPremiumHelp] = useState(false);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step15: {
        purchasePremium,
      },
    });
  }, [purchasePremium, treatReturnState]);

  const shouldDisableNext = () => !isCompleted({ purchasePremium });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
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

         <div>
          <Link
            to="/file/step/14"
            className="block text-center mt-4 rounded-md font-medium text-white w-full py-2 bg-sky-700 cursor-pointer"
          >
            Previous
          </Link>
          <Link
            to="/file/finish"
            className={
              "block text-center mt-4 rounded-md font-medium text-white w-full py-2" +
              (shouldDisableNext()
                ? " bg-gray-300 cursor-not-allowed pointer-events-none"
                : " bg-sky-700 cursor-pointer")
            }
          >
            Next
          </Link>
        </div>
      </div>
    </main>
  );
}
