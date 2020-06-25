import {IsString} from "class-validator";

export class ShopifyCheckDto {
    @IsString()
    code: string;

    @IsString()
    shop: string;
}
