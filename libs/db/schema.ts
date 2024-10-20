import { date, jsonb, pgTable, smallint, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { IAssistant } from '../models/IAssistant';
import { ISection } from '../models/ISection';

export const assistantsTable = pgTable('assistants', {
  id: uuid('id').primaryKey().defaultRandom().unique(),
  user_id: uuid('user_id').notNull(),
  assistant_name: text('assistant_name').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull()
});

export type InsertAssistant = typeof assistantsTable.$inferInsert;
export type SelectAssistant = typeof assistantsTable.$inferSelect;

export const dutiesTable = pgTable('duties', {
  id: uuid('id').primaryKey().defaultRandom().unique(),
  date: date('date', { mode: 'date' }).notNull(),
  rest_day_count: smallint('rest_day_count').notNull().default(0),
  assistant_data: jsonb('assistant_data').$type<IAssistant[]>().notNull(),
  section_data: jsonb('section_data').$type<ISection[]>().notNull()
});

export type InsertDuty = typeof dutiesTable.$inferInsert;
export type SelectDuty = typeof assistantsTable.$inferSelect;
