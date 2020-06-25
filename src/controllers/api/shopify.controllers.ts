import {Body, Controller, Get, HttpStatus, Post, Query, Req, Res} from "@nestjs/common";
import {ShopifyLinkDto} from "./validation/shopify.link.dto";
import {config} from "../../config";
import {Request} from 'express';
import {ShopifyCheckDto} from "./validation/shopify.check.dto";
import axios from 'axios';
import {ShopifyUpdateDto} from "./shopify.update.dto";
import {getManager} from "typeorm";
import * as querystring from "querystring";
import crypto from 'crypto';

const nonce = require('nonce')();

@Controller('/shopify')
export class ShopifyControllers {
    @Get()
    index(@Req() req: Request, @Query() shopify: ShopifyLinkDto) {
        const state = nonce();
        return 'https://' + shopify.shop +
            '/admin/oauth/authorize?client_id=' + config.shopify.API_KEY +
            '&scope=' + config.shopify.SCOPES +
            '&state=' + state +
            '&redirect_uri=' + shopify.callback;
    }

    @Get('/check')
    async check(@Query() shop: ShopifyCheckDto) {
        const accessTokenRequestUrl = 'https://' + shop.shop + '/admin/oauth/access_token';
        const accessTokenPayload = {
            client_id: config.shopify.API_KEY,
            client_secret: config.shopify.API_SECRET,
            code: shop.code,
        };

        const accesstoken = await axios.post(accessTokenRequestUrl, accessTokenPayload);

        await getManager().query('INSERT INTO shopify(shop, accessToken) VALUES (?, ?) ON DUPLICATE KEY UPDATE accessToken = ?', [
            shop.shop,
            accesstoken.data.access_token,
            accesstoken.data.access_token,
        ]);

        const scriptList = 'https://' + shop.shop + '/admin/api/2020-04/script_tags.json';
        const scripts = await axios.get(scriptList, {
            headers: {
                'X-Shopify-Access-Token': accesstoken.data.access_token
            }
        });

        return {
            // @ts-ignore
            exists: scripts.data.script_tags.some(a => {
                return a.src.indexOf('linvo.io') > -1 || a.src.indexOf('localhost:4000') > -1
            })
        };
    }

    private checkRequestValidity(query) {
        const { shop, hmac, code, state } = query;
        if (!(shop && hmac && code)) {
            return false;
        }

        // DONE: Validate request is from Shopify
        const map = Object.assign({}, query);
        delete map['signature'];
        delete map['hmac'];
        delete map['id'];
        const message = querystring.stringify(map);
        const providedHmac = Buffer.from(hmac, 'utf-8');
        const generatedHash = Buffer.from(
            crypto
                .createHmac('sha256', config.shopify.API_SECRET)
                .update(message)
                .digest('hex'),
            'utf-8'
        );
        try {
            const hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac)
            return Boolean(hashEquals);

        } catch (e) {
            return false;
        }
    }

    @Post('/update')
    async update(@Res() response, @Body() shop: ShopifyUpdateDto) {
        const isValid = this.checkRequestValidity(shop);

        if (!isValid) {
            response.status(HttpStatus.FORBIDDEN).send();
            return ;
        }

        const { shop: shopNumber, hmac, code } = shop;
        const accesstoken = (await getManager().query('SELECT accessToken FROM shopify WHERE shop = ?', [shop.shop]))[0].accessToken;

        const scriptList = 'https://' + shop.shop + '/admin/api/2020-04/script_tags.json';
        const scripts = await axios.get(scriptList, {
            headers: {
                'X-Shopify-Access-Token': accesstoken
            }
        });

        const updateExisting = scripts.data.script_tags.find(a => {
            return a.src.indexOf('linvo.io') > -1 || a.src.indexOf('localhost:4000') > -1
        });

        const insert = 'https://' + shop.shop + '/admin/api/2020-04/script_tags.json';

        const url = `https://api.linvo.io/js/plugin.bundle.js?id=${shop.id}`;
        if (!updateExisting) {
            try {
                await axios.post(insert, {
                    script_tag: {
                        event: "onload",
                        src: url
                    }
                }, {
                    headers: {
                        'X-Shopify-Access-Token': accesstoken
                    }
                });
            }
            catch (err) {
                console.log(err);
                response.status(HttpStatus.CONFLICT).send();
                return ;
            }
        }
        else {
            const put = 'https://' + shop.shop + '/admin/api/2020-04/script_tags/' + updateExisting.id + '.json';
            try {
                await axios.put(put, {
                    script_tag: {
                        id: updateExisting.id,
                        src: url
                    }
                }, {
                    headers: {
                        'X-Shopify-Access-Token': accesstoken
                    }
                });
            }
            catch (err) {
                console.log(err);
                response.status(HttpStatus.CONFLICT).send();
                return ;
            }
        }

        response.status(HttpStatus.OK).send();
        return ;
    }
}
