import { UserType } from "@prisma/client";
import { Exclude, Expose, Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class UsersResponseDTO{
    name: string;
    email: string;
    userType: UserType;

    @Exclude()
    password:string

    @Exclude()
    created_at: Date
    @Expose({name: "createdAt"})
    createdAt(){
        return this.created_at
    }

    @Exclude()
    updated_at: Date
    @Expose({name: "updatedAt"})
    updatedAt(){
        return this.updated_at
    }

    constructor(partial: Partial<UsersResponseDTO>) {
        Object.assign(this, partial)
    }
}

export class UpdateUserDTO {
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsNotEmpty()
    @IsString()
    photo: string;

    constructor(partial: Partial<UpdateUserDTO>) {
        Object.assign(this, partial)
    }
    
}
