import { Request } from 'express';

declare global {
  namespace Express {
    export interface Request {
      usuario?: JwtPayload;
    }
  }
}

export interface JwtPayload {
    id: string;
    rol: 'admin' | 'user';
    exp: number
}