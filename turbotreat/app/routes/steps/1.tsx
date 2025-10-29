import MultipleChoice from "app/components/multiple-choice";
import { useAppState } from "~/contexts/ApplicationStateContext";
import type { ApplicationState, QuestionAnswer } from "~/lib/types";
import { getCurrentQuestionAnswers } from "~/lib/state.client";
import { useEffect, useMemo, useState } from "react";

export default function Step1() {
  // The below code will be used in every step, probably there is a
  // nicer way to decompose this
  const { state } = useAppState() as { state: ApplicationState };
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
  </div>;
}
