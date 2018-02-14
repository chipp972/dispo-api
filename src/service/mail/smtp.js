// @flow
import { createTransport } from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import { env } from '../../config/env';

const { host, port, user, pass } = env.mail;
const smtpConfig = smtpTransport({
  host,
  port,
  auth: { user, pass },
});

const mailer = createTransport(smtpConfig);

/**
 * generic mail sender
 * @param {string} subject
 * @param {string} html body of the mail
 * @return {Function} a function that take a recepient and send the mail
 */
export const sendMail = (subject: string, html: string) => (
  to: string | string[]
): Promise<Function> =>
  new Promise((resolve, reject) => {
    mailer.sendMail(
      {
        from: 'dispo@no-reply.com',
        to,
        subject,
        html,
      },
      (err, info) => (err ? reject(err) : resolve(info))
    );
  });
