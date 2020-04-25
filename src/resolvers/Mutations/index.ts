import { mutationField, stringArg, intArg, mutationType } from '@nexus/schema';

export const createMeal = mutationField('createMeal', {
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

export const Mutation = mutationType({
    definition(t) {
        t.crud.createOneMeal();
        t.crud.deleteOneUser();
        t.crud.deleteOneMeal();
    },
});

export * from './User';
