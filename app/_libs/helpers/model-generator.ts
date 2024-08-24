import { GenerateUUID } from '@/libs/helpers/id-generator';
import { IAssistant } from '@/models/IAssistant';
import { ISection } from "@/models/ISection";
import { getRandomColor } from "@/libs/helpers/color-generator";

export const newAssistant = (name?: string): IAssistant => {
  return {
    id: GenerateUUID(),
    name: name ?? 'New Assistant',
    selectedDays: [],
    disabledDays: [],
    sectionConfig: []
  };
};

export const newSection = (sectionName?: string): ISection => {
  return {
    id: GenerateUUID(),
    name: sectionName ?? "New Section",
    color: getRandomColor()
  }
}