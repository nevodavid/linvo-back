import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const MongodbService = MongooseModule.forRoot('mongodb://localhost/linvo');

export default MongodbService;
