import { AuthenticationError, UserInputError } from 'apollo-server-express';

export default {
    notAuthenticated: new AuthenticationError('Unauthenticated user!'),
    invalidToken: new AuthenticationError('Invalid Token!'),
    invalidUser: new UserInputError('Invalid email or password'),
    invalidUserEmail: new UserInputError('The email has already been taken'),
};
