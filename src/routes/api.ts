import express, { Request, Response, NextFunction } from 'express';
import { sayHello } from '../lib/hello.js';
import { getTeams } from '../lib/db.js';

export const router = express.Router();

//const time = getTeams();

export async function hello(req: Request, res: Response, next: NextFunction) {
  res.json({ hello: 'world' });
  next();
}

export async function bye() {
  console.log('done');
}

export async function error() {
  throw new Error('error');
}

//router.get('/teams', getTeams);

// Mun crasha öllu
router.get('/error', error);


