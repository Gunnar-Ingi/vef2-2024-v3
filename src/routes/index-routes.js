import express from 'express';
import { getDatabase } from '../lib/db.js';
import { calculateStandings } from '../lib/score.js';

export const indexRouter = express.Router();

async function indexRoute(req, res) {
  const user = req.user ?? null;
  const loggedIn = req.isAuthenticated();
  const games = await getDatabase()?.getGames(5);
  const allGames = await getDatabase()?.getGames();

  const standings = allGames ? calculateStandings(allGames, 3) : null;

  return res.render('index', {
    title: 'Forsíða',
    games,
    standings,
    user,
    loggedIn,
  });
}

async function leikirRoute(req, res) {
  const user = req.user ?? null;
  const loggedIn = req.isAuthenticated();
  const games = await getDatabase()?.getGames();

  if (!games) {
    return res.render('error', {
      title: 'Villa',
      message: 'Ekki tókst að sækja leiki',
    });
  }

  return res.render('leikir', {
    title: 'Leikir',
    games,
    user,
    loggedIn,
  });
}

async function stadaRoute(req, res) {
  const user = req.user ?? null;
  const loggedIn = req.isAuthenticated();
  const allGames = await getDatabase()?.getGames();

  const standings = allGames ? calculateStandings(allGames) : null;

  return res.render('stada', {
    title: 'Staðan',
    standings,
    user,
    loggedIn,
  });
}

indexRouter.get('/', indexRoute);
indexRouter.get('/leikir', leikirRoute);
indexRouter.get('/stada', stadaRoute);
