import { MovementType } from "@prisma/client";
import { Exclude } from "class-transformer";
import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UserBalanceDTO {

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;
}

export class UserBalanceResponseDTO{
    
    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;

    @Exclude()
    created_at: Date;

    @IsNumber()
    @IsNotEmpty()
    value: number;

    @IsNotEmpty()
    @IsEnum(MovementType)
    movementType: MovementType;
    
    constructor(partial: Partial<UserBalanceResponseDTO>) {
        Object.assign(this, partial)
    }
}