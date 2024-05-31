const TelergramApi = require('node-telegram-bot-api');
const {gameOptions, againOptions} = require('./options');
const token = '7014992670:AAEy6QD18_qgucJ9dDYdcpYVelJqjJxhEOE';
const bot = new TelergramApi(token, {polling: true});

const chats = {};

const startGame = async (chatId) => {
    await bot.sendMessage(chatId, 'Now I\'m going to guess the number from 0 to 9, and you have to guess it!');
    const randomNumber = Math.floor(Math.random() * 10);
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, 'Guess it!', gameOptions)
}

const start = () => {
    bot.setMyCommands([
        {command: '/start', description: 'Launch the bot'},
        {command: '/info', description: 'Get information about user'},
        {command: '/game', description: 'Play the game'}
    ]);
    
    bot.on( 'message', async msg => {
        const text = msg.text;
        const chatId = msg.chat.id;
        
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://data.chpic.su/stickers/k/kofein9/kofein9_001.webp');
            return bot.sendMessage(chatId, `You wrote: ${text}`);
        };
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`);
        };

        if (text === '/game' ) {
             return startGame(chatId);
        };

        return bot.sendMessage(chatId, 'I don\'t understand you.');
    
    });

    bot.on('callback_query', async msg => {
        const data = msg.data;
        const chatId = msg.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data === chats[chatId]) {
            return await bot.sendMessage(chatId, `Congratulations! You guessed the number ${chats[chatId]}`, againOptions);
        } else {
            return await bot.sendMessage(chatId, `Unfortunately, you didn't guess right. I made a number ${chats[chatId]}`, againOptions);
        }
    });
};

start()
