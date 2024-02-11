/* eslint-disable camelcase */
import express from 'express';
import { validationResult } from 'express-validator';
import passport from 'passport';
import { catchErrors } from '../lib/catch-errors.js';
import { getDatabase } from '../lib/db.js';
import { logger } from '../lib/logger.js';
import { ensureLoggedIn } from '../lib/users.js';
import {
  createGameValidationMiddleware,
  sanitizationMiddleware,
  xssSanitizationMiddleware,
} from '../lib/validation.js';

export const adminRouter = express.Router();

async function indexRoute(req, res) {
  let message;
  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
    req.session.messages = [];
  }

  return res.render('login', {
    title: 'Innskráning',
    message,
  });
}

async function adminRoute(req, res) {
  const user = req.user ?? null;
  const loggedIn = req.isAuthenticated();
  const teams = await getDatabase()?.getTeams();
  const games = await getDatabase()?.getGames();

  let message;
  if (req.session.messages && req.session.messages.length > 0) {
    message = req.session.messages.join(', ');
    req.session.messages = [];
  }

  return res.render('admin', {
    title: 'Umsjónarsíða',
    teams,
    games,
    user,
    loggedIn,
    message,
  });
}

async function validationCheck(req, res, next) {
  const user = req.user ?? null;
  const loggedIn = req.isAuthenticated();
  const teams = await getDatabase()?.getTeams();
  const games = await getDatabase()?.getGames();

  const { date, home, away, home_score, away_score } = req.body;

  const data = {
    date,
    home,
    away,
    home_score,
    away_score,
  };

  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.render('admin', {
      title: 'Umsjónarsíða',
      teams,
      games,
      user,
      loggedIn,
      data,
      errors: validation.array(),
    });
  }

  return next();
}

async function deleteGame(req, res) {
  const { id } = req.params;
  const result = await getDatabase()?.deleteGame(id);

  if (!result) {
    req.session.messages = ['Ekki tókst að eyða leik.'];
  } else {
    req.session.messages = ['Leik eytt.'];
  }

  return res.redirect('/admin');
}

async function createGame(req, res) {
  const { date, home, away, home_score, away_score } = req.body;
  const result = await getDatabase()?.insertGame({
    date,
    home_id: home,
    away_id: away,
    home_score,
    away_score,
  });

  if (!result) {
    req.session.messages = ['Ekki tókst að bæta við leik.'];
  } else {
    req.session.messages = ['Leik bætt við.'];
  }

  return res.redirect('/admin');
}

adminRouter.get('/login', indexRoute);
adminRouter.get('/admin', ensureLoggedIn, adminRoute);
adminRouter.post('/admin/delete/:id', ensureLoggedIn, deleteGame);
adminRouter.post(
  '/admin/create',
  ensureLoggedIn,
  createGameValidationMiddleware(),
  xssSanitizationMiddleware(),
  catchErrors(validationCheck),
  sanitizationMiddleware(),
  createGame,
);
adminRouter.post(
  '/login',
  passport.authenticate('local', {
    failureMessage: 'Notandanafn eða lykilorð vitlaust.',
    failureRedirect: '/login',
    successMessage: 'Innskráning tókst',
    successRedirect: '/admin',
  }),
);
adminRouter.get('/logout', (req, res) => {
  req.logout((e) => {
    if (e) {
      logger.error('error logging out', e);
      return res.render('error', {
        title: 'Villa',
        message: 'Ekki tókst að skrá út',
      });
    }
    return res.redirect('/');
  });
});
