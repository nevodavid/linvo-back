import {IsArray, IsDefined, IsNumber, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

export class Variable {
    @IsNumber()
    @IsDefined()
    id: number;

    @IsString()
    @IsDefined()
    name: string;

    @IsString()
    @IsDefined()
    value?: string;
}

export class Plugins {
    @IsNumber()
    @IsDefined()
    id: number;

    @ValidateNested()
    @Type(() => Variable)
    @IsArray()
    @IsDefined()
    variables: Variable[];
}
