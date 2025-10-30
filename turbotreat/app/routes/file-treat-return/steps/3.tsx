import { useEffect, useMemo, useState } from "react";
import { Link, useLoaderData, useNavigate } from "react-router";
import {
  loadTreatReturnState,
  setTreatReturnState,
} from "~/lib/treat-return-state.client";
import { HelpButton, QuestionHeader, Select } from "./components.client";

export type Step3State = {
  attendsSchool: boolean;
  schoolYear: SchoolYear;
  schoolConditions: SchoolCondition;
};

export type SchoolYear = "Pre-K" | "Elementary" | "1st Grade" | "2nd Grade" | "3rd Grade" | "4th Grade" | "5th Grade" | "6th Grade" | "7th Grade" | "8th Grade" | "9th Grade" | "10th Grade" | "11th Grade" | "12th Grade" | "College" | "Graduate" | null;
export type SchoolCondition = "cannot_attend" | "graduated" | "none" | null;

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();
  if (!treatReturnState.step3 || typeof treatReturnState.step3.attendsSchool !== "string") {
    const initialState = {
      ...treatReturnState,
      step3: { 
        attendsSchool: false,
        schoolYear: null,
        schoolConditions: null,
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
  const [showSchoolHelp, setShowSchoolHelp] = useState(false);
  const [showYearHelp, setShowYearHelp] = useState(false);
  const [showConditionsHelp, setShowConditionsHelp] = useState(false);

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
     <main className="flex flex-col gap-4">
      <div>
        <QuestionHeader>
          Do you regularly attend school?
        </QuestionHeader>
        <Select
          value={attendsSchool}
          onChange={setAttendsSchool}
          options={[
            { value: "yes", display: "Yes" },
            { value: "no", display: "No" },
          ]}
        />
      </div>


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
          <div className="flex items-center mb-2">
            <legend className="text-xl font-bold">
              What is your school year?
            </legend>
            <button 
              onClick={() => setShowYearHelp(!showYearHelp)}
              className="ml-2 w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
              aria-label="Help with school year"
            >
              ?
            </button>
          </div>
          {showYearHelp && (
            <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
              <h4 className="font-bold mb-2"></h4>
              <p className="text-sm">
                
              </p>
            </div>
          )}
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
          <div className="flex items-center mb-2">
            <legend className="text-xl font-bold">
              Do any of the following conditions apply to you?
            </legend>
            <button 
              onClick={() => setShowConditionsHelp(!showConditionsHelp)}
              className="ml-2 w-6 h-6 flex items-center justify-center rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
              aria-label="Help with school conditions"
            >
              ?
            </button>
          </div>
          {showConditionsHelp && (
            <div className="bg-yellow-50 p-4 mb-4 rounded border border-yellow-200">
              <h4 className="font-bold mb-2"></h4>
              <p className="text-sm">
                
              </p>
            </div>
          )}
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
      
      <div className="flex justify-between mt-8">
        <button
          onClick={() => navigate("/file/step/2")}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
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
            });
            navigate("/file/step/4");
          }}
          className={`px-4 py-2 rounded ${
            !isFormValid()
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          Next
        </button>
      </div>
    </main>
  );
}
