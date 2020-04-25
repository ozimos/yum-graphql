import { nexusPrismaPlugin } from 'nexus-prisma';
import { intArg, makeSchema, mutationType, objectType, queryType, stringArg } from '@nexus/schema';
import { join } from 'path';

import { applyMiddleware } from 'graphql-middleware';
import permissions from './permissions';
import * as allTypes from './resolvers'

export const schema = makeSchema({
    types: [allTypes],
    plugins: [nexusPrismaPlugin()],
    outputs: {
        typegen: join(__dirname, '../node_modules/@types/nexus-typegen/index.d.ts'),
    },
    typegenAutoConfig: {
        contextType: '{ prisma: PrismaClient.PrismaClient }',
        sources: [{ source: '@prisma/client', alias: 'PrismaClient' }],
    },
});

export const schemaWithMiddleware = applyMiddleware(schema, permissions);
