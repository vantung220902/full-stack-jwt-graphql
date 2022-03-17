import { IMutationResponse } from "./MutationResponse";
import { User } from './../entities/User';
import { Field, ObjectType } from "type-graphql";

@ObjectType({ implements: IMutationResponse })
export class UserMutationResponse implements IMutationResponse {
    code: number;
    success: boolean;
    message?: string;

    @Field({ nullable: true })
    user?: User

    @Field({ nullable: true })
    accessToken?:string

}