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
  StepPagination,
} from "./components.client";

export type TransportMethod =
  | "school_bus"
  | "public_transit"
  | "gas_vehicle"
  | "electric_vehicle"
  | "bike"
  | "scooter"
  | "skateboard"
  | "horse"
  | "roller_skating"
  | "walking"
  | "running"
  | "none"
  | null;

export type Step9State = {
  hasCommute: boolean | null;
  transportMethod: TransportMethod;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step9 || treatReturnState.step9.hasCommute === undefined) {
    const initialState = {
      ...treatReturnState,
      step9: {
        hasCommute: null,
        transportMethod: null,
      } as Step9State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export function isCompleted(step9: Step9State) {
  if (step9.hasCommute === null) return false;
  if (step9.hasCommute === true && step9.transportMethod === null) return false;
  return true;
}

export default function Step9() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [hasCommute, setHasCommute] = useState(treatReturnState.step9.hasCommute);
  const [transportMethod, setTransportMethod] = useState(treatReturnState.step9.transportMethod);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step9: {
        hasCommute,
        transportMethod,
      },
    });
  }, [hasCommute, transportMethod, treatReturnState]);

  const shouldDisableNext = () => !isCompleted({ hasCommute, transportMethod });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <ProgressBar currentStep={9} />
        <QuestionHeader>
          Do you regularly commute to school or work?
        </QuestionHeader>
        <Select
          value={hasCommute}
          onChange={setHasCommute}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        {hasCommute === true && (
          <div className="animate-fade-in">
            <QuestionHeader>
              Which of the following means of transportation do you most frequently use to commute to school or work?
            </QuestionHeader>
            <Select
              value={transportMethod}
              onChange={setTransportMethod}
              options={[
                { value: "school_bus", display: "Riding a school bus" },
                { value: "public_transit", display: "Taking public transportation" },
                { value: "gas_vehicle", display: "Driving a gas-powered vehicle" },
                { value: "electric_vehicle", display: "Driving an electric vehicle" },
                { value: "bike", display: "Riding a bike" },
                { value: "scooter", display: "Riding a scooter" },
                { value: "skateboard", display: "Riding a skateboard" },
                { value: "horse", display: "Riding a horse" },
                { value: "roller_skating", display: "Roller skating" },
                { value: "walking", display: "Walking" },
                { value: "running", display: "Running" },
                { value: "none", display: "None of these" },
              ]}
            />
          </div>
        )}

        <StepPagination disabled={shouldDisableNext()} currentStep={9} />
      </div>
    </main>
  );
}
