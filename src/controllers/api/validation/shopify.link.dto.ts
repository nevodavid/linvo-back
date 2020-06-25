import {IsString} from "class-validator";

export class ShopifyLinkDto {
    @IsString()
    shop: string;

    @IsString()
    callback: string;
}
