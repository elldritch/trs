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

export type Step6State = {
  investedPTP: boolean | null;
  investedPTPPercent: number | null;
  investedREIT: boolean | null;
  investedREITPercent: number | null;
  californiaFilm: boolean | null;
  otherSourcesOfCandy: boolean | null;
  filed1040TRES: boolean | null;
  pieces1040TRES: number | null;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step6 || treatReturnState.step6 === undefined) {
    const initialState = {
      ...treatReturnState,
      step6: {
        investedPTP: null,
        investedPTPPercent: null,
        investedREIT: null,
        investedREITPercent: null,
        californiaFilm: null,
        otherSourcesOfCandy: null,
        filed1040TRES: null,
        pieces1040TRES: null,
      } as Step6State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export function isCompleted(step6: Step6State) {
  if (step6.investedPTP === null) return false;
  if (step6.investedPTP === true && step6.investedPTPPercent === null) return false;
  if (step6.investedREIT === null) return false;
  if (step6.investedREIT === true && step6.investedREITPercent === null) return false;
  if (step6.californiaFilm === null) return false;
  if (step6.otherSourcesOfCandy === null) return false;
  if (step6.filed1040TRES === null) return false;
  if (step6.filed1040TRES === true && step6.pieces1040TRES === null) return false;
  return true;
}

export default function Step6() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [investedPTP, setInvestedPTP] = useState(treatReturnState.step6.investedPTP);
  const [investedPTPPercent, setInvestedPTPPercent] = useState(treatReturnState.step6.investedPTPPercent);
  const [investedREIT, setInvestedREIT] = useState(treatReturnState.step6.investedREIT);
  const [investedREITPercent, setInvestedREITPercent] = useState(treatReturnState.step6.investedREITPercent);
  const [californiaFilm, setCaliforniaFilm] = useState(treatReturnState.step6.californiaFilm);
  const [otherSourcesOfCandy, setOtherSourcesOfCandy] = useState(treatReturnState.step6.otherSourcesOfCandy);
  const [filed1040TRES, setFiled1040TRES] = useState(treatReturnState.step6.filed1040TRES);
  const [pieces1040TRES, setPieces1040TRES] = useState(treatReturnState.step6.pieces1040TRES);
  const [showPTPHelp, setShowPTPHelp] = useState(false);
  const [showREITHelp, setShowREITHelp] = useState(false);
  const [show1040TRESHelp, setShow1040TRESHelp] = useState(false);
  const [show1040TRESPiecesHelp, setShow1040TRESPiecesHelp] = useState(false);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step6: {
        investedPTP,
        investedPTPPercent,
        investedREIT,
        investedREITPercent,
        californiaFilm,
        otherSourcesOfCandy,
        filed1040TRES,
        pieces1040TRES,
      },
    });
  }, [investedPTP, investedPTPPercent, investedREIT, investedREITPercent, californiaFilm, otherSourcesOfCandy, filed1040TRES, pieces1040TRES, treatReturnState]);

  const shouldDisableNext = () => !isCompleted({
    investedPTP,
    investedPTPPercent,
    investedREIT,
    investedREITPercent,
    californiaFilm,
    otherSourcesOfCandy,
    filed1040TRES,
    pieces1040TRES,
  });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <ProgressBar currentStep={6} />
        <QuestionHeader>
          Did you invest candy in a Publicly Treatable Partnership (PTP) this year?
          <HelpButton onClick={() => setShowPTPHelp(!showPTPHelp)} />
        </QuestionHeader>
        {showPTPHelp && (
          <HelpText title="What is a Publicly Treatable Partnership (PTP)?">
            Some trick or treaters pool their candy with other trick or treaters to form a shared pool of candy.
            If this candy pool is registered as a Publicly Treatable Partnership (PTP), ownership shares in the
            PTP can be sold or traded on established securities exchanges, much like shares of a corporation,
            but the PTP is still subject to similar tax treatment as a standard limited treat partnership.
          </HelpText>
        )}
        <Select
          value={investedPTP}
          onChange={setInvestedPTP}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />
        {investedPTP && (
           <div className="animate-fade-in">
          <QuestionHeader>
            What percentage of your total candy weight this year was received as dividends from a PTP?
          </QuestionHeader>
          <NumberInput
            value={investedPTPPercent}
            onChange={setInvestedPTPPercent}
            minValue={0}
            maxValue={100}
            step={1}
            placeholderText="Enter percentage"
          />
            </div>
         ) }

        <QuestionHeader>
          Did you invest candy in a Real Estate Investment Treat (REIT) this year?
          <HelpButton onClick={() => setShowREITHelp(!showREITHelp)} />
        </QuestionHeader>
        {showREITHelp && (
          <HelpText title="What is a Real Estate Investment Treat (REIT)?">
            Sometimes, while investing in commercial or residential property, you deserve a treat.
            This food item (can be either savory or sweet) is considered a "Real Estate Investment Treat".
          </HelpText>
        )}
        <Select
          value={investedREIT}
          onChange={setInvestedREIT}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />
        {investedREIT && (
           <div className="animate-fade-in">
          <QuestionHeader>
            What percentage of your total candy weight this year was received as dividends from an REIT?
          </QuestionHeader>
          <NumberInput
            value={investedREITPercent}
            onChange={setInvestedREITPercent}
            minValue={0}
            maxValue={100}
            step={1}
            placeholderText="Enter percentage"
          />
            </div>
         ) }

        <QuestionHeader>
          Will any of this candy be used to feed actors or actresses in a film or television production in the state of California?
        </QuestionHeader>
        <Select
          value={californiaFilm}
          onChange={setCaliforniaFilm}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        <QuestionHeader>
          Was any of your candy received from unreported sources, other than trick-or-treating?
        </QuestionHeader>
        <Select
          value={otherSourcesOfCandy}
          onChange={setOtherSourcesOfCandy}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />


        <QuestionHeader>
          Have you already filled out a form 1040-TR-ES earlier this year?
          <HelpButton onClick={() => setShow1040TRESHelp(!show1040TRESHelp)} />
        </QuestionHeader>
        {show1040TRESHelp && (
          <HelpText title="What is form 1040-TR-ES?">
            Form 1040-TR-ES is used to submit estimated treat tax payments for treat income that is not subject to withholding.
            For instance, if you made treats yourself (self-employed treat income), or received treats from a house that did not
            issue you a form W-2-TR, that treat income might not have been subject to withholding. The TRS collects candy in a
            pay-as-you-go system, so estimated taxes on non-withheld treat income must be paid quarterly using Form 1040-TR-ES.
          </HelpText>
        )}
        <Select
          value={filed1040TRES}
          onChange={setFiled1040TRES}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        {filed1040TRES === true && (
          <>
            <QuestionHeader>
              How many pieces of candy did you pay via form 1040-TR-ES?
              <HelpButton onClick={() => setShow1040TRESPiecesHelp(!show1040TRESPiecesHelp)} />
            </QuestionHeader>
            {show1040TRESPiecesHelp && (
              <HelpText title="How many pieces of candy did I pay in estimated treat payments?">
                NOTE: Estimated treat payments are made by weight, but deductions for estimated treat payments are determined
                by converting estimated treat payment weights to a number of Standard Candies (SCs). To determine how SCs you paid,
                take the total weight of the candy you paid in each quarter by consulting box 13 of form 1040-TR-ES, and dividing
                by the Standard Candy weight to candy pieces conversion ratio for the given tax year. The Standard Candy weight to
                candy pieces conversion schedule is available as form SCTR-2. The standard conversion ratio for chocolate type candies
                for the 2025 tax year is 16.21g/pc.
              </HelpText>
            )}
            <NumberInput
              value={pieces1040TRES}
              onChange={setPieces1040TRES}
              minValue={0}
              step={1}
              placeholderText="Enter number of pieces"
            />
          </>
        )}

        <StepPagination disabled={shouldDisableNext()} currentStep={6} />
      </div>
    </main>
  );
}
