const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')

const token = '1652765564:AAEHOSGSH5qEKXSAduVlikEW3WAnesIKMAg'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId) => {
    await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/9a5/3d6/9a53d66b-53c8-3ccb-a3dd-75fa64c18322/192/42.webp')
    await bot.sendMessage(chatId, `Смотри, правила игры очень просты - я загадаю число от 0 до 9, а ты попробуешь его отгадать!`)

    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Попробуй отгадать', gameOptions)
}

const againGame = async (chatId) => {
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Попробуй отгадать', gameOptions)
}

const start = ()=> {
    bot.setMyCommands([
        {command: '/start', description: 'Start Telegram Bot'},
        {command: '/info', description: 'Info User'},
        {command: '/game', description: 'Game Telegram Bot'},
        {command: '/stop', description: 'Stop Telegram Bot'}
    ])
    
    bot.on('message', async (msg) => {
        const text = msg.text
        const chatId = msg.chat.id
        
        if (text === '/start'){
            await bot.sendMessage(chatId, 'Добро пожаловать к боту в гости, введи команды ниже, чтобы узнать, что я умею.')
            return bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/9a5/3d6/9a53d66b-53c8-3ccb-a3dd-75fa64c18322/192/37.webp')
        }
        if (text === '/info'){
            return bot.sendMessage(chatId, `Вот, что я знаю о тебе: \n Имя: ${msg.from.first_name} \n Username: ${msg.from.username}`)
        }
        if (text === '/game'){
            return startGame(chatId)
        }
        if(text === '/stop'){
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/9a5/3d6/9a53d66b-53c8-3ccb-a3dd-75fa64c18322/8.webp')
            await bot.stop();
        }
        return bot.sendMessage(chatId, 'Подожди, я тебя не понял, давай по-новой)')
    })
    bot.on('callback_query', (msg) => {
        const data = msg.data
        const chatId = msg.message.chat.id

        if (data === '/again') {
            return againGame(chatId)
        }
        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю, ты отгдал цифру ${chats[chatId]}`, againOptions)
        }
        else {
            return bot.sendMessage(chatId, `Увы, но ты не отгдал цифру. Я загадал ${chats[chatId]}`, againOptions)
        }
    })
}

start()