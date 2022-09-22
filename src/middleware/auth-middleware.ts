import { Request, Response, NextFunction } from 'express';
import { RouteError } from '../utils/route-error';
import { checkJwt } from '../utils/helpers-auth';

export const setAuthToken = (req: Request) => {
  req.jwt = req.headers.authorization;
};

export const checkIfAuthenticated = async (req: Request, res: Response, next: NextFunction) => {
  try {
    setAuthToken(req);

    if (!req.jwt) {
      throw new RouteError('unauthorised', 'You are not authorized to make this request, 1');
    }

    const user = await checkJwt(req.jwt)

    req.user = user;

    return next();

  } catch (e) {
    throw new RouteError('unauthorised', 'You are not authorized to make this request, 2');
  }
};

