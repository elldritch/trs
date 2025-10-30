import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router";
import {
  loadStepStateOrRedirect,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";

export type Step3State = {
  attendsSchool: "yes" | "no" | "";
  schoolYear: "Pre-K" | "Elementary" | "Middle" | "High School" | "Adult" | "";
  schoolConditions: "cannot_attend" | "graduated" | "none" | "";
};

export function clientLoader() {
  const treatReturnState = loadStepStateOrRedirect(3);
  if (!treatReturnState.step3 || typeof treatReturnState.step3.attendsSchool !== "string") {
    const initialState = {
      ...treatReturnState,
      step3: { 
        attendsSchool: "", 
        schoolYear: "", 
        schoolConditions: "", 
      } as Step3State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }
  return treatReturnState;
}
export default function Step3() {
  const navigate = useNavigate();
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [attendsSchool, setAttendsSchool] = useState(treatReturnState.step3.attendsSchool);
  const [schoolYear, setSchoolYear] = useState(treatReturnState.step3.schoolYear);
  const [schoolConditions, setSchoolConditions] = useState(
    treatReturnState.step3.schoolConditions
  );

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step3: { 
        attendsSchool: attendsSchool as Step3State['attendsSchool'],
        schoolYear: schoolYear as Step3State['schoolYear'],
        schoolConditions: schoolConditions as Step3State['schoolConditions']
      },
    });
  }, [attendsSchool, schoolYear, schoolConditions]);

  const isFormValid = () => {
    if (attendsSchool === "yes") {
      return !!schoolYear;
    } else if (attendsSchool === "no") {
      return schoolConditions.length > 0;
    }
    return false;
  };

  return (
    <main>
      <fieldset className="mb-6">
        <legend className="mb-2">
          <h1>Do you regularly attend school?</h1>
        </legend>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="attends-school"
              value="yes"
              checked={attendsSchool === "yes"}
              onChange={() => setAttendsSchool("yes")}
              className="h-4 w-4"
            />
            Yes
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="attends-school"
              value="no"
              checked={attendsSchool === "no"}
              onChange={() => setAttendsSchool("no")}
              className="h-4 w-4"
            />
            No
          </label>
        </div>
      </fieldset>

      {attendsSchool === "yes" && (
        <fieldset className="mb-6">
          <legend className="mb-2">
            <h1>What is your school year?</h1>
          </legend>
          <div className="grid gap-2">
            {["Pre-K", "Elementary", "Middle", "High School", "Adult"].map((year) => (
              <label key={year} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="school-year"
                  value={year}
                  checked={schoolYear === year}
                  onChange={(e) => setSchoolYear(e.target.value as Step3State['schoolYear'])}
                  className="h-4 w-4"
                />
                {year}
              </label>
            ))}
          </div>
        </fieldset>
      )}

        <fieldset className="mb-6">
          <legend className="mb-2">
            <h1>Do any of the following conditions apply to you?</h1>
          </legend>
          <div className="grid gap-2">
            {[
              { value: "cannot_attend", label: "Cannot yet attend school" },
              { value: "graduated", label: "Already graduated" },
              { value: "none", label: "None of these" },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="school-conditions"
                  value={value}
                  checked={schoolConditions.includes(value)}
                  onChange={(e) => setSchoolConditions(e.target.value as Step3State['schoolConditions'])}
                  className="h-4 w-4 rounded"
                />
                {label}
              </label>
            ))}
          </div>
        </fieldset>
      
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <button
          onClick={() => navigate("/file/step/2")}
          className="bg-gray-200 text-gray-800 hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          disabled={!isFormValid()}
          onClick={() => {
            setTreatReturnState({
              ...treatReturnState,
              step3: { 
                attendsSchool: attendsSchool as Step3State['attendsSchool'],
                schoolYear: schoolYear as Step3State['schoolYear'],
                schoolConditions: schoolConditions as Step3State['schoolConditions']
              },
              currentStep: 4,
            });
            navigate("/file/step/4");
          }}
          className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </main>
  );
}
