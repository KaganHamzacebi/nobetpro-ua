export const getDisabledDays = (selectedDayIndexes: number[], range: number, min = 0, max = 30) => {
  const disabledDays = new Set<number>();

  for (const selectedDayIndex of Array.from(selectedDayIndexes)) {
    for (let i = selectedDayIndex - range; i <= selectedDayIndex + range; i++) {
      if (i !== selectedDayIndex && i >= min && i <= max) {
        disabledDays.add(i);
      }
    }
  }

  return Array.from(disabledDays);
};
