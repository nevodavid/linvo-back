import {IsString} from "class-validator";

export class ShopifyUpdateDto {
    @IsString()
    shop: string;

    @IsString()
    code: string;

    @IsString()
    id: string;

    @IsString()
    hmac: string;
}
