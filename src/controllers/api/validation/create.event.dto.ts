import {IsBoolean, IsNumber, IsOptional, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";
import {ObjectID} from "typeorm";
import {CreateWidgetDto} from "./create.widget.dto";

export class CreateGroupDto {
    @IsString()
    id: number;

    @IsString()
    groupName: string;

    @IsBoolean()
    eventToolOpen: boolean;

    @IsString()
    domain: string;
}

export class EventsList {
    @IsString()
    @IsOptional()
    @Type(() => ObjectID)
    _id: string;

    @IsString()
    id: string;

    @IsString()
    picture: string;

    @IsString()
    url: string;

    @IsString()
    match: string;

    @IsNumber()
    order: number;
}

class WidgetModel extends CreateWidgetDto {
    @IsString()
    _id: string;

    @IsString()
    id: string;

    @IsString()
    title: string;

    @IsString()
    text: string;

    domain: string;
}

export class UpdateEvent extends CreateGroupDto {
    @ValidateNested()
    @Type(() => EventsList)
    events: EventsList[];

    @IsOptional()
    @Type(() => WidgetModel)
    @ValidateNested()
    widget?: WidgetModel;
}
