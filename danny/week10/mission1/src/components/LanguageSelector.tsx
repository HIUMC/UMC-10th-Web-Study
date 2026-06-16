import { memo } from "react";
import SelectBox from "./SelectBox";
import { LANGUAGE_OPTIONS, type LanguageValue } from "../constants/movie";

interface LanguageSelectorProps {
  value: LanguageValue;
  onChange: (value: LanguageValue) => void;
}

const LanguageSelector = memo(({ value, onChange }: LanguageSelectorProps) => {
  return (
    <SelectBox
      label="언어"
      value={value}
      options={[...LANGUAGE_OPTIONS]}
      onChange={(val) => onChange(val as LanguageValue)}
    />
  );
});

LanguageSelector.displayName = "LanguageSelector";
export default LanguageSelector;
