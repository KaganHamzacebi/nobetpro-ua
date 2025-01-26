import { DefaultAssistantSchema, DefaultSectionSchema, DutySchema } from '@/libs/models/duty-model';
import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().optional(),
  emailVerified: z.date().optional(),
  image: z.string().optional(),
  password: z.string().optional(),

  defaultAssistants: DefaultAssistantSchema.array(),
  defaultSections: DefaultSectionSchema.array(),
  duties: DutySchema.array()
});

export type IUser = z.infer<typeof UserSchema>;
