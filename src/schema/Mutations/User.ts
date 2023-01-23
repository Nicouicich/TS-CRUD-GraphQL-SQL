import {UserType} from './../typeDefs/Users';
import {GraphQLString, GraphQLBoolean, GraphQLID, GraphQLInputObjectType} from 'graphql';
import {MessageType} from '../typeDefs/Message';
import {Users} from '../../Entities/Users';
import {comparePassword, hashPassword} from '../../libs/bcrypt';
import bcrypt from 'bcryptjs';


export class UserMutations {

    static CREATE_USER = {
        type: UserType,
        args: {
            name: {type: GraphQLString},
            username: {type: GraphQLString},
            password: {type: GraphQLString}
        },
        async resolve(parent: any, args: any) {
            try {

                const {name, username, password} = args;
                const encryptPassword = await bcrypt.hash(password, 10);

                const result = await Users.insert({
                    name: name,
                    username: username,
                    password: encryptPassword
                });

                return {...args, id: result.identifiers[0].id, password: encryptPassword};

            } catch (e) {
                return e;
            }
        }
    };

    static UPDATE_USER = {
        type: MessageType,
        args: {
            id: {type: GraphQLID},
            input: {
                type: new GraphQLInputObjectType({
                    name: "UserInput",
                    fields: () => ({
                        name: {type: GraphQLString},
                        username: {type: GraphQLString},
                        oldPassword: {type: GraphQLString},
                        newPassword: {type: GraphQLString},
                    }),
                }),
            },
        },
        async resolve(_: any, {id, input}: any) {
            const userFound = await Users.findOneBy({id});
            if (!userFound) throw new Error("User not found");

            // Compare old password with the new password
            const isMatch = await comparePassword(
                userFound?.password as string,
                input.oldPassword
            );
            if (!isMatch) throw new Error("Passwords does not match");

            // Hashing the password and deleteting oldPassword and new Password
            const newPassword = await hashPassword(input.newPassword);
            delete input.oldPassword;
            delete input.newPassword;

            // Adding passsword to the input for update
            input.password = newPassword;

            const response = await Users.update({id}, input);

            if (response.affected === 0) return {message: "User not found"};

            return {
                success: true,
                message: "Update User successfully",
            };
        },
    };

    static DELETE_USER = {
        type: GraphQLBoolean,
        args: {
            id: {type: GraphQLID}
        },
        async resolve(_: any, args: any) {
            try {
                const result = await Users.delete({id: args.id});
                if (result.affected === 0) {
                    return false;
                }
                return true;

            } catch (e) {
                return e;
            }
        }
    };

}

