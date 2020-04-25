import { shield } from 'graphql-shield';
import rules from './rules';

export default shield(
    {
        Query: {
            me: rules.isAuthenticatedUser,
            filterMeals: rules.isAuthenticatedUser,
            meal: rules.isAuthenticatedUser,
        },
        Mutation: {
            createMeal: rules.isAuthenticatedUser,
            deleteOneMeal: rules.isMealOwner,
        },
    },
    { allowExternalErrors: true, debug: true },
);
