import { objectType } from '@nexus/schema';

export const User = objectType({
    name: 'User',
    definition(t) {
        t.model.createdAt();
        t.model.id();
        t.model.firstName();
        t.model.lastName();
        t.model.email();
        t.model.addresses({
            pagination: { first: true },
        });
    },
});

export const Address = objectType({
    name: 'Address',
    definition(t) {
        t.model.id();
        t.model.lga();
        t.model.state();
        t.model.areaCode();
    },
});

export const Meal = objectType({
    name: 'Meal',
    definition(t) {
        t.model.id();
        t.model.title();
        t.model.description();
        t.model.price();
        t.model.caterer();
    },
});

export const AuthPayload = objectType({
    name: 'AuthPayload',
    definition(t) {
        t.string('accessToken');
        t.field('user', { type: 'User' });
    },
});
