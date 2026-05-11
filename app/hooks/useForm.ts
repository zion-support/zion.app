import React, { useCallback, useState } from 'react';

export interface FormState<T = Record<string, unknown>> {
  data: T;
  isSubmitting: boolean;
  submitStatus: 'idle' | 'success' | 'error';
  _errors: Record<string, string>;
}

export interface UseFormOptions<T = Record<string, unknown>> {
  initialData?: T;
  validate?: (data: T) => Record<string, string>;
  onSubmit?: (data: T) => Promise<void> | void;
}

export const _useForm = <T = Record<string, unknown>>(options: UseFormOptions<T> = {}) => {
  const { initialData = {} as T, validate, onSubmit } = options;
  const [formState, setFormState] = useState<FormState<T>>({
    data: initialData,
    isSubmitting: false,
    submitStatus: 'idle',
    _errors: {}
  });

  const _setFieldValue = useCallback((field: keyof T, value: T[keyof T]) => {
    setFormState(prev => ({
      ...prev,
      data: { ...prev.data, [field]: value },
      _errors: { ...prev._errors, [field as string]: '' }
    }));
  }, []);

  const _setFieldError = useCallback((field: keyof T, error: string) => {
    setFormState(prev => ({
      ...prev,
      _errors: { ...prev._errors, [field as string]: error }
    }));
  }, []);

  const _validateForm = useCallback(() => {
    if (!validate) return true;
    
    const _errors = validate(formState.data);
    setFormState(prev => ({ ...prev, _errors }));
    
    return Object.keys(_errors).length === 0;
  }, [validate, formState.data]);

  const _handleSubmit = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (!_validateForm()) return;
    
    setFormState(prev => ({ ...prev, isSubmitting: true, submitStatus: 'idle' }));
    
    try {
      if (onSubmit) {
        await onSubmit(formState.data);
      }
      setFormState(prev => ({ ...prev, isSubmitting: false, submitStatus: 'success' }));
    } catch {
      setFormState(prev => ({ 
        ...prev, 
        isSubmitting: false, 
        submitStatus: 'error',
        _errors: { ...prev._errors, submit: 'An error occurred while submitting the form' }
      }));
    }
  }, [_validateForm, onSubmit, formState.data]);

  const _resetForm = useCallback(() => {
    setFormState({
      data: initialData,
      isSubmitting: false,
      submitStatus: 'idle',
      _errors: {}
    });
  }, [initialData]);

  const _clearErrors = useCallback(() => {
    setFormState(prev => ({ ...prev, _errors: {} }));
  }, []);

  return {
    formState,
    _setFieldValue,
    _setFieldError,
    _validateForm,
    _handleSubmit,
    _resetForm,
    _clearErrors
  };
};