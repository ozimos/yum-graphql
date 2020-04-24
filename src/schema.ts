import { nexusPrismaPlugin } from 'nexus-prisma';
import { intArg, makeSchema, mutationType, objectType, queryType, stringArg } from '@nexus/schema';
import * as path from 'path';

const User = objectType({
    name: 'User',
    definition(t) {
        t.model.id();
        t.model.firstName();
        t.model.password();
        t.model.email();
        t.model.addresses({
            pagination: false,
        });
    },
});

const Meal = objectType({
    name: 'Meal',
    definition(t) {
        t.model.id();
        t.model.title();
        t.model.description();
        t.model.price();
        t.model.caterer();
    },
});

const Address = objectType({
    name: 'Address',
    definition(t) {
        t.model.id();
        t.model.lga();
        t.model.state();
        t.model.areaCode();
    },
});

const Query = queryType({
    definition(t) {
        t.crud.user();
        t.crud.users({ ordering: true });
        t.crud.meal({
            alias: 'meal',
        });
        t.crud.meals({ filtering: true });

        t.list.field('filterMeals', {
            type: 'Meal',
            args: {
                searchString: stringArg({ nullable: true }),
            },
            resolve: (_, { searchString }, ctx) => {
                return ctx.prisma.meal.findMany({
                    where: { title: { contains: searchString } },
                });
            },
        });
    },
});

const Mutation = mutationType({
    definition(t) {
        t.crud.createOneUser({ alias: 'signupUser' });

        t.crud.createOneMeal();
        t.crud.deleteOneUser();
        t.crud.deleteOneMeal();

        t.field('createDraft', {
            type: 'Meal',
            args: {
                title: stringArg({ nullable: false }),
                description: stringArg({ nullable: false }),
                imageUrl: stringArg({ nullable: false }),
                price: intArg({ nullable: false }),
                authorEmail: stringArg({ nullable: false }),
            },
            resolve: (_, { authorEmail, ...rest }, ctx) => {
                return ctx.prisma.meal.create({
                    data: {
                        ...rest,
                        caterer: {
                            connect: { email: authorEmail },
                        },
                    },
                });
            },
        });
    },
});

const schema = makeSchema({
    types: [Query, Mutation, Meal, User, Address],
    plugins: [nexusPrismaPlugin()],
    outputs: {
        typegen: path.join(__dirname, '../node_modules/@types/nexus-typegen/index.d.ts'),
    },
    typegenAutoConfig: {
        contextType: '{ prisma: PrismaClient.PrismaClient }',
        sources: [{ source: '@prisma/client', alias: 'PrismaClient' }],
    },
});

export default schema;
