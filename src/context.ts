import { PrismaClient } from '@prisma/client';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { JsonWebTokenError } from 'jsonwebtoken';
import { extractTokenPayload } from './middleware/authenticate';

const prisma = new PrismaClient();

export interface TokenPayload {
    userId: string;
    role: string;
    type: string;
    timestamp: number;
}
export interface TokenStatus {
    tokenPayload?: TokenPayload;
    tokenError?: JsonWebTokenError;
}
export interface IntegrationContext {
    req: ExpressContext['req'];
    res: ExpressContext['res'];
}
export interface Context extends TokenStatus {
    prisma: PrismaClient;
}

export const createContext = (integrationContext: IntegrationContext): Context => ({
    prisma,
    ...extractTokenPayload(integrationContext.req),
});
