import './FormCheckbox.css';

interface FormCheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: (checked: boolean) => void;
}

export function FormCheckbox({
  id,
  label,
  checked,
  disabled = false,
  onChange,
}: FormCheckboxProps) {
  return (
    <label className="form-checkbox" htmlFor={id}>
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
      />

      <span>{label}</span>
    </label>
  );
}
