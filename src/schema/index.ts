import {GREETING} from './Queries/Greeting';
import {UserQuery} from './Queries/User';
import {GraphQLSchema, GraphQLObjectType} from 'graphql';
import {UserMutations} from './Mutations/User';


const RootQuery = new GraphQLObjectType({
    name: 'RootQuery',
    fields: {
        greeting: GREETING,
        getAllUsers: UserQuery.GET_ALL_USERS,
        getUser: UserQuery.GET_USER
    }
});

const Mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: UserMutations.CREATE_USER,
        deleteUser: UserMutations.DELETE_USER,
        updateUser: UserMutations.UPDATE_USER
    }
});

export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
