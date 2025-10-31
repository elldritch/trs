import { useState } from "react";
import { Link } from "react-router";

export function ProgressBar({ currentStep, totalSteps = 15 }: { currentStep: number; totalSteps?: number }) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-gray-700">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-gray-700">
          {Math.round(percentage)}%
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-sky-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

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

export function NumberInput({
  value,
  onChange,
  minValue,
  maxValue,
  step,
  placeholderText,
}: {
  value: number | null;
  onChange: (value: number | null) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
  placeholderText?: string;
}) {
  return (
    <input
      type="number"
      className="w-full px-2 py-4 border block border-gray-300 rounded-md mt-2"
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
      min={minValue}
      max={maxValue}
      step={step}
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

export type PersonItem = {
  name: string;
  costume: string;
  willEatCandy: boolean | null;
  [key: string]: any;
};

export type ExtraField = {
  key: string;
  label: string;
  placeholder: string;
};

export function PersonList({
  items,
  onChange,
  personType,
  extraFields = [],
  headerText,
}: {
  items: PersonItem[];
  onChange: (items: PersonItem[]) => void;
  personType: string;
  extraFields?: ExtraField[];
  headerText?: string;
}) {
  const [newPerson, setNewPerson] = useState<Record<string, string>>({
    name: "",
    costume: "",
    ...Object.fromEntries(extraFields.map((f) => [f.key, ""])),
  });

  const addPerson = () => {
    const allFieldsFilled =
      newPerson.name.trim() &&
      newPerson.costume.trim() &&
      extraFields.every((f) => newPerson[f.key]?.trim());

    if (allFieldsFilled) {
      onChange([
        ...items,
        { ...newPerson, willEatCandy: false } as PersonItem,
      ]);
      setNewPerson({
        name: "",
        costume: "",
        ...Object.fromEntries(extraFields.map((f) => [f.key, ""])),
      });
    }
  };

  const removePerson = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateWillEatCandy = (index: number, willEat: boolean) => {
    onChange(
      items.map((item, i) =>
        i === index ? { ...item, willEatCandy: willEat } : item
      )
    );
  };

  const isAddButtonDisabled =
    !newPerson.name.trim() ||
    !newPerson.costume.trim() ||
    extraFields.some((f) => !newPerson[f.key]?.trim());

  return (
    <div className="animate-fade-in">
      <QuestionHeader>
        {headerText || `Please list each ${personType}'s first name and costume.`}
      </QuestionHeader>

      {items.length > 0 && (
        <div className="flex flex-col gap-2 py-2">
          {items.map((person, index) => (
            <div
              key={index}
              className="rounded-md w-full py-4 px-4 border border-gray-400 bg-sky-50"
            >
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="font-light text-lg">
                    {person.name} ({person.costume})
                  </p>
                  {extraFields.map((field) => (
                    <p key={field.key} className="text-sm text-gray-600 font-light">
                      {field.label}: {person[field.key]}
                    </p>
                  ))}
                </div>
                <button
                  onClick={() => removePerson(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Remove
                </button>
              </div>
              <div>
                <p className="text-sm font-light text-gray-700 mb-2">
                  Will {person.name} be eating any of your candy this year?
                </p>
                <Select
                  value={person.willEatCandy ?? false}
                  onChange={(value) => updateWillEatCandy(index, value)}
                  options={[
                    { value: true, display: "Yes" },
                    { value: false, display: "No" },
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4">
        <p className="text-md font-light text-gray-700 mb-2">
          Add a {personType}:
        </p>
        <TextInput
          value={newPerson.name}
          onChange={(value) => setNewPerson({ ...newPerson, name: value })}
          placeholderText={`${personType}'s first name`}
        />
        <TextInput
          value={newPerson.costume}
          onChange={(value) => setNewPerson({ ...newPerson, costume: value })}
          placeholderText={`${personType}'s costume`}
        />
        {extraFields.map((field) => (
          <TextInput
            key={field.key}
            value={newPerson[field.key] || ""}
            onChange={(value) =>
              setNewPerson({ ...newPerson, [field.key]: value })
            }
            placeholderText={field.placeholder}
          />
        ))}
        <button
          onClick={addPerson}
          disabled={isAddButtonDisabled}
          className={
            "block text-center mt-4 rounded-md font-medium text-white w-full py-2 " +
            (isAddButtonDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-sky-700 cursor-pointer hover:bg-sky-800")
          }
        >
          Save {personType}
        </button>
      </div>
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
       <Link
        to={`/file/step/${currentStep - 1}`}
        className={
          "block text-center mt-4 rounded-md font-medium text-white w-full py-2 bg-sky-700 cursor-pointer"
        }
      >
        Previous
      </Link>
    </div>
  );
}
