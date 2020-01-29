import { Request, Response, NextFunction } from 'express';

export class AuthController {
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { body: { user } } = req;

    if (!user.email) {
      res.status(422).json({
        errors: {
          email: 'is required',
        },
      });
    }

    if (!user.password) {
      res.status(422).json({
        errors: {
          password: 'is required',
        },
      });
    }

    const finalUser = new Users(user);

    finalUser.setPassword(user.password);

    return finalUser.save()
      .then(() => res.json({ user: finalUser.toAuthJSON() }));

  }
}
