import { useEffect, useState, type ChangeEvent } from "react";

interface useFormProps<T> {
  initialValue: T; // { email: "", password: "" }
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T>({ initialValue, validate }: useFormProps<T>) {
  const [values, setValues] = useState<T>(initialValue);

  const [touched, setTouched] = useState<Record<string, boolean>>();
  const [errors, setErrors] = useState<Record<string, string>>();

  const handleChange = (name: keyof T, text: string) => {
    setValues({
      ...values, // 불변성 유지(기존 값 유지)
      [name]: text,
    });
  };

  const handleBlur = (name: keyof T) => {
    setTouched({
      ...touched,
      [name]: true,
    });
  };

  const getInputProps = (name: keyof T) => {
    const value = values[name];
    const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      handleChange(name, e.target.value);

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  // values가 바뀔 때마다 에러 검증 함수 실행
  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors); // 오류 메시지 업데이트
  }, [validate, values]);

  return { values, errors, touched, getInputProps };
}

export default useForm;