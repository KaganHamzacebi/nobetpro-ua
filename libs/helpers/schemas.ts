import { z } from 'zod';

export const UuidSchema = z.string().uuid();
