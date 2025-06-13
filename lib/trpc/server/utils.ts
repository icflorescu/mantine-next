import { initTRPC, TRPCError } from '@trpc/server';
import superjson from 'superjson';
import { ZodError } from 'zod';
import { getSessionUserId } from '~/lib/auth';

export class ProcedureError extends TRPCError {
  constructor(message: string) {
    super({ code: 'BAD_REQUEST', message });
  }
}

export const createContext = async () => {
  return { userId: await getSessionUserId() };
};

const t = initTRPC.context<typeof createContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;
export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx: { userId }, next }) => {
  if (!userId) throw new TRPCError({ code: 'UNAUTHORIZED' });
  return next({ ctx: { userId } });
});
