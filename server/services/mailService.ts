// Load the AWS SDK for Node.js
import AWS = require('aws-sdk');
import * as dotenv from 'dotenv';

// Set the region


export default class MailService  {

    constructor () {
        AWS.config.loadFromPath('./server/ses_config.json');
        dotenv.load({ path: '../../.env' });
    }

    sendMailToUs = (subject, msgHtml, msgText) => {
        // Create sendEmail params
        const params = {
        Destination: { /* required */
            CcAddresses: process.env.MAIL_CC.split(','),
            ToAddresses: process.env.MAIL_TO.split(',')
        },
        Message: { /* required */
            Body: { /* required */
            Html: {
            Charset: 'UTF-8',
            Data: msgHtml
            },
            Text: {
            Charset: 'UTF-8',
            Data: msgText
            }
            },
            Subject: {
            Charset: 'UTF-8',
            Data: subject
            }
            },
        Source: process.env.MAIL_FROM
        };

        const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

        // Handle promise's fulfilled/rejected states
        sendPromise.then(
        function(data) {
            console.log(data.MessageId);
        }).catch(
            function(err) {
            console.error(err, err.stack);
            throw(err);
        });
    }

    sendMailToUser = (subject, msgHtml, msgText, userMail) => {
        // Create sendEmail params
        const params = {
        Destination: { /* required */
            BccAddresses: process.env.MAIL_BCC.split(','),
            ToAddresses: userMail.split(',')
        },
        Message: { /* required */
            Body: { /* required */
            Html: {
            Charset: 'UTF-8',
            Data: msgHtml
            },
            Text: {
            Charset: 'UTF-8',
            Data: msgText
            }
            },
            Subject: {
            Charset: 'UTF-8',
            Data: subject
            }
            },
        Source: process.env.MAIL_FROM
        };

        const sendPromise = new AWS.SES({apiVersion: '2010-12-01'}).sendEmail(params).promise();

        // Handle promise's fulfilled/rejected states
        sendPromise.then(
        function(data) {
            console.log(data.MessageId);
        }).catch(
            function(err) {
            console.error(err, err.stack);
            throw(err);
        });
    }

}