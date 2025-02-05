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
const TOKEN = env('TOKEN');

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

  const bot = new TelegramBot(TOKEN, {
    polling: true,
  });

  const gameName = GAME_NAME;
  const queries = {};
  bot.onText(/help|info/, msg =>
    bot.sendMessage(
      msg.from.id,
      'This bot implements a fartrump jumping game. Say /game if you want to play.'
    )
  );
  bot.onText(/start/, msg =>
    bot.sendMessage(
      msg.from.id,

      `Hi ${msg.from.first_name}. Say /game if you want to play.
      Welcome to FARTRUMP EARN GAME!

Rules are as simple as farting:

You need to score at least 20 points to win.
20-29 points - 0.005 SOL
30-39 points - 0.010 SOL
40-49 points - 0.015 SOL
50-59 points - 0.020 SOL
60-69 points - 0.025 SOL
70-79 points - 0.030 SOL
80-89 points - 0.035 SOL
90-99 points - 0.040 SOL
100+ points - 0.050 SOL

Also more $TGAME tokens you hold - higher Fart Multiplier you had!
100-300k hodl - x1.3
400-500k hodl - x1.5
500k-1kk hodl - x2.0
1kk-2kk hodl - x3.0
2-5kk hodl - x5.0
5kk+ hodl - x10.0
`
    )
  );
  bot.onText(/game/, msg => {
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

  // app.post('/', function (req, res) {
  //   try {
  //     console.log(req.body);
  //     res.json({
  //       message: `Score : ${req.body.score} , Wallet_Id : ${req.body.wallet_id}`,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send('Internal Server Error');
  //   }
  // });

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`server is run on http://localhost:${PORT}`);
  });
};
