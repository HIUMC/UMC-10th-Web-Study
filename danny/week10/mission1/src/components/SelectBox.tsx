import { memo } from "react";

interface Option {
  value: string;
  label: string;
}

interface SelectBoxProps {
  value: string;
  options: Option[];
  onChange: (value: string) => void;
  label?: string;
}

const SelectBox = memo(
  ({ value, options, onChange, label }: SelectBoxProps) => {
    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            🌐 {label}
          </label>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg
                   text-white text-sm cursor-pointer
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                   transition-colors"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  },
);

SelectBox.displayName = "SelectBox";
export default SelectBox;
