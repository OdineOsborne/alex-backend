require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');
const { getTodayEvents } = require('./google/calendar');

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Ciao! Sono AlexGPT 👋'));

bot.on('text', async (ctx) => {
  const msg = ctx.message.text.toLowerCase();

  if (msg.includes('impegni') || msg.includes('oggi')) {
    try {
      const events = await getTodayEvents(process.env.CALENDAR_ID_LAVORO);
      if (events.length === 0) {
        ctx.reply('Oggi non hai impegni nel calendario! 🗓️');
      } else {
        const reply = events.map(event => {
          const time = event.start.dateTime || event.start.date;
          return `🕒 ${time} - ${event.summary}`;
        }).join('\n');
        ctx.reply(`Ecco i tuoi impegni di oggi:\n\n${reply}`);
      }
    } catch (err) {
      console.error('Errore durante il recupero eventi:', err);
      ctx.reply('Si è verificato un errore nel recupero degli eventi 📛');
    }
  } else if (msg.includes('ci sei')) {
    ctx.reply('Eccomi! Sono operativo 🧠');
  } else {
    ctx.reply('Ricevuto! Dimmi pure come posso aiutarti.');
  }
});

bot.launch();
app.use(bot.webhookCallback('/telegram'));
app.get('/', (req, res) => res.send('Alex backend attivo'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server in ascolto sulla porta ${PORT}`));
