import {IsIn, IsOptional, IsString} from "class-validator";

export class CreateWidgetDto {
    @IsString()
    id: string;

    @IsString()
    title: string;

    @IsIn(['pixel', 'popup'])
    type: 'pixel' | 'popup';

    @IsString()
    text: string;

    @IsString()
    domain: string;
}
