import { Context } from '../context';
import errors from './errors';
import { handleError } from './helpers';

export const { TOKEN_PASSWORD, TOKEN_EXPIRY } = process.env;
export const tokens = {
    access: {
        name: 'ACCESS_TOKEN',
        expiry: TOKEN_EXPIRY || '1d',
    },
};

export function getTokenPayload(context: Context) {
    const { tokenPayload, tokenError } = context;

    if (tokenPayload?.userId && tokenPayload?.type !== tokens.access.name) {
        return tokenPayload;
    }
    const error = tokenError ? errors.invalidToken : errors.notAuthenticated;
    handleError(error);
}
