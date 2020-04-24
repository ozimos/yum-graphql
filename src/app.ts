import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import authRouter from './routes/authRouter';
import validationErrors from './middleware/validationErrors';

import schema from './schema';
import { createContext } from './context';

const app = express();
app.use('/api/v1/auth', authRouter);

app.use(validationErrors);
// Get port from environment and store in Express.
const PORT = parseInt(process.env.PORT, 10) || 4000;
app.set('port', PORT);

const server = new ApolloServer({ schema, context: createContext })
server.applyMiddleware({ app });
app.listen({ port: PORT }, () =>
    /* eslint no-console: off */
    console.log(
        `🚀 Server ready at: http://localhost:${PORT}${server.graphqlPath}\n
        ⭐️ See sample queries: http://pris.ly/e/ts/graphql-apollo-server#using-the-graphql-api`,
    ),
);
