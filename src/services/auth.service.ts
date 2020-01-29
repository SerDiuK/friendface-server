import jwt from 'express-jwt';

export class AuthService {

  static getTokenFromHeaders(req): string {
    const { headers: { authorization } } = req;

    if (authorization && authorization.split(' ')[0] === 'Token') {
      return authorization.split(' ')[1];
    }
    return null;
  }

  static isRequired(): jwt.RequestHandler {
    return jwt({
      secret: process.env.SESSION_SECRET,
      userProperty: 'payload',
      getToken: this.getTokenFromHeaders,
    });
  }

  static isOptional(): jwt.RequestHandler {
    return jwt({
      secret: process.env.SESSION_SECRET,
      userProperty: 'payload',
      getToken: this.getTokenFromHeaders,
      credentialsRequired: false,
    });
  }
}
