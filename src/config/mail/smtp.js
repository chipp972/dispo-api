// @flow
import { createTransport } from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import moment from 'moment-timezone';
import env from '../env';

moment.locale('fr');

type Destination = string | string[];

const smtpConfig = smtpTransport({
  host: env.mail.host,
  port: env.mail.port,
  auth: {
    user: env.mail.login,
    pass: env.mail.password
  }
});

const mailer = createTransport(smtpConfig);

/**
 * generic mail sender
 * @param {string} subject
 * @param {string} html body of the mail
 * @return {Function} a function that take a recepient and send the mail
 */
export const sendMail = (subject: string, html: string) => (
  to: Destination
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
 * @return {Function}
 */
export const sendPasswordlessAuthMail = (code: string) =>
  sendMail(
    'Authentification',
    `<p style="font-size:14px">Bonjour,
  <br/><br/>
  Voici le code qui te permettra de t'authentifier
  à l'espace d'administration :<br/><br/>

  <p style="font-size:24px"><strong>${code}</strong><br/><br/></p>

  Ce code est à utilisation <strong>unique</strong>.<br/>
  Ce code est valable jusqu'à ${moment()
    .tz('Europe/Paris')
    .add(env.auth.admin.validDuration, 'seconds')
    .format('LT')}.</p>`
  );
