import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import {
  loadStepStateOrRedirect,
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

export type Step2State = {};

export function clientLoader() {
  const treatReturnState = loadStepStateOrRedirect(2);

  // TODO: Validate state. If state fails validation, reset it to initial state.

  return treatReturnState;
}

export default function Step2() {
  // const navigate = useNavigate();
  // const treatReturnState = useLoaderData<typeof clientLoader>();
  // const [firstName, setFirstName] = useState(treatReturnState.step1.firstName);
  // useEffect(() => {
  //   setTreatReturnState({ ...treatReturnState, step1: { firstName } });
  // }, [firstName]);

  return (
    <main>
      <fieldset>
        <legend>
          <h1>Are you wearing a costume this Halloween season?</h1>
        </legend>
        <input type="radio" name="wearing-costume" value="yes" />
        <label htmlFor="wearing-costume">Yes</label>
        <input type="radio" name="wearing-costume" value="no" />
        <label htmlFor="wearing-costume">No</label>
      </fieldset>
      <fieldset>
        <legend>
          <h1>
            Which, if any, of the following categories does your costume fall
            into?
          </h1>
        </legend>
        <input type="radio" name="costume-category" value="animal" />
        <label htmlFor="costume-category">Animal</label>
        <input type="radio" name="costume-category" value="vegetable" />
        <label htmlFor="costume-category">Vegetable</label>
        <input type="radio" name="costume-category" value="spirit" />
        <label htmlFor="costume-category">Spirit</label>
        <input type="radio" name="costume-category" value="mineral" />
        <label htmlFor="costume-category">Mineral</label>
        <input type="radio" name="costume-category" value="none" />
        <label htmlFor="costume-category">None of these</label>
      </fieldset>
      <button>Previous</button>
      <button
      // disabled={firstName.length === 0}
      // onClick={() => {
      //   setTreatReturnState({
      //     ...treatReturnState,
      //     step1: { firstName },
      //     currentStep: 2,
      //   });
      //   navigate("/file/step/2");
      // }}
      >
        Next
      </button>
    </main>
  );
}
