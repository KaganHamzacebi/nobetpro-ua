export const caseInsensitiveSorter = (rowA: any, rowB: any, columnId: any) => {
  const a = rowA.getValue(columnId).toLowerCase();
  const b = rowB.getValue(columnId).toLowerCase();
  return a.localeCompare(b);
};
