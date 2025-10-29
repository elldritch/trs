import { useAppState } from "~/contexts/ApplicationStateContext";
import type { Question } from "../lib/types";

export default function MultipleChoice({ question, options, answer }: { question: Question, options: string[], answer: string }) {
    const { setAnswer } = useAppState();

    const handleChange = (value: string) => {
        setAnswer(question.id, value);
    };

    return (<div>
        <form>
            <fieldset>
                <legend>{question.text}</legend>
                {options.map((option) => (
                    <label key={option}>
                        <input
                            type="radio"
                            name={question.id}
                            value={option}
                            onChange={(e) => handleChange(e.target.value)}
                            checked={answer === option}
                        />
                        {option}
                    </label>
                ))}
            </fieldset>
        </form>
    </div>);
}
