import { memo } from "react";

interface InputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
}

const Input = memo(({ value, onChange, placeholder, label }: InputProps) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
          🎬 {label}
        </label>
      )}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-600 rounded-lg
                   text-white placeholder-gray-500 text-sm
                   focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500
                   transition-colors"
      />
    </div>
  );
});

Input.displayName = "Input";
export default Input;
