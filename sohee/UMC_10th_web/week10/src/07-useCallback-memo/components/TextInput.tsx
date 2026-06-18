import { memo } from 'react';

type TextInputProps = {
  text: string;
  onChange: (text: string) => void;
};

function TextInput({ text, onChange }: TextInputProps) {
  console.log('TextInput rendering');

  return (
    <input
      value={text}
      onChange={(event) => onChange(event.target.value)}
    />
  );
}

export default memo(TextInput);
