import { useMemo, useState } from 'react';

type ValidationRule = {
  required?: string;
  pattern?: {
    value: RegExp;
    message: string;
  };
  minLength?: {
    value: number;
    message: string;
  };
};

type ValidationRules<T> = {
  [K in keyof T]?: ValidationRule;
};

type ErrorMessages<T> = {
  [K in keyof T]?: string;
};

const useForm = <T extends  { [K in keyof T]: string }>(
  initialValues: T,
  validationRules: ValidationRules<T>
) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ErrorMessages<T>>({});

  const validateField = (name: keyof T, value: string) => {
    const rules = validationRules[name];
    if (!rules) return '';

    if (rules.required && !value.trim()) {
      return rules.required;
    }

    if (rules.pattern && !rules.pattern.value.test(value)) {
      return rules.pattern.message;
    }

    if (rules.minLength && value.length < rules.minLength.value) {
      return rules.minLength.message;
    }

    return '';
  };

  const handleChange = (name: keyof T, value: string) => {
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    const errorMessage = validateField(name, value);

    setErrors((prev) => ({
      ...prev,
      [name]: errorMessage,
    }));
  };

  const validateAll = () => {
    const newErrors: ErrorMessages<T> = {};

    (Object.keys(values) as Array<keyof T>).forEach((key) => {
      newErrors[key] = validateField(key, values[key]);
    });

    setErrors(newErrors);

    return Object.values(newErrors).every((error) => !error);
  };

  const isValid = useMemo(() => {
    const hasEmptyValue = (Object.values(values) as string[]).some(
  (value) => !value.trim()
);

const hasError = (Object.values(errors) as Array<string | undefined>).some(
  (error) => !!error
);
    return !hasEmptyValue && !hasError;
  }, [values, errors]);

  return {
    values,
    errors,
    handleChange,
    validateAll,
    isValid,
  };
};

export default useForm;