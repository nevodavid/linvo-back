import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ValidationPipe} from "@nestjs/common";
import {config} from "./config";
import {static as staticExpress} from 'express';
import {json} from 'body-parser';
import * as fs from 'fs';
const request = require('request');


function getJsFile() {
  return new Promise((res) => {
    if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
      request.get({url: config.pluginDirectory + '/js/plugin.bundle.js', encoding: null}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          res(body);
          return ;
        }

        console.log('Could not fetch plugin from dev server');
      });
      return ;
    }

    res(fs.readFileSync(config.pluginDirectory + '/js/plugin.bundle.js'));
  })
}

(async () => {
  let loadJsFile = await getJsFile();

  async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.use(config.upload.url_path, staticExpress(config.upload.save_path));
    app.use('/js/plugin.bundle.js', (req, res) => {
      (async () => {
        if (!req.query.id) {
          res.send('Not found');
          return;
        }
        const write = Buffer.from(`window.linvoApiKey = '${req.query.id}';\n`);
        res.setHeader('content-type', 'text/javascript; charset=utf-8');
        if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
          let loadJsFile = await getJsFile();
        }
        // @ts-ignore
        res.send(Buffer.concat([write, loadJsFile]));
      })()
    });
    app.use(json({limit: '50mb'}));

    app.enableCors({
      origin: '*'
    })
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(config.port);
  }

  bootstrap();
})();
