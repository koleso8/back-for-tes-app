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

export const startServer = () => {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(cookieParser());

  app.get('/', (req, res) => {
    res.json({
      message: 'Fart now!',
    });
  });
  const TOKEN = env('TOKEN');

  let username;

  const bot = new TelegramBot(TOKEN, {
    polling: true,
  });

  const gameName = 'testststs';
  const queries = {};
  bot.onText(/help/, msg =>
    bot.sendMessage(
      msg.from.id,
      'This bot implements a flappy bird jumping game. Say /start if you want to play.'
    )
  );
  bot.onText(/start|game/, msg => {
    bot.sendGame(msg.from.id, gameName);
    username = msg.from.username;
    console.log(`Пользователь: ${username}`);
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
      let gameurl = 'https://test-app-omega-indol.vercel.app/';
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
  app.get('/highscore/:score', function (req, res, next) {
    if (!Object.hasOwnProperty.call(queries, req.query.id)) return next();
    let query = queries[req.query.id];
    let options;
    if (query.message) {
      options = {
        chat_id: query.message.chat.id,
        message_id: query.message.message_id,
      };
    } else {
      options = {
        inline_message_id: query.inline_message_id,
      };
    }
    bot.setGameScore(
      query.from.id,
      parseInt(req.params.score),
      options,
      function (err, result) {}
    );
  });
  app.get('/asd', () => console.log('pes asd'));
  app.post('/sendLocalStorageValue', (req, res) => {
    // console.log(req._read);
    const userValue = req.body.value;

    console.log(`${username}: ${userValue}`);

    // Здесь вы можете обработать полученное значение по своему усмотрению
    res.json({ message: `${username} Value received successfully` });
  });

  // app.use(router);

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`server is run on http://localhost:${PORT}`);
  });
};
