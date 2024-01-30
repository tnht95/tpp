export const MinStr =
  (min: number) =>
  (input: { value: unknown }): string => {
    if (typeof input.value === 'string' && input.value.length > 0) return '';
    return `Min ${min} characters`;
  };
