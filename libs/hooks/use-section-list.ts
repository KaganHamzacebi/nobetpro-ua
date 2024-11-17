import { newSection } from '@/libs/helpers/model-generator';
import { ISection } from '@/libs/models/ISection';
import { useCallback, useState } from 'react';

export const useSectionList = (defaultList: ISection[]) => {
  const [sectionList, setSectionList] = useState(defaultList);

  const addSection = useCallback(() => {
    setSectionList(prevState => [
      ...prevState,
      newSection(`New Section - ${prevState.length + 1}`)
    ]);
  }, []);

  const removeSection = useCallback((sectionId: ISection['id']) => {
    setSectionList(prevState => prevState.filter(i => i.id !== sectionId));
  }, []);

  const setSectionProps = useCallback((sectionId: ISection['id'], props: Partial<ISection>) => {
    setSectionList(prevState =>
      prevState.map(section => (section.id === sectionId ? { ...section, ...props } : section))
    );
  }, []);

  return {
    sectionList,
    setSectionList,
    addSection,
    removeSection,
    setSectionProps
  };
};
