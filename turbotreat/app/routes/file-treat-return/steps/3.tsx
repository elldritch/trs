import { useEffect, useState } from "react";
import { useLoaderData } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";
import { ProgressBar, QuestionHeader, Select, StepPagination } from "./components.client";

export type Step3State = {
  attendsSchool: boolean | null;
  schoolYear: SchoolYear;
  schoolConditions: SchoolCondition;
};

export type SchoolYear = "Pre-K" | "Elementary" | "1st Grade" | "2nd Grade" | "3rd Grade" | "4th Grade" | "5th Grade" | "6th Grade" | "7th Grade" | "8th Grade" | "9th Grade" | "10th Grade" | "11th Grade" | "12th Grade" | "College" | "Graduate" | null;
export type SchoolCondition = "cannot_attend" | "graduated" | "none" | null;

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();
  if (!treatReturnState.step3 || treatReturnState.step3.attendsSchool === undefined) {
    const initialState = {
      ...treatReturnState,
      step3: {
        attendsSchool: null,
        schoolYear: null,
        schoolConditions: null,
      } as Step3State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }
  return treatReturnState;
}

export function isCompleted(step3: Step3State) {
  if (step3.attendsSchool === null) return false;
  if (step3.attendsSchool === true) {
    return !!step3.schoolYear;
  } else {
    return step3.schoolConditions !== null;
  }
}

export default function Step3() {
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
        attendsSchool: attendsSchool,
        schoolYear: schoolYear,
        schoolConditions: schoolConditions
      },
    });
  }, [attendsSchool, schoolYear, schoolConditions]);

  const shouldDisableNext = () => !isCompleted({
    attendsSchool,
    schoolYear,
    schoolConditions
  });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <ProgressBar currentStep={3} />
        <div>
          <QuestionHeader>
            Do you regularly attend school?
          </QuestionHeader>
          <Select
            value={attendsSchool}
            onChange={setAttendsSchool}
            options={[
              { value: true, display: "Yes" },
              { value: false, display: "No" },
            ]}
          />
        </div>

        {attendsSchool &&
          (
            <div>
              <QuestionHeader>
                What is your school year?
              </QuestionHeader>
              <Select
                value={schoolYear}
                onChange={setSchoolYear}
                options={[
                  { value: "Pre-K", display: "Pre-K" },
                  { value: "Elementary", display: "Elementary" },
                  { value: "1st Grade", display: "1st Grade" },
                  { value: "2nd Grade", display: "2nd Grade" },
                  { value: "3rd Grade", display: "3rd Grade" },
                  { value: "4th Grade", display: "4th Grade" },
                  { value: "5th Grade", display: "5th Grade" },
                  { value: "6th Grade", display: "6th Grade" },
                  { value: "7th Grade", display: "7th Grade" },
                  { value: "8th Grade", display: "8th Grade" },
                  { value: "9th Grade", display: "9th Grade" },
                  { value: "10th Grade", display: "10th Grade" },
                  { value: "11th Grade", display: "11th Grade" },
                  { value: "12th Grade", display: "12th Grade" },
                  { value: "College", display: "College" },
                ]}
              />
            </div>
          )
        }

        {!attendsSchool &&
          (
            <div>
              <QuestionHeader>
                Do any of the following conditions apply to you?
              </QuestionHeader>
              <Select
                value={schoolConditions}
                onChange={setSchoolConditions}
                options={[
                  { value: "cannot_attend", display: "Cannot yet attend school" },
                  { value: "graduated", display: "Already graduated" },
                  { value: "none", display: "None of these" },
                ]}
              />
            </div>
          )
        }

        <StepPagination disabled={shouldDisableNext()} currentStep={3} />
      </div>
    </main>
  );
}
