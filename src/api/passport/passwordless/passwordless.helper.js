// @flow

type Options = {
  code: string,
  limitDate: string,
  recipient: string,
  sendMail: (
    subject: string,
    html: string
  ) => (to: string | string[]) => Promise<any>,
};

/**
 * send a mail for passwordless authentication
 * @param {string} code
 * @param {string} limitDate
 * @param {string} recipient
 * @return {Function}
 */
export const sendPasswordlessAuthMail = ({
  code,
  limitDate,
  recipient,
  sendMail,
}: Options) =>
  sendMail(
    'Authentification',
    `<p style="font-size:14px">Bonjour,
  <br/><br/>
  Voici le code qui te permettra de t'authentifier
  à l'espace d'administration :<br/><br/>

  <p style="font-size:24px"><strong>${code}</strong><br/><br/></p>

  Ce code est à utilisation <strong>unique</strong>.<br/>
  Ce code est valable jusqu'à ${limitDate}.</p>`
  )(recipient);
