export const removeProtectedFields = (
  data: Record<string, unknown>,
  protectedFields: ReadonlyArray<string>
) => {
  for (const field of protectedFields) {
    delete data[field];
  }
};
