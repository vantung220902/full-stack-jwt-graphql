"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const User_1 = require("./entities/User");
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const apollo_server_express_1 = require("apollo-server-express");
const type_graphql_1 = require("type-graphql");
const apollo_server_core_1 = require("apollo-server-core");
const user_1 = require("./resolvers/user");
const greeting_1 = require("./resolvers/greeting");
const refreshTokenRouter_1 = __importDefault(require("./routes/refreshTokenRouter"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const main = async () => {
    await (0, typeorm_1.createConnection)({
        type: 'postgres',
        database: 'jwt-auth-tutorial',
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        logging: true,
        synchronize: true,
        entities: [User_1.User],
    });
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({ origin: 'http://localhost:3000', credentials: true }));
    app.use((0, cookie_parser_1.default)());
    app.use('/refresh_token', refreshTokenRouter_1.default);
    const httpServer = (0, http_1.createServer)(app);
    const apolloServer = new apollo_server_express_1.ApolloServer({
        schema: await (0, type_graphql_1.buildSchema)({
            validate: false,
            resolvers: [greeting_1.GreetingResolver, user_1.UserResolver]
        }),
        plugins: [
            (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
            apollo_server_core_1.ApolloServerPluginLandingPageGraphQLPlayground
        ],
        context: ({ req, res }) => ({
            req,
            res,
        })
    });
    await apolloServer.start();
    apolloServer.applyMiddleware({ app, cors: { origin: 'http://localhost:3000', credentials: true } });
    const PORT = process.env.PORT || 4000;
    await new Promise(resolve => httpServer.listen({ port: PORT }, resolve));
    console.log(`Server start on PORT ${PORT}.GRAPHQL ENDPOINT ON http://localhost:${PORT}${apolloServer.graphqlPath}`);
};
main().catch(err => console.error(`Error starting server error ${err.message}`));
//# sourceMappingURL=index.js.map