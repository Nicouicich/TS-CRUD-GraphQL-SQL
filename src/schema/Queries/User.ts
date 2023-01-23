import {GraphQLList, GraphQLID, GraphQLBoolean, GraphQLString} from 'graphql';
import {Users} from '../../Entities/Users';
import {UserType} from '../typeDefs/Users';

export class UserQuery {
    
    static GET_ALL_USERS = {
        type: new GraphQLList(UserType),
        async resolve() {
            try {
                return await Users.find();
            } catch (e) {
                return e;
            }
        }
    };

    static GET_USER = {
        type: UserType,
        args: {
            id: {type: GraphQLID}
        },
        async resolve(_: any, args: any) {
            try {
                return await Users.findOneBy({id: args.id});
            } catch (e) {
                return e;
            }
        }
    };

}

