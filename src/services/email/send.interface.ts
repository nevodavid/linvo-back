import {TemplateInterface} from './template.interface';

export interface SendInterface {
    send(address: any, subject: any, templatePath: TemplateInterface, params: object);
}
