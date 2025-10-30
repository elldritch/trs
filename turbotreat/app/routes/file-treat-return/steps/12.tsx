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

export type Step12State = {
  beenToDentist: boolean | null;
  dentalWorkFromCandy: boolean | null;
  reimbursedForDental: boolean | null;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step12) {
    const initialState = {
      ...treatReturnState,
      step12: {
        beenToDentist: null,
        dentalWorkFromCandy: null,
        reimbursedForDental: null,
      } as Step12State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export function isCompleted(step12: Step12State) {
  if (step12.beenToDentist === null) return false;
  if (step12.beenToDentist === false) return true;
  if (step12.dentalWorkFromCandy === null) return false;
  if (step12.dentalWorkFromCandy === false) return true;
  if (step12.reimbursedForDental === null) return false;
  return true;
}

export default function Step12() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [beenToDentist, setBeenToDentist] = useState(treatReturnState.step12.beenToDentist);
  const [dentalWorkFromCandy, setDentalWorkFromCandy] = useState(treatReturnState.step12.dentalWorkFromCandy);
  const [reimbursedForDental, setReimbursedForDental] = useState(treatReturnState.step12.reimbursedForDental);
  const [showDentalWorkHelp, setShowDentalWorkHelp] = useState(false);
  const [showReimbursedHelp, setShowReimbursedHelp] = useState(false);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step12: {
        beenToDentist,
        dentalWorkFromCandy,
        reimbursedForDental,
      },
    });
  }, [beenToDentist, dentalWorkFromCandy, reimbursedForDental, treatReturnState]);

  const shouldDisableNext = () => !isCompleted({
    beenToDentist,
    dentalWorkFromCandy,
    reimbursedForDental,
  });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <QuestionHeader>
          Have you been to the dentist in the past year?
        </QuestionHeader>
        <Select
          value={beenToDentist}
          onChange={setBeenToDentist}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        {beenToDentist === true && (
          <div className="animate-fade-in">
            <QuestionHeader>
              Was any dental work you received performed as a result of eating candy over the last year?
              <HelpButton onClick={() => setShowDentalWorkHelp(!showDentalWorkHelp)} />
            </QuestionHeader>
            {showDentalWorkHelp && (
              <HelpText title="What is teeth?">
                Teeth are bones, but in your face. If you ate so much candy that it hurt your face bones,
                you may have received treatment from a face bone doctor (dentist). Visits to the face bone
                doctor would be considered appointments for "dental work".
              </HelpText>
            )}
            <Select
              value={dentalWorkFromCandy}
              onChange={setDentalWorkFromCandy}
              options={[
                { value: true, display: "Yes" },
                { value: false, display: "No" },
              ]}
            />
          </div>
        )}

        {beenToDentist === true && dentalWorkFromCandy === true && (
          <div className="animate-fade-in">
            <QuestionHeader>
              Were you already reimbursed for this dental work?
              <HelpButton onClick={() => setShowReimbursedHelp(!showReimbursedHelp)} />
            </QuestionHeader>
            {showReimbursedHelp && (
              <HelpText title="How do I know if a dental visit was reimbursed?">
                Trick or treaters who go to the dentist are usually entitled to compensation in the form of a
                toy or other small delightful object (like a new toothbrush). If you visited the dentist but
                did not receive compensation, you are eligible for a tax credit from the TRS.
              </HelpText>
            )}
            <Select
              value={reimbursedForDental}
              onChange={setReimbursedForDental}
              options={[
                { value: true, display: "Yes" },
                { value: false, display: "No" },
              ]}
            />
          </div>
        )}

        <StepPagination disabled={shouldDisableNext()} currentStep={12} />
      </div>
    </main>
  );
}
