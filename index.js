const TelegramApi = require('node-telegram-bot-api')
const { gameOptions, againOptions } = require('./options')

const token = '5620011264:AAEcNY4_fJgqblPLSdj9SKCeKbLk2Xx_y6g'

const bot = new TelegramApi(token, {polling: true})

const chats = {}

const startGame = async (chatId)=>{
  await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 0 до 9, а ты должен ее угадать!')
  const randomNum = Math.floor(Math.random() * 10)
  chats[chatId] = randomNum
  
  await bot.sendMessage(chatId, 'Отгадай', gameOptions)
}
const start = () => {
  bot.setMyCommands([
    { command: '/start', description: 'Начальное приветствие' },
    { command: '/info', description: 'Получить информацию о пользователе' },
    { command: '/game', description: 'Игра угадай цифру' },
  ])
  bot.on('message', async (msg)=>{
    const text = msg.text
    const chatId = msg.chat.id
  
    if (text === '/start') {
      await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/g/Gopher_golang/Gopher_golang_004.webp')
      return bot.sendMessage(chatId, `${ msg.from.first_name }, добро пожаловать в телеграм бот`)
    }
    if(text === '/info') {
      return bot.sendMessage(chatId, `Тебя зовут ${ msg.from.first_name } ${ msg.from.last_name }`)
    }
    if(text === '/game') {
      return startGame(chatId)
    }
    return bot.sendMessage(chatId, 'Я тебя не понимаю, попробуй еще раз!')
  })
  
  bot.on('callback_query', (msg)=> {
    const data = msg.data
    const chatId = msg.message.chat.id
    if(data === '/again') {
      return startGame(chatId)
    }
    if(data == chats[chatId]) {
      return bot.sendMessage(chatId, `Поздравляю, ты отгадал цифру ${ chats[chatId] }`, againOptions)
    } else {
      return bot.sendMessage(chatId, `К сожалению ты не угадал цифру ${ chats[chatId] }`, againOptions)
    }
  })
}

start()
