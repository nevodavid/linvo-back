import {IsEmail, IsString, MaxLength, Min, MinLength} from "class-validator";

export class LoginValidation {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    password: string;
}
