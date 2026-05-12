import { useEffect, useMemo, useState } from "react";

interface UseFormProps<T> {
  initialValue: T;
  validate: (values: T) => Record<keyof T, string>;
}

function useForm<T extends Record<string, string>>({
  initialValue,
  validate,
}: UseFormProps<T>) {
  const [values, setValues] = useState<T>(initialValue);
  const [touched, setTouched] = useState<Record<keyof T, boolean>>(
    Object.keys(initialValue).reduce(
      (acc, key) => {
        acc[key as keyof T] = false;
        return acc;
      },
      {} as Record<keyof T, boolean>,
    ),
  );

  const [errors, setErrors] = useState<Record<keyof T, string>>(
    Object.keys(initialValue).reduce(
      (acc, key) => {
        acc[key as keyof T] = "";
        return acc;
      },
      {} as Record<keyof T, string>,
    ),
  );

  const handleChange = (name: keyof T, text: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: text,
    }));
  };

  const handleBlur = (name: keyof T) => {
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));
  };

  const setFieldValue = (name: keyof T, text: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: text,
    }));
  };

  const setFieldTouched = (name: keyof T, value = true) => {
    setTouched((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateField = (name: keyof T) => {
    const newErrors = validate(values);
    return newErrors[name];
  };

  const validateAll = () => {
    const newErrors = validate(values);
    setErrors(newErrors);

    const newTouched = Object.keys(values).reduce(
      (acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      },
      {} as Record<keyof T, boolean>,
    );
    setTouched(newTouched);

    return Object.values(newErrors).every((error) => error === "");
  };

  const getInputProps = (name: keyof T) => {
    const value = values[name];

    const onChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => handleChange(name, e.target.value);

    const onBlur = () => handleBlur(name);

    return { value, onChange, onBlur };
  };

  useEffect(() => {
    const newErrors = validate(values);
    setErrors(newErrors);
  }, [validate, values]);

  const isValid = useMemo(() => {
    return Object.values(errors).every((error) => error === "");
  }, [errors]);

  return {
    values,
    errors,
    touched,
    isValid,
    handleChange,
    handleBlur,
    setFieldValue,
    setFieldTouched,
    validateField,
    validateAll,
    getInputProps,
    setValues,
    setErrors,
    setTouched,
  };
}

export default useForm;