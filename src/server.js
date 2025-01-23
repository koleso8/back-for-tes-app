import express from 'express';
import cors from 'cors';

import path from 'path';
import TelegramBot from 'node-telegram-bot-api';
// import router from './routers/index.js';

import { env } from './utils/env.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import axios from 'axios';

const PORT = Number(env('PORT', '3000'));
const APP_DOMAIN = env('APP_DOMAIN');

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
      'This bot implements a flappy bird jumping game. Say /start if you want to enter your solana wallet address, /game if you want to play.'
    )
  );
  bot.onText(/start/, msg =>
    bot.sendMessage(
      msg.from.id,
      'Please enter your solana wallet address. Say /game if you want to play.'
    )
  );
  bot.on('message', msg => {
    const chatId = msg.chat.id;
    const text = msg.text;

    // Обрабатываем только те сообщения, которые не являются командами
    if (text && !text.startsWith('/')) {
      // Здесь вы можете обработать введенные данные
      console.log(`Received message from user: ${text}`);

      // Например, отправляем подтверждение обратно пользователю
      bot.sendMessage(chatId, `Your solana wallet : ${text}`);
    }
  });

  bot.onText(/game/, msg => {
    bot.sendGame(msg.from.id, gameName);
    username = msg.from.username;
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
  app.post('/sendScore', function (req, res, next) {
    console.log(req.body);
    axios
      .post('https://ti1.ngrok.io/submit_score', req.body)
      .then(response => {
        // console.log(response.data);
        res.send('Score submitted successfully!');
      })
      .catch(error => {
        // console.error(error);
        res.status(500).send('Error submitting score, please try again');
      });
    // if (!Object.hasOwnProperty.call(queries, req.query.id)) return next();
    // let query = queries[req.query.id];

    // let options;
    // if (query.message) {
    //   options = {
    //     chat_id: query.message.chat.id,
    //     message_id: query.message.message_id,
    //   };
    // } else {
    //   options = {
    //     inline_message_id: query.inline_message_id,
    //   };
    // }
    // bot.setGameScore(
    //   query.from.id,
    //   parseInt(req.params.score),
    //   options,
    //   function (err, result) {}
    // );
  });

  app.use('*', notFoundHandler);

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`server is run on http://localhost:${PORT}`);
  });
};
