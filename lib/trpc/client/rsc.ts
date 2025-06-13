import 'server-only';

import { cache } from 'react';
import { createCaller } from '~/lib/trpc/server';
import { createContext } from '~/lib/trpc/server/utils';

export const trpcCaller = createCaller(cache(createContext));
