import { IsEmail, IsNotEmpty, IsString } from "class-validator";

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