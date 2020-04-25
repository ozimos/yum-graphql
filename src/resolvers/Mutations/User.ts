import { mutationField, stringArg } from '@nexus/schema';
import { compare, hash } from 'bcrypt';
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

export const login = mutationField('login', {
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
