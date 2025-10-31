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
  NumberInput,
  StepPagination,
} from "./components.client";

export type Step7State = {
  completedThreeHomework: boolean | null;
  totalHomeworkCount: number | null;
  homeworkAtHomeCount: number | null;
};

export function clientLoader() {
  const treatReturnState = loadTreatReturnState();

  if (!treatReturnState.step7 || treatReturnState.step7.completedThreeHomework === undefined) {
    const initialState = {
      ...treatReturnState,
      step7: {
        completedThreeHomework: null,
        totalHomeworkCount: null,
        homeworkAtHomeCount: null,
      } as Step7State,
    };
    setTreatReturnState(initialState);
    return initialState;
  }

  return treatReturnState;
}

export function isCompleted(step7: Step7State) {
  if (step7.completedThreeHomework === null) return false;
  if (step7.totalHomeworkCount === null) return false;
  if (step7.homeworkAtHomeCount === null) return false;
  return true;
}

export default function Step7() {
  const treatReturnState = useLoaderData<typeof clientLoader>();
  const [completedThreeHomework, setCompletedThreeHomework] = useState(treatReturnState.step7.completedThreeHomework);
  const [totalHomeworkCount, setTotalHomeworkCount] = useState(treatReturnState.step7.totalHomeworkCount);
  const [homeworkAtHomeCount, setHomeworkAtHomeCount] = useState(treatReturnState.step7.homeworkAtHomeCount);

  useEffect(() => {
    setTreatReturnState({
      ...treatReturnState,
      step7: {
        completedThreeHomework,
        totalHomeworkCount,
        homeworkAtHomeCount,
      },
    });
  }, [completedThreeHomework, totalHomeworkCount, homeworkAtHomeCount, treatReturnState]);

  const shouldDisableNext = () => !isCompleted({
    completedThreeHomework,
    totalHomeworkCount,
    homeworkAtHomeCount,
  });

  return (
    <main className="max-w-2xl mx-auto p-4">
      <div className="space-y-8">
        <ProgressBar currentStep={7} />
        <QuestionHeader>
          Over the past year, have you completed at least three homework assignments?
        </QuestionHeader>
        <Select
          value={completedThreeHomework}
          onChange={setCompletedThreeHomework}
          options={[
            { value: true, display: "Yes" },
            { value: false, display: "No" },
          ]}
        />

        {completedThreeHomework && (
          <div className="animate-fade-in">
            <QuestionHeader>
          How many homework assignments have you completed in total over the past year?
        </QuestionHeader>
        <NumberInput
          value={totalHomeworkCount}
          onChange={setTotalHomeworkCount}
          minValue={0}
          step={1}
          placeholderText="Enter total number of homework assignments"
        />

        <QuestionHeader>
          Of the homework assignments you've completed, how many of them were completed at your home (rather than at school, at a library, or somewhere else)?
        </QuestionHeader>
        <NumberInput
          value={homeworkAtHomeCount}
          onChange={setHomeworkAtHomeCount}
          minValue={0}
          step={1}
          placeholderText="Enter number completed at home"
        />
        </div>)}

        <StepPagination disabled={shouldDisableNext()} currentStep={7} />
      </div>
    </main>
  );
}
