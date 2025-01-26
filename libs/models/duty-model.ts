import { UuidSchema } from '@/libs/helpers/schemas';
import { z } from 'zod';

export const DefaultAssistantSchema = z.object({
  id: UuidSchema.optional(),
  userId: UuidSchema.optional(),
  name: z.string(),
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional()
});

export type IDefaultAssistant = z.infer<typeof DefaultAssistantSchema>;

export const DefaultSectionSchema = z.object({
  id: UuidSchema.optional(),
  userId: UuidSchema.optional(),
  name: z.string(),
  defaultValue: z.number().min(0),
  color: z.string(),
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional()
});

export type IDefaultSection = z.infer<typeof DefaultSectionSchema>;

export const MonthConfigSchema = z.object({
  datesInMonth: z.number(),
  weekendIndexes: z.number().array()
});

export type IMonthConfig = z.infer<typeof MonthConfigSchema>;

export const DutyAssistantSchema = z.object({
  id: UuidSchema,
  dutyId: UuidSchema.optional(),
  name: z.string(),
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional()
});

export type IDutyAssistant = z.infer<typeof DutyAssistantSchema>;

export const DutySectionSchema = z.object({
  id: UuidSchema,
  dutyId: UuidSchema.optional(),
  name: z.string(),
  color: z.string(),
  defaultValue: z.number().min(0).optional(),
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional()
});

export type IDutySection = z.infer<typeof DutySectionSchema>;

export const SelectedDaySchema = z.object({
  dutyId: UuidSchema.optional(),
  dayIndex: z.number(),
  assistantId: UuidSchema,
  sectionId: UuidSchema,
  section: DutySectionSchema.optional()
});

export const SelectedDayCreateSchema = SelectedDaySchema.pick({
  dayIndex: true,
  assistantId: true,
  sectionId: true
});

export type SelectedDayCreate = z.infer<typeof SelectedDayCreateSchema>;

export type ISelectedDay = z.infer<typeof SelectedDaySchema>;

export const UnwantedDaySchema = z.object({
  dutyId: UuidSchema.optional(),
  dayIndex: z.number().min(0),
  assistantId: z.string()
});

export type IUnwantedDay = z.infer<typeof UnwantedDaySchema>;

export const AssistantSectionConfigSchema = z.object({
  dutyId: UuidSchema.optional(),
  assistantId: UuidSchema,
  sectionId: UuidSchema,
  totalLimit: z.number(),
  section: DutySectionSchema.optional(),
  assistant: DutyAssistantSchema.optional()
});

export type IAssistantSectionConfig = z.infer<typeof AssistantSectionConfigSchema>;

export const DisabledDaysSchema = z.record(z.number().array());

export type IDisabledDays = z.infer<typeof DisabledDaysSchema>;

export const DutySchema = z.object({
  id: UuidSchema,
  userId: UuidSchema.optional(),
  restDayCount: z.number().min(0),
  description: z.string().optional(),
  pinned: z.boolean().default(false),
  dutyMonth: z.coerce.date(),
  assistantList: DutyAssistantSchema.array(),
  assistantSectionConfig: AssistantSectionConfigSchema.array(),
  sectionList: DutySectionSchema.array(),
  selectedDays: SelectedDaySchema.array(),
  unwantedDays: UnwantedDaySchema.array(),
  updatedAt: z.coerce.date().optional(),
  createdAt: z.coerce.date().optional()
});

export interface IDuty extends z.infer<typeof DutySchema> {
  disabledDays: IDisabledDays;
  monthConfig: IMonthConfig;
}
