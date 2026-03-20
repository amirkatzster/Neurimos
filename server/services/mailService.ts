import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

export default class MailService {

    private sesClient: SESClient;

    constructor() {
        dotenv.load({ path: '../../.env' });
        const awsConfig = JSON.parse(fs.readFileSync('./server/ses_config.json', 'utf-8'));
        this.sesClient = new SESClient({
            region: awsConfig.region,
            credentials: {
                accessKeyId: awsConfig.accessKeyId,
                secretAccessKey: awsConfig.secretAccessKey
            }
        });
    }

    sendMailToUs = (subject, msgHtml, msgText) => {
        const params = {
            Destination: {
                CcAddresses: process.env.MAIL_CC.split(','),
                ToAddresses: process.env.MAIL_TO.split(',')
            },
            Message: {
                Body: {
                    Html: { Charset: 'UTF-8', Data: msgHtml },
                    Text: { Charset: 'UTF-8', Data: msgText }
                },
                Subject: { Charset: 'UTF-8', Data: subject }
            },
            Source: process.env.MAIL_FROM
        };
        this.sesClient.send(new SendEmailCommand(params))
            .then(data => console.log(data.MessageId))
            .catch(err => { console.error(err, err.stack); throw(err); });
    }

    sendMailToUser = (subject, msgHtml, msgText, userMail) => {
        const params = {
            Destination: {
                BccAddresses: process.env.MAIL_BCC.split(','),
                ToAddresses: userMail.split(',')
            },
            Message: {
                Body: {
                    Html: { Charset: 'UTF-8', Data: msgHtml },
                    Text: { Charset: 'UTF-8', Data: msgText }
                },
                Subject: { Charset: 'UTF-8', Data: subject }
            },
            Source: process.env.MAIL_FROM
        };
        this.sesClient.send(new SendEmailCommand(params))
            .then(data => console.log(data.MessageId))
            .catch(err => { console.error(err, err.stack); throw(err); });
    }
}
