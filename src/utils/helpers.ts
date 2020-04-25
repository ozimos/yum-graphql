import { sign } from 'jsonwebtoken';
import { TOKEN_PASSWORD, tokens } from './constants';

export const handleError = (error) => {
    // add any other logging mechanism here e.g. Sentry
    return error;
};
interface CreateTokenInput {
    id: string;
    role: string;
}
export const generateAccessToken = ({ id: userId, role }: CreateTokenInput) => {
    const accessToken = sign(
        {
            userId,
            role,
            type: tokens.access.name,
            timestamp: Date.now(),
        },
        TOKEN_PASSWORD,
        {
            expiresIn: tokens.access.expiry,
        },
    );
    return accessToken;
};
