import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";

interface Option {
  value: string;
  label: string;
}

type TextInputProps = {
  as?: "input";
  label: string;
  error?: string;
} & InputHTMLAttributes<HTMLInputElement>;

type SelectInputProps = {
  as: "select";
  label: string;
  error?: string;
  options: Option[];
} & SelectHTMLAttributes<HTMLSelectElement>;

type InputProps = TextInputProps | SelectInputProps;

const fieldClasses = (error?: string) =>
  `w-full rounded-md border bg-transparent px-3 py-2 text-sm text-[var(--text-h)] outline-none focus:border-[var(--accent)] ${
    error ? "border-[var(--status-danger)]" : "border-[var(--border)]"
  }`;

export function Input(props: InputProps) {
  if (props.as === "select") {
    const { label, error, options, as: _as, ...rest } = props;
    return (
      <div>
        <label className="mb-1 block text-sm text-[var(--text)]">{label}</label>
        <select {...rest} className={fieldClasses(error)}>
          <option value="" disabled>
            Select...
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-xs text-[var(--status-danger)]">{error}</p>}
      </div>
    );
  }

  const { label, error, as: _as, ...rest } = props;
  return (
    <div>
      <label className="mb-1 block text-sm text-[var(--text)]">{label}</label>
      <input {...rest} className={fieldClasses(error)} />
      {error && <p className="mt-1 text-xs text-[var(--status-danger)]">{error}</p>}
    </div>
  );
}
