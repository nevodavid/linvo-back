import {SendService} from './send.service';
import * as nodemailer from 'nodemailer';
import {Injectable} from '@nestjs/common';
import {Attachment} from 'nodemailer/lib/mailer';
import * as Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService extends SendService {
    protected _send(address: string[], subject: string, template: string, moreOptions: Attachment[] = []) {
        const transporter = nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: 'thaitours',
                pass: 'dadavida10'
            }
        });

        const mailOptions: Mail.Options = {
            from: 'Thai Tours <no-reply@thai-tours.asia>', // sender address
            to: address, // list of receivers
            subject: '[Linvo.io] ' + subject, // Subject line
            html: template, // html body
        };

        transporter.sendMail(mailOptions);
    }
}
