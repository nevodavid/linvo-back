import {IsEmail, IsString, MaxLength, MinLength} from "class-validator";

export class RegisterValidation {
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    fullname: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(2)
    @MaxLength(50)
    password: string;
}
