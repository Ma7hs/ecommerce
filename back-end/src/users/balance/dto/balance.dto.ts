import { MovementType } from "@prisma/client";
import { Exclude } from "class-transformer";
import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class UserBalanceDTO {

    @IsNotEmpty()
    @IsString()
    cpf: string;

    @IsNumber()
    @IsNotEmpty()
    value: number;

    @IsNotEmpty()
    @IsEnum(MovementType)
    movementType: MovementType;
}

export class UserBalanceResponseDTO{
    
    @IsNotEmpty()
    @IsString()
    cpf: string;

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