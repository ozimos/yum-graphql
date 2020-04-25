import { verify } from 'jsonwebtoken';

export function extractTokenPayload(req) {
    const result = {};
    const bearerHeader = req.get('Authorization');
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ').pop();
        verify(token, process.env.TOKEN_PASSWORD, (err, tokenPayload) => {
            if (err) {
                result.tokenError = err;
            }
            result.tokenPayload = tokenPayload;
        });
    }
    return result;
}
export function extractTokenPayloadMiddleware(req, res, next) {
    const { tokenPayload, tokenError } = extractTokenPayload(req);
    if (tokenPayload) {
        req.tokenPayload = tokenPayload;
    } else if (tokenError) {
        req.tokenError = tokenError;
    }
    return next();
}
export function isUser(req, res, next) {
    if (req.decoded && !req.tokenError) {
        return next();
    }
    const message = req.tokenError
        ? req.tokenError.message
        : 'You Are not Authorized to access this page!';

    return res.status(403).json({
        message,
    });
}

export function isAdmin(req, res, next) {
    if (req.decoded && req.decoded.isCaterer) {
        return next();
    }
    return res.status(403).json({
        message: 'You Are not Authorized to access this page!',
    });
}
