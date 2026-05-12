import { useMemo, useState } from 'react';
import type { ChangeEvent, FocusEvent, FormEvent } from 'react';

type Validator<TValues, TField extends keyof TValues> = (
  value: TValues[TField],
  values: TValues,
) => string;

type Validators<TValues extends Record<string, string>> = Partial<{
  [K in keyof TValues]: Validator<TValues, K>;
}>;

type UseFormOptions<TValues extends Record<string, string>> = {
  initialValues: TValues;
  validators?: Validators<TValues>;
  onSubmit: (values: TValues) => Promise<void> | void;
};

type RegisterOptions<TValues extends Record<string, string>> = {
  name: keyof TValues;
};

const getFieldErrors = <TValues extends Record<string, string>>(
  values: TValues,
  validators: Validators<TValues>,
) => {
  const nextErrors = {} as Partial<Record<keyof TValues, string>>;

  (Object.keys(values) as Array<keyof TValues>).forEach((fieldName) => {
    const validator = validators[fieldName];
    if (!validator) return;

    const errorMessage = validator(values[fieldName], values);
    if (errorMessage) {
      nextErrors[fieldName] = errorMessage;
    }
  });

  return nextErrors;
};

export const useForm = <TValues extends Record<string, string>>({
  initialValues,
  validators = {},
  onSubmit,
}: UseFormOptions<TValues>) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof TValues, string>>>(
    {},
  );
  const [touched, setTouched] = useState<
    Partial<Record<keyof TValues, boolean>>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formErrors = useMemo(
    () => getFieldErrors(values, validators),
    [validators, values],
  );

  const isValid =
    Object.keys(formErrors).length === 0 &&
    (Object.values(values) as string[]).every((value) => value.trim() !== '');

  const validateField = (fieldName: keyof TValues, nextValues: TValues) => {
    const validator = validators[fieldName];

    setErrors((prev) => {
      const nextErrors = { ...prev };

      if (!validator) {
        delete nextErrors[fieldName];
        return nextErrors;
      }

      const errorMessage = validator(nextValues[fieldName], nextValues);

      if (errorMessage) {
        nextErrors[fieldName] = errorMessage;
      } else {
        delete nextErrors[fieldName];
      }

      return nextErrors;
    });
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    const fieldName = name as keyof TValues;

    setValues((prev) => {
      const nextValues = { ...prev, [fieldName]: value };

      if (touched[fieldName]) {
        validateField(fieldName, nextValues);
      }

      return nextValues;
    });
  };

  const handleBlur = (
    event: FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const fieldName = event.target.name as keyof TValues;

    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, values);
  };

  const register = ({ name }: RegisterOptions<TValues>) => ({
    name: String(name),
    value: values[name],
    onChange: handleChange,
    onBlur: handleBlur,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {} as Partial<Record<keyof TValues, boolean>>,
    );
    const nextErrors = getFieldErrors(values, validators);

    setTouched(nextTouched);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit(values);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    values,
    errors,
    touched,
    isValid,
    isSubmitting,
    register,
    handleSubmit,
  };
};
