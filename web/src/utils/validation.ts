export const MinStr =
  (min: number, errMsg?: string) =>
  (input: { value: unknown }): string => {
    if (typeof input.value === 'string' && input.value.length > 0) return '';
    return errMsg ?? `Min ${min} characters`;
  };

export const MaxStr =
  (max: number, errMsg?: string) =>
  (input: { value: unknown }): string => {
    if (typeof input.value === 'string' && input.value.length <= max) return '';
    return errMsg ?? `Max ${max} characters`;
  };

export const fileRequired = (el: { value: unknown }): string => {
  const input = el as HTMLInputElement;
  if (input.files?.length !== 1) return 'File required';
  if (
    (input.files[0]?.size as number) < 1 ||
    (input.files[0]?.size as number) > 3584
  )
    return 'Invalid size';
  return '';
};

export const validateTags = ({ value }: { value: string }) => {
  if (value === '') return '';
  const tagsArr = value.split(',');
  if (tagsArr.length > 5) return 'The maximum total of tags is 5.';
  for (const tag of tagsArr) {
    if (tag.startsWith(' ') || tag.endsWith(' '))
      return 'Tags can not contain spaces';
    if (tag === '') return 'The minimun length of a tag is 1';
    if (tag.length > 20) return 'The maximum length of a tag is 20';
  }
  return '';
};
