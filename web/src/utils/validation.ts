export const MinStr =
  (min: number, errMsg?: string) =>
  (input: { value: unknown }): string => {
    if (typeof input.value === 'string' && input.value.length > 0) return '';
    return errMsg ?? `Min ${min} characters`;
  };
