import { createCallerFactory, createTRPCRouter } from '~/lib/trpc/server/utils';
import * as procedures from '~/procedures';

export type AppRouter = typeof appRouter;
export const appRouter = createTRPCRouter(procedures);
export const createCaller = createCallerFactory(appRouter);
