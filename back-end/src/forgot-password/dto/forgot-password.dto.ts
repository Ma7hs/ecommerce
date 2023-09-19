import { IsEmail, IsNotEmpty, IsNumber, IsString } from "class-validator";

export class ForgotPasswordDTO{
    @IsNotEmpty()
    @IsEmail()
    @IsString()
    email: string;
}

export class UpdatePasswordDTO{
    @IsNotEmpty()
    @IsString()
    password: string;
}

export class ForgotPasswordResponseDTO {
    message: string;
    statusCode: number;

    constructor(partial: Partial<ForgotPasswordResponseDTO>) {
        Object.assign(this, partial)
    }
}
