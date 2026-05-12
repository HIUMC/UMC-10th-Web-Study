import { useState, useEffect } from 'react';

interface UseFormProps<T> {
    initialValues: T;
    validate: (values: T) => { [K in keyof T]?: string };
}

function useForm<T>({ initialValues, validate }: UseFormProps<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [touched, setTouched] = useState<{ [K in keyof T]?: boolean }>({});
    const [errors, setErrors] = useState<{ [K in keyof T]?: string }>({});

    useEffect(() => {
        const validationErrors = validate(values);
        setErrors(validationErrors);
    }, [values, validate]);

    const handleChange = (name: keyof T, value: string) => {
        setValues({ ...values, [name]: value });
    };

    const handleBlur = (name: keyof T) => {
        setTouched({ ...touched, [name]: true });
    };

    const isValid = Object.keys(errors).length === 0 && 
                    Object.values(values).every(val => String(val).trim() !== "");

    return { values, errors, touched, handleChange, handleBlur, isValid };
}

export default useForm;