import { newSection } from '@/libs/helpers/model-generator';
import { DefaultSection, DutySection } from '@prisma/client';
import { useCallback, useState } from 'react';

export const useSectionList = (defaultList: DutySection[]) => {
  const [sectionList, setSectionList] = useState<DutySection[]>(defaultList);

  const addSection = useCallback(() => {
    setSectionList(prevState => [
      ...prevState,
      newSection({ name: `New Section - ${prevState.length + 1}` })
    ]);
  }, []);

  const removeSection = useCallback((sectionId: DefaultSection['id']) => {
    setSectionList(prevState => prevState.filter(i => i.id !== sectionId));
  }, []);

  const setSectionProps = useCallback(
    (sectionId: DutySection['id'], props: Partial<DutySection>) => {
      setSectionList(prevState =>
        prevState.map(section => (section.id === sectionId ? { ...section, ...props } : section))
      );
    },
    []
  );

  return {
    sectionList,
    setSectionList,
    addSection,
    removeSection,
    setSectionProps
  };
};
