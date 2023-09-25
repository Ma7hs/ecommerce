import { IsNotEmpty, IsString, IsEmail } from "class-validator";
import { sign } from 'jsonwebtoken';

export class SignUpDTO {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}

export class SignInDTO {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;

}

export class RefreshToken {
  id: number;
  userId: number;
  userAgent: string;
  ipAddress: string;

  sign(): string {
    return sign({ ...this }, process.env.JSON_WEB_TOKEN_SECRET);
  }

  constructor(init?: Partial<RefreshToken>) {
    Object.assign(this, init);
  }
}

export class GoogleTokenDTO {
  @IsString()
  @IsNotEmpty()
  token: string;
}