import * as Handlebars from 'handlebars';
import {SendInterface} from './send.interface';
import {TemplateInterface} from './template.interface';
import {generateTemplate} from './email.general.template';
import {Attachment} from 'nodemailer/lib/mailer';

/**
 * Send service such as emails or sms etc
 */
export abstract class SendService implements SendInterface {
    public async send(address: any[], subject: string, template: TemplateInterface, params: object, moreOptions: Attachment[] = []) {

        // render template for sending
        const compiledTemplate   = Handlebars.compile(generateTemplate(subject, template.html));
        const templateWithParams = compiledTemplate(params || {});

        // send via provider
        this._send(address, subject, templateWithParams, moreOptions);
    }

    public async sendPlain(address: any[], subject: string, template: TemplateInterface, params: object, moreOptions: Attachment[] = []) {
        // send via provider
        this._send(address, subject, template.html, moreOptions);
    }

    protected abstract _send(address: any, subject: string, template: string, moreOptions: Attachment[]);
}
