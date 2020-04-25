import { queryField, stringArg, queryType } from '@nexus/schema';
import { compare } from 'bcrypt';
import { getTokenPayload } from '../../utils/constants';
import { generateAccessToken, handleError } from '../../utils/helpers';
import errors from '../../utils/errors';

export const me = queryField('me', {
    type: 'User',
    resolve(_parent, _args, ctx) {
        const { userId } = getTokenPayload(ctx);
        return ctx.prisma.user.findOne({
            where: {
                id: userId,
            },
        });
    },
});

export const login = queryField('login', {
    type: 'AuthPayload',
    args: {
        email: stringArg({ required: true }),
        password: stringArg({ required: true }),
    },
    resolve: async (_parent, { email, password: inputPassword }, ctx) => {
        let user = null;
        try {
            user = await ctx.prisma.user.findOne({
                where: {
                    email,
                },
            });
        } catch (e) {
            handleError(errors.invalidUser);
        }

        if (!user) handleError(errors.invalidUser);
        const { password, ...confirmedUser } = user;
        const passwordValid = await compare(inputPassword, password);
        if (!passwordValid) handleError(errors.invalidUser);

        const accessToken = generateAccessToken(confirmedUser);
        return {
            accessToken,
            user: confirmedUser,
        };
    },
});

export const Query = queryType({
    definition(t) {
        t.crud.meals({ filtering: true });
        t.crud.meal({
            alias: 'meal',
        });
        t.list.field('filterMeals', {
            type: 'Meal',
            args: {
                searchString: stringArg(),
            },
            resolve(_, { searchString }, ctx) {
                return ctx.prisma.meal.findMany({
                    where: { title: { contains: searchString } },
                });
            },
        });
    },
});
