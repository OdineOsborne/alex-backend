require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');
const { google } = require('googleapis');
const dayjs = require('dayjs');

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

// OAuth2 setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

oauth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

// Funzione per ottenere gli eventi di oggi
async function getEventsForToday() {
  const now = new Date();
  const end = new Date();
  end.setHours(23, 59, 59);

  const res = await calendar.events.list({
    calendarId: 'primary', // Puoi sostituire con un calendarId specifico
    timeMin: now.toISOString(),
    timeMax: end.toISOString(),
    singleEvents: true,
    orderBy: 'startTime'
  });

  return res.data.items || [];
}

// Comandi Telegram
bot.start((ctx) => ctx.reply('Ciao! Sono AlexGPT 👋'));

bot.on('text', async (ctx) => {
  const msg = ctx.message.text.toLowerCase();

  if (msg.includes('impegni') || msg.includes('oggi')) {
    ctx.reply('Sto controllando i tuoi impegni… 🧠');
    try {
      const events = await getEventsForToday();
      if (events.length === 0) {
        ctx.reply("Oggi non hai impegni in agenda ✅");
      } else {
        const formatted = events.map(ev => `📌 ${ev.summary} — ${ev.start.dateTime || ev.start.date}`).join('\n');
        ctx.reply(`Ecco cosa hai in programma oggi:\n\n${formatted}`);
      }
    } catch (err) {
      console.error('Errore lettura calendar:', err);
      ctx.reply("❌ Errore nel recupero degli impegni dal calendario");
    }
  } else if (msg.includes('domani')) {
    ctx.reply('Presto arriverà anche la gestione degli impegni futuri. 😉');
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
