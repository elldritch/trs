import { Link } from "react-router";

export function QuestionHeader({ children }: { children: React.ReactNode }) {
  return <h1 className="text-2xl font-light text-gray-900">{children}</h1>;
}

export function HelpButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline text-xl ml-2 align-top h-8 w-8 rounded-full border border-gray-300 bg-white text-gray-600 hover:bg-gray-100"
    >
      ?
    </button>
  );
}

export function HelpText({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-yellow-50 p-4 mb-4 mt-2 rounded border border-yellow-200">
      <h4 className="font-bold mb-2">{title}</h4>
      <p className="text-sm">{children}</p>
    </div>
  );
}

export function TextInput({
  value,
  onChange,
  placeholderText,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholderText?: string;
}) {
  return (
    <input
      type="text"
      className="w-full px-2 py-4 border block border-gray-300 rounded-md mt-2"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholderText}
    />
  );
}

export function Select<T>({
  value,
  onChange,
  options,
}: {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; display: React.ReactNode }[];
}) {
  return (
    <div className="flex gap-2 flex-col py-2">
      {options.map((option) => (
        <div
          onClick={() => onChange(option.value)}
          className={
            "rounded-md w-full py-4 text-center text-md font-light border border-gray-400" +
            (value === option.value ? " bg-sky-200" : "")
          }
        >
          {option.display}
        </div>
      ))}
    </div>
  );
}

export function StepPagination({
  disabled,
  currentStep,
}: {
  disabled: boolean;
  currentStep: number;
}) {
  return (
    <div>
      <Link
        to={`/file/step/${currentStep - 1}`}
        className={
          "block text-center mt-4 rounded-md font-medium text-white w-full py-2" +
          (disabled
            ? " bg-gray-300 cursor-not-allowed pointer-events-none"
            : " bg-sky-700 cursor-pointer")
        }
      >
        Previous
      </Link>
      <Link
        to={`/file/step/${currentStep + 1}`}
        className={
          "block text-center mt-4 rounded-md font-medium text-white w-full py-2" +
          (disabled
            ? " bg-gray-300 cursor-not-allowed pointer-events-none"
            : " bg-sky-700 cursor-pointer")
        }
      >
        Next
      </Link>
    </div>
  );
}
