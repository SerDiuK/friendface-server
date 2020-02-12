import passport from 'passport';

const jwt = require('express-jwt');

const getTokenFromHeaders = (req) => {
  const authorization = req.headers.authorization;

  if (authorization && authorization.split(' ')[0] === 'Bearer') {
    return authorization.split(' ')[1];
  }
  return null;
};

export class AuthService {
  static required = jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
  });

  static optional = jwt({
    secret: 'secret',
    userProperty: 'payload',
    getToken: getTokenFromHeaders,
    credentialsRequired: false,
  });

  static authenticate(req, res, next): Promise<any> {
    return passport.authenticate('local', { session: false }, (err, passportUser) => {

      if (err) {
        return next(err);
      }

      if (passportUser) {
        const ppuser = passportUser;
        ppuser.token = passportUser.generateJWT();

        return res.json({user: ppuser.toAuthJSON()});
      }

      return res.status(400).json({ error: 'Authentication failed' });
    })(req, res, next);

  }
}
