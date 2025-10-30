import { useEffect, useState } from "react";
import type { Route } from "./+types/2";

import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";
import {
  HelpButton,
  HelpText,
  QuestionHeader,
  Select,
  StepPagination,
  TextInput,
} from "./components.client";

export type Step2State = {
  wearingCostume: boolean;
  costumeCategory: CostumeCategory | null;
  costumeName: string | null;
};

export type CostumeCategory =
  | "animal"
  | "vegetable"
  | "spirit"
  | "mineral"
  | "none";

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (typeof treatReturnState.step2.wearingCostume !== "boolean") {
    const initialState = {
      ...treatReturnState,
      step2: {
        wearingCostume: false,
        costumeCategory: null,
        costumeName: null,
      },
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export default function Step2({ loaderData }: Route.ComponentProps) {
  const treatReturnState = loaderData;

  const [wearingCostume, setWearingCostume] = useState(
    treatReturnState.step2.wearingCostume
  );
  const [costumeCategory, setCostumeCategory] = useState(
    treatReturnState.step2.costumeCategory
  );
  const [costumeName, setCostumeName] = useState(
    treatReturnState.step2.costumeName
  );
  const [showCostumeHelp, setShowCostumeHelp] = useState(false);

  const disabled =
    wearingCostume &&
    (costumeCategory == null ||
      costumeName == null ||
      costumeName.length === 0);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step2: { wearingCostume, costumeCategory, costumeName },
    });
  }, [wearingCostume, costumeCategory, costumeName, treatReturnState]);

  return (
    <main className="flex flex-col gap-4">
      <div>
        <QuestionHeader>
          Are you wearing a costume this Halloween season?
          <HelpButton onClick={() => setShowCostumeHelp(!showCostumeHelp)} />
        </QuestionHeader>
        {showCostumeHelp && (
          <HelpText title="How do I know if I am wearing a costume?">
            A costume consists of article(s) of clothing that you are wearing
            for a special occasion. If you are dressed in clothes that you don't
            typically wear every day, you are probably wearing a costume.
          </HelpText>
        )}
        <Select
          value={wearingCostume}
          onChange={setWearingCostume}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />
      </div>

      {wearingCostume && (
        <div className="animate-fade-in">
          <QuestionHeader>
            Which, if any, of the following categories does your costume fall
            into?
          </QuestionHeader>
          <Select
            value={costumeCategory}
            onChange={setCostumeCategory}
            options={[
              { value: "animal", display: "Animal" },
              { value: "vegetable", display: "Vegetable" },
              { value: "spirit", display: "Spirit" },
              { value: "mineral", display: "Mineral" },
              { value: "none", display: "None of these" },
            ]}
          />
        </div>
      )}

      {wearingCostume && (
        <div className="animate-fade-in mt-4">
          <QuestionHeader>What is the name of your costume?</QuestionHeader>
          <TextInput
            value={costumeName ?? ""}
            onChange={(value) => setCostumeName(value)}
          />
        </div>
      )}

      <StepPagination disabled={disabled} currentStep={2} />
    </main>
  );
}
