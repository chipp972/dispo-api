// @flow
import { createTransport } from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import env from '../../config/env';

const { host, port, user, pass } = env.mail;
const smtpConfig = smtpTransport({
  host,
  port,
  auth: { user, pass }
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
): Promise<void> =>
  new Promise((resolve, reject) => {
    mailer.sendMail(
      {
        from: 'dispo@no-reply.com',
        to,
        subject,
        html
      },
      (err, info) => (err ? reject(err) : resolve(info))
    );
  });

/**
 * send a mail for passwordless authentication
 * @param {string} code
 * @param {string} limitDate
 * @return {Function}
 */
export const sendPasswordlessAuthMail = (code: string, limitDate: string) =>
  sendMail(
    'Authentification',
    `<p style="font-size:14px">Bonjour,
  <br/><br/>
  Voici le code qui te permettra de t'authentifier
  à l'espace d'administration :<br/><br/>

  <p style="font-size:24px"><strong>${code}</strong><br/><br/></p>

  Ce code est à utilisation <strong>unique</strong>.<br/>
  Ce code est valable jusqu'à ${limitDate}.</p>`
  );
