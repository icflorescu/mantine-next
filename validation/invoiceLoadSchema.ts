import { z } from 'zod';
import { idSchema } from './idSchema';

export const invoiceLoadSchema = z.object({ id: idSchema });
