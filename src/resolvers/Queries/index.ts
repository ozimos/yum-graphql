import { queryField, stringArg, queryType } from '@nexus/schema';
import { getTokenPayload } from '../../utils/constants';

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
