import { useState, useCallback } from 'react';

interface UseFormProps<T extends Record<string, string>> {
  initialValues: T;
  validate: (values: T) => Partial<Record<keyof T, string>>;
}

const useForm = <T extends Record<string, string>>({
  initialValues,
  validate,
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setValues((prev) => {
        const next = { ...prev, [name]: value };
        setErrors(validate(next));
        return next;
      });
    },
    [validate]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name } = e.target;
      setTouched((prev) => ({ ...prev, [name]: true }));
      setErrors(validate(values));
    },
    [validate, values]
  );

  const handleSubmit = useCallback(
    (onSubmit: (values: T) => void) =>
      (e: React.FormEvent) => {
        e.preventDefault();
        const allTouched = Object.keys(values).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {} as Record<keyof T, boolean>
        );
        setTouched(allTouched);
        const validationErrors = validate(values);
        setErrors(validationErrors);
        if (Object.keys(validationErrors).length === 0) {
          onSubmit(values);
        }
      },
    [validate, values]
  );

  const isValid =
    Object.keys(errors).length === 0 &&
    Object.values(values).every((v) => v !== '');

  return { values, errors, touched, handleChange, handleBlur, handleSubmit, isValid };
};

export default useForm;