import { getLoginSession, setLoginSession } from './auth';
import { removeTokenCookie } from './auth-cookies';
import { Magic } from '@magic-sdk/admin';

const magic = new Magic(process.env.MAGIC_SECRET_KEY);

export async function login(req, res) {
  try {
    const didToken = req.headers.authorization.substr(7);
    const metadata = await magic.users.getMetadataByToken(didToken);
    const session = { ...metadata };

    await setLoginSession(res, session);

    res.status(200).send({ done: true });
  } catch (error) {
    // @ts-ignore
    res.status(error.status || 500).end(error.message);
  }
}

export async function logout(req, res) {
  try {
    const session = await getLoginSession(req);

    if (session) {
      await magic.users.logoutByIssuer(session.issuer);
      removeTokenCookie(res);
    }
  } catch (error) {
    console.error(error);
  }

  res.writeHead(302, { Location: '/' });
  res.end();
}

export async function user(req, res) {
  const session = await getLoginSession(req);
  // After getting the session you may want to fetch for the user instead
  // of sending the session's payload directly, this example doesn't have a DB
  // so it won't matter in this case
  res.status(200).json({ user: session || null });
}
