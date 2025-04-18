
require('dotenv').config();
const express = require('express');
const { Telegraf } = require('telegraf');

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => ctx.reply('Ciao! Sono AlexGPT 👋'));
bot.on('text', async (ctx) => {
    const msg = ctx.message.text.toLowerCase();
    if (msg.includes('impegni') || msg.includes('domani') || msg.includes('oggi')) {
        ctx.reply('Sto controllando i tuoi impegni... (placeholder)');
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
