import { rule } from 'graphql-shield';
import { getTokenPayload } from '../utils/constants';
import { Context } from '../context';

export default {
    isAuthenticatedUser: rule({ cache: 'contextual' })((_parent, _args, ctx: Context) => {
        try {
            const tokenPayload = getTokenPayload(ctx);
            return Boolean(tokenPayload);
        } catch (e) {
            return e;
        }
    }),
    isMealOwner: rule({ cache: 'contextual' })(async (_parent, { id }, ctx: Context) => {
        try {
            const tokenPayload = getTokenPayload(ctx);
            const meal = await ctx.prisma.meal.findOne({
                where: {
                    id,
                },
                select: { caterer: { select: { id: true } } },
            });
            return tokenPayload.userId === meal.caterer.id;
        } catch (e) {
            return e;
        }
    }),
};
