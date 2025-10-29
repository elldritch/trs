import MultipleChoice from "app/components/multiple-choice";
import { useAppState } from "~/contexts/ApplicationStateContext";
import type { QuestionAnswer } from "~/lib/types";
import { getCurrentQuestionAnswers } from "~/lib/state.client";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";

export default function Step1() {
  // The below code will be used in every step, probably there is a
  // nicer way to decompose this
  const { state, setReadyToSubmit } = useAppState();
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  useEffect(() => {
    setAnswers(getCurrentQuestionAnswers(state));
  }, [state]);
  const answerMap = useMemo(() => 
    new Map(answers.map(a => [a.questionId, a])), 
    [answers]
  );

  return <div>
    <MultipleChoice
    question={{ id: "q1", text: "What is your favorite color?"}}
    options={["Red", "Blue", "Green"]}
    answer={answerMap.get("q1")?.answer ?? ""}
    />
    <MultipleChoice
    question={{ id: "q3", text: "What is your favorite animal?"}}
    options={["Dog", "Cat", "Bird"]}
    answer={answerMap.get("q3")?.answer ?? ""}
    />

    <div className="mt-6 flex gap-4">
      {state.state === "in_progress" && state.readyToSubmit && (
        <Link to="/application/finish">
          <button className="rounded-md bg-stone-500 font-medium text-white px-6 py-2">
            Return to Review
          </button>
        </Link>
      )}
      <Link to="/application/finish" onClick={() => setReadyToSubmit(true)}>
        <button className="rounded-md bg-sky-700 font-medium text-white px-6 py-2">
          Continue to Review
        </button>
      </Link>
    </div>
  </div>;
}
