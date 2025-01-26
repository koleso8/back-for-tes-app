import express from 'express';
import cors from 'cors';

import path from 'path';
import TelegramBot from 'node-telegram-bot-api';
// import router from './routers/index.js';

import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';

const PORT = Number(env('PORT', '3000'));
const APP_DOMAIN = env('APP_DOMAIN');
const GAME_NAME = env('GAME_NAME');

export const startServer = () => {
  const app = express();

  app.use(
    express.json({ type: ['application/json', 'application/vnd.api+json'] })
  );
  app.use(cors());
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.json({
      message: 'Fart now!',
    });
  });
  const TOKEN = env('TOKEN');

  const bot = new TelegramBot(TOKEN, {
    polling: true,
  });

  const gameName = GAME_NAME;
  const queries = {};
  bot.onText(/help|info/, msg =>
    bot.sendMessage(
      msg.from.id,
      'This bot implements a fartrump jumping game. Say /game or /play if you want to play.'
    )
  );
  bot.onText(/start/, msg =>
    bot.sendMessage(
      msg.from.id,

      `Hi ${msg.from.username}. Say /game or /play if you want to play.`
    )
  );
  bot.onText(/game|play/, msg => {
    bot.sendGame(msg.from.id, gameName);
  });
  bot.on('callback_query', function (query) {
    if (query.game_short_name !== gameName) {
      bot.answerCallbackQuery(
        query.id,
        "Sorry, '" + query.game_short_name + "' is not available."
      );
    } else {
      queries[query.id] = query;
      let gameurl = APP_DOMAIN;
      bot.answerCallbackQuery({
        callback_query_id: query.id,
        url: gameurl,
      });
    }
  });

  bot.on('inline_query', function (iq) {
    bot.answerInlineQuery(iq.id, [
      {
        type: 'game',
        id: '0',
        game_short_name: gameName,
      },
    ]);
  });
  app.post('/', function (req, res, next) {
    console.log(req.body);
  });

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`server is run on http://localhost:${PORT}`);
  });
};
