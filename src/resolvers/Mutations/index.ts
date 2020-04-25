import { mutationField, stringArg, intArg, mutationType } from '@nexus/schema';
import { hash } from 'bcrypt';
import { generateAccessToken, handleError } from '../../utils/helpers';
import errors from '../../utils/errors';

export const signup = mutationField('signup', {
    type: 'AuthPayload',
    args: {
        firstName: stringArg({ nullable: true }),
        lastName: stringArg({ nullable: true }),
        email: stringArg({ required: true }),
        password: stringArg({ required: true }),
    },
    resolve: async (_parent, { firstName, lastName, email, password: newPassword }, ctx) => {
        const hashedPassword = await hash(newPassword, 10);
        let user, password;
        try {
            ({ password, ...user } = await ctx.prisma.user.create({
                data: {
                    firstName,
                    lastName,
                    email,
                    password: hashedPassword,
                },
            }));
        } catch (e) {
            handleError(errors.invalidUserEmail);
        }
        const accessToken = generateAccessToken(user);
        return {
            accessToken,
            user,
        };
    },
});

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
