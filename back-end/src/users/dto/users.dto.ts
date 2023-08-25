import { UserType } from "@prisma/client";
import { Exclude, Expose } from "class-transformer";

export class UsersResponseDTO{
    name: string;
    email: string;
    cpf: string;
    userType: UserType
    constructor(partial: Partial<UsersResponseDTO>) {
        Object.assign(this, partial)
    }
}